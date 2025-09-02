<?php
// public/testBB.php

require __DIR__ . '/../vendor/autoload.php';

use Services\AuthService;

// Inicializa o serviço de autenticação
$authService = new AuthService();

// Simula credenciais de login
$usuario = 'luis.vitor'; // Substitua pelo nome de usuário real
$senha = 'i89gtu-A'; // Substitua pela senha real

// Testa a função de login
echo "=== Testando Login ===\n";
$token = $authService->login($usuario, $senha);

if ($token) {
    echo "Token gerado com sucesso:\n";
    echo $token . "\n";
} else {
    echo "Falha no login: credenciais inválidas.\n";
}

// Testa a função de verificação do token
if ($token) {
    echo "\n=== Testando Verificação do Token ===\n";
    $decoded = $authService->verifyToken($token);

    if ($decoded) {
        echo "Token válido. Dados decodificados:\n";
        print_r($decoded);
    } else {
        echo "Token inválido.\n";
    }
}

