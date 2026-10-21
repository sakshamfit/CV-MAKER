// Shared pieces for every generated page: icon sprite, <head>, website header and footer.
// `root` is the relative path back to dist/ ('' for website pages, '../' for workspace pages).

const ICONS = {
  'arrow-right': '<path d="M5 12h14M13 6l6 6-6 6"/>',
  'arrow-left': '<path d="M19 12H5M11 18l-6-6 6-6"/>',
  'arrow-up-right': '<path d="M7 17 17 7M8 7h9v9"/>',
  check: '<path d="m5 12.5 4.5 4.5L19 7"/>',
  x: '<path d="M6 6l12 12M18 6 6 18"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  'chevron-down': '<path d="m6 9 6 6 6-6"/>',
  'chevron-right': '<path d="m9 6 6 6-6 6"/>',
  'chevron-left': '<path d="m15 6-6 6 6 6"/>',
  file: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h4"/>',
  upload: '<path d="M12 15V4m-4 4 4-4 4 4"/><path d="M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3"/>',
  download: '<path d="M12 4v11m-4-4 4 4 4-4"/><path d="M4 17v1a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-1"/>',
  link: '<path d="M10 14a4 4 0 0 0 5.66 0l3-3a4 4 0 0 0-5.66-5.66l-1 1"/><path d="M14 10a4 4 0 0 0-5.66 0l-3 3a4 4 0 0 0 5.66 5.66l1-1"/>',
  qr: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><path d="M14 14h3v3h-3zM20 14v.01M14 20h.01M17 17h4v4h-4z"/>',
  eye: '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  sparkles: '<path d="M12 3l1.8 4.7 4.7 1.8-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8z"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/>',
  refresh: '<path d="M20 11a8 8 0 0 0-14.9-3M4 4v4h4"/><path d="M4 13a8 8 0 0 0 14.9 3M20 20v-4h-4"/>',
  chart: '<path d="M4 20V11M10 20V5M16 20v-7M21 20H3"/>',
  briefcase: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
  route: '<circle cx="6" cy="19" r="2"/><circle cx="18" cy="5" r="2"/><path d="M8 19h7.5a3.5 3.5 0 0 0 0-7h-7a3.5 3.5 0 0 1 0-7H16"/>',
  message: '<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/><path d="M9.6 9.6a2.4 2.4 0 1 1 3.4 2.2c-.6.3-1 .8-1 1.5M12 16.2h.01"/>',
  wand: '<path d="M15 4V2M15 10V8M11 6H9M21 6h-2M17.8 3.2l-1.4 1.4M12.2 8.8l1.4-1.4"/><path d="m3 21 9.5-9.5"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14a6 6 0 0 1 3.5 6"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  building: '<path d="M4 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16M16 9h2a2 2 0 0 1 2 2v10M3 21h18M8 7h4M8 11h4M8 15h4"/>',
  graduation: '<path d="m2 9 10-5 10 5-10 5z"/><path d="M6 11v5c3 2.5 9 2.5 12 0v-5M22 9v6"/>',
  shield: '<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z"/><path d="m9 12 2 2 4-4"/>',
  lock: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
  monitor: '<rect x="2" y="4" width="20" height="13" rx="2"/><path d="M8 21h8M12 17v4"/>',
  phone: '<rect x="7" y="2" width="10" height="20" rx="2.5"/><path d="M11 18h2"/>',
  fingerprint: '<path d="M7 4.6A9 9 0 0 1 21 12"/><path d="M3 12a9 9 0 0 1 1.6-5.1"/><path d="M6.2 16.5A12 12 0 0 0 7 12a5 5 0 0 1 10 0c0 1.6-.1 3.2-.4 4.7"/><path d="M12 12c0 3-.6 6-1.8 8.6"/><path d="M15.5 19.3c.3-.9.6-1.9.8-2.9"/><path d="M3.8 15.5c.1-.5.2-1 .2-1.5"/><path d="M9 19.8c.6-1.5 1-3.1 1-4.8"/>',
  layers: '<path d="m12 3 9 5-9 5-9-5z"/><path d="m3 13 9 5 9-5"/>',
  edit: '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="m13 7 4 4"/>',
  share: '<circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="m8.2 10.8 7.6-4.5M8.2 13.2l7.6 4.5"/>',
  copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M2 12h3M19 12h3M4.9 19.1 7 17M17 7l2.1-2.1"/>',
  card: '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20M6 15h4"/>',
  dashboard: '<rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/>',
  logout: '<path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3M10 17l-5-5 5-5M5 12h12"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  filter: '<path d="M3 5h18l-7 8v6l-4 2v-8z"/>',
  table: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 10h18M9 10v10"/>',
  send: '<path d="m22 2-7 20-4-9-9-4z"/><path d="M22 2 11 13"/>',
  alert: '<path d="M12 3 2 20h20z"/><path d="M12 10v4M12 17h.01"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
  bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10 21a2 2 0 0 0 4 0"/>',
  bolt: '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
  book: '<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 19V5M8 7h7"/>',
  list: '<path d="M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01"/>',
  pin: '<path d="M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12z"/><circle cx="12" cy="9" r="2.5"/>',
  loader: '<path d="M12 3a9 9 0 1 0 9 9"/>',
  trash: '<path d="M4 7h16M10 11v6M14 11v6M5 7l1 13h12l1-13M9 7V4h6v3"/>',
  doc: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 8h6M9 12h6M9 16h3"/>',
  pdf: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><path d="M8.5 15.5v-3h1.2a1 1 0 0 1 0 2H8.5M13 12.5v3h.8a1.5 1.5 0 0 0 0-3zM17 12.5h-1.6v3M15.4 14h1.2"/>',
};

export const icon = (name, cls = '') => `<svg class="i ${cls}" aria-hidden="true"><use href="#ic-${name}"/></svg>`;
export const sprite = () => `<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>${Object.entries(ICONS).map(([id, body]) => `<symbol id="ic-${id}" viewBox="0 0 24 24">${body}</symbol>`).join("")}</defs></svg>`;
export const arrowBtn = (label, href, cls = 'btn-primary', extra = '') => `<a class="btn ${cls}" href="${href}"${extra}>${label}<span class="btn-arrow">${icon('arrow-right', 'i-sm')}</span></a>`;

// Wordmark used in the header, footer, workspace and the home intro. The mark is the
// same CV glyph as the favicon; the name is set in type so it stays sharp at any size.
export const logoMark = (cls = 'brand-mark') => `<svg class="${cls}" viewBox="0 0 64 64" aria-hidden="true"><rect width="64" height="64" rx="16" fill="#0663FC"/><path d="M17 16v32h16" stroke="#fff" stroke-width="7" fill="none" stroke-linecap="round"/><path d="m33 21 8 24 10-29" stroke="#7ee5ff" stroke-width="6" fill="none" stroke-linejoin="round"/></svg>`;
export const brandLockup = (extraClass = '') => `<span class="brand${extraClass ? ` ${extraClass}` : ''}">${logoMark()}<span class="brand-word">CV-MAKER</span></span>`;

// Soft sky background from the earlier design: gradient (CSS .sky), a white glow, a translucent shape and three layered waves.
export const skyWaves = (cls, edge = '#f5f6f8') => `<svg class="${cls}" viewBox="0 0 1440 430" preserveAspectRatio="none" aria-hidden="true"><path fill="#e0f2ff" d="M0 70C105 125 56 370 252 350c182-20 413-52 597-127s356-137 591-223v430H0Z"/><path fill="#f0f8ff" d="M0 305c119-95 262-57 367-25s183 85 375 90 316-95 436-113 169-36 262-8v181H0Z"/><path fill="${edge}" d="M0 369c250-170 321-96 474-40s290 96 441 64 314-25 525-73v110H0Z"/></svg>`;
export const skyBackdrop = (edge) => `<span class="sky-glow" aria-hidden="true"></span><span class="sky-shape" aria-hidden="true"></span>${skyWaves('sky-waves', edge)}`;

// Plan cards for the home preview and the pricing page. Names, prices and allowances stay
// placeholders until the business owner approves them (brief section 6).
export const planCards = (features) => `<div class="plan-grid">${[1, 2, 3].map((n) => `<article class="plan-card${n === 2 ? ' featured' : ''} reveal" style="--d:${(n - 1) * 80}ms">
   <span class="plan-tier">Plan ${n}</span>
   <h3 class="plan-name"><span class="ph">[Plan name]</span></h3>
   <p class="plan-price"><span class="ph">[Price]</span><span class="plan-period">/ <span class="ph">[Billing period]</span></span></p>
   ${arrowBtn('Get started', 'app/builder.html', `${n === 2 ? 'btn-light' : 'btn-primary'} plan-cta`)}
   <div class="plan-feats"><span class="plan-feats-label">Includes</span><ul>${features.map(([label, value]) => `<li>${icon('check', 'i-sm')}<span>${label}</span><span class="ph">${value}</span></li>`).join('')}</ul></div>
  </article>`).join('\n  ')}</div>`;

export const head = ({ title, description, root = '', css = [], extra = '' }) => `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#f5f6f8">
  <meta name="description" content="${description}">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <title>${title}</title>
  <link rel="icon" href="${root}assets/favicon.svg" type="image/svg+xml">
  <link rel="preload" as="font" href="${root}assets/fonts/geist.woff2" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="${root}css/base.css">
${css.map((file) => `  <link rel="stylesheet" href="${root}css/${file}">`).join("\n")}
  <script>document.documentElement.classList.add('js')</script>${extra}
</head>`;

const NAV = [
  ['features.html', 'Features'],
  ['pricing.html', 'Pricing'],
  ['about.html', 'About Us'],
  ['contact.html', 'Contact'],
];

export const siteHeader = (active) => `<header class="nav" id="top">
 <div class="nav-bar">
  <a class="nav-logo" href="index.html" aria-label="CV-MAKER home">${brandLockup()}</a>
  <nav class="nav-links" aria-label="Main">
   ${NAV.map(([href, label]) => `<a href="${href}"${href === active ? ' aria-current="page"' : ""}>${label}</a>`).join("")}
  </nav>
  <div class="nav-actions">
   <a class="btn btn-ghost btn-sm nav-signin" href="app/index.html">Sign in</a>
   ${arrowBtn("Create your resume", "app/builder.html", "btn-primary btn-sm")}
   <button class="nav-toggle" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="nav-mobile">${icon("menu")}</button>
  </div>
 </div>
 <div class="nav-mobile" id="nav-mobile" hidden>
  ${NAV.map(([href, label]) => `<a href="${href}"${href === active ? ' aria-current="page"' : ""}>${label}</a>`).join("")}
  <a href="for-institutions.html"${active === "for-institutions.html" ? ' aria-current="page"' : ""}>For Institutions</a>
  <a href="app/index.html">Sign in</a>
 </div>
</header>`;

export const siteFooter = () => `<footer class="footer">
 <div class="container footer-grid">
  <div class="footer-brand">
   <a class="nav-logo" href="index.html" aria-label="CV-MAKER home">${brandLockup()}</a>
   <p>Your career is bigger than a resume.</p>
   <p class="small">Made by <a href="https://github.com/sakshamfit">sakshamfit</a></p>
   <p class="small">Support: <a href="mailto:support@cv-maker.app">support@cv-maker.app</a> <span class="pending">To confirm</span></p>
  </div>
  <nav aria-label="Product"><h3 class="label">Product</h3><a href="features.html">Features</a><a href="pricing.html">Pricing</a><a href="for-institutions.html">For Institutions</a><a href="app/builder.html">Create your resume</a></nav>
  <nav aria-label="Company"><h3 class="label">Company</h3><a href="about.html">About Us</a><a href="contact.html">Contact</a><a href="app/index.html">Sign in</a></nav>
  <nav aria-label="Legal"><h3 class="label">Legal</h3><button type="button" data-legal="Terms of Service">Terms</button><button type="button" data-legal="Privacy Policy">Privacy</button><button type="button" data-legal="Cookie Policy">Cookies</button></nav>
 </div>
 <div class="container footer-bottom"><span>© 2026 CV-MAKER · Made by sakshamfit</span><span>Prices, policies and some answers are marked pending until approved.</span></div>
</footer>`;

export const siteScripts = (extra = []) => ["js/vendor/qrcode.js", "js/vendor/lenis.min.js", "js/core.js", "js/site.js", ...extra].map((src) => `<script src="${src}" defer></script>`).join("\n");

export const sitePage = ({ file, title, description, body, scripts = [], extraHead = '' }) => `${head({ title, description, css: ["site.css"], extra: extraHead })}
<body>
<a class="skip-link" href="#main">Skip to content</a>
${sprite()}
${siteHeader(file)}
<main id="main">
${body.trim()}
</main>
${siteFooter()}
${siteScripts(scripts)}
</body>
</html>
`;
