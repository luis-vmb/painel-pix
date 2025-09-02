<?php
namespace Services;

use Dotenv\Dotenv;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Models\Usuario;

require __DIR__ . '/../vendor/autoload.php';
Dotenv::createImmutable('/etc/env')->load();

class AuthService
{
    private $jwtSecret;

    /**
     * Construtor da classe AuthService.
     *
     * Inicializa a classe carregando a chave secreta do JWT a partir das variáveis de ambiente.
     * Certifique-se de que a variável `JWT_SECRET` esteja definida no arquivo `.env`.
     *
     * @throws \RuntimeException Se a variável de ambiente `JWT_SECRET` não estiver definida.
     */

    public function __construct()
    {
        $this->jwtSecret = $_ENV['JWT_SECRET']; // Certifique-se de definir JWT_SECRET no arquivo .env
    }

    /**
     * Realiza login e gera um token JWT.
     *
     * @param string $usuario
     * @param string $senha
     * @return string|false Retorna o token JWT ou false se as credenciais forem inválidas.
     */
    public function login(string $usuario, string $senha)
    {
        $usuarioModel = new Usuario();
        $authUser = $usuarioModel->getAuthUser($usuario, $senha);

        if ($authUser) {
            $payload = [
                'iss' => 'painel-pix', // Identificador do emissor
                'iat' => time(), // Timestamp de emissão
                'exp' => time() + 3600, // Expiração em 1 hora
                'data' => [
                    'id' => $authUser['MATRICULA'],
                    'username' => $authUser['USERNAME'],
                    'name' => $authUser['NOME'],
                    'role' => $authUser['CODSETOR']
                ]
            ];

            return JWT::encode($payload, $this->jwtSecret, 'HS256');
        }

        return false;
    }

    /**
     * Verifica se o token JWT é válido.
     *
     * @param string $token
     * @return array|false Retorna os dados do token decodificado ou false se inválido.
     */
    public function verifyToken(string $token)
    {
        try {
            $decoded = JWT::decode($token, new Key($this->jwtSecret, 'HS256'));
            return (array) $decoded;
        } catch (\Exception $e) {
            return false;
        }
    }
}