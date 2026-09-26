<?php
/**
 * Schlüssel vom Cloudflare-Widget „HomePower Captcha“ hier eintragen.
 * Direkt im Browser aufrufen geht nicht; gelesen wird die Datei nur vom Formular.
 * Beim nächsten Hochladen von dist diese Datei nicht überschreiben.
 */
if (isset($_SERVER['SCRIPT_FILENAME']) && basename((string) $_SERVER['SCRIPT_FILENAME']) === 'turnstile-secret.php') {
    http_response_code(404);
    exit;
}

return [
    'sitekey' => '',
    'secret' => '',
];
