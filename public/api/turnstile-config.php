<?php
/**
 * Liest Sitekey und Secret aus turnstile-secret.php.
 * Zuerst die mitgelieferte Datei neben diesem Skript, danach eine Datei
 * außerhalb des Webroots, falls dort schon Werte stehen.
 */

declare(strict_types=1);

/** @return list<string> */
function turnstile_config_paths(): array
{
    return [
        __DIR__ . DIRECTORY_SEPARATOR . 'turnstile-secret.php',
        dirname(__DIR__, 2) . DIRECTORY_SEPARATOR . 'turnstile-secret.php',
    ];
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

    foreach (turnstile_config_paths() as $file) {
        if (!is_file($file)) {
            continue;
        }
        $value = include $file;
        if (is_string($value)) {
            if ($value !== '') {
                $secret = $value;
            }
        } elseif (is_array($value)) {
            if (isset($value['secret']) && is_string($value['secret']) && $value['secret'] !== '') {
                $secret = $value['secret'];
            }
            if (isset($value['sitekey']) && is_string($value['sitekey']) && $value['sitekey'] !== '') {
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
