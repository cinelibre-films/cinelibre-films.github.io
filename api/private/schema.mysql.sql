-- À importer une fois dans phpMyAdmin (Hostinger > Bases de données > phpMyAdmin > Importer)

CREATE TABLE IF NOT EXISTS donations (
    id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    capture_id    VARCHAR(64)  NOT NULL UNIQUE,   -- identifiant PayPal du paiement : empêche le double comptage
    amount_cents  INT UNSIGNED NOT NULL,
    currency      CHAR(3)      NOT NULL DEFAULT 'EUR',
    refunded      TINYINT(1)   NOT NULL DEFAULT 0,
    created_at    DATETIME     NOT NULL           -- heure UTC
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS vip_codes (
    id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    code_hash     CHAR(64)     NOT NULL UNIQUE,   -- SHA-256 du code, le code en clair n'est jamais stocké
    capture_id    VARCHAR(64)  NULL UNIQUE,       -- don qui a généré le code (NULL si créé à la main)
    expires_at    DATETIME     NOT NULL,          -- heure UTC
    revoked       TINYINT(1)   NOT NULL DEFAULT 0,
    created_at    DATETIME     NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS webhook_events (
    event_id      VARCHAR(64)  PRIMARY KEY,       -- évite de traiter deux fois le même webhook
    event_type    VARCHAR(64)  NOT NULL,
    received_at   DATETIME     NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
