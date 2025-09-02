<?php
namespace Models;

use Dotenv\Dotenv;
use Config\Database;
use DateTime;

require __DIR__ . '/../vendor/autoload.php';
Dotenv::createImmutable('/etc/env')->load();

class Pix {
    
    // Variáveis principais LOG_EXTRATOBB
    private int $numdoc; // Chave primária
    private ?string $tipoLancamento = null;
    private int $codAgencia;
    private int $numLote;
    private int $codTipoLanc;
    private ?string $historico = null;
    private float $valor;
    private ?string $cgc = null;
    private ?string $nomePagador = null;
    private ?int $codFuncConf = null;
    private ?string $nomeFuncConf = null;
    private ?float $valorAlt = null;
    
    // Variáveis de datas
    private ?DateTime $dtLanc = null;
    private ?DateTime $dataEnvio = null;
    private ?DateTime $dtConfirmacao = null;
    
    // Variáveis de pedidos associados
    private ?int $numPed1 = null;
    private ?int $numPed2 = null;
    private ?int $numPed3 = null;
    private ?int $numPed4 = null;
    private ?int $numPed5 = null;

    public static function getPixByNumdoc(int $numDoc): self
    {
        $conn = Database::connect();
        $owner = $_ENV['DBOWNER'];

        $sql = "SELECT
                    NUMDOC,
                    TIPOLANCAMENTO,
                    TO_CHAR(DTLANC, 'YYYY-MM-DD HH24:MI:SS') AS DTLANC,
                    CODAGENCIA,
                    NUMLOTE,
                    CODTIPOLANC,
                    HISTORICO,
                    VALOR,
                    TO_CHAR(DATAENVIO, 'YYYY-MM-DD HH24:MI:SS') AS DATAENVIO,
                    CGC,
                    NOMEPAGADOR,
                    NUMPED1,
                    NUMPED2,
                    NUMPED3,
                    NUMPED4,
                    NUMPED5,
                    CODFUNCCONF,
                    NOMEFUNCCONF,
                    TO_CHAR(DTCONFIRMACAO, 'YYYY-MM-DD HH24:MI:SS') AS DTCONFIRMACAO,
                    VALORALT
                FROM $owner.LOG_EXTRATOBB
                WHERE NUMDOC = :NUMDOC";

        $stid = oci_parse($conn, $sql);
        oci_bind_by_name($stid, ':NUMDOC', $numDoc);
        oci_execute($stid);
        $row = oci_fetch_assoc($stid) ?: []; // Entrega o array com dados ou array vazio
        oci_free_statement($stid);

        $pix = new self();
        // Preenche propriedades do objeto Pix com os dados do SQL
        $pix->numdoc = (int)$row['NUMDOC'];
        $pix->tipoLancamento = $row['TIPOLANCAMENTO'] ?? null;
        $pix->codAgencia = isset($row['CODAGENCIA']) ? (int)$row['CODAGENCIA'] : null;
        $pix->numLote = isset($row['NUMLOTE']) ? (int)$row['NUMLOTE'] : null;
        $pix->codTipoLanc = isset($row['CODTIPOLANC']) ? (int)$row['CODTIPOLANC'] : null;
        $pix->historico = $row['HISTORICO'] ?? null;
        $pix->valor = isset($row['VALOR']) ? (float)$row['VALOR'] : null;
        $pix->cgc = $row['CGC'] ?? null;
        $pix->nomePagador = $row['NOMEPAGADOR'] ?? null;

        $pix->dtLanc = isset($row['DTLANC']) ? new DateTime($row['DTLANC']) : null;
        $pix->dataEnvio = isset($row['DATAENVIO']) ? new DateTime($row['DATAENVIO']) : null;
        $pix->dtConfirmacao = isset($row['DTCONFIRMACAO']) ? new DateTime($row['DTCONFIRMACAO']) : null;

        $pix->numPed1 = isset($row['NUMPED1']) ? (int)$row['NUMPED1'] : null;
        $pix->numPed2 = isset($row['NUMPED2']) ? (int)$row['NUMPED2'] : null;
        $pix->numPed3 = isset($row['NUMPED3']) ? (int)$row['NUMPED3'] : null;
        $pix->numPed4 = isset($row['NUMPED4']) ? (int)$row['NUMPED4'] : null;
        $pix->numPed5 = isset($row['NUMPED5']) ? (int)$row['NUMPED5'] : null;

        // Campos de confirmação
        $pix->codFuncConf = isset($row['CODFUNCCONF']) ? (int)$row['CODFUNCCONF'] : null;
        $pix->nomeFuncConf = $row['NOMEFUNCCONF'] ?? null;
        $pix->valorAlt = isset($row['VALORALT']) ? (float)$row['VALORALT'] : null;

        // Retorna objeto Pix preenchido
        return $pix;
    }

    /**
     * Getters das propriedades do objeto Pix
     * @return mixed
     */

    public function getNumdoc(): int
    {
        return $this->numdoc;
    }

    public function getValor(): float
    {
        return $this->valor;
    }

    public function getValorAlt(): ?float
    {
        return $this->valorAlt;
    }
    
    public function isConfirmado(): bool
    {
        return $this->dtConfirmacao !== null;
    }

    public function getTipoLancamento(): ?string
    {
        return $this->tipoLancamento;
    }

    public function getCodAgencia(): ?int
    {
        return $this->codAgencia ?? null;
    }

    public function getNumLote(): ?int
    {
        return $this->numLote ?? null;
    }

    public function getCodTipoLanc(): ?int
    {
        return $this->codTipoLanc ?? null;
    }

    public function getHistorico(): ?string
    {
        return $this->historico;
    }

    public function getCgc(): ?string
    {
        return $this->cgc;
    }

    public function getNomePagador(): ?string
    {
        return $this->nomePagador;
    }

    public function getCodFuncConf(): ?int
    {
        return $this->codFuncConf;
    }

    public function getNomeFuncConf(): ?string
    {
        return $this->nomeFuncConf;
    }

    public function getDtLanc(): ?DateTime
    {
        return $this->dtLanc;
    }

    public function getDataEnvio(): ?DateTime
    {
        return $this->dataEnvio;
    }

    public function getDtConfirmacao(): ?DateTime
    {
        return $this->dtConfirmacao;
    }

    public function getNumPed1(): ?int
    {
        return $this->numPed1;
    }

    public function getNumPed2(): ?int
    {
        return $this->numPed2;
    }

    public function getNumPed3(): ?int
    {
        return $this->numPed3;
    }

    public function getNumPed4(): ?int
    {
        return $this->numPed4;
    }

    public function getNumPed5(): ?int
    {
        return $this->numPed5;
    }

    /**
     * Atualiza um registro existente em LOG_EXTRATOBB para confirmar o PIX, preenche campo com horários e responsável da confirmação.
     *
     * @param int    $numeroDocumento  Número do documento de depósito (NUMDOC)
     * @param int    $numeroPedido     Número do pedido a liberar (NUMPED1)
     * @param int    $codFuncConf      Código do funcionário que confirmou (CODFUNCCONF)
     * @param string $nomeFuncConf     Nome do funcionário que confirmou (NOMEFUNCCONF)
     * @param float  $valornew         Valor alterado do pix, deduzindo o quanto foi utilizado do Pedido. Pegar valor de pix do objeto Pedido
     * @return bool                    True em sucesso, false em falha, executa rollback em falha.
     */
    public static function confirmPix(int $numeroDocumento, int $numeroPedido, int $codFuncConf, string $nomeFuncConf, float $valornew): bool
    {
        $conn = Database::connect();
        $owner = $_ENV['DBOWNER'];
        // TODO: Tratar a confirmação de múltiplos pedidos ou múltipls pix. Necessárias mudanças na tabela?
        $sql  = "UPDATE $owner.LOG_EXTRATOBB
                SET NUMPED1       = :NUMPED,
                    CODFUNCCONF   = :CODFUNCCONF,
                    NOMEFUNCCONF  = :NOMEFUNCCONF,
                    DTCONFIRMACAO = SYSDATE,
                    VALORALT      = VALOR - :VALORNEW
                WHERE NUMDOC   = :NUMDOC
                AND NUMPED1 IS NULL";

        $stid = oci_parse($conn, $sql);
        oci_bind_by_name($stid, ':NUMDOC',       $numeroDocumento);
        oci_bind_by_name($stid, ':NUMPED',      $numeroPedido);
        oci_bind_by_name($stid, ':CODFUNCCONF',  $codFuncConf);
        oci_bind_by_name($stid, ':NOMEFUNCCONF', $nomeFuncConf);
        oci_bind_by_name($stid, ':VALORNEW', $valornew);

        // Executa sem auto‐commit
        $ok = oci_execute($stid, OCI_NO_AUTO_COMMIT);
        if ($ok) {
            oci_commit($conn);
        } else {
            oci_rollback($conn);
        }
        oci_free_statement($stid);

        return $ok;
    }

    /**
     * Insere um novo lançamento em LOG_EXTRATOBB. Usado pelo 
     *
     * @param int     $numDoc          NUMDOC
     * @param string  $tipoLancamento  TIPOLANCAMENTO
     * @param string  $dtLanc          DTLANC no formato 'YYYY-MM-DD HH24:MI:SS'
     * @param int     $codAgencia      CODAGENCIA
     * @param int     $numLote         NUMLOTE
     * @param int     $codTipoLanc     CODTIPOLANC
     * @param string  $historico       HISTORICO
     * @param float   $valor           VALOR
     * @param string  $dataEnvio       DATAENVIO no formato 'YYYY-MM-DD HH24:MI:SS'
     * @param string  $cgc             CGC
     * @param string  $nomePagador     NOMEPAGADOR
     * @return bool                    True em sucesso, false em falha
     */
    public static function insertPix(
        int    $numDoc,
        string $tipoLancamento,
        string $dtLanc,
        int    $codAgencia,
        int    $numLote,
        int    $codTipoLanc,
        string $historico,
        float  $valor,
        string $dataEnvio,
        string $cgc,
        string $nomePagador
    ): bool
    {
        $conn = Database::connect();
        $owner = $_ENV['DBOWNER'];
        $sql  = "INSERT INTO $owner.LOG_EXTRATOBB (
                NUMDOC,
                TIPOLANCAMENTO,
                DTLANC,
                CODAGENCIA,
                NUMLOTE,
                CODTIPOLANC,
                HISTORICO,
                VALOR,
                DATAENVIO,
                CGC,
                NOMEPAGADOR
            ) VALUES (
                :NUMDOC,
                :TIPOLANCAMENTO,
                TO_DATE(:DTLANC, 'YYYY-MM-DD HH24:MI:SS'),
                :CODAGENCIA,
                :NUMLOTE,
                :CODTIPOLANC,
                :HISTORICO,
                :VALOR,
                TO_TIMESTAMP(:DATAENVIO, 'YYYY-MM-DD HH24:MI:SS'),
                :CGC,
                :NOMEPAGADOR
            )";

        $stid = oci_parse($conn, $sql);
        oci_bind_by_name($stid, ':NUMDOC', $numDoc);
        oci_bind_by_name($stid, ':TIPOLANCAMENTO', $tipoLancamento);
        oci_bind_by_name($stid, ':DTLANC', $dtLanc);
        oci_bind_by_name($stid, ':CODAGENCIA', $codAgencia);
        oci_bind_by_name($stid, ':NUMLOTE',  $numLote);
        oci_bind_by_name($stid, ':CODTIPOLANC', $codTipoLanc);
        oci_bind_by_name($stid, ':HISTORICO', $historico);
        oci_bind_by_name($stid, ':VALOR', $valor);
        oci_bind_by_name($stid, ':DATAENVIO', $dataEnvio);
        oci_bind_by_name($stid, ':CGC', $cgc);
        oci_bind_by_name($stid, ':NOMEPAGADOR', $nomePagador);

        // Executa sem auto‐commit
        $ok = oci_execute($stid, OCI_NO_AUTO_COMMIT);
        if ($ok) {
            oci_commit($conn);
        } else {
            oci_rollback($conn);
        }
        oci_free_statement($stid);

        return $ok;
    }
}