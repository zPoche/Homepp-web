<?php
/**
 * Liefert nur den öffentlichen Turnstile-Sitekey.
 * Das Secret bleibt in turnstile-secret.php und wird hier nicht ausgegeben.
 */

declare(strict_types=1);

require_once __DIR__ . '/turnstile-config.php';

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'GET') {
    http_response_code(405);
    echo json_encode(['sitekey' => ''], JSON_UNESCAPED_UNICODE);
    exit;
}

echo json_encode(['sitekey' => turnstile_sitekey()], JSON_UNESCAPED_UNICODE);
