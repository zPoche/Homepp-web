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

// Einfaches Rate-Limit: max. 5 Anfragen / IP / Stunde
$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
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
