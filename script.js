'use strict';

/* =========================================================================
   Catalogue : films d'animation du Blender Studio (studio.blender.org),
   sous licence Creative Commons BY : diffusion gratuite autorisée en citant l'auteur.
   N'ajouter QUE des œuvres dont la diffusion est autorisée.
   "src" = adresse de la vidéo, "img" = image d'affiche (facultative).
   ========================================================================= */
const CREDIT = '© Blender Foundation · studio.blender.org · licence Creative Commons BY';
const shortFilms = [
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

/* Longs-métrages complets en VF, publiés gratuitement et légalement par leurs ayants droit
   sur leurs chaînes YouTube officielles (intégration autorisée). Un film peut être retiré
   par son ayant droit : vérifier la liste de temps en temps. */
const longFilms = [
  { kind: 'long', youtube: 'ON6kusOM-WA', title: "La Vallée de la Mort", year: 2014, genre: "Western", minutes: 108, channel: "Allociné Films Complets",
    description: "Fin du XIXe siècle, dans les Alpes. Un mystérieux cavalier qui se dit photographe arrive dans un village isolé, tenu d'une main de fer par un clan redoutable." },
  { kind: 'long', youtube: 'mTtH6fmfKhg', title: "Mon mariage est un mensonge", year: 2021, genre: "Thriller", minutes: 89, channel: "M6 Films & Séries",
    description: "Jeune mariée, Alison perd son mari, renversé par une voiture. En fouillant son passé, elle découvre que l'homme idéal lui cachait beaucoup de choses." },
  { kind: 'long', youtube: 'FxRGnPzMlNE', title: "La Traque de l'Immortel", year: null, genre: "Action", minutes: 114, channel: "Allociné Films Complets",
    description: "Un agent mourant doit protéger le premier clone humain, porteur du secret de l'immortalité, traqué par des forces prêtes à tout." },
  { kind: 'long', youtube: 'sxCf7q2oL9o', title: "La Traque du FBI", year: null, genre: "Action", minutes: 76, channel: "Allociné Films Complets",
    description: "Un détective coriace dirige une équipe d'infiltration d'élite pour faire tomber un réseau criminel violent à Seattle." },
  { kind: 'long', youtube: '4g1wKn-l2sA', title: "Bulletproof", year: null, genre: "Thriller", minutes: 95, channel: "Allociné Films Complets",
    description: "Des duels à balles réelles avec gilets pare-balles deviennent un spectacle extrême, qui attire des volontaires prêts à tout pour la gloire." },
  { kind: 'long', youtube: 'H5JQWgrPJVQ', title: "Une fille à problèmes", year: null, genre: "Thriller", minutes: 87, channel: "Allociné Films Complets",
    description: "Criblée de dettes et prête à tout pour quitter sa ville, une jeune femme se lance dans le recouvrement et défie un chef de gang impitoyable." },
  { kind: 'long', youtube: 'gBvbrzv-pKs', title: "Rencontre nocturne", year: null, genre: "Thriller", minutes: 96, channel: "Allociné Films Complets",
    description: "Un ancien pilote devenu garde du corps accepte une mission illégale en mer, qui déclenche une série d'événements incontrôlables." },
  { kind: 'long', youtube: 'nbR-88QLygw', title: "La Jumelle perdue", year: null, genre: "Science-fiction", minutes: 99, channel: "Allociné Films Complets",
    description: "Marquée par un drame, une jeune femme est attirée vers une autre réalité où sa sœur, disparue dans une noyade, semble encore en vie." },
  { kind: 'long', youtube: 'pt21q_iAVAs', title: "Gangster amateur", year: null, genre: "Comédie", minutes: 89, channel: "Allociné Films Complets",
    description: "Un coursier entre dans la mafia grâce à un ami. Déçu par leur inaction, il déclenche en secret une guerre sanglante contre un gang rival." },
  { kind: 'long', youtube: 'eq5dt_A1irQ', title: "Cop vs Mafia", year: null, genre: "Thriller", minutes: 82, channel: "Allociné Films Complets",
    description: "Un ancien policier se retrouve pris entre plusieurs feux : un gang local, la mafia et ses anciens collègues." },
  { kind: 'long', youtube: 'S_jjBHbSzLE', title: "Ballet meurtrier", year: 2015, genre: "Thriller", minutes: 86, channel: "M6 Films & Séries",
    description: "Spécialiste du nettoyage de scènes de crime, Morgan a le don de visualiser ce qui s'y est passé. Elle aide un jeune inspecteur sur une affaire troublante." },
  { kind: 'long', youtube: 'ys8jqPJtQjU', title: "Diagnostic : délicieux", year: 2016, genre: "Romance", minutes: 84, channel: "M6 Films & Séries",
    description: "Sur le point d'être promue cheffe de service, Nina doit lancer des cours de cuisine diététique à l'hôpital… avec un chef qui ne lui facilite pas la tâche." },
  { kind: 'long', youtube: 'B7g01sJQ4Xk', title: "Mon Noël en Alaska", year: 2018, genre: "Romance", minutes: 81, channel: "M6 Films & Séries",
    description: "Pilote d'avion à Seattle, Zoey hérite d'un ranch en Alaska à quelques jours de Noël. Elle part le vendre… mais rien ne se passe comme prévu." },
  { kind: 'long', youtube: 'CKsBEUbMbtg', title: "Jungle Survivors", year: null, genre: "Horreur", minutes: 90, channel: "Allociné Films Complets",
    description: "En mission de surveillance dans une forêt primaire, un garde forestier tombe sur deux survivalistes au mode de vie post-apocalyptique… et inquiétant.",
    note: "Film d'horreur : déconseillé aux plus jeunes." },
  { kind: 'long', youtube: 'FUkaEwcCrZw', title: "Baignade mortelle", year: null, genre: "Horreur", minutes: 76, channel: "Allociné Films Complets",
    description: "Des grands requins blancs attaquent un bateau de pêche. À des kilomètres du rivage, les passagers doivent se battre pour survivre.",
    note: "Film d'horreur : déconseillé aux plus jeunes." },
  { kind: 'long', youtube: 'H9bbjJSf3aU', title: "La Proie des ténèbres", year: null, genre: "Horreur", minutes: 77, channel: "Allociné Films Complets",
    description: "Un démon antique est libéré dans une petite ville d'Alaska. Le seul espoir : un chasseur de démons et une agente du FBI.",
    note: "Film d'horreur : déconseillé aux plus jeunes." },
  { kind: 'long', youtube: '_9ATLwEdcmk', title: "Night Attack", year: null, genre: "Horreur", minutes: 84, channel: "Allociné Films Complets",
    description: "Une femme enceinte est traquée par un inconnu obsédé par son enfant à naître.",
    note: "Film d'horreur : déconseillé aux plus jeunes." },
  { kind: 'long', youtube: 'uAaLIUgiPCQ', title: "Zombies Chaos", year: null, genre: "Horreur", minutes: 84, channel: "Allociné Films Complets",
    description: "Des étudiants tournent un petit film d'horreur en forêt quand la télé annonce que, partout dans le pays, les morts reviennent à la vie.",
    note: "Film d'horreur : déconseillé aux plus jeunes." },
  { kind: 'long', youtube: 'qUjHhgJc4Bs', title: "Duel fatal", year: null, genre: "Science-fiction", minutes: 68, channel: "Allociné Films Complets",
    description: "Une agente spécialisée dans les crimes mutants infiltre la société Medusa pour prouver ses recherches génétiques secrètes." },
  { kind: 'long', youtube: 'WtDODyFgbCs', title: "Mort en eaux troubles", year: null, genre: "Science-fiction", minutes: 84, channel: "Allociné Films Complets",
    description: "Dans un futur proche où la glace recouvre presque toute la planète, les requins sont devenus les maîtres du monde." },
  { kind: 'long', youtube: 'AeX2efiaak0', title: "Traquée", year: null, genre: "Science-fiction", minutes: 89, channel: "Allociné Films Complets",
    description: "Quand Ruth découvre qu'elle a des super-pouvoirs, elle doit fuir loin des siens." },
  { kind: 'long', youtube: 'wNWrLWACkzM', title: "Panique biologique", year: null, genre: "Science-fiction", minutes: 82, channel: "Allociné Films Complets",
    description: "En pleine pandémie, un vortex polaire géant gèle la planète. Un virologue qui détient le seul remède doit traverser ce monde glacé." },
  { kind: 'long', youtube: 'imC4DJarGlI', title: "The Quarantine Patient", year: null, genre: "Science-fiction", minutes: 104, channel: "Allociné Films Complets",
    description: "Une équipe descend explorer le forage le plus profond du monde… et y découvre la plus grande menace de l'histoire." },
  { kind: 'long', youtube: 'kN8WEwvHXRQ', title: "L'Aube de l'invasion", year: null, genre: "Science-fiction", minutes: 87, channel: "Allociné Films Complets",
    description: "Un frère et une sœur astronomes s'allient à l'armée quand des extraterrestres attaquent la Terre." },
  { kind: 'long', youtube: 'o_ntN7NcYjU', title: "La Princesse elfique", year: null, genre: "Fantastique", minutes: 85, channel: "Allociné Films Complets",
    description: "Deux frères orphelins rejoignent une bande de guerriers peu recommandables, lancés dans une chasse aux dragons périlleuse." },
  { kind: 'long', youtube: 'i6FH_OZvNIY', title: "Naissance d'un vampire", year: null, genre: "Fantastique", minutes: 75, channel: "Allociné Films Complets",
    description: "Au XVIIIe siècle, un aventurier doit ramener un moine aux savoirs interdits d'un monastère maudit… et affronter le Prince des Ténèbres." },
  { kind: 'long', youtube: 'Zl2uUtTCqy8', title: "Transformation", year: null, genre: "Fantastique", minutes: 97, channel: "Allociné Films Complets",
    description: "Deux sœurs fascinées par la mort affrontent des conséquences tragiques quand l'une d'elles est mordue par un loup-garou.",
    note: "Film d'horreur : déconseillé aux plus jeunes." },
  { kind: 'long', youtube: '-ScCM-hMtf0', title: "Monstrueuse", year: null, genre: "Fantastique", minutes: 113, channel: "Allociné Films Complets",
    description: "En 1912, une enfant au corps couvert de poils grandit cachée. En quête de liberté, elle affronte le rejet et la cruauté." },
  { kind: 'long', youtube: 'rriQE42Upy8', title: "Chasse au monstre", year: null, genre: "Fantastique", minutes: 87, channel: "Allociné Films Complets",
    description: "Un capitaine obsédé traque l'immense créature marine qui l'a mutilé, dans une chasse où la folie devient son pire ennemi." },
];
for (const f of longFilms) { f.img = `https://i.ytimg.com/vi/${f.youtube}/mqdefault.jpg`; f.tone = '#1b2a33'; }
for (const f of shortFilms) f.kind = 'court';
const catalog = [...longFilms, ...shortFilms];
const GENRE_ORDER = ['Horreur', 'Science-fiction', 'Fantastique', 'Action', 'Thriller', 'Western', 'Comédie', 'Romance'];

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
    el('div', { className: 'movie-info' }, el('strong', {}, f.title), el('small', {}, meta(f))),
  );
  b.addEventListener('click', () => showDetail(f));
  return b;
}

function meta(f) {
  const dur = f.minutes >= 60 ? `${Math.floor(f.minutes / 60)} h ${String(f.minutes % 60).padStart(2, '0')}` : `${f.minutes} min`;
  return [f.year, f.genre, dur, f.kind === 'long' ? 'VF' : ''].filter(Boolean).join(' · ');
}

function normalize(s) {
  return s.toLocaleLowerCase('fr').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function render(q = '') {
  const query = normalize(q.trim());
  const filtered = catalog.filter(f => normalize(`${f.title} ${f.genre} ${f.year}`).includes(query));
  const msg = () => el('p', { className: 'muted empty' }, `Aucun résultat pour « ${q.trim()} ».`);
  const longs = filtered.filter(f => f.kind === 'long');
  const courts = filtered.filter(f => f.kind === 'court');
  if (!query) {
    // Sans recherche : une rangée par genre.
    newCards.className = 'genre-rows';
    const groups = GENRE_ORDER.map(g => [g, longs.filter(f => f.genre === g)]).filter(([, l]) => l.length);
    newCards.replaceChildren(...groups.map(([g, l]) => el('div', { className: 'genre-row' },
      el('h3', {}, g), el('div', { className: 'cards' }, ...l.map(card)))));
  } else {
    newCards.className = 'cards';
    newCards.replaceChildren(...(longs.length ? longs.map(card) : [msg()]));
  }
  popularCards.replaceChildren(...(courts.length ? courts.map(card) : [msg()]));
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
    el('p', { className: 'muted' }, meta(f)),
    el('p', {}, f.description),
  ];
  if (f.note) content.push(el('p', { className: 'small warn' }, f.note));
  if (f.src || f.youtube) {
    const play = el('button', { type: 'button', className: 'btn' }, '▶ Regarder');
    play.addEventListener('click', () => { $('#detail').close(); playFilm(f); });
    content.push(play);
  } else {
    content.push(el('p', { className: 'muted' }, 'Vidéo bientôt disponible.'));
  }
  content.push(el('p', { className: 'small muted credit' }, f.channel
    ? `Diffusé gratuitement et légalement par la chaîne officielle « ${f.channel} » sur YouTube (publicités possibles).`
    : CREDIT));
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
$('#heroMeta').textContent = meta(featured);
$('#heroText').textContent = featured.description;
const heroImg = featured.youtube ? `https://i.ytimg.com/vi/${featured.youtube}/maxresdefault.jpg` : featured.img;
if (heroImg) $('#affiche').style.setProperty('--hero-img', `url("${heroImg}")`);
$('#heroPlay').addEventListener('click', () => playFilm(featured));
$('#heroInfo').addEventListener('click', () => showDetail(featured));

/* =========================================================================
   Lecteur
   ========================================================================= */
const video = $('#licensedVideo');
const videoStatus = $('#videoStatus');
let localVideoURL = null;

// Lecteur YouTube (films publiés par les ayants droit) : chargé seulement si besoin.
let ytPlayer = null;
let ytReady = null;
function loadYouTube() {
  if (!ytReady) {
    ytReady = new Promise((resolve, reject) => {
      window.onYouTubeIframeAPIReady = resolve;
      const s = document.createElement('script');
      s.src = 'https://www.youtube.com/iframe_api';
      s.onerror = () => { ytReady = null; reject(new Error('Le lecteur YouTube n\'a pas pu être chargé.')); };
      document.head.append(s);
    });
  }
  return ytReady;
}

async function playYouTube(id) {
  await loadYouTube();
  if (ytPlayer) { ytPlayer.loadVideoById(id); return; }
  ytPlayer = new YT.Player('ytPlayer', {
    videoId: id,
    host: 'https://www.youtube-nocookie.com',
    playerVars: { autoplay: 1, rel: 0, playsinline: 1, hl: 'fr', cc_lang_pref: 'fr' },
  });
}

function showNativePlayer() {
  if (ytPlayer?.pauseVideo) ytPlayer.pauseVideo();
  $('#ytWrap').hidden = true;
  video.hidden = false;
}

function playFilm(f) {
  armSupport();
  $('#nowPlaying').textContent = `Lecture : ${f.title}`;
  $('#lecteur').scrollIntoView({ behavior: 'smooth' });
  if (f.youtube) {
    video.pause();
    video.hidden = true;
    $('#ytWrap').hidden = false;
    videoStatus.textContent = 'Une fenêtre de soutien facultative s\'affiche une seule fois, entre 15 et 20 minutes de film.';
    playYouTube(f.youtube).catch(e => { videoStatus.textContent = e.message; });
  } else {
    showNativePlayer();
    video.src = f.src;
    video.play().catch(() => {});
  }
}

$('#localVideoFile').addEventListener('change', event => {
  const file = event.target.files?.[0];
  if (!file) return;
  if (!file.type.startsWith('video/')) {
    videoStatus.textContent = 'Choisissez un fichier vidéo valide.';
    return;
  }
  showNativePlayer();
  armSupport();
  if (localVideoURL) URL.revokeObjectURL(localVideoURL);
  localVideoURL = URL.createObjectURL(file);
  video.src = localVideoURL;
  $('#nowPlaying').textContent = `Vidéo locale : ${file.name}`;
  videoStatus.textContent = 'Vidéo prête. Une fenêtre de soutien facultative s\'affiche une seule fois, entre 15 et 20 minutes de film.';
});

// Règle : la fenêtre de soutien s'ouvre une seule fois par film, à un moment tiré au hasard
// entre 15 et 20 minutes de visionnage. Le film est mis en pause puis reprend à la fermeture.
const SUPPORT_MIN_S = 15 * 60;
const SUPPORT_MAX_S = 20 * 60;
let supportAt = SUPPORT_MIN_S;
let supportShown = false;
let pausedBy = null;
function armSupport() {
  supportShown = false;
  supportAt = SUPPORT_MIN_S + Math.random() * (SUPPORT_MAX_S - SUPPORT_MIN_S);
}
function checkSupport(seconds, player) {
  if (!supportShown && seconds >= supportAt) {
    supportShown = true;
    onSupportMoment(player);
  }
}
video.addEventListener('timeupdate', () => { if (!video.paused) checkSupport(video.currentTime, 'video'); });
setInterval(() => {
  if (ytPlayer?.getPlayerState?.() === 1) checkSupport(ytPlayer.getCurrentTime(), 'yt');
}, 2000);

/* =========================================================================
   Dons, objectif hebdomadaire et codes VIP (vérifiés par le serveur /api)
   ========================================================================= */
// Mode sans serveur (hébergement gratuit GitHub Pages) : pas de compteur ni de codes VIP,
// le bouton de don ouvre simplement la page PayPal. Mettre false sur un hébergement avec PHP (/api).
const STATIC_MODE = true;
// Lien de don PayPal.me (le montant choisi est ajouté automatiquement).
const PAYPAL_ME_URL = 'https://www.paypal.me/meranjacky';
const STATIC_MIN = 1;
const STATIC_MAX = 500;

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

async function onSupportMoment(player) {
  if (state.vip || supportDialog.open) return;
  await refreshStatus();
  if (state.status?.reached) return; // objectif atteint : pas de fenêtre avant la nouvelle semaine
  if (player === 'yt') ytPlayer?.pauseVideo?.(); else video.pause();
  pausedBy = player;
  resetSupportDialog();
  supportDialog.showModal();
}

// À la fermeture de la fenêtre (croix, Échap ou « Continuer gratuitement »), le film reprend.
supportDialog.addEventListener('close', () => {
  if (pausedBy === 'yt') ytPlayer?.playVideo?.();
  else if (pausedBy === 'video') video.play().catch(() => {});
  pausedBy = null;
});

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
  $('#donateMessage').textContent = '';
}));
$('#customAmount').addEventListener('input', e => {
  document.querySelectorAll('.amount').forEach(b => b.classList.remove('active'));
  state.amount = e.target.value.replace(',', '.').trim();
  $('#donateMessage').textContent = '';
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
    if (!PAYPAL_ME_URL) {
      $('#staticMessage').textContent = 'Les dons seront bientôt disponibles. Merci de votre soutien, bon film\u00a0!';
      return;
    }
    // Choix du montant, puis ouverture de la page PayPal.me avec ce montant.
    $('#donateArea').hidden = false;
    $('#vipArea').hidden = true;
    $('#donateButton').hidden = true;
    if (!$('#paypalMeButton')) {
      const btn = el('button', { type: 'button', className: 'btn paypal-me', id: 'paypalMeButton' }, 'Donner avec PayPal');
      btn.addEventListener('click', () => {
        const n = Number(state.amount);
        const msg = $('#donateMessage');
        if (!/^\d+(\.\d{1,2})?$/.test(state.amount) || n < STATIC_MIN || n > STATIC_MAX) {
          msg.textContent = `Indiquez un montant entre ${euro(STATIC_MIN)} et ${euro(STATIC_MAX)}.`;
          return;
        }
        window.open(`${PAYPAL_ME_URL}/${n.toFixed(2)}EUR`, '_blank', 'noopener');
        msg.textContent = 'Merci beaucoup ! La page PayPal s\'est ouverte dans un nouvel onglet pour finaliser votre don.';
      });
      $('#paypalButtons').replaceChildren(btn);
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
