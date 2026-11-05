<?php
declare(strict_types=1);
require __DIR__ . '/private/bootstrap.php';
require __DIR__ . '/private/paypal.php';

// POST /api/webhook.php : notifications PayPal, signature vérifiée avant tout traitement.
// URL à déclarer dans l'app PayPal : https://VOTRE-DOMAINE/api/webhook.php
// Événements : PAYMENT.CAPTURE.COMPLETED, PAYMENT.CAPTURE.REFUNDED, PAYMENT.CAPTURE.REVERSED
require_post();
$raw = file_get_contents('php://input') ?: '';
$event = json_decode($raw, true);
if (!is_array($event) || empty($event['id']) || empty($event['event_type'])) {
    json_out(['error' => 'Requête invalide.'], 400);
}

try {
    $headers = function_exists('getallheaders') ? getallheaders() : [];
    if (!$headers) {
        foreach ($_SERVER as $k => $v) {
            if (str_starts_with($k, 'HTTP_')) $headers[str_replace('_', '-', substr($k, 5))] = $v;
        }
    }
    if (!paypal_verify_webhook($headers, $event)) {
        json_out(['error' => 'Signature invalide.'], 401);
    }

    // Un même événement n'est traité qu'une fois.
    try {
        db()->prepare('INSERT INTO webhook_events (event_id, event_type, received_at) VALUES (:id, :t, :r)')
            ->execute([':id' => (string) $event['id'], ':t' => (string) $event['event_type'], ':r' => db_time(utc_now())]);
    } catch (PDOException $e) {
        if (is_duplicate($e)) json_out(['ok' => true, 'duplicate' => true]);
        throw $e;
    }

    $res = $event['resource'] ?? [];
    switch ($event['event_type']) {
        case 'PAYMENT.CAPTURE.COMPLETED':
            $cents = eur_to_cents((string) ($res['amount']['value'] ?? ''));
            if (!empty($res['id']) && $cents !== null && ($res['amount']['currency_code'] ?? '') === 'EUR') {
                $at = !empty($res['create_time']) ? new DateTimeImmutable($res['create_time']) : null;
                record_donation((string) $res['id'], $cents, 'EUR', $at);
            }
            break;

        case 'PAYMENT.CAPTURE.REVERSED':
            if (!empty($res['id'])) mark_refunded((string) $res['id']);
            break;

        case 'PAYMENT.CAPTURE.REFUNDED':
            // La ressource est le remboursement ; la capture d'origine est dans le lien "up".
            foreach ($res['links'] ?? [] as $link) {
                if (($link['rel'] ?? '') === 'up' && preg_match('#/captures/([^/?]+)#', (string) $link['href'], $m)) {
                    mark_refunded($m[1]);
                }
            }
            break;
    }
    json_out(['ok' => true]);
} catch (Throwable $e) {
    error_log('[CinéLibre webhook] ' . $e->getMessage());
    json_out(['error' => 'Erreur serveur.'], 500); // PayPal renverra l'événement plus tard
}
