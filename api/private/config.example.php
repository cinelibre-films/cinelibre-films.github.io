<?php
// Copier ce fichier en "config.php" (même dossier) puis remplir les valeurs.
// config.php n'est JAMAIS envoyé sur GitHub (voir .gitignore).
return [
    // Base de données Hostinger (hPanel > Bases de données > MySQL)
    'db_dsn'  => 'mysql:host=localhost;dbname=u000000000_cinelibre;charset=utf8mb4',
    'db_user' => 'u000000000_cinelibre',
    'db_pass' => 'MOT_DE_PASSE_ICI',

    // PayPal (developer.paypal.com > Apps & Credentials)
    'paypal_mode'          => 'sandbox',          // 'sandbox' pour tester, 'live' en production
    'paypal_client_id'     => 'CLIENT_ID_ICI',
    'paypal_client_secret' => 'SECRET_ICI',
    'paypal_webhook_id'    => 'WEBHOOK_ID_ICI',   // ID du webhook créé dans l'app PayPal

    // Règles des dons
    'goal_eur'        => 160,   // objectif hebdomadaire, remis à zéro le lundi 00:00 (Europe/Paris)
    'min_donation'    => 1,     // don minimum en €
    'max_donation'    => 500,   // don maximum en €
    'vip_min_donation'=> 5,     // un code VIP est offert à partir de ce montant
    'vip_days'        => 30,    // durée de validité du code VIP
];
