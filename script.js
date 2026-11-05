'use strict';

/* =========================================================================
   Catalogue : films d'animation du Blender Studio (studio.blender.org),
   sous licence Creative Commons BY : diffusion gratuite autorisée en citant l'auteur.
   N'ajouter QUE des œuvres dont la diffusion est autorisée.
   "src" = adresse de la vidéo, "img" = image d'affiche (facultative).
   ========================================================================= */
const CREDIT = '© Blender Foundation · studio.blender.org · licence Creative Commons BY';
const catalog = [
  {
    title: "Wing It!", year: 2023, genre: "Comédie", minutes: 4, tone: '#c2410c',
    description: "Un chat inventeur et son compagnon canin bricolent une fusée dans leur grange. Le décollage ne va pas du tout se passer comme prévu.",
    img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/WING_IT%21_-_Blender_Open_Movie-full_movie.webm/960px-seek%3D95-WING_IT%21_-_Blender_Open_Movie-full_movie.webm.jpg',
    src: 'https://upload.wikimedia.org/wikipedia/commons/3/38/WING_IT%21_-_Blender_Open_Movie-full_movie.webm',
  },
  {
    title: "Charge", year: 2022, genre: "Action", minutes: 4, tone: '#1e3a8a',
    description: "Dans un monde glacé où l'énergie est rationnée, un vieil homme tente un coup risqué : en voler dans une centrale gardée par un robot redoutable.",
    img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Charge_-_Blender_Open_Movie-full_movie.webm/960px-seek%3D70-Charge_-_Blender_Open_Movie-full_movie.webm.jpg',
    src: 'https://upload.wikimedia.org/wikipedia/commons/transcoded/7/7a/Charge_-_Blender_Open_Movie-full_movie.webm/Charge_-_Blender_Open_Movie-full_movie.webm.1080p.vp9.webm',
  },
  {
    title: "Sprite Fright", year: 2021, genre: "Horreur", minutes: 10, tone: '#14532d',
    description: "Des ados venus faire la fête en forêt croisent de mignons petits êtres-champignons… beaucoup moins gentils qu'ils n'en ont l'air.",
    note: "Déconseillé aux moins de 13 ans.",
    img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Sprite_Fright_-_Blender_Open_Movie-full_movie.webm/960px-seek%3D150-Sprite_Fright_-_Blender_Open_Movie-full_movie.webm.jpg',
    src: 'https://archive.org/download/sprite-fright/Sprite%20Fright%20-%20Open%20Movie%20by%20Blender%20Studio-804p.mp4',
  },
  {
    title: "Coffee Run", year: 2020, genre: "Drame", minutes: 3, tone: '#9a3412',
    description: "Dopée à la caféine, une jeune femme court à travers les souvenirs doux-amers de son histoire d'amour passée.",
    img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Coffee_Run_-_Blender_Open_Movie-full_movie.webm/960px-seek%3D60-Coffee_Run_-_Blender_Open_Movie-full_movie.webm.jpg',
    src: 'https://archive.org/download/coffee-run/Coffee%20Run.mp4',
  },
  {
    title: "Spring", year: 2019, genre: "Fantastique", minutes: 8, tone: '#155e75',
    description: "Une jeune bergère et son chien affrontent d'anciens esprits pour que le cycle de la vie puisse continuer.",
    img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Spring_-_Blender_Open_Movie.webm/960px-seek%3D200-Spring_-_Blender_Open_Movie.webm.jpg',
    src: 'https://archive.org/download/spring_blenderopenmovie/Spring%20-%20Blender%20Open%20Movie%20-%20YouTube.mp4',
  },
  {
    title: "Agent 327 : Opération Barbershop", year: 2017, genre: "Espionnage", minutes: 4, tone: '#7f1d1d',
    description: "L'agent secret 327 enquête incognito dans un salon de coiffure… et tombe nez à nez avec un ennemi redoutable.",
    img: '',
    src: 'https://archive.org/download/agent327operationbarbershop/agent327-1080.mp4',
  },
  {
    title: "Caminandes : Llamigos", year: 2016, genre: "Comédie", minutes: 3, tone: '#0369a1',
    description: "En plein hiver en Patagonie, le lama Koro doit défendre ses baies contre un pingouin très gourmand.",
    img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Caminandes_3_-_Llamigos_-_Blender_Animated_Short.webm/960px-seek%3D40-Caminandes_3_-_Llamigos_-_Blender_Animated_Short.webm.jpg',
    src: 'https://archive.org/download/CaminandesLlamigos/Caminandes_%20Llamigos-1080p.mp4',
  },
  {
    title: "Cosmos Laundromat", year: 2015, genre: "Science-fiction", minutes: 12, tone: '#4c1d95',
    description: "Sur une île désolée, Franck, un mouton désabusé, rencontre un mystérieux vendeur qui lui promet une vie toute neuve.",
    img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Cosmos_Laundromat_-_First_Cycle_-_Official_Blender_Foundation_release.webm/960px-seek%3D300-Cosmos_Laundromat_-_First_Cycle_-_Official_Blender_Foundation_release.webm.jpg',
    src: 'https://archive.org/download/CosmosLaundromatFirstCycle/Cosmos%20Laundromat%20-%20First%20Cycle%20%281080p%29.mp4',
  },
  {
    title: "Tears of Steel", year: 2012, genre: "Science-fiction", minutes: 12, tone: '#334155',
    description: "À Amsterdam, une équipe de scientifiques tente de sauver le monde d'une invasion de robots… en rejouant une vieille rupture amoureuse.",
    img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Tears_of_Steel_1080p.webm/960px-seek%3D200-Tears_of_Steel_1080p.webm.jpg',
    src: 'https://archive.org/download/Tears-of-Steel/tears_of_steel_720p.mp4',
  },
  {
    title: "Sintel", year: 2010, genre: "Aventure", minutes: 15, tone: '#78350f',
    description: "Une jeune guerrière parcourt un monde hostile à la recherche du bébé dragon qu'on lui a enlevé.",
    img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Sintel_movie_4K.webm/960px-seek%3D300-Sintel_movie_4K.webm.jpg',
    src: 'https://archive.org/download/Sintel/sintel-2048-stereo.mp4',
  },
  {
    title: "Big Buck Bunny", year: 2008, genre: "Comédie", minutes: 10, tone: '#3f6212',
    description: "Un gros lapin au grand cœur décide de donner une bonne leçon à trois rongeurs qui lui ont gâché la journée.",
    img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Big_Buck_Bunny_4K.webm/960px-seek%3D120-Big_Buck_Bunny_4K.webm.jpg',
    src: 'https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4',
  },
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
  const poster = el('div', { className: 'poster' }, el('span', { className: 'play-badge' }, '▶'), el('span', { className: 'poster-title' }, f.title));
  poster.style.setProperty('--tone', f.tone);
  if (f.img) poster.style.setProperty('--img', `url("${f.img}")`);
  const b = el('button', { className: 'movie', type: 'button' },
    poster,
    el('div', { className: 'movie-info' }, el('strong', {}, f.title), el('small', {}, `${f.year} · ${f.genre} · ${f.minutes} min`)),
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
  const popular = query ? filtered : filtered.slice(6);
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
    el('p', { className: 'muted' }, `${f.year} · ${f.genre} · ${f.minutes} min`),
    el('p', {}, f.description),
  ];
  if (f.note) content.push(el('p', { className: 'small warn' }, f.note));
  if (f.src) {
    const play = el('button', { type: 'button', className: 'btn' }, '▶ Regarder');
    play.addEventListener('click', () => { $('#detail').close(); playFilm(f.src, f.title); });
    content.push(play);
  } else {
    content.push(el('p', { className: 'muted' }, 'Vidéo bientôt disponible.'));
  }
  content.push(el('p', { className: 'small muted credit' }, CREDIT));
  $('#detailContent').replaceChildren(...content);
  $('#detail').showModal();
}

$('#close').addEventListener('click', () => $('#detail').close());
searchInput.addEventListener('input', e => render(e.target.value));
render();
renderGenres();

// Film à l'affiche (le plus récent) en haut de la page.
const featured = catalog[0];
$('#heroTitle').textContent = featured.title;
$('#heroMeta').textContent = `${featured.genre} · ${featured.year} · ${featured.minutes} min`;
$('#heroText').textContent = featured.description;
if (featured.img) $('#affiche').style.setProperty('--hero-img', `url("${featured.img}")`);
$('#heroPlay').addEventListener('click', () => playFilm(featured.src, featured.title));
$('#heroInfo').addEventListener('click', () => showDetail(featured));

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
// Mode sans serveur (hébergement gratuit GitHub Pages) : pas de compteur ni de codes VIP,
// le bouton de don ouvre simplement la page PayPal. Mettre false sur un hébergement avec PHP (/api).
const STATIC_MODE = true;
// Lien de don PayPal, ex. 'https://paypal.me/VotreNom'. Laisser vide tant qu'il n'existe pas.
const PAYPAL_ME_URL = '';

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
  if (STATIC_MODE) { state.status = null; return; }
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
      msg.textContent = 'Code VIP activé, bon film\u00a0!';
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
  if (STATIC_MODE) return;
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
  if (STATIC_MODE) {
    const msg = $('#staticMessage');
    if (PAYPAL_ME_URL) {
      window.open(PAYPAL_ME_URL, '_blank', 'noopener');
      msg.textContent = 'Merci beaucoup ! La page PayPal s\'est ouverte dans un nouvel onglet.';
    } else {
      msg.textContent = 'Les dons seront bientôt disponibles. Merci de votre soutien, bon film\u00a0!';
    }
    return;
  }
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

if (STATIC_MODE) {
  // Sans serveur : on masque le compteur et les codes VIP plutôt que d'afficher des chiffres faux.
  $('#goalBox').hidden = true;
  $('#vipButton').hidden = true;
}
refreshStatus();
