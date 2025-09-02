<?php
namespace Models;

use Dotenv\Dotenv;
use Config\Database;

require __DIR__ . '/../vendor/autoload.php';
Dotenv::createImmutable('/etc/env')->load();

class Pedido
{
    private int $numeroPedido; // Chave primária
    private ?string $posicao = null;
    private ?int $condVenda = null;
    private ?string $origemPed = null;
    private ?float $valorTotal = null;
    private bool $cobrancaPxa = false;
    private bool $vendaAssistida = false;
    private bool $lock = false;
    private bool $multiplasFormas = false;
    private bool $jaConfirmado = false;

    /**
     * Carrega os dados básicos do pedido para validações.
     *
     * @param int $numeroPedido Número do pedido, chave primária da tabela
     * @return self Retorna uma instância de Pedido com os dados carregados
     */
    public static function getPedidoByNumped(int $numeroPedido): self
    {
        $conn  = Database::connect();
        $owner = $_ENV['DBOWNER'];

        $sql = "SELECT
                    P.POSICAO,
                    P.CONDVENDA,
                    P.ORIGEMPED,
                    NVL(P.VENDAASSISTIDA, 'N') AS VENDAASSISTIDA,
                    P.OBSFRETENF3 AS LOCK,
                    NVL(
                        (SELECT SUM(VALOR)
                        FROM $owner.PCPRESTPEDIDO PRE
                        WHERE PRE.NUMPED = P.NUMPED
                            AND PRE.CODCOB = 'PXA'),
                        P.VLATEND
                    ) AS VLATEND,
                    CASE 
                        WHEN P.CODCOB = 'PXA' THEN 1
                        WHEN EXISTS (
                            SELECT 1
                            FROM $owner.PCPRESTPEDIDO PRE
                            WHERE PRE.NUMPED = P.NUMPED
                            AND PRE.CODCOB = 'PXA'
                        ) THEN 1
                        ELSE 0 
                    END AS COBRANCA_PXA,
                    CASE WHEN EXISTS (
                        SELECT 1
                        FROM $owner.PCPRESTPEDIDO PRE
                        WHERE PRE.NUMPED = P.NUMPED
                        AND PRE.CODCOB = 'PXA'
                    ) THEN 1 ELSE 0 END AS MULTIPLAS_FORMAS,
                    CASE WHEN EXISTS (
                        SELECT 1
                        FROM $owner.LOG_EXTRATOBB L
                        WHERE L.NUMPED1 = P.NUMPED
                    ) THEN 1 ELSE 0 END AS JA_CONFIRMADO
                FROM $owner.PCPEDC P
                WHERE P.NUMPED = :NUMPED";

        $stid = oci_parse($conn, $sql);
        oci_bind_by_name($stid, ':NUMPED', $numeroPedido);
        oci_execute($stid);
        $row = oci_fetch_assoc($stid) ?: []; // Entrega o array com dados ou array vazio
        oci_free_statement($stid);

        $pedido = new self();
        $pedido->posicao = $row['POSICAO'] ?? null;
        $pedido->condVenda = isset($row['CONDVENDA']) ? (int)$row['CONDVENDA'] : null;
        $pedido->origemPed = $row['ORIGEMPED'] ?? null;
        $pedido->vendaAssistida = ($row['VENDAASSISTIDA'] === 'S');
        $pedido->lock = ($row['LOCK'] === 'ALTERANDO');
        $pedido->valorTotal = isset($row['VLATEND']) ? (float)$row['VLATEND'] : null;
        $pedido->cobrancaPxa = ($row['COBRANCA_PXA'] == 1);
        $pedido->multiplasFormas = ($row['MULTIPLAS_FORMAS'] == 1);
        $pedido->jaConfirmado = ($row['JA_CONFIRMADO'] == 1);

        return $pedido;
    }

    public function getPosicao(): ?string
    {
        return $this->posicao;
    }

    public function getCondVenda(): ?int
    {
        return $this->condVenda;
    }

    public function getOrigemPed(): ?string
    {
        return $this->origemPed;
    }

    public function getValorTotal(): ?float
    {
        return $this->valorTotal;
    }

    public function isCobrancaPxa(): bool
    {
        return $this->cobrancaPxa;
    }

    public function isMultiplasFormas(): bool
    {
        return $this->multiplasFormas;
    }

    public function isConfirmado(): bool
    {
        return $this->jaConfirmado;
    }
    public function isVendaAssistida(): bool
    {
        return $this->vendaAssistida;
    }
    public function isLock(): bool
    {
        return $this->lock;
    }

    /**
     * Atualiza a posição de um pedido, mas só se ele não estiver nas posições
     * faturado, liberado, montado ou cancelado.
     *
     * @param int    $numeroPedido  NUMPED a ser atualizado
     * @param string $novaPosicao    'M' (Montado) ou 'L' (Liberado)
     * @return bool                  true se atualizou, false caso contrário
     */
    public static function updatePosicao(int $numeroPedido, string $novaPosicao, int $matriculaUsuario): bool
    {
        $conn  = Database::connect();
        $owner = $_ENV['DBOWNER'];

        $sql = "UPDATE {$owner}.PCPEDC
                SET POSICAO = :NEWPOSICAO,
                    DTLIBERA = SYSDATE,
                    CODFUNCLIBERA = :MATRICULA
                WHERE NUMPED   = :NUMPED
                AND POSICAO NOT IN ('F','L','M','C')";

        $stid = oci_parse($conn, $sql);
        oci_bind_by_name($stid, ':NEWPOSICAO', $novaPosicao);
        oci_bind_by_name($stid, ':NUMPED',     $numeroPedido);
        oci_bind_by_name($stid, ':MATRICULA',  $matriculaUsuario);

        $ok = oci_execute($stid, OCI_NO_AUTO_COMMIT);
        if (!$ok) {
            oci_rollback($conn);
            oci_free_statement($stid);
            return false;
        }

        // se não afetou nenhuma linha, o pedido estava em estado proibido
        if (oci_num_rows($stid) < 1) {
            oci_rollback($conn);
            oci_free_statement($stid);
            return false;
        }

        oci_commit($conn);
        oci_free_statement($stid);
        return true;
    }
}
