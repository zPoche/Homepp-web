<?php
/**
 * Vorlage. Einmalig kopieren nach httpdocs/turnstile-secret.php,
 * also eine Ebene über den Ordner dist. Dort eintragen:
 *
 * return [
 *     'sitekey' => '0x...',
 *     'secret' => '0x...',
 * ];
 *
 * Ein neuer Build ersetzt nur diese Vorlage, nicht die Kopie über dist.
 */
return [
    'sitekey' => '',
    'secret' => '',
];
