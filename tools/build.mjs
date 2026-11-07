// Génère les pages lisibles par Google (une page par film, une par genre, le catalogue
// en dur sur l'accueil, le sitemap) dans le dossier _site. Lancé automatiquement par
// GitHub Actions à chaque modification : il suffit d'ajouter un film dans script.js.
import fs from 'node:fs';
import path from 'node:path';

const SITE = 'https://cinelibre-films.github.io';
const OUT = '_site';
const TODAY = new Date().toISOString().slice(0, 10);

// --- Catalogue lu directement dans script.js -----------------------------------------
const src = fs.readFileSync('script.js', 'utf8');
const head = src.split('const catalog')[0].replace("'use strict';", '');
const { shortFilms, longFilms, CREDIT } = new Function(`${head};return {shortFilms,longFilms,CREDIT};`)();
const films = [...longFilms, ...shortFilms];

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const slug = s => String(s).toLocaleLowerCase('fr').normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const dur = m => m >= 60 ? `${Math.floor(m / 60)} h ${String(m % 60).padStart(2, '0')}` : `${m} min`;
const iso = m => `PT${Math.floor(m / 60)}H${m % 60}M`;
const meta = f => [f.year, f.genre, dur(f.minutes), f.kind === 'long' ? 'VF' : ''].filter(Boolean).join(' · ');
const image = f => f.youtube ? `https://i.ytimg.com/vi/${f.youtube}/hqdefault.jpg` : (f.img || '');
const kindLabel = f => f.kind === 'long' ? 'Film complet en VF' : "Court-métrage d'animation";

const used = new Set();
for (const f of films) {
  let s = slug(f.title), n = 2;
  while (used.has(s)) s = `${slug(f.title)}-${n++}`;
  used.add(s); f.slug = s;
}
const genres = [...new Set(films.map(f => f.genre))].sort((a, b) => a.localeCompare(b, 'fr'));
const byGenre = g => films.filter(f => f.genre === g);
const filmUrl = f => `${SITE}/films/${f.slug}.html`;
const genreUrl = g => `${SITE}/genres/${slug(g)}.html`;

// --- Copie du site -----------------------------------------------------------------------
fs.rmSync(OUT, { recursive: true, force: true });
const SKIP = new Set(['.git', '.github', OUT, 'tools', 'node_modules', 'private']);
(function copy(from, to) {
  fs.mkdirSync(to, { recursive: true });
  for (const e of fs.readdirSync(from, { withFileTypes: true })) {
    if (SKIP.has(e.name)) continue;
    const a = path.join(from, e.name), b = path.join(to, e.name);
    e.isDirectory() ? copy(a, b) : fs.copyFileSync(a, b);
  }
})('.', OUT);

// --- Gabarit commun ----------------------------------------------------------------------
const EXTRA_CSS = `<style>
.page{max-width:1000px;margin:0 auto;padding:28px 4% 40px}.page h1{font-size:clamp(32px,5vw,52px);margin:8px 0 10px}
.crumbs{font-size:14px;color:var(--muted)}.crumbs a{color:var(--muted)}.lead{font-size:18px;line-height:1.6;color:#e5e9eb}
.player{position:relative;aspect-ratio:16/9;background:#000;border-radius:14px;overflow:hidden;margin:22px 0}
.player iframe,.player video{position:absolute;inset:0;width:100%;height:100%;border:0}
.list{list-style:none;padding:0;margin:0 0 18px;display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:12px}
.list a{display:block;background:var(--panel);border:1px solid #1f2b32;border-radius:12px;padding:12px 14px;color:#fff;text-decoration:none;height:100%}
.list a:hover{border-color:var(--green)}.list strong{display:block}.list small,.list span{color:var(--muted);font-size:13px}
.list span{display:block;margin-top:6px;line-height:1.45}.chips a{display:inline-block;margin:0 8px 8px 0;padding:8px 14px;border-radius:20px;background:#19232b;color:#fff;text-decoration:none}
.static-catalogue h3{margin:22px 0 10px}
@media (max-width:700px){.topbar{flex-wrap:wrap;gap:6px 12px}.topbar nav{justify-content:flex-start;flex-basis:100%}}
</style>`;

const layout = ({ title, description, url, img, body, jsonld, depth = 1 }) => {
  const up = '../'.repeat(depth);
  return `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${url}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="CinéLibre">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${url}">
${img ? `<meta property="og:image" content="${esc(img)}">\n` : ''}<meta property="og:locale" content="fr_FR">
<link rel="stylesheet" href="${up}style.css?v=6">
${EXTRA_CSS}
${jsonld ? `<script type="application/ld+json">${JSON.stringify(jsonld)}</script>` : ''}
</head>
<body>
<header class="topbar">
  <a class="brand" href="${up}"><span class="clap">▣</span><span>Ciné<span class="green">Libre</span><small>Films &amp; Séries en Streaming Gratuit</small></span></a>
  <nav aria-label="Navigation"><a href="${up}">⌂ Accueil</a><a href="${up}films/">🎬 Tous les films</a><a href="${up}#genres">▦ Genres</a></nav>
</header>
<main class="page">
${body}
</main>
<footer>© ${TODAY.slice(0, 4)} CinéLibre · Films gratuits et légaux · Regarder reste gratuit</footer>
</body>
</html>
`;
};

const item = (f, up = '../') => `<li><a href="${up}films/${f.slug}.html"><strong>${esc(f.title)}</strong><small>${esc(meta(f))}</small><span>${esc(f.description)}</span></a></li>`;
const genreChips = (up = '../') => `<p class="chips">${genres.map(g => `<a href="${up}genres/${slug(g)}.html">${esc(g)}</a>`).join('')}</p>`;

// --- Pages film --------------------------------------------------------------------------
fs.mkdirSync(path.join(OUT, 'films'), { recursive: true });
for (const f of films) {
  const player = f.youtube
    ? `<div class="player"><iframe src="https://www.youtube-nocookie.com/embed/${f.youtube}" title="${esc(f.title)} — film complet en VF" loading="lazy" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowfullscreen></iframe></div>`
    : `<div class="player"><video controls playsinline preload="none"${f.img ? ` poster="${esc(f.img)}"` : ''} src="${esc(f.src)}"></video></div>`;
  const credit = f.channel
    ? `Diffusé gratuitement et légalement par la chaîne officielle « ${esc(f.channel)} » sur YouTube (publicités possibles).`
    : esc(CREDIT);
  const others = byGenre(f.genre).filter(o => o !== f).slice(0, 6);
  const title = `${f.title}${f.year ? ` (${f.year})` : ''} — ${f.kind === 'long' ? 'film complet en VF gratuit' : "court-métrage d'animation gratuit"} | CinéLibre`;
  const description = `Regardez ${f.title} gratuitement et légalement : ${f.genre.toLowerCase()}, ${dur(f.minutes)}${f.kind === 'long' ? ', en VF' : ''}. ${f.description}`.slice(0, 300);
  const body = `<p class="crumbs"><a href="../">Accueil</a> › <a href="../genres/${slug(f.genre)}.html">${esc(f.genre)}</a> › ${esc(f.title)}</p>
<h1>${esc(f.title)}</h1>
<p class="genre">${esc(kindLabel(f))} · ${esc(meta(f))}</p>
${player}
<h2>Résumé</h2>
<p class="lead">${esc(f.description)}</p>
<p class="muted small">${credit}</p>
${others.length ? `<h2>Autres films : ${esc(f.genre)}</h2>\n<ul class="list">${others.map(o => item(o)).join('\n')}</ul>` : ''}
<h2>Tous les genres</h2>
${genreChips()}`;
  const jsonld = {
    '@context': 'https://schema.org', '@type': 'Movie', name: f.title, url: filmUrl(f), description: f.description,
    genre: f.genre, duration: iso(f.minutes), inLanguage: 'fr', isAccessibleForFree: true,
    ...(f.year ? { dateCreated: String(f.year) } : {}), ...(image(f) ? { image: image(f) } : {}),
  };
  fs.writeFileSync(path.join(OUT, 'films', `${f.slug}.html`), layout({ title, description, url: filmUrl(f), img: image(f), body, jsonld }));
}

// --- Liste de tous les films ---------------------------------------------------------------
fs.writeFileSync(path.join(OUT, 'films', 'index.html'), layout({
  title: `Tous les films gratuits en VF (${films.length} films) | CinéLibre`,
  description: `Les ${films.length} films à regarder gratuitement et légalement sur CinéLibre : films complets en VF et courts-métrages d'animation, classés par genre.`,
  url: `${SITE}/films/`,
  body: `<p class="crumbs"><a href="../">Accueil</a> › Tous les films</p>
<h1>Tous les films gratuits</h1>
<p class="lead">${films.length} films à regarder gratuitement et légalement, sans inscription : des films complets en VF diffusés par les chaînes officielles des ayants droit, et des courts-métrages d'animation sous licence libre.</p>
${genres.map(g => `<h2>${esc(g)}</h2>\n<ul class="list">${byGenre(g).map(f => item(f)).join('\n')}</ul>`).join('\n')}`,
}));

// --- Pages genre ---------------------------------------------------------------------------
fs.mkdirSync(path.join(OUT, 'genres'), { recursive: true });
for (const g of genres) {
  const list = byGenre(g);
  const lower = g.toLowerCase();
  fs.writeFileSync(path.join(OUT, 'genres', `${slug(g)}.html`), layout({
    title: `Films ${lower} gratuits en VF — streaming légal | CinéLibre`,
    description: `${list.length} film${list.length > 1 ? 's' : ''} ${lower} à regarder gratuitement et légalement en streaming : ${list.slice(0, 4).map(f => f.title).join(', ')}…`,
    url: genreUrl(g),
    body: `<p class="crumbs"><a href="../">Accueil</a> › ${esc(g)}</p>
<h1>Films ${esc(lower)} gratuits</h1>
<p class="lead">${list.length} film${list.length > 1 ? 's' : ''} ${esc(lower)} à regarder gratuitement et légalement, sans inscription, directement sur CinéLibre.</p>
<ul class="list">${list.map(f => item(f)).join('\n')}</ul>
<h2>Autres genres</h2>
${genreChips()}`,
  }));
}

// --- Catalogue en dur sur l'accueil -------------------------------------------------------
const indexPath = path.join(OUT, 'index.html');
let index = fs.readFileSync(indexPath, 'utf8');
const staticBlock = `<section id="catalogue" class="static-catalogue">
    <h2>Le catalogue CinéLibre</h2>
    <p class="muted">CinéLibre réunit ${films.length} films à regarder gratuitement et légalement, sans inscription : des films complets en VF (action, thriller, horreur, science-fiction, fantastique, romance…) diffusés par les chaînes officielles des ayants droit, et des courts-métrages d'animation sous licence libre. <a class="green" href="films/">Voir tous les films</a>.</p>
    ${genreChips('')}
    ${genres.map(g => `<h3><a class="green" href="genres/${slug(g)}.html">${esc(g)}</a></h3>\n    <ul class="list">${byGenre(g).map(f => item(f, '')).join('\n')}</ul>`).join('\n    ')}
  </section>

  `;
const MARK = '<section id="apropos">';
if (!index.includes(MARK)) throw new Error('Repère <section id="apropos"> introuvable dans index.html');
index = index.replace(MARK, staticBlock + MARK);
index = index.replace('</head>', `${EXTRA_CSS}\n</head>`);
fs.writeFileSync(indexPath, index);

// --- Sitemap -------------------------------------------------------------------------------
const urls = [`${SITE}/`, `${SITE}/films/`, ...genres.map(genreUrl), ...films.map(filmUrl)];
fs.writeFileSync(path.join(OUT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url><loc>${u}</loc><lastmod>${TODAY}</lastmod></url>`).join('\n')}
</urlset>
`);
fs.writeFileSync(path.join(OUT, '.nojekyll'), '');
console.log(`OK : ${films.length} pages film, ${genres.length} pages genre, ${urls.length} URL dans le sitemap.`);
