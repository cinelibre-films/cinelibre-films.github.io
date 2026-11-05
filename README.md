# CinéLibre

Site de films et séries gratuits (HTML/CSS/JS) avec dons volontaires PayPal, objectif hebdomadaire et codes VIP, prêt pour Hostinger (PHP + MySQL).

## Règle de la fenêtre de dons
- Aucune fenêtre au démarrage du site ni au début du film.
- La fenêtre s'ouvre **une seule fois par film, entre 15 et 20 minutes de visionnage** (moment tiré au hasard). Le film se met en pause et reprend à la fermeture.
- Le visiteur peut toujours la fermer ou cliquer « Continuer gratuitement ».
- Objectif : **160 € par semaine**, remis à zéro le **lundi 00:00 heure de Paris** (heure d'été/hiver gérée).
- Objectif atteint → plus de fenêtre jusqu'au lundi suivant.
- Don ≥ 5 € → un **code VIP** est offert (30 jours sans fenêtre). Remboursement → code annulé.
- Les montants affichés viennent uniquement de la base de données. Si le serveur ne répond pas, le site affiche « — », jamais un montant inventé.

## Mettre à jour la cagnotte (version gratuite GitHub Pages)
Le site ne voit pas tout seul les dons PayPal. Après avoir reçu des dons, modifier le fichier `cagnotte.json` sur GitHub (icône crayon, puis « Valider les modifications ») :
```
{
  "objectif": 160,
  "lundi": "2026-11-02",
  "montant": 45
}
```
- `montant` : total reçu cette semaine, en euros.
- `lundi` : date du lundi de la semaine en cours (AAAA-MM-JJ).
- Quand `montant` atteint `objectif`, la fenêtre de don ne s'affiche plus jusqu'au lundi suivant.
- Le lundi, la cagnotte repart automatiquement à 0 € : il suffit de mettre la nouvelle date de lundi en même temps que le nouveau montant.

## Structure
```
index.html, style.css, script.js     le site
api/status.php                       total de la semaine + objectif (GET)
api/create-order.php                 crée la commande PayPal (POST)
api/capture-order.php                valide le paiement, compte le don, offre le code VIP (POST)
api/webhook.php                      notifications PayPal, signature vérifiée (POST)
api/vip.php                          vérifie un code VIP (POST)
api/private/                         config, code interne, schéma SQL (bloqué par .htaccess)
```
Un même paiement n'est jamais compté deux fois : l'identifiant de capture PayPal est unique en base, et chaque webhook n'est traité qu'une fois.

## Ajouter des films
Dans `script.js`, tableau `catalog` : renseigner `src` avec l'adresse de la vidéo **dont vous détenez les droits de diffusion**. Le bouton « Regarder » apparaît alors sur la fiche.

## Mise en ligne sur Hostinger
1. **Base de données** : hPanel → Bases de données → MySQL → créer une base + un utilisateur. Ouvrir phpMyAdmin → Importer `api/private/schema.mysql.sql`.
2. **PayPal** : sur developer.paypal.com → Apps & Credentials → créer une app (d'abord en *Sandbox*). Noter le *Client ID* et le *Secret*.
3. **Webhook PayPal** : dans l'app → Add Webhook → URL `https://VOTRE-DOMAINE/api/webhook.php`, événements `PAYMENT.CAPTURE.COMPLETED`, `PAYMENT.CAPTURE.REFUNDED`, `PAYMENT.CAPTURE.REVERSED`. Noter le *Webhook ID*.
4. **Configuration** : copier `api/private/config.example.php` en `api/private/config.php` et remplir les valeurs (ce fichier n'est jamais mis sur GitHub).
5. **Envoi des fichiers** : hPanel → Sites → Git (déploiement depuis ce dépôt GitHub vers `public_html`), ou Gestionnaire de fichiers. Puis créer `config.php` directement sur le serveur.
6. **HTTPS** : activer le certificat SSL gratuit dans hPanel.
7. **Vérifier** : ouvrir `https://VOTRE-DOMAINE/api/status.php` (doit afficher le total) et `https://VOTRE-DOMAINE/api/private/config.php` (doit être **refusé**, erreur 403).
8. **Tester en Sandbox** avec un compte acheteur fictif PayPal, puis passer `paypal_mode` à `live` avec les identifiants *Live*.

## Créer un code VIP à la main
Par SSH sur Hostinger : `php api/private/tools/create-vip.php 30` (30 = nombre de jours).
