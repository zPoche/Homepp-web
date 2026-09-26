<?php
/**
 * Liest Sitekey und Secret aus turnstile-secret.php außerhalb des Webroots.
 * Die Datei selbst gibt nichts aus. Den Sitekey liefert nur turnstile-sitekey.php.
 */

declare(strict_types=1);

function turnstile_config_path(): string
{
    return dirname(__DIR__, 2) . DIRECTORY_SEPARATOR . 'turnstile-secret.php';
}

/** @return array{sitekey: string, secret: string} */
function turnstile_config(): array
{
    static $loaded = false;
    static $config = ['sitekey' => '', 'secret' => ''];
    if ($loaded) {
        return $config;
    }
    $loaded = true;

    $secret = getenv('TURNSTILE_SECRET_KEY');
    if (!is_string($secret) || $secret === '') {
        $fromServer = $_SERVER['TURNSTILE_SECRET_KEY'] ?? '';
        $secret = is_string($fromServer) ? $fromServer : '';
    }

    $sitekey = getenv('TURNSTILE_SITE_KEY');
    if (!is_string($sitekey) || $sitekey === '') {
        $fromServer = $_SERVER['TURNSTILE_SITE_KEY'] ?? '';
        $sitekey = is_string($fromServer) ? $fromServer : '';
    }

    $file = turnstile_config_path();
    if (is_file($file)) {
        $value = include $file;
        if (is_string($value)) {
            if ($secret === '' && $value !== '') {
                $secret = $value;
            }
        } elseif (is_array($value)) {
            if ($secret === '' && isset($value['secret']) && is_string($value['secret'])) {
                $secret = $value['secret'];
            }
            if ($sitekey === '' && isset($value['sitekey']) && is_string($value['sitekey'])) {
                $sitekey = $value['sitekey'];
            }
        }
    }

    $config = [
        'sitekey' => trim($sitekey),
        'secret' => trim($secret),
    ];
    return $config;
}

function turnstile_secret(): string
{
    return turnstile_config()['secret'];
}

function turnstile_sitekey(): string
{
    $key = turnstile_config()['sitekey'];
    if (!preg_match('/^0x[A-Za-z0-9_-]{16,200}$/', $key)) {
        return '';
    }
    return $key;
}
