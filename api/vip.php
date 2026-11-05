<?php
declare(strict_types=1);
require __DIR__ . '/private/bootstrap.php';

// POST /api/vip.php {"code": "CINE-XXXX-XXXX-XXXX"} : vérifie un code VIP (validité et expiration).
require_post();
usleep(300000); // ralentit les essais en série
$code = (string) (read_json_body()['code'] ?? '');
try {
    $vip = check_vip($code);
    if ($vip) {
        json_out(['valid' => true, 'expires_at' => $vip['expires_at']]);
    }
    json_out(['valid' => false, 'error' => 'Code VIP invalide ou expiré.']);
} catch (Throwable $e) {
    error_log('[CinéLibre vip] ' . $e->getMessage());
    json_out(['valid' => false, 'error' => 'Vérification impossible pour le moment.'], 503);
}
