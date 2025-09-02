<?php
namespace Models;

use Dotenv\Dotenv;
use Config\Database;

require __DIR__ . '/../vendor/autoload.php';
Dotenv::createImmutable('/etc/env')->load();

class Usuario {

    /**
     * Utiliza login e senha para retornar dados do usuário, necessários para gerar token JWT.
     * 
     * @param string $usuario // Usuário igual ao campo USUARIBD
     * @param string $senha   // Senha tem que ser igual ao retorno da função DECRYPT(SENHABD, USUARIBD)
     * @return array|false    // retorna dados do usuário ou false se credenciais inválidas
     * 
     */
    public function getAuthUser(string $usuario, string $senha) {

        // Obtendo conexão e owner das tabelas
        $conn = Database::connect();
        $owner = $_ENV['DBOWNER'];

        // Consulta SQL para montar a tabela usuarios
        $sql = "SELECT 
                    MATRICULA, 
                    USUARIOBD AS USERNAME,
                    NOME,
                    $owner.DECRYPT(SENHABD, USUARIOBD) AS PASSWORD,
                    CODSETOR
                FROM $owner.PCEMPR
                WHERE SENHABD IS NOT NULL
                AND SITUACAO = 'A'
                AND UPPER(USUARIOBD) = UPPER(:USERNAME)
                AND UPPER($owner.DECRYPT(SENHABD, USUARIOBD)) = UPPER(:PASSWORD)";

        // Preparação e execução da consulta
        $stid = oci_parse($conn, $sql);
        oci_bind_by_name($stid, ':USERNAME', $usuario);
        oci_bind_by_name($stid, ':PASSWORD', $senha);
        oci_execute($stid);

        // busca o primeiro resultado
        if ($row = oci_fetch_assoc($stid)) {
            oci_free_statement($stid);
            return $row;   // ex: ['ID'=>1, 'LOGIN'=>'joao', 'NOME'=>'João Silva', 'PERFIL'=>'ADMIN']
        }

        oci_free_statement($stid);
        return false;
    }

}