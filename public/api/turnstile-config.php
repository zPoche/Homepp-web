<?php
/**
 * Liest Sitekey und Secret aus httpdocs/turnstile-secret.php.
 * Gesucht wird vom Skript aus aufwärts: direkt in httpdocs, wenn api dort liegt,
 * und eine Ebene über dist, wenn die Website aus dist läuft. Ein neuer Build
 * fasst diese Datei nicht an. Eine Kopie neben diesem Skript gilt nur als Notnagel.
 */

declare(strict_types=1);

/** @return list<string> */
function turnstile_config_paths(): array
{
    $starts = [__DIR__];
    $cwd = getcwd();
    if (is_string($cwd) && $cwd !== '') {
        $starts[] = $cwd;
    }

    $parents = [];
    $besideScript = [];
    foreach ($starts as $start) {
        $besideScript[] = $start . DIRECTORY_SEPARATOR . 'turnstile-secret.php';
        $dir = $start;
        for ($level = 0; $level < 4; $level++) {
            $parent = dirname($dir);
            if ($parent === $dir) {
                break;
            }
            $dir = $parent;
            $parents[] = $dir . DIRECTORY_SEPARATOR . 'turnstile-secret.php';
        }
    }

    return array_values(array_unique(array_merge($parents, $besideScript)));
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
            if ($secret === '' && $value !== '') {
                $secret = $value;
            }
        } elseif (is_array($value)) {
            if ($secret === '' && isset($value['secret']) && is_string($value['secret']) && $value['secret'] !== '') {
                $secret = $value['secret'];
            }
            if ($sitekey === '' && isset($value['sitekey']) && is_string($value['sitekey']) && $value['sitekey'] !== '') {
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
