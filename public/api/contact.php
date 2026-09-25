<?php
/**
 * Minimales Kontaktformular-Backend für Plesk/PHP.
 * Empfängt multipart/form-data, prüft Felder und sendet eine Mail
 * an die Betriebsadresse. Kein Drittanbieter, keine Datenbank.
 */

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');

const MAIL_TO = 'info@homepp.de';
const MAIL_FROM = 'noreply@homepowerplus.de';
const MAX_LEN = [
    'name' => 120,
    'email' => 190,
    'phone' => 60,
    'topic' => 120,
    'message' => 5000,
];

function respond(int $status, array $payload): never
{
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE);
    exit;
}

function clean_header(string $value): string
{
    return trim(str_replace(["\r", "\n", "\0"], '', $value));
}

function field(string $key): string
{
    $raw = $_POST[$key] ?? '';
    if (!is_string($raw)) {
        return '';
    }
    $value = trim($raw);
    $max = MAX_LEN[$key] ?? 500;
    if (strlen($value) > $max) {
        $value = substr($value, 0, $max);
    }
    return $value;
}

function client_ip(): string
{
    // Hinter dem Cloudflare-Proxy ist REMOTE_ADDR eine Edge-Adresse.
    // Die Besucher-IP steht dann in CF-Connecting-IP.
    $cf = $_SERVER['HTTP_CF_CONNECTING_IP'] ?? '';
    if (is_string($cf) && filter_var($cf, FILTER_VALIDATE_IP)) {
        return $cf;
    }
    $remote = $_SERVER['REMOTE_ADDR'] ?? '';
    return is_string($remote) && $remote !== '' ? $remote : 'unknown';
}

/**
 * Secret nur serverseitig: Umgebungsvariable oder Datei außerhalb des
 * Webroots (eine Ebene über public/ bzw. über httpdocs auf Plesk).
 * Die Datei gibt den Secret-String per return zurück und wird nicht
 * mit ausgeliefert.
 */
function turnstile_secret(): string
{
    $fromEnv = getenv('TURNSTILE_SECRET_KEY');
    if (is_string($fromEnv) && $fromEnv !== '') {
        return $fromEnv;
    }
    $fromServer = $_SERVER['TURNSTILE_SECRET_KEY'] ?? '';
    if (is_string($fromServer) && $fromServer !== '') {
        return $fromServer;
    }
    $file = dirname(__DIR__, 2) . DIRECTORY_SEPARATOR . 'turnstile-secret.php';
    if (is_file($file)) {
        $value = include $file;
        if (is_string($value) && $value !== '') {
            return $value;
        }
    }
    return '';
}

/** @return 'ok'|'invalid'|'unavailable' */
function verify_turnstile(string $token, string $secret, string $ip): string
{
    if ($token === '' || strlen($token) > 2048) {
        return 'invalid';
    }

    $body = http_build_query([
        'secret' => $secret,
        'response' => $token,
        'remoteip' => $ip,
    ]);
    $raw = http_post('https://challenges.cloudflare.com/turnstile/v0/siteverify', $body);
    if ($raw === null) {
        return 'unavailable';
    }

    $decoded = json_decode($raw, true);
    if (!is_array($decoded) || ($decoded['success'] ?? false) !== true) {
        return 'invalid';
    }
    return 'ok';
}

function http_post(string $url, string $body): ?string
{
    if (function_exists('curl_init')) {
        $ch = curl_init($url);
        if ($ch === false) {
            return null;
        }
        curl_setopt_array($ch, [
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => $body,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 8,
            CURLOPT_HTTPHEADER => ['Content-Type: application/x-www-form-urlencoded'],
        ]);
        $raw = curl_exec($ch);
        $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        if (!is_string($raw) || $status < 200 || $status >= 300) {
            return null;
        }
        return $raw;
    }

    $context = stream_context_create([
        'http' => [
            'method' => 'POST',
            'header' => "Content-Type: application/x-www-form-urlencoded\r\n",
            'content' => $body,
            'timeout' => 8,
        ],
    ]);
    $raw = @file_get_contents($url, false, $context);
    return is_string($raw) ? $raw : null;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(405, ['ok' => false, 'error' => 'method_not_allowed']);
}

// Honeypot: bei gefülltem Feld still "Erfolg" melden, keine Mail senden
if (field('company') !== '') {
    respond(200, ['ok' => true]);
}

$name = field('name');
$email = field('email');
$phone = field('phone');
$topic = field('topic');
$message = field('message');
$privacy = isset($_POST['privacy']);

if ($name === '' || $email === '' || $message === '' || !$privacy) {
    respond(422, ['ok' => false, 'error' => 'validation']);
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(422, ['ok' => false, 'error' => 'email']);
}

$ip = client_ip();
$turnstileSecret = turnstile_secret();
if ($turnstileSecret !== '') {
    $token = $_POST['cf-turnstile-response'] ?? '';
    $token = is_string($token) ? $token : '';
    $verdict = verify_turnstile($token, $turnstileSecret, $ip);
    if ($verdict === 'unavailable') {
        respond(503, ['ok' => false, 'error' => 'turnstile_unavailable']);
    }
    if ($verdict !== 'ok') {
        respond(403, ['ok' => false, 'error' => 'turnstile']);
    }
}

// Einfaches Rate-Limit: max. 5 Anfragen / IP / Stunde
$rateFile = rtrim(sys_get_temp_dir(), DIRECTORY_SEPARATOR)
    . DIRECTORY_SEPARATOR
    . 'hpp-contact-'
    . hash('sha256', $ip)
    . '.json';
$now = time();
$window = 3600;
$limit = 5;
$hits = [];

if (is_readable($rateFile)) {
    $decoded = json_decode((string) file_get_contents($rateFile), true);
    if (is_array($decoded)) {
        $hits = array_values(array_filter(
            $decoded,
            static fn ($t) => is_int($t) && $t > $now - $window,
        ));
    }
}

if (count($hits) >= $limit) {
    respond(429, ['ok' => false, 'error' => 'rate_limit']);
}

$hits[] = $now;
@file_put_contents($rateFile, json_encode($hits), LOCK_EX);

$subjectTopic = $topic !== '' ? $topic : 'Allgemein';
$subject = clean_header('Anfrage über homepowerplus.de: ' . $subjectTopic);

$body = implode("\n", [
    'Neue Anfrage über das Kontaktformular',
    '',
    'Name:    ' . $name,
    'E-Mail:  ' . $email,
    'Telefon: ' . ($phone !== '' ? $phone : '-'),
    'Thema:   ' . ($topic !== '' ? $topic : '-'),
    'IP:      ' . $ip,
    'Zeit:    ' . gmdate('c'),
    '',
    $message,
    '',
    'Einwilligung Datenschutz: ja',
]);

$replyTo = clean_header($email);
$headers = [
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
    'From: HomePower+ Website <' . MAIL_FROM . '>',
    'Reply-To: ' . $replyTo,
    'X-Mailer: HomePowerPlus-Contact/1.0',
];

$encodedSubject = '=?UTF-8?B?' . base64_encode($subject) . '?=';
$sent = @mail(MAIL_TO, $encodedSubject, $body, implode("\r\n", $headers));

if (!$sent) {
    respond(500, ['ok' => false, 'error' => 'mail']);
}

respond(200, ['ok' => true]);
