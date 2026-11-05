<?php
declare(strict_types=1);
require __DIR__ . '/private/bootstrap.php';
require __DIR__ . '/private/paypal.php';

// POST /api/capture-order.php {"orderID": "..."} : finalise le paiement, l'enregistre une seule fois,
// et offre un code VIP si le don atteint le minimum prévu.
require_post();
$orderId = (string) (read_json_body()['orderID'] ?? '');
if (!preg_match('/^[A-Z0-9-]{5,40}$/i', $orderId)) {
    json_out(['error' => 'Commande invalide.'], 400);
}
try {
    $c = config();
    $cap = paypal_capture_order($orderId);
    if ($cap['currency'] !== 'EUR') {
        json_out(['error' => 'Devise non prise en charge.'], 400);
    }
    // Le webhook PayPal peut arriver avant ou après : le capture_id unique empêche le double comptage.
    record_donation($cap['capture_id'], $cap['amount_cents'], 'EUR');

    $vip = null;
    if ($cap['amount_cents'] >= (int) round($c['vip_min_donation'] * 100)) {
        $vip = issue_vip($cap['capture_id'], (int) $c['vip_days']); // null si déjà remis pour ce don
    }
    $goalCents = (int) round($c['goal_eur'] * 100);
    $total = weekly_total_cents();
    json_out([
        'ok'      => true,
        'amount'  => $cap['amount_cents'] / 100,
        'total'   => $total / 100,
        'reached' => $total >= $goalCents,
        'vip'     => $vip,
    ]);
} catch (Throwable $e) {
    error_log('[CinéLibre capture-order] ' . $e->getMessage());
    json_out(['error' => 'Le paiement n\'a pas pu être confirmé. Aucun montant n\'a été compté.'], 502);
}
