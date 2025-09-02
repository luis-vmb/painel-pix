<?php
namespace Config;

use Dotenv\Dotenv;

require __DIR__ . '/../vendor/autoload.php';
Dotenv::createImmutable('/etc/env')->load();

class Database
{
    private static $connection = null;

    public static function connect()
    {
        if (self::$connection === null) {
            // Variáveis de conexão agora vindas de $_ENV
            $db_username = $_ENV['DBUSER'];
            $db_password = $_ENV['DBPASSWORD'];
            $db_host     = $_ENV['DBHOST'];
            $db_service  = $_ENV['DBSERVICE'];

            // Conexão com o Oracle
            $conn = oci_connect($db_username, $db_password, "$db_host/$db_service");
            if (!$conn) {
                $erro = oci_error();
                die("Erro na conexão Oracle: " . $erro['message']);
            }

            self::$connection = $conn;
        }

        return self::$connection;
    }
}
