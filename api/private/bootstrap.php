<?php
declare(strict_types=1);

// Code commun à toutes les routes /api.

const PARIS_TZ = 'Europe/Paris';

function config(): array
{
    static $cfg = null;
    if ($cfg === null) {
        $path = getenv('CINELIBRE_CONFIG') ?: __DIR__ . '/config.php';
        if (!is_file($path)) {
            json_out(['error' => 'Serveur non configuré (config.php manquant).'], 503);
        }
        $cfg = require $path;
    }
    return $cfg;
}

function db(): PDO
{
    static $pdo = null;
    if ($pdo === null) {
        $c = config();
        $pdo = new PDO($c['db_dsn'], $c['db_user'] ?? null, $c['db_pass'] ?? null, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]);
    }
    return $pdo;
}

function json_out(array $data, int $status = 200): never
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    header('X-Content-Type-Options: nosniff');
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function require_post(): void
{
    if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
        json_out(['error' => 'Méthode non autorisée.'], 405);
    }
}

function read_json_body(): array
{
    $raw = file_get_contents('php://input') ?: '';
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

function utc_now(): DateTimeImmutable
{
    return new DateTimeImmutable('now', new DateTimeZone('UTC'));
}

function db_time(DateTimeImmutable $d): string
{
    return $d->setTimezone(new DateTimeZone('UTC'))->format('Y-m-d H:i:s');
}

/**
 * Début (lundi 00:00 heure de Paris) et fin de la semaine en cours, convertis en UTC.
 * Gère automatiquement l'heure d'été / d'hiver.
 */
function current_week_bounds(?DateTimeImmutable $now = null): array
{
    $paris = new DateTimeZone(PARIS_TZ);
    $now = ($now ?? utc_now())->setTimezone($paris);
    $start = $now->modify('monday this week')->setTime(0, 0);
    $end = $start->modify('+1 week');
    return [$start, $end];
}

function weekly_total_cents(?DateTimeImmutable $now = null): int
{
    [$start, $end] = current_week_bounds($now);
    $st = db()->prepare(
        'SELECT COALESCE(SUM(amount_cents), 0) AS total FROM donations
         WHERE refunded = 0 AND currency = :cur AND created_at >= :s AND created_at < :e'
    );
    $st->execute([':cur' => 'EUR', ':s' => db_time($start), ':e' => db_time($end)]);
    return (int) $st->fetch()['total'];
}

function is_duplicate(PDOException $e): bool
{
    return $e->getCode() === '23000' || str_contains($e->getMessage(), 'UNIQUE');
}

/** Enregistre un don une seule fois par capture PayPal. Renvoie true si c'était nouveau. */
function record_donation(string $captureId, int $amountCents, string $currency, ?DateTimeImmutable $at = null): bool
{
    try {
        db()->prepare(
            'INSERT INTO donations (capture_id, amount_cents, currency, refunded, created_at)
             VALUES (:id, :a, :c, 0, :t)'
        )->execute([':id' => $captureId, ':a' => $amountCents, ':c' => $currency, ':t' => db_time($at ?? utc_now())]);
        return true;
    } catch (PDOException $e) {
        if (is_duplicate($e)) return false;
        throw $e;
    }
}

function mark_refunded(string $captureId): void
{
    db()->prepare('UPDATE donations SET refunded = 1 WHERE capture_id = :id')->execute([':id' => $captureId]);
    db()->prepare('UPDATE vip_codes SET revoked = 1 WHERE capture_id = :id')->execute([':id' => $captureId]);
}

function normalize_vip(string $code): string
{
    return strtoupper(preg_replace('/[^A-Za-z0-9]/', '', $code) ?? '');
}

function vip_hash(string $code): string
{
    return hash('sha256', normalize_vip($code));
}

function generate_vip_code(): string
{
    $alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // sans 0/O/1/I pour éviter les confusions
    $chars = '';
    for ($i = 0; $i < 12; $i++) {
        $chars .= $alphabet[random_int(0, strlen($alphabet) - 1)];
    }
    return 'CINE-' . substr($chars, 0, 4) . '-' . substr($chars, 4, 4) . '-' . substr($chars, 8, 4);
}

/**
 * Crée un code VIP. Avec $captureId, un seul code par don (renvoie null si déjà créé).
 * Le code en clair n'est renvoyé qu'ici : il n'est jamais stocké.
 */
function issue_vip(?string $captureId, int $days): ?array
{
    $code = generate_vip_code();
    $expires = utc_now()->modify("+{$days} days");
    try {
        db()->prepare(
            'INSERT INTO vip_codes (code_hash, capture_id, expires_at, revoked, created_at)
             VALUES (:h, :c, :e, 0, :t)'
        )->execute([':h' => vip_hash($code), ':c' => $captureId, ':e' => db_time($expires), ':t' => db_time(utc_now())]);
    } catch (PDOException $e) {
        if (is_duplicate($e)) return null;
        throw $e;
    }
    return ['code' => $code, 'expires_at' => $expires->format(DATE_ATOM)];
}

function check_vip(string $code): ?array
{
    if (strlen(normalize_vip($code)) < 8) return null;
    $st = db()->prepare(
        'SELECT expires_at FROM vip_codes WHERE code_hash = :h AND revoked = 0 AND expires_at > :now'
    );
    $st->execute([':h' => vip_hash($code), ':now' => db_time(utc_now())]);
    $row = $st->fetch();
    if (!$row) return null;
    $exp = new DateTimeImmutable($row['expires_at'], new DateTimeZone('UTC'));
    return ['expires_at' => $exp->format(DATE_ATOM)];
}

/** Convertit "12.50" en 1250 centimes, ou null si le format est invalide. */
function eur_to_cents(string $value): ?int
{
    if (!preg_match('/^\d{1,6}(\.\d{1,2})?$/', $value)) return null;
    [$e, $c] = array_pad(explode('.', $value), 2, '0');
    return (int) $e * 100 + (int) str_pad($c, 2, '0');
}

function cents_to_eur(int $cents): string
{
    return sprintf('%d.%02d', intdiv($cents, 100), $cents % 100);
}
