<?php
namespace Services;

use GuzzleHttp\Client;
use GuzzleHttp\Exception\GuzzleException;
use Dotenv\Dotenv;

require __DIR__ . '/../vendor/autoload.php';
Dotenv::createImmutable('/etc/env')->load();

class TokenBBService
{
    /**
     * Token de acesso atual.
     *
     * @var string|null
     */
    private ?string $token = null;

    /**
     * Timestamp (Unix epoch) de expiração do token.
     *
     * @var int
     */
    private int $expiresAt = 0;

    /**
     * Cliente HTTP para realizar requisições.
     *
     * @var Client
     */
    private Client $http;

    /**
     * Cria instância do serviço de token, aceitando um Client customizado.
     *
     * @param Client|null $http Cliente Guzzle opcional (injeção de dependência).
     */
    public function __construct(Client $http = null)
    {
        $this->http = $http ?? new Client(['timeout' => 5.0]);
    }

    /**
     * Renova o token se ele não existir ou estiver expirado, se estiver válido, retorna o token.
     *
     * @return string Token de acesso válido.
     * @throws \RuntimeException Em caso de falha na renovação do token.
     */
    public function getValidAccessToken(): string
    {
        if (!$this->token || time() >= $this->expiresAt) {
            $this->refreshToken();
        }

        return $this->token;
    }

    /**
     * Renova o token de acesso junto à API do Banco do Brasil.
     *
     * Atualiza as propriedades `$token` e `$expiresAt`.
     *
     * @return void
     * @throws \RuntimeException Em caso de erro na requisição de renovação.
     */
    private function refreshToken(): void
    {
        try {
            $response = $this->http->post(
                $_ENV['OAUTH_URL'],
                [
                    'headers' => [
                        'Authorization' => $_ENV['OAUTHBASIC'],
                        'Content-Type'  => 'application/x-www-form-urlencoded',
                    ],
                    'form_params' => [
                        'grant_type' => 'client_credentials',
                        'scope'      => 'extrato-info',
                    ],
                ]
            );

            $data = json_decode((string) $response->getBody(), true);
            $this->token = $data['access_token'];
            $this->expiresAt = time() + $data['expires_in'] - 15;

        } catch (GuzzleException $e) {
            throw new \RuntimeException("Falha ao renovar token BB: " . $e->getMessage(), 0, $e);
        }
    }
}