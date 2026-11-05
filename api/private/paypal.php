<?php
declare(strict_types=1);

// Appels à l'API REST PayPal, toujours côté serveur (le secret ne quitte jamais le serveur).

function paypal_base(): string
{
    $override = getenv('PAYPAL_API_BASE'); // utilisé seulement pour les tests locaux
    if ($override) return rtrim($override, '/');
    return (config()['paypal_mode'] ?? 'sandbox') === 'live'
        ? 'https://api-m.paypal.com'
        : 'https://api-m.sandbox.paypal.com';
}

function paypal_request(string $method, string $path, array|object|null $body = null, ?string $token = null, array $extraHeaders = []): array
{
    $ch = curl_init(paypal_base() . $path);
    $headers = array_merge(['Accept: application/json'], $extraHeaders);
    if ($token) {
        $headers[] = 'Authorization: Bearer ' . $token;
    }
    $opts = [
        CURLOPT_CUSTOMREQUEST  => $method,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT        => 20,
    ];
    if ($body !== null) {
        $headers[] = 'Content-Type: application/json';
        $opts[CURLOPT_POSTFIELDS] = json_encode($body, JSON_UNESCAPED_SLASHES);
    }
    $opts[CURLOPT_HTTPHEADER] = $headers;
    curl_setopt_array($ch, $opts);
    $resp = curl_exec($ch);
    $status = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $err = curl_error($ch);
    curl_close($ch);
    if ($resp === false) {
        throw new RuntimeException('PayPal injoignable : ' . $err);
    }
    $data = json_decode((string) $resp, true);
    return ['status' => $status, 'body' => is_array($data) ? $data : []];
}

function paypal_token(): string
{
    $c = config();
    $ch = curl_init(paypal_base() . '/v1/oauth2/token');
    curl_setopt_array($ch, [
        CURLOPT_POST           => true,
        CURLOPT_POSTFIELDS     => 'grant_type=client_credentials',
        CURLOPT_USERPWD        => $c['paypal_client_id'] . ':' . $c['paypal_client_secret'],
        CURLOPT_HTTPHEADER     => ['Accept: application/json'],
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT        => 20,
    ]);
    $resp = curl_exec($ch);
    $status = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    $data = json_decode((string) $resp, true);
    if ($status !== 200 || empty($data['access_token'])) {
        throw new RuntimeException('Authentification PayPal refusée (vérifier client_id / secret).');
    }
    return $data['access_token'];
}

function paypal_create_order(int $amountCents): array
{
    $r = paypal_request('POST', '/v2/checkout/orders', [
        'intent' => 'CAPTURE',
        'purchase_units' => [[
            'description' => 'Don volontaire CinéLibre',
            'amount' => ['currency_code' => 'EUR', 'value' => cents_to_eur($amountCents)],
        ]],
        'application_context' => ['shipping_preference' => 'NO_SHIPPING', 'brand_name' => 'CinéLibre'],
    ], paypal_token(), ['PayPal-Request-Id: ' . bin2hex(random_bytes(16))]);
    if ($r['status'] >= 300 || empty($r['body']['id'])) {
        throw new RuntimeException('Création de la commande PayPal impossible.');
    }
    return $r['body'];
}

/** Capture la commande et renvoie la capture validée (id, montant en centimes, devise). */
function paypal_capture_order(string $orderId): array
{
    $r = paypal_request('POST', '/v2/checkout/orders/' . rawurlencode($orderId) . '/capture', new stdClass(), paypal_token(), [
        'PayPal-Request-Id: capture-' . $orderId, // rejouer la même capture ne débite pas deux fois
    ]);
    $body = $r['body'];
    // Si la commande a déjà été capturée, on relit la commande pour retrouver la capture.
    if ($r['status'] === 422 && (($body['details'][0]['issue'] ?? '') === 'ORDER_ALREADY_CAPTURED')) {
        $body = paypal_request('GET', '/v2/checkout/orders/' . rawurlencode($orderId), null, paypal_token())['body'];
    } elseif ($r['status'] >= 300) {
        throw new RuntimeException('Le paiement PayPal n\'a pas pu être finalisé.');
    }
    $capture = $body['purchase_units'][0]['payments']['captures'][0] ?? null;
    if (!$capture || ($capture['status'] ?? '') !== 'COMPLETED') {
        throw new RuntimeException('Paiement non confirmé par PayPal.');
    }
    $cents = eur_to_cents((string) ($capture['amount']['value'] ?? ''));
    if ($cents === null) {
        throw new RuntimeException('Montant PayPal illisible.');
    }
    return [
        'capture_id' => (string) $capture['id'],
        'amount_cents' => $cents,
        'currency' => (string) ($capture['amount']['currency_code'] ?? ''),
    ];
}

/** Vérifie auprès de PayPal que le webhook est authentique. */
function paypal_verify_webhook(array $headers, array $event): bool
{
    $h = array_change_key_case($headers, CASE_LOWER);
    $needed = ['paypal-auth-algo', 'paypal-cert-url', 'paypal-transmission-id', 'paypal-transmission-sig', 'paypal-transmission-time'];
    foreach ($needed as $k) {
        if (empty($h[$k])) return false;
    }
    $r = paypal_request('POST', '/v1/notifications/verify-webhook-signature', [
        'auth_algo'         => $h['paypal-auth-algo'],
        'cert_url'          => $h['paypal-cert-url'],
        'transmission_id'   => $h['paypal-transmission-id'],
        'transmission_sig'  => $h['paypal-transmission-sig'],
        'transmission_time' => $h['paypal-transmission-time'],
        'webhook_id'        => config()['paypal_webhook_id'],
        'webhook_event'     => $event,
    ], paypal_token());
    return $r['status'] === 200 && ($r['body']['verification_status'] ?? '') === 'SUCCESS';
}
