<?php
declare(strict_types=1);
require __DIR__ . '/private/bootstrap.php';
require __DIR__ . '/private/paypal.php';

// POST /api/create-order.php {"amount": "10.00"} : crée la commande PayPal côté serveur.
require_post();
$c = config();
$amount = (string) (read_json_body()['amount'] ?? '');
$cents = eur_to_cents(str_replace(',', '.', trim($amount)));
$min = (int) round($c['min_donation'] * 100);
$max = (int) round($c['max_donation'] * 100);
if ($cents === null || $cents < $min || $cents > $max) {
    json_out(['error' => sprintf('Montant entre %s € et %s €.', $c['min_donation'], $c['max_donation'])], 400);
}
try {
    $order = paypal_create_order($cents);
    json_out(['id' => $order['id']]);
} catch (Throwable $e) {
    error_log('[CinéLibre create-order] ' . $e->getMessage());
    json_out(['error' => 'PayPal est momentanément indisponible.'], 502);
}
