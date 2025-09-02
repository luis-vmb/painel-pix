<?php
namespace Services;

use Models\Pedido;
use Models\Pix;
use Dotenv\Dotenv;
use Config\Database;

require __DIR__ . '/../vendor/autoload.php';
Dotenv::createImmutable('/etc/env')->load();

class PedidoService
{
    /**
     * 
     * 
     */
    public function validarParaConfirmacao(int $numeroPedido, ?int $numeroDocumentoPix): array
    {   
        // Variáveis de retorno
        $mensagem = "";
        $valido = true;

        $pedido = Pedido::getPedidoByNumped($numeroPedido);
        $pix = Pix::getPixByNumdoc($numeroDocumentoPix);

        // Regra 1: Pedido deve conter cobrança PXA
        if (!$pedido->isCobrancaPxa()) {
            $mensagem = "Pedido $numeroPedido não é de cobrança PXA.";
            $valido = false;
            return ['mensagem' => $mensagem, 'valido' => $valido];
        }

        // Regra 2: precisa estar "B" e ser cobrança PXA
        if ($pedido->getPosicao() !== 'B') {
            $mensagem = "Pedido $numeroPedido não está na posição 'B' (Bloqueado).";
            $valido = false; 
            return ['mensagem' => $mensagem, 'valido' => $valido];
        }

        // Regra 3: Pedido deve estar sem lock no banco
        if ($pedido->isLock()) {
            $mensagem = "Pedido $numeroPedido está sendo alterado em outra estação.";
            $valido = false;
            return ['mensagem' => $mensagem, 'valido' => $valido];
        }

        // Regra 4: Pedido não pode ter valor maior que o pix, ou conjunto de pix
        if ($pix->getValor() < $pedido->getValorTotal()) {
            $mensagem = "Valor do PIX ({$pix->getValor()}) é menor que o valor do pedido ({$pedido->getValorTotal()}).";
            $valido = false;
            return ['mensagem' => $mensagem, 'valido' => $valido];
        }

        // TODO: Fazer o restante das regras de validação

        return ['mensagem' => $mensagem, 'valido' => $valido];
    }

    /** Desbloqueio simples, mantendo sua lógica. */
    public function liberarPedido(int $numeroPedido, int $matriculaUsuario, string $usuario): bool
    {
        $pedido = Pedido::getPedidoByNumped($numeroPedido);

        $novaPosicao = null;
        if ($pedido->getCondVenda() === 1 && $pedido->getOrigemPed() === 'R') {
            $novaPosicao = 'M'; // Montado
        } elseif (in_array($pedido->getCondVenda(), [7, 8], true) && $pedido->getOrigemPed() === 'T') {
            $novaPosicao = 'L'; // Liberado
        }

        if ($novaPosicao) {
            $desbloqueado = Pedido::updatePosicao($numeroPedido, $novaPosicao, $matriculaUsuario);

            if ($desbloqueado) {
                // Inserir o log de confirmação
                $this->insertLog($numeroPedido, $matriculaUsuario, $usuario, $pedido);
            }

            return $desbloqueado;
        }

        return false;
    }

    /**
     * Insere um log na tabela LOG_CONFIRMACAO_PXA.
     *
     * @param int $numeroPedido
     * @param int $matricula
     * @param string $usuario
     * @param Pedido $pedido
     * @return void
     */
    private function insertLog(int $numeroPedido, int $matricula, string $usuario, Pedido $pedido): void
    {
        $conn = Database::connect();

        $sql = "
            INSERT INTO RYMO.LOG_CONFIRMACAO_PXA
                (NUMPED, NUMDOC, MATRICULA, USUARIO, DTLOG,
                 VLATEND, POSICAO, CONDVENDA, ORIGEMPED, CODCOB)
            VALUES
                (:NUMPED, :NUMDOC, :MATRICULA, :USUARIO, SYSDATE,
                 :VLATEND, :POSICAO, :CONDVENDA, :ORIGEMPED, :CODCOB)
        ";

        $stid = oci_parse($conn, $sql);

        // Bind dos valores
        oci_bind_by_name($stid, ":NUMPED",    $numeroPedido);
        oci_bind_by_name($stid, ":NUMDOC",    $numeroPedido); // Substitua se necessário
        oci_bind_by_name($stid, ":MATRICULA", $matricula);
        oci_bind_by_name($stid, ":USUARIO",   $usuario);
        oci_bind_by_name($stid, ":VLATEND",   $pedido->getValorTotal());
        oci_bind_by_name($stid, ":POSICAO",   $pedido->getPosicao());
        oci_bind_by_name($stid, ":CONDVENDA", $pedido->getCondVenda());
        oci_bind_by_name($stid, ":ORIGEMPED", $pedido->getOrigemPed());
        oci_bind_by_name($stid, ":CODCOB",    $pedido->isCobrancaPxa() ? 'PXA' : null);

        oci_execute($stid, OCI_NO_AUTO_COMMIT);
        oci_commit($conn);
        oci_free_statement($stid);
    }

    public static function listPedidosVendedor(int $codigoVendedor): array
    {
        $conn  = Database::connect();
        $owner = $_ENV['DBOWNER'];

        $sql = "SELECT
                    P.NUMPED,
                    CASE WHEN P.CODCLI = 1 THEN (SELECT V.CLIENTE FROM $owner.PCVENDACONSUM V WHERE P.NUMPED = V.NUMPED) 
                    ELSE (SELECT C.CLIENTE FROM $owner.PCCLIENT C WHERE P.CODCLI = C.CODCLI) END AS CLIENTE,
                    NVL((SELECT SUM(VALOR) FROM $owner.PCPRESTPEDIDO PRE WHERE PRE.NUMPED = P.NUMPED AND PRE.CODCOB = 'PXA'), P.VLTOTAL) AS VLTOTAL,
                    CODCOB,
                    CASE WHEN EXISTS (SELECT 1 FROM $owner.LOG_EXTRATOBB L WHERE L.NUMPED1 = P.NUMPED) THEN 1 ELSE 0 END AS JA_CONFIRMADO
                FROM $owner.PCPEDC P
                WHERE P.CODUSUR = :CODUSUR
                AND P.POSICAO = 'B'
                AND P.CONDVENDA IN (1, 7)
                AND P.CODCOB = 'PXA'";

        $stid = oci_parse($conn, $sql);
        oci_bind_by_name($stid, ':CODUSUR', $codigoVendedor);
        oci_execute($stid);

        $pedidos = [];
        while ($row = oci_fetch_assoc($stid)) {
            $pedidos[] = $row;
        }

        oci_free_statement($stid);
        return $pedidos;
    }
}
