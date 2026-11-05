<?php
declare(strict_types=1);
// Crée un code VIP à la main (ex. pour un don reçu hors PayPal).
// Usage (terminal SSH Hostinger) : php api/private/tools/create-vip.php 30
if (PHP_SAPI !== 'cli') { http_response_code(404); exit; }
require __DIR__ . '/../bootstrap.php';
$days = max(1, (int) ($argv[1] ?? config()['vip_days']));
$vip = issue_vip(null, $days);
echo "Code VIP : {$vip['code']}\nValable jusqu'au : {$vip['expires_at']}\n";
