'use strict';

/* =========================================================================
   Catalogue
   Ajouter UNIQUEMENT des œuvres dont vous détenez les droits de diffusion.
   "src" = adresse de la vidéo autorisée (fichier MP4 hébergé, CDN, etc.).
   Sans "src", la fiche s'affiche mais aucune lecture n'est proposée.
   ========================================================================= */
const catalog = [
  { title: 'La Dernière Étoile', year: 2026, genre: 'Science-fiction', tone: '#275b9e', description: 'Une expédition découvre un signal mystérieux aux confins de la galaxie.', src: '' },
  { title: 'Océan Secret', year: 2026, genre: 'Aventure', tone: '#127b99', description: 'Un voyage spectaculaire au cœur des mers inconnues.', src: '' },
  { title: 'La Forêt des Rêves', year: 2025, genre: 'Animation', tone: '#5a3195', description: 'Une aventure familiale dans une forêt enchantée.', src: '' },
  { title: 'Minuit à Paris', year: 2025, genre: 'Mystère', tone: '#784b87', description: 'Une enquête nocturne pleine de rebondissements.', src: '' },
  { title: 'Le Royaume Perdu', year: 2026, genre: 'Fantastique', tone: '#92701c', description: 'Une quête épique dans un monde oublié.', src: '' },
  { title: 'Horizons', year: 2025, genre: 'Drame', tone: '#b15a2c', description: 'Deux voyageurs se rencontrent au bout du monde.', src: '' },
  { title: 'Mission Aurore', year: 2024, genre: 'Action', tone: '#7a2323', description: 'Une équipe doit empêcher une catastrophe.', src: '' },
  { title: 'Les Explorateurs', year: 2024, genre: 'Documentaire', tone: '#256b51', description: 'La beauté des territoires encore méconnus.', src: '' },
];

const $ = sel => document.querySelector(sel);
const el = (tag, props = {}, ...children) => {
  const n = Object.assign(document.createElement(tag), props);
  n.append(...children);
  return n;
};

const newCards = $('#newCards');
const popularCards = $('#popularCards');
const searchInput = $('#search');

function card(f) {
  const poster = el('div', { className: 'poster' }, f.title);
  poster.style.setProperty('--tone', f.tone);
  const b = el('button', { className: 'movie', type: 'button' },
    poster,
    el('div', { className: 'movie-info' }, el('strong', {}, f.title), el('small', {}, `${f.year} · ${f.genre}`)),
  );
  b.addEventListener('click', () => showDetail(f));
  return b;
}

function normalize(s) {
  return s.toLocaleLowerCase('fr').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function render(q = '') {
  const query = normalize(q.trim());
  const filtered = catalog.filter(f => normalize(`${f.title} ${f.genre} ${f.year}`).includes(query));
  if (!filtered.length) {
    const msg = () => el('p', { className: 'muted empty' }, `Aucun résultat pour « ${q.trim()} ».`);
    newCards.replaceChildren(msg());
    popularCards.replaceChildren(msg());
    return;
  }
  newCards.replaceChildren(...filtered.slice(0, 6).map(card));
  const popular = query ? filtered : filtered.slice(2);
  popularCards.replaceChildren(...popular.map(card));
}

function renderGenres() {
  const genres = [...new Set(catalog.map(f => f.genre))].sort((a, b) => a.localeCompare(b, 'fr'));
  $('#genreChips').replaceChildren(...genres.map(g => {
    const chip = el('button', { type: 'button', className: 'chip' }, g);
    chip.addEventListener('click', () => {
      searchInput.value = g;
      render(g);
      $('#nouveautes').scrollIntoView({ behavior: 'smooth' });
    });
    return chip;
  }));
}

function showDetail(f) {
  const content = [
    el('h2', { id: 'detailTitle' }, f.title),
    el('p', {}, `${f.year} · ${f.genre}`),
    el('p', {}, f.description),
  ];
  if (f.src) {
    const play = el('button', { type: 'button', className: 'btn' }, '▶ Regarder');
    play.addEventListener('click', () => { $('#detail').close(); playFilm(f.src, f.title); });
    content.push(play);
  } else {
    content.push(el('p', { className: 'muted' }, 'Vidéo bientôt disponible.'));
  }
  $('#detailContent').replaceChildren(...content);
  $('#detail').showModal();
}

$('#close').addEventListener('click', () => $('#detail').close());
searchInput.addEventListener('input', e => render(e.target.value));
render();
renderGenres();

/* =========================================================================
   Lecteur
   ========================================================================= */
const video = $('#licensedVideo');
const videoStatus = $('#videoStatus');
let localVideoURL = null;

function playFilm(src, title) {
  video.src = src;
  $('#nowPlaying').textContent = `Lecture : ${title}`;
  $('#lecteur').scrollIntoView({ behavior: 'smooth' });
  video.play().catch(() => {});
}

$('#localVideoFile').addEventListener('change', event => {
  const file = event.target.files?.[0];
  if (!file) return;
  if (!file.type.startsWith('video/')) {
    videoStatus.textContent = 'Choisissez un fichier vidéo valide.';
    return;
  }
  if (localVideoURL) URL.revokeObjectURL(localVideoURL);
  localVideoURL = URL.createObjectURL(file);
  video.src = localVideoURL;
  $('#nowPlaying').textContent = `Vidéo locale : ${file.name}`;
  videoStatus.textContent = 'Vidéo prête. La fenêtre de soutien apparaît seulement à la fin du film.';
});

// Règle validée : la fenêtre s'ouvre UNIQUEMENT quand le film se termine naturellement.
video.addEventListener('ended', onFilmEnded);

/* =========================================================================
   Dons, objectif hebdomadaire et codes VIP (vérifiés par le serveur /api)
   ========================================================================= */
const API = 'api/';
const VIP_KEY = 'cinelibre_vip';
const supportDialog = $('#supportDialog');
const state = { status: null, vip: null, amount: '5', paypalReady: false };

const euro = n => `${Number(n).toLocaleString('fr-FR', { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 })} €`;

function store(key, value) {
  try { value === null ? localStorage.removeItem(key) : localStorage.setItem(key, JSON.stringify(value)); } catch { /* stockage indisponible */ }
}
function load(key) {
  try { return JSON.parse(localStorage.getItem(key) || 'null'); } catch { return null; }
}

async function api(path, body) {
  const res = await fetch(API + path, body === undefined
    ? { cache: 'no-store' }
    : { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const data = await res.json().catch(() => ({}));
  if (!res.ok && !('valid' in data)) throw new Error(data.error || 'Service indisponible.');
  return data;
}

async function refreshStatus() {
  try {
    state.status = await api('status.php');
  } catch {
    state.status = null;
  }
  paintGoal();
}

function paintGoal() {
  const s = state.status;
  const progress = $('#donationProgress');
  if (!s) {
    // On n'affiche jamais de montant inventé : si le serveur ne répond pas, on le dit.
    $('#donationTotal').textContent = '—';
    progress.removeAttribute('value');
    $('#goalMessage').textContent = 'Compteur des dons momentanément indisponible.';
    return;
  }
  $('#donationTotal').textContent = euro(s.total);
  $('#donationGoal').textContent = euro(s.goal);
  progress.max = s.goal;
  progress.value = Math.min(s.goal, s.total);
  $('#goalMessage').textContent = s.reached
    ? 'Objectif atteint, merci ! Plus aucune demande jusqu\'à lundi.'
    : 'Objectif de la semaine, remis à zéro chaque lundi.';
  $('#vipHint').textContent = s.vip_min_donation
    ? `À partir de ${euro(s.vip_min_donation)}, un code VIP vous est offert : plus de fenêtre de dons pendant ${s.vip_days || 30} jours.`
    : '';
}

async function onFilmEnded() {
  if (state.vip || supportDialog.open) return;
  await refreshStatus();
  if (state.status?.reached) return; // objectif atteint : pas de fenêtre avant la nouvelle semaine
  resetSupportDialog();
  supportDialog.showModal();
}

function resetSupportDialog() {
  $('#donateArea').hidden = true;
  $('#thanksArea').hidden = true;
  $('#vipArea').hidden = true;
  $('#donateMessage').textContent = '';
  $('#vipMessage').textContent = '';
  $('#donateButton').hidden = false;
}

function closeSupport() { supportDialog.close(); }
$('#closeSupport').addEventListener('click', closeSupport);
$('#continueFree').addEventListener('click', closeSupport);

/* ---- Codes VIP ---- */
function activateVip(code, expiresAt) {
  state.vip = { code, expires_at: expiresAt };
  store(VIP_KEY, state.vip);
  const badge = $('#vipBadge');
  badge.textContent = `🔑 VIP actif jusqu'au ${new Date(expiresAt).toLocaleDateString('fr-FR')} : aucune fenêtre de dons.`;
  badge.hidden = false;
}

function clearVip() {
  state.vip = null;
  store(VIP_KEY, null);
  $('#vipBadge').hidden = true;
}

$('#vipButton').addEventListener('click', () => {
  $('#vipArea').hidden = false;
  $('#donateArea').hidden = true;
  $('#donateButton').hidden = false;
  $('#vipCode').focus();
});

$('#applyVip').addEventListener('click', async () => {
  const code = $('#vipCode').value.trim();
  const msg = $('#vipMessage');
  if (!code) { msg.textContent = 'Saisissez votre code.'; return; }
  msg.textContent = 'Vérification…';
  try {
    const r = await api('vip.php', { code });
    if (r.valid) {
      activateVip(code, r.expires_at);
      msg.textContent = 'Code VIP activé, bon film !';
      setTimeout(closeSupport, 1500);
    } else {
      msg.textContent = r.error || 'Code VIP invalide ou expiré.';
    }
  } catch (e) {
    msg.textContent = e.message;
  }
});
$('#vipCode').addEventListener('keydown', e => { if (e.key === 'Enter') $('#applyVip').click(); });

// Au chargement : on revérifie auprès du serveur le code VIP mémorisé sur cet appareil.
(async () => {
  const saved = load(VIP_KEY);
  if (!saved?.code) return;
  if (saved.expires_at && new Date(saved.expires_at) < new Date()) { clearVip(); return; }
  activateVip(saved.code, saved.expires_at); // provisoire, confirmé ci-dessous
  try {
    const r = await api('vip.php', { code: saved.code });
    if (r.valid) activateVip(saved.code, r.expires_at); else clearVip();
  } catch { /* serveur injoignable : on garde le code jusqu'à sa date d'expiration */ }
})();

/* ---- Dons PayPal ---- */
document.querySelectorAll('.amount').forEach(btn => btn.addEventListener('click', () => {
  document.querySelectorAll('.amount').forEach(b => b.classList.toggle('active', b === btn));
  $('#customAmount').value = '';
  state.amount = btn.dataset.amount;
}));
$('#customAmount').addEventListener('input', e => {
  document.querySelectorAll('.amount').forEach(b => b.classList.remove('active'));
  state.amount = e.target.value.replace(',', '.').trim();
});

function validAmount() {
  const s = state.status;
  const n = Number(state.amount);
  if (!/^\d+(\.\d{1,2})?$/.test(state.amount) || !s || n < s.min_donation || n > s.max_donation) {
    $('#donateMessage').textContent = s
      ? `Indiquez un montant entre ${euro(s.min_donation)} et ${euro(s.max_donation)}.`
      : 'Dons momentanément indisponibles.';
    return null;
  }
  $('#donateMessage').textContent = '';
  return n.toFixed(2);
}

function loadPayPal(clientId) {
  if (window.paypal) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(clientId)}&currency=EUR&intent=capture&components=buttons&locale=fr_FR`;
    s.onload = resolve;
    s.onerror = () => reject(new Error('PayPal n\'a pas pu être chargé.'));
    document.head.append(s);
  });
}

$('#donateButton').addEventListener('click', async () => {
  $('#donateArea').hidden = false;
  $('#vipArea').hidden = true;
  $('#donateButton').hidden = true;
  const msg = $('#donateMessage');
  if (state.paypalReady) return;
  if (!state.status?.paypal_client_id) {
    msg.textContent = 'Les dons sont momentanément indisponibles. Vous pouvez continuer gratuitement.';
    return;
  }
  msg.textContent = 'Chargement de PayPal…';
  try {
    await loadPayPal(state.status.paypal_client_id);
    await window.paypal.Buttons({
      style: { layout: 'vertical', shape: 'rect', label: 'donate' },
      onClick: (_data, actions) => (validAmount() ? actions.resolve() : actions.reject()),
      createOrder: async () => (await api('create-order.php', { amount: validAmount() })).id,
      onApprove: async data => {
        msg.textContent = 'Confirmation du paiement…';
        const r = await api('capture-order.php', { orderID: data.orderID });
        onDonationConfirmed(r);
      },
      onCancel: () => { msg.textContent = 'Don annulé. Aucun montant n\'a été prélevé.'; },
      onError: err => { msg.textContent = err?.message || 'Le paiement n\'a pas abouti. Aucun montant n\'a été compté.'; },
    }).render('#paypalButtons');
    state.paypalReady = true;
    msg.textContent = '';
  } catch (e) {
    msg.textContent = e.message;
  }
});

function onDonationConfirmed(r) {
  state.status = { ...state.status, total: r.total, reached: r.reached };
  paintGoal();
  $('#donateArea').hidden = true;
  $('#thanksArea').hidden = false;
  if (r.vip?.code) {
    activateVip(r.vip.code, r.vip.expires_at);
    $('#vipGiftCode').textContent = r.vip.code;
    $('#vipGiftExpiry').textContent = `Valable jusqu'au ${new Date(r.vip.expires_at).toLocaleDateString('fr-FR')}.`;
    $('#vipGift').hidden = false;
  } else {
    $('#vipGift').hidden = true;
  }
}

$('#copyVip').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText($('#vipGiftCode').textContent);
    $('#copyVip').textContent = 'Copié ✓';
  } catch {
    $('#copyVip').textContent = 'Sélectionnez le code';
  }
});

refreshStatus();
