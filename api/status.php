<?php
declare(strict_types=1);
require __DIR__ . '/private/bootstrap.php';

// GET /api/status.php : total réel de la semaine (Europe/Paris), objectif, configuration publique PayPal.
try {
    $c = config();
    $goalCents = (int) round(((float) $c['goal_eur']) * 100);
    $total = weekly_total_cents();
    [, $end] = current_week_bounds();
    json_out([
        'total'            => $total / 100,
        'goal'             => $goalCents / 100,
        'reached'          => $total >= $goalCents,
        'week_resets_at'   => $end->format(DATE_ATOM),
        'min_donation'     => (float) $c['min_donation'],
        'max_donation'     => (float) $c['max_donation'],
        'vip_min_donation' => (float) $c['vip_min_donation'],
        'vip_days'         => (int) $c['vip_days'],
        'paypal_client_id' => (string) $c['paypal_client_id'],
    ]);
} catch (Throwable $e) {
    error_log('[CinéLibre status] ' . $e->getMessage());
    json_out(['error' => 'Compteur indisponible.'], 503);
}
