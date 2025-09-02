<?php
namespace Services;

use Dotenv\Dotenv;
use Config\Database;
use Models\Pix;

require __DIR__ . '/../vendor/autoload.php';
Dotenv::createImmutable('/etc/env')->load();

class PixService
{
    /**
     * Grava o log de confirmação do PIX.
     *
     * @param int $numeroPedido Número do pedido.
     * @param int $numeroDocumento Número do documento PIX.
     * @param int $matricula Matrícula do funcionário.
     * @param string $usuario Nome do funcionário.
     * @return bool True se o log foi gravado com sucesso, False caso contrário.
     */
    public function gravarLog(int $numeroPedido, int $numeroDocumento, int $matricula, string $usuario, float $valornew): bool
    {
        return Pix::confirmPix($numeroPedido, $numeroDocumento, $matricula, $usuario, $valornew);
    }

    /**
     * Retorna um array de arrays com os pix sem confirmação usando filtro de data de between.
     * 
     * @param string $dataInicio
     * @param string $dataFim
     * @param string $cgc
     * @return array|false
     * 
     */
    public static function listPix(string $dataInicio, string $dataFim) :array {
        // Conexão 
        $conn = Database::connect();
        $owner = $_ENV['DBOWNER'];

        $sql = "SELECT 
                NUMDOC,
                DTLANC,
                HISTORICO,
                NVL(VALORALT, VALOR) VALOR,
                CGC,
                NOMEPAGADOR,
                DATAENVIO
            FROM $owner.LOG_EXTRATOBB
            WHERE 1=1
                AND NUMPED1 IS NULL
                AND CGC NOT LIKE '%14220230000170%'
                AND TRUNC(DATAENVIO) BETWEEN TO_DATE(:DATAINI, 'DD-MM-YYYY') AND TO_DATE(:DATAFIM, 'DD-MM-YYYY')
                AND HISTORICO NOT LIKE '%QR Code%'
            ORDER BY DATAENVIO DESC";
        $stmt = oci_parse($conn, $sql);
        oci_bind_by_name($stmt, ":DATAINI", $dataInicio);
        oci_bind_by_name($stmt, ":DATAFIM", $dataFim);
        oci_execute($stmt);

        $resultado = [];
        while ($row = oci_fetch_assoc($stmt)) {
            $resultado[] = $row;
        }

        oci_free_statement($stmt);
        return $resultado;
    }
}