<?php
namespace Services;

use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;
use Dotenv\Dotenv;
use Services\TokenBBService;

require __DIR__ . '/../vendor/autoload.php';
Dotenv::createImmutable('/etc/env')->load();

class BBService
{
    private Client          $http;
    private TokenBBService  $tokenService;
    private string          $devKey;
    private string          $agencia;
    private string          $conta;

    public function __construct(TokenBBService $tokenService, Client $http = null)
    {
        $this->tokenService = $tokenService;
        $this->http         = $http ?? new Client([
            'base_uri' => $_ENV['BB_BASE_URI'],
            'cert'     => $_ENV['BB_CERT_PATH'],
            'verify'   => $_ENV['BB_CERT_VERIFY_PATH'],
        ]);

        $this->devKey  = $_ENV['DEVKEYBB'];
        $this->agencia = $_ENV['AGENCIA'];
        $this->conta   = $_ENV['CONTA'];
    }

    /**
     * Busca o extrato paginado entre datas.
     *
     * @param string $dateInit
     * @param string $dateFinal
     * 
     * @return array Lista de lançamentos
     */
    public function fetchExtratoRange(string $dateInit, string $dateFinal): array
    {
        $paginaInicial = 1;
        $mergedLancamentos = [];

        do {
            $resp = $this->fetchExtratoPage($paginaInicial, $dateInit, $dateFinal);
            if (isset($resp['error'])) {
                throw new \RuntimeException("Erro ao obter extrato BB: " . $resp['error']);
            }
            $mergedLancamentos = array_merge($mergedLancamentos, $resp['listaLancamento'] ?? []);
            $pagina = $resp['numeroPaginaProximo'] ?? 0;
        } while ($pagina);

        return $mergedLancamentos;
    }

    /**
     * Busca uma página específica do extrato.
     * 
     * @param int $pagina
     * @param string $dateInit
     * @param string $dateFinal
     * 
     * @return array
     */
    private function fetchExtratoPage(int $pagina, string $dateInit, string $dateFinal): array
    {
        $token = $this->tokenService->getValidAccessToken();
        $endpoint = "/extratos/v1/conta-corrente/agencia/{$this->agencia}/conta/{$this->conta}";

        try {
            $response = $this->http->request('GET', $endpoint, [
                'headers' => [
                    'Authorization' => "Bearer {$token}",
                    'Content-Type' => 'application/json',
                    'gw-dev-app-key' => $this->devKey,
                ],
                'query' => [
                    'dataInicioSolicitacao' => $dateInit,
                    'dataFimSolicitacao' => $dateFinal,
                    'numeroPaginaSolicitacao' => $pagina,
                ],
            ]);

            return json_decode((string) $response->getBody(), true);

        } catch (RequestException $e) {
            // Centraliza o log de erro
            error_log("BBService fetchExtratoPage erro: " . $e->getMessage());
            return ['error' => $e->getMessage()];
        }
    }
}
