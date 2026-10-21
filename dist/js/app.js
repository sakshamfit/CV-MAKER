'use strict';

// CV-MAKER workspace prototype. Everything here is sample data and simulated results:
// nothing is uploaded or sent anywhere. Each screen's set-up runs from SCREENS at the bottom,
// keyed by <body data-page>. The working resume and a few choices persist in localStorage.

const params = new URLSearchParams(location.search);
const EMBED = params.has('embed');
const HOST = 'cv-maker.app';
const GID = 'GID-12345-67890';
const hubURL = `https://${HOST}/id/${GID}`;
const cvURL = cvid => `https://${HOST}/cv/${cvid}`;
const short = url => url.replace(/^https:\/\//, '');

const store = {
 get(key, fallback) {try {const value = localStorage.getItem(`cvmaker.${key}`); return value ? JSON.parse(value) : fallback;} catch {return fallback;}},
 set(key, value) {try {localStorage.setItem(`cvmaker.${key}`, JSON.stringify(value));} catch {/* storage unavailable: the demo keeps working in memory */}},
};

// Deterministic numbers so sample charts look the same on every visit.
const hash = text => [...String(text)].reduce((h, c) => (Math.imul(h, 31) + c.charCodeAt(0)) >>> 0, 7);
const seeded = seed => {let s = seed % 2147483646 + 1; return () => (s = s * 16807 % 2147483647) / 2147483647;};
const fmt = n => n.toLocaleString('en-US');
const slugify = text => String(text).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 24) || 'resume';
const randomCode = (length = 4) => Array.from({length}, () => 'abcdefghjkmnpqrstuvwxyz23456789'[Math.floor(Math.random() * 31)]).join('');
const dateIn = days => new Date(Date.now() + days * 864e5).toLocaleDateString('en-GB', {day: 'numeric', month: 'short', year: 'numeric'});
const empty = (ic, title, text, actions = '') => `<div class="panel empty fade-in"><span class="tool-icon big">${icon(ic, 'i-lg')}</span><b>${title}</b><span class="small">${text}</span>${actions ? `<div class="row-actions">${actions}</div>` : ''}</div>`;
const panel = (title, body, action = '', cls = '') => `<section class="panel ${cls}"><div class="panel-head"><h2 class="panel-title">${title}</h2>${action}</div>${body}</section>`;
const pressed = (group, button) => $$('button', group).forEach(b => b.setAttribute('aria-pressed', String(b === button)));
const onSeg = (group, handler) => group && group.addEventListener('click', event => {
 const button = event.target.closest('button');
 if (!button || !group.contains(button)) return;
 pressed(group, button);
 handler(button);
});
const steps = async (list, node, pause = 420) => {
 node.innerHTML = `<ul class="gen-steps">${list.map(s => `<li>${icon('check', 'i-sm')}${s}</li>`).join('')}</ul>`;
 for (const li of $$('li', node)) {await wait(pause); li.classList.add('done');}
 await wait(240);
};

// ------------------------------------------------------------------ Sample data
const LIVE = [
 {id: 'design', title: 'Product Designer', cvid: 'design-a1b2', edited: '2 days ago', views: 742, unique: 498, last: '2h ago', jobs: 18},
 {id: 'research', title: 'UX Researcher', cvid: 'research-e5f6', edited: '1 week ago', views: 318, unique: 213, last: '5h ago', jobs: 11},
 {id: 'lead', title: 'Design Lead', cvid: 'lead-g7h8', edited: '3 weeks ago', views: 144, unique: 95, last: '1 day ago', jobs: 7},
];
const RANGE = {7: .27, 30: 1, 90: 2.6};

const DOCS = {
 experienced: {
  path: 'experienced', title: 'Design Systems', name: 'Alex Morgan', headline: 'Product Designer · Design Systems',
  email: 'alex.morgan@email.com', phone: '+1 555 0142', location: 'Remote', link: `${HOST}/id/${GID}`,
  summary: 'Product designer with seven years of experience building design systems and data-heavy products. Turns complex workflows into calm, consistent interfaces and works closely with engineering to ship them.',
  experience: [
   {role: 'Senior Product Designer', company: 'Acme Corporation', dates: '2022 – Present', bullets: 'Led the design system used across four product teams.\nRedesigned onboarding to reduce drop-off in the first week.\nMentored three designers and ran weekly design critique.'},
   {role: 'Product Designer', company: 'Northwind', dates: '2019 – 2022', bullets: 'Designed analytics dashboards for operations teams.\nBuilt the first shared component library with engineering.'},
  ],
  education: [{degree: 'B.Des, Interaction Design', school: 'City University', year: '2018'}],
  projects: [{name: 'Component audit', desc: 'Audited the product UI and merged duplicate components into one documented set.'}],
  skills: 'Design systems, Figma, Prototyping, User research, Accessibility, HTML & CSS',
 },
 fresher: {
  path: 'fresher', title: 'Graduate', name: 'Alex Morgan', headline: 'Computer Science graduate',
  email: 'alex.morgan@email.com', phone: '+1 555 0142', location: 'Bengaluru', link: `${HOST}/id/${GID}`,
  summary: 'Final-year computer science student who enjoys building useful web products. Comfortable across front-end and back-end work and keen to grow in a product engineering team.',
  education: [{degree: 'B.Tech, Computer Science', school: 'City University', year: '2026'}],
  projects: [
   {name: 'Campus events app', desc: 'Built a web app that lets students find and register for campus events.'},
   {name: 'Study planner', desc: 'Designed and built a planner that spreads revision across the term.'},
  ],
  experience: [{role: 'Software Engineering Intern', company: 'Contoso', dates: 'Summer 2025', bullets: 'Worked on the internal dashboard used by the support team.\nHelped write tests for the billing service.'}],
  skills: 'JavaScript, React, Python, SQL, Git, Communication',
 },
};
const SECTION_ORDER = {experienced: ['summary', 'experience', 'projects', 'education', 'skills'], fresher: ['summary', 'education', 'projects', 'experience', 'skills']};
const loadDoc = () => store.get('doc', null) || structuredClone(DOCS.experienced);
const saveDoc = doc => store.set('doc', doc);

function allResumes() {
 const doc = loadDoc();
 const own = {id: 'own', title: doc.title, cvid: doc.cvid || null, live: Boolean(doc.live), edited: doc.live ? 'just now' : 'yesterday', views: 0, unique: 0, last: '—', jobs: 0, own: true};
 return [...LIVE.map(r => ({...r, live: true})), own];
}

function sectionsDone(doc) {
 const done = {
  contact: Boolean(doc.name && doc.email),
  summary: (doc.summary || '').length > 40,
  experience: doc.experience.some(e => e.role && e.bullets),
  education: doc.education.some(e => e.degree),
  projects: doc.projects.some(p => p.name),
  skills: (doc.skills || '').split(',').filter(s => s.trim()).length >= 3,
 };
 return done;
}

// ------------------------------------------------------------------ Resume document
function docHTML(doc, highlight = {}) {
 const lines = text => String(text || '').split('\n').map(l => l.trim()).filter(Boolean);
 const li = line => line.startsWith('+') ? `<li><span class="doc-hl">${escapeHTML(line.slice(1))}</span></li>` : `<li>${escapeHTML(line)}</li>`;
 const sec = (title, body) => body ? `<div class="doc-sec"><h4>${title}</h4>${body}</div>` : '';
 const parts = {
  summary: sec('Summary', doc.summary && `<p>${highlight.summary ? `<span class="doc-hl">${escapeHTML(doc.summary)}</span>` : escapeHTML(doc.summary)}</p>`),
  experience: sec('Experience', doc.experience.filter(e => e.role).map(e => `<div class="doc-item"><div class="doc-row"><b>${escapeHTML(e.role)}${e.company ? ` · ${escapeHTML(e.company)}` : ''}</b><span>${escapeHTML(e.dates)}</span></div><ul>${lines(e.bullets).map(li).join('')}</ul></div>`).join('')),
  education: sec('Education', doc.education.filter(e => e.degree).map(e => `<div class="doc-item"><div class="doc-row"><b>${escapeHTML(e.degree)}</b><span>${escapeHTML(e.year)}</span></div><div>${escapeHTML(e.school)}</div></div>`).join('')),
  projects: sec('Projects', doc.projects.filter(p => p.name).map(p => `<div class="doc-item"><b>${escapeHTML(p.name)}</b><div>${escapeHTML(p.desc)}</div></div>`).join('')),
  skills: sec('Skills', doc.skills && `<div class="doc-skills">${doc.skills.split(',').map(s => s.trim()).filter(Boolean).map(s => `<span>${escapeHTML(s)}</span>`).join('')}</div>`),
 };
 const contact = [doc.email, doc.phone, doc.location, doc.link].filter(Boolean).map(s => `<span>${escapeHTML(s)}</span>`).join('');
 return `<div class="doc-name">${escapeHTML(doc.name || 'Your name')}</div><div class="doc-title">${escapeHTML(doc.headline || '')}</div><div class="doc-contact">${contact}</div>${(SECTION_ORDER[doc.path] || SECTION_ORDER.experienced).map(k => parts[k]).join('')}`;
}

// ------------------------------------------------------------------ Shared dialogs
function shareDialog(url, title) {
 openDialog(`<h2>Share card</h2><p class="dialog-sub">Anyone with the link or QR code sees the latest saved version.</p>
  <div class="share-card"><div class="qr" data-dialog-qr></div><div><span class="label">CV-MAKER${title ? ` · ${escapeHTML(title)}` : ''}</span><h3>Alex Morgan</h3><span class="mono">${short(url)}</span></div></div>
  <div class="dialog-actions"><button class="btn btn-primary" type="button" data-copy-link="${url}">${icon('copy', 'i-sm')}Copy link</button><button class="btn btn-light" type="button" data-sim="Share card download is simulated in this prototype">${icon('download', 'i-sm')}Download card</button></div>`);
 renderQR($('[data-dialog-qr]'), url);
}

function hubDialog() {
 const hub = store.get('hub', {headline: 'Designing calm, useful products', role: 'Senior Product Designer', company: 'Acme Corporation', primary: 'design'});
 const primary = LIVE.find(r => r.id === hub.primary) || LIVE[0];
 openDialog(`<div class="hub">
  <div class="hub-url">${icon('lock', 'i-sm')}${short(hubURL)}</div>
  <div class="hub-top"><span class="avatar">AM</span><div><h3>Alex Morgan</h3><p class="small">${escapeHTML(hub.role)} at ${escapeHTML(hub.company)}</p></div></div>
  <p class="body">${escapeHTML(hub.headline)}</p>
  <div class="hub-primary"><span class="tool-icon">${icon('doc')}</span><div><b>${primary.title} resume</b><div class="small">Primary resume · always current</div></div><span class="btn btn-light btn-sm">View</span></div>
  <div class="hub-list">${LIVE.filter(r => r !== primary).map(r => `<div>${icon('doc', 'i-sm')}${r.title}<span class="mono">/cv/${r.cvid}</span></div>`).join('')}</div>
  <p class="hint"><span class="pending">To confirm</span> Which resumes appear on the public hub is pending.</p>
 </div>`);
}

document.addEventListener('click', event => {
 const target = event.target.closest('[data-share],[data-hub-preview],[data-copy-link],[data-sim]');
 if (!target) return;
 if (target.hasAttribute('data-share')) shareDialog(target.dataset.share, target.dataset.shareTitle);
 else if (target.hasAttribute('data-hub-preview')) hubDialog();
 else if (target.hasAttribute('data-copy-link')) copyText(target.dataset.copyLink);
 else toast(target.dataset.sim);
});

// ------------------------------------------------------------------ Shell
function initShell() {
 const side = $('#side'), toggle = $('.side-toggle');
 if (side && toggle) {
  const scrim = document.createElement('div');
  scrim.className = 'side-scrim';
  document.body.append(scrim);
  const set = open => {document.body.classList.toggle('side-open', open); toggle.setAttribute('aria-expanded', String(open));};
  toggle.addEventListener('click', () => set(!document.body.classList.contains('side-open')));
  scrim.addEventListener('click', () => set(false));
  document.addEventListener('keydown', event => event.key === 'Escape' && set(false));
 }
 const accountBtn = $('.account-btn'), menu = $('.account-menu');
 if (accountBtn && menu) {
  accountBtn.addEventListener('click', event => {
   event.stopPropagation();
   menu.hidden = !menu.hidden;
   accountBtn.setAttribute('aria-expanded', String(!menu.hidden));
  });
  document.addEventListener('click', () => {menu.hidden = true; accountBtn.setAttribute('aria-expanded', 'false');});
 }
}

// ------------------------------------------------------------------ Sign in
function initSignIn() {
 $('[data-signin]').addEventListener('submit', async event => {
  event.preventDefault();
  const button = $('button[type=submit]', event.target);
  button.innerHTML = `${icon('loader', 'spin')}Signing in…`;
  await wait(700);
  location.href = 'dashboard.html';
 });
}

// ------------------------------------------------------------------ Dashboard
function series(key, days) {
 const rand = seeded(hash(`${key}-${days}`));
 const base = key === 'account' ? LIVE.reduce((s, r) => s + r.views, 0) : (LIVE.find(r => r.id === key) || {views: 0}).views;
 const total = Math.round(base * RANGE[days]);
 const points = days === 90 ? 13 : days;
 const raw = Array.from({length: points}, (_, i) => .55 + rand() * .9 + i / points * .45);
 const sum = raw.reduce((a, b) => a + b, 0);
 return raw.map(v => Math.round(v / sum * total));
}

function spark(node, data) {
 const w = 300, h = 70, max = Math.max(...data, 1);
 const line = data.map((v, i) => `${i ? 'L' : 'M'}${(i / (data.length - 1) * w).toFixed(1)} ${(h - v / max * (h - 8) - 2).toFixed(1)}`).join('');
 node.innerHTML = `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="spark-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0663fc" stop-opacity=".2"/><stop offset="1" stop-color="#0663fc" stop-opacity="0"/></linearGradient></defs><path d="${line}L${w} ${h}L0 ${h}Z" fill="url(#spark-fill)"/><path d="${line}" fill="none" stroke="#0663fc" stroke-width="2" vector-effect="non-scaling-stroke"/></svg>`;
}

function initDashboard() {
 const hour = new Date().getHours();
 $('[data-greeting]').textContent = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
 const doc = loadDoc(), done = Object.values(sectionsDone(doc)).filter(Boolean).length;
 $('[data-continue-title]').textContent = `${doc.title} resume`;
 $('[data-continue-meta]').textContent = doc.live ? `Live at ${HOST}/cv/${doc.cvid}` : `Draft · ${done} of 6 sections complete · edited yesterday`;
 $('[data-resume-summary]').innerHTML = allResumes().map(r => `<div class="r-mini"><span class="tool-icon">${icon('doc', 'i-sm')}</span><div><b>${escapeHTML(r.title)} resume</b><span class="mono">${r.live ? `${HOST}/cv/${r.cvid}` : 'Not live yet'}</span></div>${r.live ? '<span class="live-pill">Live</span>' : '<span class="chip grey status-chip">Draft</span>'}<span class="r-mini-views"><b>${r.live ? fmt(r.views) : '—'}</b>views</span></div>`).join('');
 spark($('[data-spark]'), series('account', 30));
 const showState = state => $$('[data-state-view]').forEach(view => {view.hidden = view.dataset.stateView !== state;});
 const group = $('[data-user-state]');
 onSeg(group, button => showState(button.dataset.state));
 if (params.get('state') === 'new') {pressed(group, $('[data-state=new]', group)); showState('new');}
}

// ------------------------------------------------------------------ Global ID
function initGID() {
 const form = $('[data-gid-form]');
 const hub = store.get('hub', null);
 if (hub) Object.entries(hub).forEach(([name, value]) => {if (form.elements[name]) form.elements[name].value = value;});
 form.addEventListener('submit', event => {
  event.preventDefault();
  store.set('hub', Object.fromEntries(new FormData(form)));
  $('[data-saved]').textContent = 'Saved just now';
  toast('Hub details saved');
 });
 $('[data-gid-tree]').innerHTML = allResumes().map(r => `<li>${icon('doc', 'i-sm')}<div><b>${escapeHTML(r.title)}</b><div class="mono">${r.live ? `/cv/${r.cvid}` : 'No CVID yet'}</div></div>${r.live ? '<span class="live-pill">Live</span>' : '<span class="chip grey status-chip">Draft</span>'}</li>`).join('');
}

// ------------------------------------------------------------------ My Resumes
function resumeRow(r) {
 const actions = `<a class="icon-btn" href="builder.html?step=editor" data-tip="Edit" aria-label="Edit ${escapeHTML(r.title)} resume">${icon('edit', 'i-sm')}</a>
  <a class="icon-btn" href="preview.html" data-tip="Preview" aria-label="Preview">${icon('eye', 'i-sm')}</a>
  <a class="icon-btn" href="preview.html?download=1" data-tip="Download PDF" aria-label="Download PDF">${icon('download', 'i-sm')}</a>
  ${r.live ? `<button class="icon-btn" type="button" data-share="${cvURL(r.cvid)}" data-share-title="${escapeHTML(r.title)}" data-tip="Share" aria-label="Share">${icon('share', 'i-sm')}</button>` : `<a class="btn btn-primary btn-sm" href="preview.html?make=live">Make it live</a>`}`;
 return `<article class="r-row fade-in">
  <div class="r-thumb" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>
  <div><div class="r-title"><b>${escapeHTML(r.title)} resume</b>${r.live ? '<span class="live-pill">Live</span>' : '<span class="chip grey status-chip">Draft</span>'}</div>
   <div class="r-meta">${r.live ? `<span class="mono">${HOST}/cv/${r.cvid}</span>` : '<span>Not live yet. Download a PDF or make it live.</span>'}<span>Edited ${r.edited}</span></div></div>
  <div class="r-stats">${r.live ? `<span><b>${fmt(r.views)}</b>views · 30 days</span><span><b>${r.jobs}</b>job matches</span>` : ''}</div>
  <div class="r-actions">${actions}</div>
 </article>`;
}

async function initResumes() {
 const list = $('[data-resume-list]');
 let filter = 'all', demo = 'list';
 const render = () => {
  if (demo === 'empty') {
   list.innerHTML = empty('doc', 'No resumes yet', 'Create one from scratch or upload a Word or PDF file. Each resume can become its own CVID under your Global ID.', `<a class="btn btn-primary btn-sm" href="builder.html">Create a resume</a><a class="btn btn-light btn-sm" href="builder.html?start=upload">${icon('upload', 'i-sm')}Upload</a>`);
   return;
  }
  const rows = allResumes().filter(r => filter === 'all' || (filter === 'live') === r.live);
  list.innerHTML = rows.length ? rows.map(resumeRow).join('') : empty('filter', 'Nothing here', 'No resumes match this filter.');
 };
 list.innerHTML = Array.from({length: 3}, () => '<div class="panel skel-row"><span class="skel"></span><div><span class="skel" style="width:40%"></span><span class="skel" style="width:65%"></span></div></div>').join('');
 onSeg($('[data-resume-filter]'), button => {filter = button.dataset.filter; render();});
 onSeg($('[data-demo-state]'), button => {demo = button.dataset.demo; render();});
 await wait(EMBED ? 0 : 650);
 render();
}

// ------------------------------------------------------------------ Builder
const ASSIST = ['Improve', 'Shorten', 'Elaborate', 'Professional', 'Add metrics'];
const STRONG = [[/^worked on /i, 'Led work on '], [/^helped (to )?write /i, 'Wrote '], [/^helped (to )?/i, 'Supported '], [/^did /i, 'Delivered '], [/^made /i, 'Built '], [/^responsible for /i, 'Owned ']];

// Simulated writing assistant: predictable rewrites, with [X] placeholders instead of invented numbers.
function rewrite(action, text) {
 const lines = String(text).split('\n').map(l => l.trim()).filter(Boolean);
 const sentence = l => l.replace(/\s+/g, ' ').trim().replace(/^./, c => c.toUpperCase()).replace(/([^.!?])$/, '$1.');
 const bare = l => l.replace(/[.!?]$/, '');
 const plain = l => l.replace(/\b(really|very|just|basically) /gi, '').replace(/\blots of\b/gi, 'many').replace(/\bstuff\b/gi, 'work').replace(/\bgot\b/gi, 'achieved');
 const strong = l => STRONG.reduce((s, [re, to]) => s.replace(re, to), l);
 if (lines.length > 1) {
  const tails = {
   Elaborate: [', partnering closely with engineering and product', ', with clear documentation for each team', ', testing each stage with users'],
   'Add metrics': [' (by [X]%)', ' across [N] teams', ', saving [N] hours a week'],
  };
  if (action === 'Shorten') return lines.slice(0, Math.max(2, lines.length - 1)).map(l => sentence(l.split(/,| and | while /)[0])).join('\n');
  if (tails[action]) return lines.map((l, i) => sentence(bare(l) + tails[action][i % 3])).join('\n');
  return lines.map(l => sentence(action === 'Professional' ? plain(l) : strong(plain(l)))).join('\n');
 }
 const first = sentence(text.split(/(?<=[.!?])\s/)[0]);
 if (action === 'Shorten') return first;
 if (action === 'Elaborate') return `${sentence(text)} Known for clear documentation, close collaboration with engineering and steady improvements to product quality.`;
 if (action === 'Add metrics') return sentence(`${bare(text.trim())}, improving [METRIC] by [X]%`);
 if (action === 'Professional') return sentence(plain(text));
 return `${strong(first)} Brings a structured, user-centred approach and a record of shipping work with engineering.`;
}

function initBuilder() {
 let doc = loadDoc(), section = 'contact', saveTimer = 0;
 const views = $$('[data-step]'), flow = $$('[data-flow-step]');
 const show = (name, {scroll = true} = {}) => {
  views.forEach(v => {v.hidden = v.dataset.step !== name;});
  const index = {path: 0, start: 1, editor: 2}[name];
  flow.forEach((li, i) => {li.classList.toggle('on', i === index); li.classList.toggle('done', i < index);});
  if (name === 'editor') renderEditor();
  if (scroll && !EMBED) window.scrollTo({top: 0, behavior: 'smooth'});
 };

 // Path and start choices
 $$('[data-path]').forEach(button => button.addEventListener('click', () => {
  if (doc.path !== button.dataset.path) doc = structuredClone(DOCS[button.dataset.path]);
  saveDoc(doc);
  show('start');
 }));
 $('[data-start=scratch]').addEventListener('click', () => {doc.parsedFrom = ''; saveDoc(doc); show('editor');});
 $$('[data-to]').forEach(button => button.addEventListener('click', () => show(button.dataset.to)));

 const parse = async name => {
  const box = $('[data-parse]'), bar = $('[data-parse-bar]'), state = $('[data-parse-state]'), note = $('[data-parse-note]');
  box.hidden = false;
  $('[data-parse-name]').textContent = name;
  const stages = [[18, 'Reading your resume…', 'Opening the file and reading its text.'], [52, 'Finding sections…', 'Extracting contact details, experience and education.'], [80, 'Matching skills…', 'Recognising skills and tools.'], [100, 'Done', 'Ready for your review.']];
  for (const [pct, label, detail] of stages) {
   bar.style.width = `${pct}%`; state.textContent = label; note.textContent = detail;
   await wait(620);
  }
  doc = structuredClone(DOCS[doc.path] || DOCS.experienced);
  doc.parsedFrom = name;
  saveDoc(doc);
  box.hidden = true;
  show('editor');
 };
 const upload = $('[data-upload]'), drop = $('[data-drop]');
 upload.addEventListener('change', () => upload.files[0] && parse(upload.files[0].name));
 ['dragenter', 'dragover'].forEach(type => drop.addEventListener(type, event => {event.preventDefault(); drop.classList.add('drag');}));
 ['dragleave', 'drop'].forEach(type => drop.addEventListener(type, () => drop.classList.remove('drag')));
 drop.addEventListener('drop', event => {event.preventDefault(); const file = event.dataTransfer.files[0]; if (file) parse(file.name);});
 $('[data-sample-upload]').addEventListener('click', () => parse('alex-morgan-resume.pdf'));

 // Editor
 const preview = () => {$('[data-resume-doc]').innerHTML = docHTML(doc);};
 const markDone = () => {const done = sectionsDone(doc); $$('[data-sec]').forEach(b => b.classList.toggle('complete', done[b.dataset.sec]));};
 const saved = () => {
  const label = $('[data-save-state]');
  label.textContent = 'Saving…';
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {saveDoc(doc); label.textContent = 'All changes saved';}, 450);
 };
 const getK = path => path.split('.').reduce((o, k) => o?.[k], doc);
 const setK = (path, value) => {const keys = path.split('.'), last = keys.pop(); keys.reduce((o, k) => o[k], doc)[last] = value;};
 const field = (label, key, {area = false, rows = 4, placeholder = ''} = {}) => {
  const id = `f-${key.replace(/\./g, '-')}`, value = escapeHTML(getK(key) ?? '');
  return `<div class="field"><label for="${id}">${label}</label>${area ? `<textarea class="textarea" id="${id}" rows="${rows}" data-k="${key}" placeholder="${placeholder}">${value}</textarea>` : `<input class="input" id="${id}" data-k="${key}" value="${value}" placeholder="${placeholder}">`}</div>`;
 };
 const assist = key => `<div class="assist" data-assist="${key}"><div class="assist-head">${icon('sparkles', 'i-sm')}Writing assistant<span class="usage">AI uses left: <span class="ph">[AI allowance]</span></span></div><div class="assist-btns">${ASSIST.map(a => `<button type="button" data-act="${a}">${a}</button>`).join('')}</div><div data-suggest></div></div>`;
 const entries = (list, render, add) => `${list.map(render).join('')}<button class="btn btn-light btn-sm" type="button" data-add="${add}">${icon('plus', 'i-sm')}Add another</button>`;
 const forms = {
  contact: () => `<h2>Contact details</h2>${field('Resume name', 'title')}<div class="form-2">${field('Full name', 'name')}${field('Headline', 'headline')}</div><div class="form-2">${field('Email', 'email')}${field('Phone', 'phone')}</div><div class="form-2">${field('Location', 'location')}${field('Link', 'link')}</div>`,
  summary: () => `<h2>Summary</h2>${field('Professional summary', 'summary', {area: true, rows: 5})}${assist('summary')}`,
  experience: () => `<h2>Experience</h2>${entries(doc.experience, (e, i) => `<div class="entry"><div class="entry-head">Role ${i + 1}</div><div class="form-2">${field('Job title', `experience.${i}.role`)}${field('Company', `experience.${i}.company`)}</div>${field('Dates', `experience.${i}.dates`)}${field('What you did (one point per line)', `experience.${i}.bullets`, {area: true, rows: 4})}${i === 0 ? assist(`experience.${i}.bullets`) : ''}</div>`, 'experience')}`,
  education: () => `<h2>Education</h2>${entries(doc.education, (e, i) => `<div class="entry"><div class="entry-head">Qualification ${i + 1}</div>${field('Degree or course', `education.${i}.degree`)}<div class="form-2">${field('School', `education.${i}.school`)}${field('Year', `education.${i}.year`)}</div></div>`, 'education')}`,
  projects: () => `<h2>Projects</h2>${entries(doc.projects, (p, i) => `<div class="entry"><div class="entry-head">Project ${i + 1}</div>${field('Project name', `projects.${i}.name`)}${field('Description', `projects.${i}.desc`, {area: true, rows: 3})}${i === 0 ? assist(`projects.${i}.desc`) : ''}</div>`, 'projects')}`,
  skills: () => `<h2>Skills</h2>${field('Skills, separated by commas', 'skills', {area: true, rows: 3})}<div class="skills-chips" data-skill-chips></div><p class="hint">Skills also help Job Discovery find better matches for this CVID.</p>`,
 };
 const BLANK = {experience: {role: '', company: '', dates: '', bullets: ''}, education: {degree: '', school: '', year: ''}, projects: {name: '', desc: ''}};
 const chips = () => {const box = $('[data-skill-chips]'); if (box) box.innerHTML = doc.skills.split(',').map(s => s.trim()).filter(Boolean).map(s => `<span class="chip">${escapeHTML(s)}</span>`).join('');};
 const renderSection = () => {
  $('[data-sec-form]').innerHTML = forms[section]();
  $$('[data-sec]').forEach(b => b.toggleAttribute('aria-current', b.dataset.sec === section));
  chips();
 };
 function renderEditor() {
  const nav = $('[data-sec-nav]');
  const order = ['contact', ...(SECTION_ORDER[doc.path] || SECTION_ORDER.experienced)];
  order.forEach(key => nav.append($(`[data-sec=${key}]`, nav)));
  $('[data-editor-title]').textContent = `${doc.title || 'Untitled'} resume`;
  $('[data-path-chip]').textContent = doc.path === 'fresher' ? 'Fresher path' : 'Experienced path';
  const parsed = $('[data-parsed]');
  parsed.hidden = !doc.parsedFrom;
  if (doc.parsedFrom) $('[data-parsed-name]').textContent = doc.parsedFrom;
  renderSection(); preview(); markDone();
 }
 const secNav = $('[data-sec-nav]');
 secNav.addEventListener('click', event => {const b = event.target.closest('[data-sec]'); if (b) {section = b.dataset.sec; renderSection();}});
 const form = $('[data-sec-form]');
 form.addEventListener('input', event => {
  const key = event.target.dataset.k;
  if (!key) return;
  setK(key, event.target.value);
  if (key === 'title') $('[data-editor-title]').textContent = `${event.target.value || 'Untitled'} resume`;
  if (key === 'skills') chips();
  preview(); markDone(); saved();
 });
 form.addEventListener('click', async event => {
  const add = event.target.closest('[data-add]');
  if (add) {doc[add.dataset.add].push({...BLANK[add.dataset.add]}); renderSection(); saved(); return;}
  const act = event.target.closest('[data-act]'), box = event.target.closest('[data-assist]');
  if (act && box) {
   const key = box.dataset.assist, out = $('[data-suggest]', box);
   out.innerHTML = `<div class="loading-line">${icon('loader', 'spin')}Writing a suggestion…</div>`;
   await wait(EMBED ? 0 : 650);
   const text = rewrite(act.dataset.act, getK(key) || '');
   out.innerHTML = `<div class="suggest fade-in"><span class="label">${act.dataset.act} · suggestion</span><div>${escapeHTML(text).replace(/\n/g, '<br>')}</div><div class="row-actions"><button class="btn btn-primary btn-sm" type="button" data-accept>Use this</button><button class="btn btn-ghost btn-sm" type="button" data-discard>Discard</button></div><span class="hint">Simulated suggestion. Always review before you use it.</span></div>`;
   out.dataset.text = text;
   return;
  }
  if (event.target.closest('[data-accept]')) {
   const out = event.target.closest('[data-suggest]'), key = event.target.closest('[data-assist]').dataset.assist;
   setK(key, out.dataset.text);
   const input = $(`[data-k="${key}"]`, form);
   if (input) input.value = out.dataset.text;
   out.innerHTML = '';
   preview(); markDone(); saved(); toast('Suggestion applied');
  }
  if (event.target.closest('[data-discard]')) event.target.closest('[data-suggest]').innerHTML = '';
 });

 // Entry points: ?step=editor, ?start=upload, or the path choice.
 if (params.get('step') === 'editor') show('editor', {scroll: false});
 else if (params.get('start') === 'upload') {show('start', {scroll: false}); drop.classList.add('hot');}
 else show('path', {scroll: false});
 if (EMBED && params.get('step') === 'editor') {section = 'summary'; renderSection(); $('[data-assist] [data-act=Improve]')?.click();}
}

// ------------------------------------------------------------------ Preview and Make it live
function initPreview() {
 let doc = loadDoc();
 $('[data-resume-doc]').innerHTML = docHTML(doc);
 const liveBox = $('[data-live-state]');
 const showLive = cvid => {
  const url = cvURL(cvid);
  liveBox.hidden = false;
  $('[data-live-url]').textContent = short(url);
  renderQR($('[data-live-qr]'), url);
  $('[data-live-copy]').onclick = () => copyText(url);
  $('[data-make-live]').hidden = true;
 };
 if (doc.live) showLive(doc.cvid);
 else if (params.has('live')) showLive('design-systems-k4d2');

 $('[data-pdf]').addEventListener('click', async () => {
  toast('Choose “Save as PDF” in the print dialog');
  await wait(500);
  window.print();
 });

 const makeLive = () => {
  const suggested = `${slugify(doc.title)}-${randomCode()}`;
  const dialog = openDialog(`<div class="make-live" data-ml>
   <div><h2>Make this resume live</h2><p class="dialog-sub">It gets its own CVID: a permanent link and QR code under your Global ID. Saved edits update it.</p></div>
   <div class="field"><label for="ml-slug">Your CVID link</label><div class="slug"><span>${HOST}/cv/</span><input id="ml-slug" value="${suggested}" spellcheck="false" autocomplete="off"></div><span class="hint">Lowercase letters, numbers and hyphens.</span></div>
   <div class="banner">${icon('fingerprint', 'i-sm')}<span>Connected to <b class="mono">${GID}</b></span></div>
   <p class="hint"><span class="pending">To confirm</span> Who can view live CVIDs and whether they appear in search engines is pending.</p>
   <div class="dialog-actions"><button class="btn btn-primary" type="button" data-ml-go>${icon('link', 'i-sm')}Generate CVID</button><button class="btn btn-light" type="button" data-close>Cancel</button></div>
  </div>`);
  $('[data-ml-go]', dialog).addEventListener('click', async () => {
   const input = $('#ml-slug', dialog);
   const cvid = slugify(input.value);
   if (!cvid || cvid.length < 3) {input.focus(); toast('Choose a link with at least 3 characters'); return;}
   const box = $('[data-ml]', dialog);
   box.innerHTML = `<div><h2>Making it live…</h2><p class="dialog-sub">${HOST}/cv/${cvid}</p></div><div data-ml-steps></div>`;
   await steps(['Creating your CVID', 'Publishing your live page', 'Generating your QR card'], $('[data-ml-steps]', box));
   doc = {...loadDoc(), live: true, cvid};
   saveDoc(doc);
   const url = cvURL(cvid);
   box.innerHTML = `<div><span class="live-pill">Live</span><h2 style="margin-top:10px">Your resume is live</h2><p class="dialog-sub">Share the link or QR card. Views appear in Analytics.</p></div>
    <div class="share-card"><div class="qr" data-dialog-qr></div><div><span class="label">CV-MAKER · ${escapeHTML(doc.title)}</span><h3>${escapeHTML(doc.name)}</h3><span class="mono">${short(url)}</span></div></div>
    <div class="dialog-actions"><button class="btn btn-primary" type="button" data-copy-link="${url}">${icon('copy', 'i-sm')}Copy link</button><a class="btn btn-light" href="gid.html">Go to Global ID</a><a class="btn btn-ghost" href="dashboard.html">Back to dashboard</a></div>`;
   renderQR($('[data-dialog-qr]', box), url);
   showLive(cvid);
  });
 };
 $('[data-make-live]').addEventListener('click', makeLive);
 if (params.get('make') === 'live' && !doc.live) makeLive();
 if (params.has('download') && !EMBED) $('[data-pdf]').click();
}

// ------------------------------------------------------------------ Analytics
const COUNTRIES = [['India', 38], ['United States', 21], ['United Kingdom', 14], ['Canada', 9], ['Germany', 7], ['Other', 11]];
const DEVICES = [['Desktop', 64], ['Mobile', 31], ['Tablet', 5]];
const RECENT = [['India', 'Desktop', '2h ago'], ['United Kingdom', 'Mobile', '4h ago'], ['Canada', 'Desktop', '7h ago'], ['United States', 'Desktop', '1 day ago'], ['India', 'Mobile', '1 day ago']];

const jitter = (list, key) => {
 const rand = seeded(hash(key));
 const raw = list.map(([name, pct]) => [name, Math.max(2, pct + Math.round((rand() - .5) * 8))]);
 const total = raw.reduce((s, [, v]) => s + v, 0);
 const out = raw.map(([name, v]) => [name, Math.round(v / total * 100)]);
 const other = out.find(([name]) => name === 'Other');
 return [...out.filter(r => r !== other).sort((a, b) => b[1] - a[1]), ...(other ? [other] : [])];
};

function barChart(node, data, days) {
 const w = 640, h = 210, foot = 24, max = Math.max(...data, 1) * 1.12, n = data.length, gap = n > 20 ? 3 : 10, bw = (w - gap * (n - 1)) / n;
 const grid = [.25, .5, .75, 1].map(f => `<line class="grid" x1="0" x2="${w}" y1="${((h - foot) * (1 - f)).toFixed(1)}" y2="${((h - foot) * (1 - f)).toFixed(1)}"/>`).join('');
 const bars = data.map((v, i) => {const bh = v / max * (h - foot); return `<rect class="bar-r" x="${(i * (bw + gap)).toFixed(1)}" y="${(h - foot - bh).toFixed(1)}" width="${bw.toFixed(1)}" height="${bh.toFixed(1)}" rx="${Math.min(4, bw / 3).toFixed(1)}"><title>${fmt(v)} views</title></rect>`;}).join('');
 const labels = `<text x="0" y="${h - 6}">${days === 90 ? '13 weeks ago' : `${days} days ago`}</text><text x="${w}" y="${h - 6}" text-anchor="end">${days === 90 ? 'This week' : 'Today'}</text>`;
 node.innerHTML = `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="Views over the last ${days} days">${grid}${bars}${labels}</svg>`;
}

function initAnalytics() {
 const doc = loadDoc();
 const scopes = [{id: 'account', label: 'All CVIDs', sub: 'Account'}, ...LIVE.map(r => ({id: r.id, label: r.title, sub: r.cvid})), {id: 'own', label: doc.title, sub: doc.live ? doc.cvid : 'Draft'}];
 let scope = scopes.some(s => s.id === params.get('cvid')) ? params.get('cvid') : 'account', days = 30;
 const box = $('[data-analytics]'), scopeBox = $('[data-scope]');
 scopeBox.innerHTML = scopes.map(s => `<button type="button" aria-pressed="${s.id === scope}" data-id="${s.id}">${escapeHTML(s.label)}<span class="mono">${escapeHTML(s.sub)}</span></button>`).join('');
 const split = rows => `<div class="split">${rows.map(([name, pct]) => `<div class="split-row"><span>${name}</span><span class="bar"><i style="width:${pct}%"></i></span><span>${pct}%</span></div>`).join('')}</div>`;
 const render = () => {
  if (scope === 'own') {
   box.innerHTML = doc.live
    ? empty('chart', 'No views yet', 'This CVID is live. Views appear here once someone opens your link or scans your QR code.', `<button class="btn btn-primary btn-sm" type="button" data-copy-link="${cvURL(doc.cvid)}">${icon('copy', 'i-sm')}Copy link</button>`)
    : empty('chart', 'This resume isn’t live yet', 'Analytics start once a resume becomes a live CVID. Downloaded PDFs can’t be tracked.', '<a class="btn btn-primary btn-sm" href="preview.html?make=live">Make it live</a>');
   return;
  }
  const rows = scope === 'account' ? LIVE : LIVE.filter(r => r.id === scope);
  const f = RANGE[days];
  const views = Math.round(rows.reduce((s, r) => s + r.views, 0) * f), unique = Math.round(rows.reduce((s, r) => s + r.unique, 0) * f);
  const countries = jitter(COUNTRIES, scope + days), devices = jitter(DEVICES, `d${scope}${days}`);
  const kpi = (ic, label, value) => `<div class="kpi fade-in"><span class="small">${icon(ic, 'i-sm')}${label}</span><b>${value}</b></div>`;
  const recent = `<ul class="recent">${RECENT.slice(0, scope === 'account' ? 5 : 4).map(([country, device, when], i) => `<li><span class="tool-icon">${icon(device === 'Mobile' ? 'phone' : 'monitor', 'i-sm')}</span><span>${country} · ${device}${scope === 'account' ? ` <span class="small">· ${LIVE[i % 3].title}</span>` : ''}</span><span class="small">${when}</span></li>`).join('')}</ul>`;
  const table = `<table class="per-cvid"><thead><tr><th>CVID</th><th>Views</th><th>Unique</th><th>Last opened</th></tr></thead><tbody>${LIVE.map(r => `<tr><td><b>${r.title}</b><div class="mono">/cv/${r.cvid}</div></td><td>${fmt(Math.round(r.views * f))}</td><td>${fmt(Math.round(r.unique * f))}</td><td>${r.last}</td></tr>`).join('')}</tbody></table>`;
  box.innerHTML = `<div class="kpis">${kpi('eye', 'Total views', fmt(views))}${kpi('users', 'Unique viewers', fmt(unique))}${kpi('clock', 'Last opened', rows[0].last)}${kpi('globe', 'Top country', countries[0][0])}</div>
   <div class="an-grid">
    <div class="stack">${panel(`Views · last ${days} days`, '<div class="chart" data-chart></div>')}${scope === 'account' ? panel('By CVID', table) : panel('Recent views', recent)}</div>
    <div class="stack">${panel('Countries', split(countries))}${panel('Devices', split(devices))}${scope === 'account' ? panel('Recent views', recent) : ''}</div>
   </div>`;
  barChart($('[data-chart]', box), series(scope, days), days);
 };
 onSeg(scopeBox, button => {scope = button.dataset.id; render();});
 onSeg($('[data-range]'), button => {days = Number(button.dataset.days); render();});
 render();
}

// ------------------------------------------------------------------ Job Discovery
const JOBS = {
 design: [['Senior Product Designer', 'Contoso', 'Remote · Full-time', '2 days ago', 94, ['Design systems', 'B2B products', 'Mentoring']], ['Product Designer, Growth', 'Northwind', 'Bengaluru · Hybrid', '3 days ago', 88, ['Onboarding', 'Figma', 'Experimentation']], ['Lead Product Designer', 'Fabrikam', 'London · Hybrid', '1 week ago', 81, ['Design systems', 'Leadership']], ['UX Designer', 'Globex', 'Remote · Contract', '4 days ago', 73, ['Prototyping', 'User research']], ['Product Designer', 'Tailspin', 'Toronto · On-site', '2 weeks ago', 64, ['Dashboards', 'Accessibility']]],
 research: [['UX Researcher', 'Fabrikam', 'Remote · Full-time', '1 day ago', 91, ['Usability testing', 'Interviews', 'Synthesis']], ['Senior UX Researcher', 'Contoso', 'Berlin · Hybrid', '5 days ago', 84, ['Mixed methods', 'Stakeholders']], ['Research Ops Lead', 'Northwind', 'Remote · Full-time', '1 week ago', 72, ['Research ops', 'Tooling']], ['Product Researcher', 'Globex', 'Singapore · Hybrid', '2 weeks ago', 66, ['Surveys', 'Analytics']]],
 lead: [['Design Lead', 'Northwind', 'Remote · Full-time', '3 days ago', 89, ['Team leadership', 'Design systems']], ['Head of Design', 'Tailspin', 'London · Hybrid', '1 week ago', 76, ['Hiring', 'Strategy', 'Critique']], ['Principal Designer', 'Contoso', 'Remote · Full-time', '6 days ago', 70, ['Design systems', 'Mentoring']]],
};

function initJobs() {
 const box = $('[data-jobs]'), scopeBox = $('[data-job-scope]');
 let current = LIVE.some(r => r.id === params.get('cvid')) ? params.get('cvid') : 'design', demo = 'results', run = 0;
 const doc = loadDoc();
 scopeBox.innerHTML = [...LIVE.map(r => `<button type="button" aria-pressed="${r.id === current}" data-id="${r.id}">${r.title}<span class="mono">${r.cvid}</span></button>`), `<button type="button" aria-pressed="false" data-id="own">${escapeHTML(doc.title)}<span class="mono">${doc.live ? doc.cvid : 'Draft'}</span></button>`].join('');
 const strength = score => score >= 85 ? ['s-strong', 'Strong match'] : score >= 70 ? ['s-good', 'Good match'] : ['s-fair', 'Fair match'];
 const job = ([title, company, place, posted, score, why], i) => {
  const [cls, label] = strength(score);
  return `<article class="job fade-in" style="animation-delay:${i * 60}ms"><span class="job-logo" aria-hidden="true">${company.slice(0, 2).toUpperCase()}</span>
   <div><h3>${title}</h3><div class="job-meta"><span>${company}</span><span>${place}</span><span>Posted ${posted}</span></div>
    <div class="job-why"><span class="label">Why it matches</span>${why.map(w => `<span class="chip">${icon('check', 'i-sm')}${w}</span>`).join('')}</div></div>
   <div class="job-side"><div class="strength ${cls}"><span>${label} · ${score}%</span><span class="bar"><i style="width:${score}%"></i></span></div>
    <div class="row-actions" style="margin-top:4px"><a class="btn btn-light btn-sm" href="tailoring.html?job=${encodeURIComponent(title)}&co=${encodeURIComponent(company)}">${icon('wand', 'i-sm')}Tailor</a><button class="btn btn-primary btn-sm" type="button" data-sim="Opening listings is pending: source and apply flow to be confirmed">View listing</button></div></div>
  </article>`;
 };
 const render = async () => {
  const id = ++run;
  if (current === 'own' && !doc.live) {
   box.innerHTML = empty('target', 'Make this resume live to find matches', 'Job Discovery works from one live CVID at a time, using its role, skills and experience.', '<a class="btn btn-primary btn-sm" href="preview.html?make=live">Make it live</a>');
   return;
  }
  box.innerHTML = `<div class="panel"><div class="loading-line">${icon('loader', 'spin')}Finding matches for this CVID…</div>${Array.from({length: 3}, () => '<div class="skel-row"><span class="skel"></span><div><span class="skel" style="width:45%"></span><span class="skel" style="width:70%"></span></div></div>').join('')}</div>`;
  await wait(EMBED ? 0 : 900);
  if (id !== run) return;
  if (demo === 'error') {box.innerHTML = empty('alert', 'We couldn’t load matches', 'Something went wrong while fetching listings. Your resumes are safe.', '<button class="btn btn-primary btn-sm" type="button" data-retry>Try again</button>'); return;}
  const list = current === 'own' ? [] : JOBS[current];
  if (demo === 'none' || !list.length) {box.innerHTML = empty('search', 'No matches yet', 'Try adding more skills to this resume, or pick another CVID. New listings are checked regularly.', '<a class="btn btn-light btn-sm" href="builder.html?step=editor">Edit resume</a>'); return;}
  const resume = LIVE.find(r => r.id === current);
  box.innerHTML = `<div class="toolbar"><p class="small"><b style="color:var(--ink)">${resume.jobs} matches</b> for ${resume.title} · showing the top ${list.length}, ranked by match strength</p><span class="hint">Refreshed <span class="ph">[Refresh frequency]</span></span></div><div class="jobs" style="margin-top:12px">${list.map(job).join('')}</div>`;
 };
 box.addEventListener('click', event => {if (event.target.closest('[data-retry]')) {demo = 'results'; pressed($('[data-job-demo]'), $('[data-job-demo] [data-demo=results]')); render();}});
 onSeg(scopeBox, button => {current = button.dataset.id; render();});
 onSeg($('[data-job-demo]'), button => {demo = button.dataset.demo; render();});
 render();
}

// ------------------------------------------------------------------ Job Tailoring
function initTailoring() {
 const role = params.get('job') || 'Senior Product Designer', company = params.get('co') || 'Contoso';
 const sample = `${company} is hiring a ${role} to lead our design system and work across product teams. You will partner with engineering, run research with customers and raise the bar for accessibility.\n\nRequirements: 5+ years in product design, strong Figma and prototyping skills, experience with design systems, and clear communication with stakeholders.`;
 const jd = $('#t-jd');
 if (params.has('job')) jd.value = sample;
 $('[data-sample-jd]').addEventListener('click', () => {jd.value = sample; jd.focus();});
 const views = $$('[data-limit-view]');
 onSeg($('[data-limit-demo]'), button => views.forEach(v => {v.hidden = v.dataset.limitView !== button.dataset.limit;}));
 const result = $('[data-tailor-result]');
 $('[data-tailor-form]').addEventListener('submit', async event => {
  event.preventDefault();
  result.innerHTML = panel('Result', '<div data-gen></div>');
  await steps(['Reading the job description', 'Matching your experience to it', 'Rewriting your resume', 'Drafting the cover letter'], $('[data-gen]', result), 380);
  const base = loadDoc().path === 'fresher' ? structuredClone(DOCS.experienced) : loadDoc();
  const tailored = {...structuredClone(base), summary: `Product designer with seven years of experience leading design systems across product teams. Partners closely with engineering, runs research with customers and champions accessibility, which matches what ${company} needs in a ${role}.`};
  tailored.experience[0].bullets = `+Led the design system used across four product teams, partnering with engineering on every release.\n+Ran research with customers to shape onboarding, and redesigned it to reduce first-week drop-off.\nMentored three designers and ran weekly design critique.`;
  tailored.skills = 'Design systems, Figma, Prototyping, Accessibility, User research, Stakeholder communication';
  const letter = `<p>Dear hiring team at ${company},</p><p>I’m applying for the ${role} role. For the past three years I have led the design system at Acme Corporation, used by four product teams, and I work side by side with engineering from first sketch to release.</p><p>Your focus on research and accessibility is close to how I work: I regularly test with customers and treat accessibility as part of the definition of done. I’d welcome the chance to bring that to ${company}.</p><p>Kind regards,<br>Alex Morgan<br><span class="mono" style="font-size:13px">${HOST}/id/${GID}</span></p>`;
  result.innerHTML = panel('Result', `<div class="seg result-tabs" role="group" aria-label="Output" data-out><button type="button" aria-pressed="true" data-out-tab="resume">Tailored resume</button><button type="button" aria-pressed="false" data-out-tab="letter">Cover letter</button></div>
   <div class="kw"><span class="label" style="align-self:center;margin-right:4px">From the job</span>${['Design systems', 'Engineering partnership', 'Customer research', 'Accessibility', 'Figma'].map(k => `<span class="chip green">${icon('check', 'i-sm')}${k}</span>`).join('')}<span class="chip amber">Stakeholder examples · add evidence</span></div>
   <div data-out-view="resume"><div class="resume-doc small-doc" style="max-height:520px">${docHTML(tailored, {summary: true})}</div><p class="hint" style="margin-top:8px">Highlighted text was changed for this job.</p></div>
   <div data-out-view="letter" hidden><div class="result-doc">${letter}</div></div>
   <div class="row-actions"><button class="btn btn-primary btn-sm" type="button" data-sim="Saved as a new draft in My Resumes (simulated)">Save as new resume</button><button class="btn btn-light btn-sm" type="button" data-sim="PDF export is simulated in this prototype">${icon('download', 'i-sm')}Download PDF</button><button class="btn btn-light btn-sm" type="button" data-copy-letter>${icon('copy', 'i-sm')}Copy letter</button></div>`, '<span class="chip grey">Not saved yet</span>');
  onSeg($('[data-out]', result), button => $$('[data-out-view]', result).forEach(v => {v.hidden = v.dataset.outView !== button.dataset.outTab;}));
  $('[data-copy-letter]', result).addEventListener('click', () => copyText($('[data-out-view=letter]', result).innerText, 'Cover letter copied'));
 });
 if (params.has('job') && EMBED) $('[data-tailor-form]').requestSubmit();
}

// ------------------------------------------------------------------ Career Roadmap
function initRoadmap() {
 const result = $('[data-roadmap-result]');
 $('[data-roadmap-form]').addEventListener('submit', async event => {
  event.preventDefault();
  const now = $('#r-now').value.trim() || 'your field', target = $('#r-target').value.trim();
  result.innerHTML = panel('Roadmap', '<div data-gen></div>');
  await steps(['Reading your resumes', `Mapping ${now} to ${target || 'your next level'}`, 'Building stages and milestones'], $('[data-gen]', result), 380);
  const goal = target || `senior ${now}`;
  const stages = [
   ['0–3 months', 'Strengthen the foundation', [`Write down the outcomes of your current ${now} work`, 'Ask for feedback from your manager and peers', 'Pick one skill gap to close first'], 'A clear picture of where you stand'],
   ['3–9 months', 'Take on visible responsibility', ['Lead one project end to end', 'Mentor a colleague or run a regular session', `Learn the basics of ${goal}`], 'A project you can point to'],
   ['9–18 months', `Step into ${goal}`, ['Update a CVID for the target role and use Job Tailoring', 'Talk to people already in the role', 'Prepare with Interview Prep'], 'Ready to apply for the target role'],
  ];
  result.innerHTML = panel(`Roadmap · ${escapeHTML(now)} → ${escapeHTML(goal)}`, `<div class="stages">${stages.map(([when, title, items, milestone], i) => `<div class="stage fade-in" style="animation-delay:${i * 90}ms"><span class="stage-dot">${i + 1}</span><div class="stage-body"><b>${escapeHTML(title)}</b><span class="label">${when}</span><ul>${items.map(it => `<li>${icon('check', 'i-sm')}${escapeHTML(it)}</li>`).join('')}</ul><p class="small" style="margin-top:8px">Milestone: ${milestone}</p></div></div>`).join('')}</div>
   <div class="row-actions"><button class="btn btn-primary btn-sm" type="button" data-sim="Roadmap saved to your dashboard (simulated)">Save roadmap</button><button class="btn btn-light btn-sm" type="submit" form="roadmap-form">${icon('refresh', 'i-sm')}Regenerate</button></div>`);
 });
 $('[data-roadmap-form]').id = 'roadmap-form';
}

// ------------------------------------------------------------------ Interview Prep
function initInterview() {
 const result = $('[data-interview-result]');
 $('[data-interview-form]').addEventListener('submit', async event => {
  event.preventDefault();
  const role = $('#i-role').value.trim() || 'the role';
  result.innerHTML = panel('Prep material', '<div data-gen></div>');
  await steps(['Reading the role', 'Choosing the topics that matter', 'Writing practice questions'], $('[data-gen]', result), 380);
  const guide = `<div class="result-doc"><h4>What interviewers look for</h4><ul><li>How you frame problems before designing solutions</li><li>Evidence of impact: what changed because of your work</li><li>How you collaborate with engineering and product</li></ul><h4>Prepare</h4><ul><li>Two case studies, each told in about five minutes</li><li>One story about a disagreement and how it was resolved</li><li>Your view of the company’s product: one strength, one opportunity</li></ul></div>`;
  const qs = [['Walk us through a project you’re proud of.', ['The problem and who it affected', 'Your role versus the team’s', 'Decisions and trade-offs', 'The outcome and what you learned']], ['How do you decide what goes into a design system?', ['Signals of real reuse', 'Who owns and reviews additions', 'How you measure adoption']], ['Tell us about a time you disagreed with a product manager.', ['The context and the stakes', 'How you listened and used evidence', 'What you agreed and why']], ['How do you make sure your work is accessible?', ['Standards you follow', 'Where checks happen in your process', 'An example where it changed a design']]];
  const qa = `<div class="acc qa">${qs.map(([q, points], i) => `<details${i === 0 ? ' open' : ''}><summary>${q}<span class="acc-icon" aria-hidden="true"></span></summary><div class="acc-body"><span class="label">A strong answer covers</span><ul style="margin-top:8px;padding-left:18px;list-style:disc">${points.map(p => `<li>${p}</li>`).join('')}</ul></div></details>`).join('')}</div>`;
  const ref = `<div class="result-doc"><h4>STAR, in one line each</h4><ul><li><b>Situation</b>: the context, briefly</li><li><b>Task</b>: what you were responsible for</li><li><b>Action</b>: what you did, and why</li><li><b>Result</b>: what changed. Use [X] if you need to look a number up</li></ul><h4>Questions to ask them</h4><ul><li>What would success look like in the first six months?</li><li>How do design and engineering plan work together?</li></ul></div>`;
  result.innerHTML = panel(`Prep · ${escapeHTML(role)}`, `<div class="seg result-tabs" role="group" aria-label="Section" data-out><button type="button" aria-pressed="true" data-out-tab="guide">Study guide</button><button type="button" aria-pressed="false" data-out-tab="qa">Practice Q&amp;A</button><button type="button" aria-pressed="false" data-out-tab="ref">Quick reference</button></div><div data-out-view="guide">${guide}</div><div data-out-view="qa" hidden>${qa}</div><div data-out-view="ref" hidden>${ref}</div><div class="row-actions"><button class="btn btn-primary btn-sm" type="button" data-sim="Prep saved (simulated)">Save prep</button></div>`);
  onSeg($('[data-out]', result), button => $$('[data-out-view]', result).forEach(v => {v.hidden = v.dataset.outView !== button.dataset.outTab;}));
 });
}

// ------------------------------------------------------------------ Settings, subscription, consent
function initSettings() {
 $('[data-profile-form]').addEventListener('submit', event => {event.preventDefault(); toast('Profile saved');});
}

function initSubscription() {
 const STATES = [
  ['green', 'check', 'Available', 'Your plan is active and every included tool is available.', ''],
  ['amber', 'alert', 'Limit reached', 'You’ve used your <span class="ph">[Feature]</span> allowance for this period. It resets <span class="ph">[Reset period]</span>.', '<a class="btn btn-primary btn-sm" href="../pricing.html">Compare plans</a>'],
  ['', 'lock', 'Upgrade required', '<span class="ph">[Feature]</span> isn’t included in <span class="ph">[Plan name]</span>. <span class="ph">[Approved upgrade message]</span>', '<a class="btn btn-primary btn-sm" href="../pricing.html">See plans</a>'],
  ['amber', 'clock', 'Payment pending', 'Your latest payment hasn’t gone through yet. <span class="ph">[Approved payment message]</span>', '<button class="btn btn-light btn-sm" type="button" data-sim="Payment methods are pending confirmation">Update payment method</button>'],
 ];
 const view = $('[data-member-view]');
 const render = i => {
  const [tone, ic, title, text, action] = STATES[i];
  view.innerHTML = `<div class="member-card fade-in"><div class="h4"><span class="tool-icon ${tone}">${icon(ic, 'i-sm')}</span>${title}</div><p class="body">${text}</p>${action ? `<div class="row-actions" style="margin-top:4px">${action}</div>` : ''}<p class="hint"><span class="pending">Wording to confirm</span> Final wording follows the approved policy.</p></div>`;
 };
 onSeg($('[data-member-state]'), button => render(Number(button.dataset.member)));
 render(0);
}

function initConsent() {
 const box = $('[data-consent]');
 const render = state => {
  const head = `<div class="inst-badge">${icon('building', 'i-sm')}<div><b>Your College</b><span class="small">Placement cell</span></div></div>`;
  if (state === 'granted' || state === 'denied') {
   box.innerHTML = `<div class="panel consent-card fade-in">${head}<span class="tool-icon big ${state === 'granted' ? 'green' : 'amber'}">${icon(state === 'granted' ? 'check' : 'shield', 'i-lg')}</span><h2 class="h3">${state === 'granted' ? 'Access allowed' : 'Access not given'}</h2><p class="body">${state === 'granted' ? 'Your College’s placement officers can now see your primary CVID and readiness. Your analytics and other resumes stay private.' : 'Your College can see that you’re on their roster, but not your resume or CVID.'}</p><div class="row-actions"><button class="btn btn-light btn-sm" type="button" data-consent-set="pending">Change my choice</button><a class="btn btn-ghost btn-sm" href="dashboard.html">Back to dashboard</a></div></div>`;
  } else {
   box.innerHTML = `<div class="panel consent-card fade-in">${head}<h2 class="h3">Your College wants to include your CV-MAKER in placements</h2><p class="body">Placement officers use it to prepare student lists and share shortlists with recruiters.</p>
    <div><span class="label">They will see</span><ul style="margin-top:10px">${['Your name and roll number', 'Your primary live CVID', 'Whether your resume is ready'].map(t => `<li>${icon('check', 'i-sm')}${t}</li>`).join('')}</ul></div>
    <div><span class="label">They won’t see</span><ul style="margin-top:10px">${['Who viewed your resumes, or any analytics', 'Draft resumes and other CVIDs', 'Your account settings'].map(t => `<li class="no">${icon('x', 'i-sm')}${t}</li>`).join('')}</ul></div>
    <p class="hint"><span class="pending">To confirm</span> Consent wording, duration and how to withdraw are pending approval.</p>
    <div class="row-actions"><button class="btn btn-primary" type="button" data-consent-set="granted">Allow access</button><button class="btn btn-light" type="button" data-consent-set="denied">Don’t allow</button></div></div>`;
  }
 };
 box.addEventListener('click', event => {
  const button = event.target.closest('[data-consent-set]');
  if (!button) return;
  store.set('consent', button.dataset.consentSet);
  render(button.dataset.consentSet);
  if (button.dataset.consentSet !== 'pending') toast(button.dataset.consentSet === 'granted' ? 'Access allowed' : 'Choice saved');
 });
 render(store.get('consent', 'pending'));
}

// ------------------------------------------------------------------ Institution placement workspace
const STUDENT_NAMES = ['Aarav Sharma', 'Priya Nair', 'Rohan Mehta', 'Ananya Iyer', 'Karthik Reddy', 'Sneha Patel', 'Vikram Singh', 'Diya Kapoor', 'Arjun Rao', 'Meera Joshi', 'Siddharth Das', 'Kavya Menon', 'Rahul Verma', 'Isha Gupta', 'Aditya Kulkarni', 'Neha Bhat', 'Farhan Ali', 'Pooja Shetty', 'Nikhil Jain', 'Tanvi Desai', 'Manish Pillai', 'Riya Chatterjee', 'Yash Agarwal', 'Zara Khan'];
const DEPTS = {'Computer Science': ['CS', ['Python', 'React', 'SQL', 'Data structures']], Electronics: ['EC', ['Embedded C', 'PCB design', 'MATLAB']], Mechanical: ['ME', ['SolidWorks', 'AutoCAD', 'Thermal design']], 'Business Administration': ['BA', ['Excel', 'Market research', 'Presenting']]};
const STUDENTS = STUDENT_NAMES.map((name, i) => {
 const dept = Object.keys(DEPTS)[i % 4];
 const consent = [5, 13, 19].includes(i) ? 'pending' : [9, 22].includes(i) ? 'denied' : 'granted';
 const readiness = consent !== 'granted' ? null : i % 5 === 3 ? 'none' : i % 4 === 2 ? 'progress' : 'ready';
 const first = name.split(' ')[0].toLowerCase();
 return {id: i, name, initials: name.split(' ').map(p => p[0]).join(''), roll: `22${DEPTS[dept][0]}${String(101 + i)}`, dept, year: i % 3 === 1 ? 2027 : 2026, consent, readiness,
  cvid: readiness === 'ready' && i % 6 !== 0 ? `${first}-${(hash(name) % 1296).toString(36).padStart(2, '0')}${i}` : null,
  updated: `${1 + hash(name) % 9}d ago`, skills: DEPTS[dept][1]};
});
const DEFAULT_SHORTLISTS = [
 {name: 'Contoso · Design interns', ids: [0, 3, 7, 11, 15, 20], created: '12 Oct 2026', expires: dateIn(9), opens: 14, status: 'active', code: 'k7d2m'},
 {name: 'Fabrikam · Graduate engineers', ids: [1, 2, 4, 6, 8, 10, 12, 14, 16, 18], created: '20 Sep 2026', expires: '4 Oct 2026', opens: 31, status: 'expired', code: 'p3x9q'},
];

function initInstitution() {
 const main = $('[data-inst]'), drawer = $('[data-drawer]');
 const selected = new Set();
 const filters = {q: '', dept: '', year: '', consent: '', ready: '', quick: 'all'};
 let shortlists = store.get('shortlists', DEFAULT_SHORTLISTS), importState = 'upload';
 const saveShortlists = () => store.set('shortlists', shortlists);
 const eligible = s => s.consent === 'granted';
 const head = (title, sub, actions = '') => `<div class="page-head"><div><h1 class="ptitle">${title}</h1><p class="psub">${sub}</p></div>${actions ? `<div class="page-actions">${actions}</div>` : ''}</div>`;
 const consentChip = s => s.consent === 'granted' ? '<span class="chip green status-chip">Granted</span>' : s.consent === 'pending' ? '<span class="chip amber status-chip">Invitation pending</span>' : '<span class="chip red status-chip">Not shared</span>';
 const readyLabel = s => !s.readiness ? `<span class="hidden-data">${icon('lock', 'i-sm')}Hidden</span>` : `<span class="ready r-${s.readiness}"><span class="dot"></span>${{ready: 'Ready', progress: 'In progress', none: 'Not started'}[s.readiness]}</span>`;

 // Roster
 const QUICK = {all: () => true, granted: eligible, ready: s => s.readiness === 'ready', live: s => Boolean(s.cvid), pending: s => s.consent === 'pending'};
 const visible = () => STUDENTS.filter(s => QUICK[filters.quick](s)
  && (!filters.q || `${s.name} ${s.roll}`.toLowerCase().includes(filters.q.toLowerCase()))
  && (!filters.dept || s.dept === filters.dept) && (!filters.year || String(s.year) === filters.year)
  && (!filters.consent || s.consent === filters.consent) && (!filters.ready || s.readiness === filters.ready));
 const tableRows = () => {
  const rows = visible();
  if (!rows.length) return `<tr><td colspan="9">${empty('search', 'No students match', 'Try a different search or clear the filters.', '<button class="btn btn-light btn-sm" type="button" data-clear>Clear filters</button>').replace('panel empty', 'empty')}</td></tr>`;
  return rows.map(s => `<tr class="${selected.has(s.id) ? 'sel' : ''}">
   <td><input type="checkbox" data-sel="${s.id}" aria-label="Select ${s.name}" ${selected.has(s.id) ? 'checked' : ''} ${eligible(s) ? '' : `disabled title="Only students who have given consent can be selected"`}></td>
   <td><div class="who"><span class="avatar">${s.initials}</span><div><b>${s.name}</b><span class="small mono">${s.roll}</span></div></div></td>
   <td>${s.dept}</td><td>${s.year}</td><td>${consentChip(s)}</td><td>${readyLabel(s)}</td>
   <td>${s.cvid ? `<span class="mono" style="color:var(--blue)">/cv/${s.cvid}</span>` : s.readiness ? '<span class="small">Not live</span>' : `<span class="hidden-data">${icon('lock', 'i-sm')}${s.consent === 'pending' ? 'Awaiting consent' : 'No consent'}</span>`}</td>
   <td class="small">${s.updated}</td><td><button class="row-btn" type="button" data-open="${s.id}">View</button></td></tr>`).join('');
 };
 const selBar = () => {
  const bar = $('[data-sel-bar]');
  if (!bar) return;
  bar.hidden = !selected.size;
  bar.innerHTML = `<b>${selected.size} selected</b><button class="btn btn-ghost btn-sm" type="button" data-export>${icon('table', 'i-sm')}Export XLSX</button><button class="btn btn-primary btn-sm" type="button" data-shortlist>${icon('link', 'i-sm')}Create shortlist</button><button class="btn btn-ghost btn-sm" type="button" data-clear-sel aria-label="Clear selection">${icon('x', 'i-sm')}</button>`;
 };
 const refreshTable = () => {
  $('[data-tbody]').innerHTML = tableRows();
  const all = $('[data-sel-all]'), ids = visible().filter(eligible).map(s => s.id);
  all.checked = ids.length > 0 && ids.every(id => selected.has(id));
  all.indeterminate = !all.checked && ids.some(id => selected.has(id));
  $('[data-count]').textContent = `${visible().length} of ${STUDENTS.length} students`;
  selBar();
 };
 const option = (value, label, current) => `<option value="${value}"${value === current ? ' selected' : ''}>${label}</option>`;
 const roster = () => {
  const count = key => STUDENTS.filter(QUICK[key]).length;
  const kpi = (key, ic, label, hint) => `<button type="button" aria-pressed="${filters.quick === key}" data-quick="${key}"><span class="small">${icon(ic, 'i-sm')}${label}</span><b>${count(key)}</b><span class="hint">${hint}</span></button>`;
  main.innerHTML = `${head('Placement roster', 'Students who have given consent, their resume readiness and live CVIDs. Details stay hidden until a student consents.', `<a class="btn btn-light" href="#import">${icon('upload', 'i-sm')}Import roster</a><button class="btn btn-primary" type="button" data-sim="Invitations are simulated in this prototype">${icon('send', 'i-sm')}Invite students</button>`)}
   <div class="inst-kpis">${kpi('all', 'users', 'Students', 'On the roster')}${kpi('granted', 'shield', 'Consent given', 'Can be shared')}${kpi('ready', 'check', 'Resume ready', 'Complete resumes')}${kpi('live', 'link', 'Live CVIDs', 'Shareable links')}${kpi('pending', 'mail', 'Invitations pending', 'Awaiting a response')}</div>
   <div class="filters"><label class="search"><span class="sr-only">Search students</span>${icon('search', 'i-sm')}<input class="input" type="search" placeholder="Search name or roll number" value="${escapeHTML(filters.q)}" data-f="q"></label>
    <select class="select" data-f="dept" aria-label="Department">${option('', 'All departments', filters.dept)}${Object.keys(DEPTS).map(d => option(d, d, filters.dept)).join('')}</select>
    <select class="select" data-f="year" aria-label="Graduation year">${option('', 'All years', filters.year)}${option('2026', 'Class of 2026', filters.year)}${option('2027', 'Class of 2027', filters.year)}</select>
    <select class="select" data-f="consent" aria-label="Consent">${option('', 'Any consent', filters.consent)}${option('granted', 'Granted', filters.consent)}${option('pending', 'Invitation pending', filters.consent)}${option('denied', 'Not shared', filters.consent)}</select>
    <select class="select" data-f="ready" aria-label="Readiness">${option('', 'Any readiness', filters.ready)}${option('ready', 'Ready', filters.ready)}${option('progress', 'In progress', filters.ready)}${option('none', 'Not started', filters.ready)}</select>
    <span class="small" data-count style="margin-left:auto"></span></div>
   <div class="table-wrap"><table class="table"><thead><tr><th><input type="checkbox" data-sel-all aria-label="Select all eligible students"></th><th>Student</th><th>Department</th><th>Year</th><th>Consent</th><th>Readiness</th><th>CVID</th><th>Updated</th><th></th></tr></thead><tbody data-tbody></tbody></table></div>
   <div class="sel-bar" data-sel-bar hidden></div>`;
  refreshTable();
 };

 // Shortlists
 const shortlistsView = () => {
  const statusChip = s => s.status === 'active' ? '<span class="chip green status-chip">Active</span>' : s.status === 'revoked' ? '<span class="chip red status-chip">Revoked</span>' : '<span class="chip grey status-chip">Expired</span>';
  main.innerHTML = `${head('Shortlists', 'Time-limited links you share with recruiters. Revoke a link at any time.', `<a class="btn btn-primary" href="#roster">${icon('plus', 'i-sm')}New shortlist from roster</a>`)}
   ${shortlists.length ? `<div class="table-wrap"><table class="table" style="min-width:820px"><thead><tr><th>Shortlist</th><th>Students</th><th>Created</th><th>Expires</th><th>Opens</th><th>Status</th><th></th></tr></thead><tbody>${shortlists.map((s, i) => `<tr><td><b>${escapeHTML(s.name)}</b><div class="mono small">${HOST}/s/${s.code}</div></td><td>${s.ids.length}</td><td>${s.created}</td><td>${s.expires}</td><td>${s.opens}</td><td>${statusChip(s)}</td><td><div class="r-actions" style="justify-content:flex-end">${s.status === 'active' ? `<button class="row-btn" type="button" data-copy-link="https://${HOST}/s/${s.code}">Copy link</button><button class="row-btn" type="button" data-revoke="${i}">Revoke</button>` : ''}</div></td></tr>`).join('')}</tbody></table></div>` : empty('link', 'No shortlists yet', 'Select consented students on the roster to create one.', '<a class="btn btn-primary btn-sm" href="#roster">Go to roster</a>')}
   <p class="hint">${icon('info', 'i-sm')} Opens count how many times a shortlist link was opened. Recruiters are not identified. <span class="pending">To confirm</span> Link access rules are pending.</p>`;
 };

 // Import
 const IMPORT_ROWS = [['Aanya Kumar', 'aanya.k@college.edu', '22CS201', 'Computer Science', '2026', ''], ['Dev Malhotra', 'dev.m@college.edu', '22EC202', 'Electronics', '2026', ''], ['Ishaan Bose', '', '22ME203', 'Mechanical', '2027', 'Email is missing'], ['Lakshmi Iyer', 'lakshmi.i@college.edu', '22BA204', 'Business Administration', '2026', ''], ['Omar Sheikh', 'omar.s@college.edu', '22CS205', 'Computer Science', '2026', ''], ['Pranav Rao', 'pranav.r@college.edu', '22CS205', 'Computer Science', '2026', 'Duplicate roll number'], ['Sana Mirza', 'sana.m@college.edu', '22EC207', 'Electronics', '20277', 'Year must be 4 digits'], ['Tara Menon', 'tara.m@college.edu', '22ME208', 'Mechanical', '2027', '']];
 const importView = () => {
  const ok = IMPORT_ROWS.filter(r => !r[5]).length, bad = IMPORT_ROWS.length - ok;
  const sub = 'Add students with a CSV or XLSX file. Each student gets an invitation and appears as “Invitation pending” until they respond.';
  if (importState === 'done') {
   main.innerHTML = `${head('Import roster', sub)}<div class="panel empty fade-in"><span class="tool-icon big green">${icon('check', 'i-lg')}</span><b>${ok} students imported</b><span class="small">Invitations were sent (simulated). ${bad} rows were skipped; download the error report to fix them.</span><div class="row-actions"><a class="btn btn-primary btn-sm" href="#roster">View roster</a><button class="btn btn-light btn-sm" type="button" data-import-reset>Import another file</button></div></div>`;
   return;
  }
  if (importState === 'preview') {
   main.innerHTML = `${head('Import roster', sub)}
    <div class="import-sum"><span class="chip grey">${icon('file', 'i-sm')}sample-roster.xlsx</span><span class="chip green">${icon('check', 'i-sm')}${ok} ready</span><span class="chip red">${icon('alert', 'i-sm')}${bad} need fixing</span><button class="link" type="button" data-import-reset style="margin-left:auto">Choose another file</button></div>
    <div class="table-wrap"><table class="table validation" style="min-width:860px"><thead><tr><th>Row</th><th>Name</th><th>Email</th><th>Roll no.</th><th>Department</th><th>Year</th><th>Check</th></tr></thead><tbody>${IMPORT_ROWS.map((r, i) => `<tr class="${r[5] ? 'err' : ''}"><td class="mono">${i + 2}</td>${r.slice(0, 5).map((v, c) => `<td class="${(r[5] && ((c === 1 && !v) || (c === 2 && r[5].startsWith('Duplicate')) || (c === 4 && r[5].startsWith('Year')))) ? 'bad' : ''}">${v || '—'}</td>`).join('')}<td>${r[5] ? `<span class="chip red status-chip">${icon('alert', 'i-sm')}${r[5]}</span>` : `<span class="chip green status-chip">${icon('check', 'i-sm')}OK</span>`}</td></tr>`).join('')}</tbody></table></div>
    <div class="row-actions"><button class="btn btn-primary" type="button" data-import-go>Import ${ok} students and send invitations</button><button class="btn btn-light" type="button" data-sim="Error report download is simulated">${icon('download', 'i-sm')}Error report</button></div>`;
   return;
  }
  main.innerHTML = `${head('Import roster', sub)}
   <label class="choice drop" style="max-width:none;justify-items:center;text-align:center;padding:44px" data-roster-drop><input type="file" accept=".csv,.xlsx" hidden data-roster-file><span class="tool-icon big">${icon('upload', 'i-lg')}</span><b>Drop a CSV or XLSX file</b><span class="small">Columns: name, email, roll number, department, graduation year.</span></label>
   <div class="row-actions" style="margin-top:0"><button class="btn btn-light" type="button" data-import-sample>${icon('file', 'i-sm')}Use a sample file</button><button class="btn btn-ghost" type="button" data-sim="Template download is pending">${icon('download', 'i-sm')}Download template</button></div>`;
  $('[data-roster-file]').addEventListener('change', () => {importState = 'preview'; importView();});
 };

 // Officers
 const officersView = () => {
  main.innerHTML = `${head('Placement officers', 'People at Your College who can use this workspace.')}
   <div class="gid-layout">${panel('Team', `<div>${[['PO', 'Placement officer', 'You · placement@college.edu', 'Admin'], ['TC', 'Training coordinator', 'training@college.edu', 'Officer'], ['DL', 'Department lead, Computer Science', 'cs.lead@college.edu', 'Viewer']].map(([init, name, mail, role]) => `<div class="officer"><span class="avatar">${init}</span><div><b>${name}</b><span class="small">${mail}</span></div><span class="chip grey">${role}</span></div>`).join('')}</div><p class="hint" style="margin-top:12px"><span class="pending">To confirm</span> Roles and permissions are pending.</p>`)}
   ${panel('Invite an officer', `<form class="form" data-officer-form><div class="field"><label for="o-mail">Work email</label><input class="input" id="o-mail" type="email" placeholder="name@college.edu" required></div><div class="field"><label for="o-role">Role</label><select class="select" id="o-role"><option>Officer</option><option>Viewer</option><option>Admin</option></select></div><button class="btn btn-primary" type="submit">${icon('send', 'i-sm')}Send invitation</button></form>`)}</div>`;
  $('[data-officer-form]').addEventListener('submit', event => {event.preventDefault(); toast('Invitation sent (simulated)'); event.target.reset();});
 };

 // Tabs
 const TABS = {roster: ['Roster', roster], shortlists: ['Shortlists', shortlistsView], import: ['Import roster', importView], officers: ['Officers', officersView]};
 const route = () => {
  const tab = TABS[location.hash.slice(1)] ? location.hash.slice(1) : 'roster';
  $$('[data-tab]').forEach(a => a.toggleAttribute('aria-current', a.dataset.tab === tab));
  $$('[data-tab]').forEach(a => a.getAttribute('aria-current') === '' && a.setAttribute('aria-current', 'page'));
  $('[data-inst-crumb]').textContent = TABS[tab][0];
  TABS[tab][1]();
  document.body.classList.remove('side-open');
 };
 window.addEventListener('hashchange', () => {route(); window.scrollTo(0, 0);});

 // Drawer
 const closeDrawer = () => {drawer.hidden = true; $('.drawer-scrim')?.remove();};
 const openDrawer = id => {
  const s = STUDENTS[id];
  const scrim = document.createElement('div');
  scrim.className = 'drawer-scrim';
  scrim.addEventListener('click', closeDrawer);
  document.body.append(scrim);
  const facts = `<dl><dt>Roll number</dt><dd class="mono">${s.roll}</dd><dt>Department</dt><dd>${s.dept}</dd><dt>Graduation</dt><dd>${s.year}</dd><dt>Consent</dt><dd>${consentChip(s)}</dd></dl>`;
  let body;
  if (s.consent === 'denied') body = `<div class="notice"><b>${icon('lock', 'i-sm')}Resume not shared</b>${s.name.split(' ')[0]} hasn’t given Your College access to their CV-MAKER. Resume, readiness and CVID stay hidden unless they change their choice.</div>`;
  else if (s.consent === 'pending') body = `<div class="notice amber"><b>${icon('mail', 'i-sm')}Invitation pending</b>An invitation was sent ${s.updated}. Details appear once ${s.name.split(' ')[0]} responds.</div><div class="row-actions"><button class="btn btn-light btn-sm" type="button" data-sim="Invitation resent (simulated)">Resend invitation</button></div>`;
  else body = `<dl><dt>Readiness</dt><dd>${readyLabel(s)}</dd><dt>Updated</dt><dd>${s.updated}</dd></dl>
   ${s.cvid ? `<h3>Live CVID</h3><div class="link-card"><div class="qr" data-drawer-qr></div><div><span class="mono" style="font-size:13px;word-break:break-all">${HOST}/cv/${s.cvid}</span><div class="row-actions"><button class="btn btn-light btn-sm" type="button" data-copy-link="${cvURL(s.cvid)}">${icon('copy', 'i-sm')}Copy link</button></div></div></div>` : `<div class="notice amber"><b>${icon('clock', 'i-sm')}No live CVID yet</b>${s.readiness === 'ready' ? 'The resume is complete but not live.' : 'The resume isn’t complete yet.'}</div>`}
   <h3>Skills</h3><div class="skills-chips">${s.skills.map(k => `<span class="chip grey">${k}</span>`).join('')}</div>
   <div class="row-actions" style="margin-top:20px"><button class="btn btn-primary btn-sm" type="button" data-pick="${s.id}">${selected.has(s.id) ? 'Selected' : 'Select for shortlist'}</button></div>`;
  drawer.innerHTML = `<button class="dialog-close" type="button" data-drawer-close aria-label="Close">${icon('x')}</button><div class="drawer-head"><span class="avatar lg">${s.initials}</span><div><h2>${s.name}</h2><span class="small">${s.dept} · Class of ${s.year}</span></div></div>${facts}${body}`;
  drawer.hidden = false;
  const qr = $('[data-drawer-qr]', drawer);
  if (qr) renderQR(qr, cvURL(s.cvid));
  $('[data-drawer-close]', drawer).focus();
 };
 drawer.addEventListener('click', event => {
  if (event.target.closest('[data-drawer-close]')) closeDrawer();
  const pick = event.target.closest('[data-pick]');
  if (pick) {selected.add(Number(pick.dataset.pick)); pick.textContent = 'Selected'; if ($('[data-tbody]')) refreshTable();}
 });
 document.addEventListener('keydown', event => {if (event.key === 'Escape' && !drawer.hidden) closeDrawer();});

 // Dialogs: export and shortlist
 const exportDialog = () => {
  const dialog = openDialog(`<div data-ex><h2>Export ${selected.size} students</h2><p class="dialog-sub">Only students who have given consent are included.</p>
   <div class="field"><span class="field-label">Columns</span><div class="skills-chips">${['Name', 'Roll number', 'Department', 'Year', 'Readiness', 'CVID link'].map(c => `<label class="chip grey" style="cursor:pointer"><input type="checkbox" class="check" checked> ${c}</label>`).join('')}</div></div>
   <div class="dialog-actions"><button class="btn btn-primary" type="button" data-ex-go>${icon('download', 'i-sm')}Export XLSX</button><button class="btn btn-light" type="button" data-close>Cancel</button></div></div>`);
  $('[data-ex-go]', dialog).addEventListener('click', async () => {
   const box = $('[data-ex]', dialog);
   box.innerHTML = '<h2>Preparing export…</h2><div data-gen style="margin-top:16px"></div>';
   await steps(['Collecting consented students', 'Building the spreadsheet'], $('[data-gen]', box), 380);
   box.innerHTML = `<span class="tool-icon big green">${icon('check', 'i-lg')}</span><h2 style="margin-top:14px">Export ready</h2><p class="dialog-sub">placement-export.xlsx · ${selected.size} students. The file download is simulated in this prototype.</p><div class="dialog-actions"><button class="btn btn-primary" type="button" data-close>Done</button></div>`;
  });
 };
 const shortlistDialog = () => {
  let days = 14;
  const dialog = openDialog(`<form data-sl><h2>Create a shortlist</h2><p class="dialog-sub">${selected.size} students · a private link for one recruiter or company</p>
   <div class="form"><div class="field"><label for="sl-name">Shortlist name</label><input class="input" id="sl-name" value="Shortlist · ${new Date().toLocaleDateString('en-GB', {day: 'numeric', month: 'short'})}" required></div>
   <div class="field"><span class="field-label">Link expires after</span><div class="seg" role="group" aria-label="Expiry" data-days>${[7, 14, 30].map(d => `<button type="button" aria-pressed="${d === days}" data-d="${d}">${d} days</button>`).join('')}</div><span class="hint" data-exp>Expires ${dateIn(days)}</span></div></div>
   <p class="hint" style="margin-top:14px"><span class="pending">To confirm</span> What recruiters can see on a shortlist is pending.</p>
   <div class="dialog-actions"><button class="btn btn-primary" type="submit">${icon('link', 'i-sm')}Create link</button><button class="btn btn-light" type="button" data-close>Cancel</button></div></form>`);
  onSeg($('[data-days]', dialog), button => {days = Number(button.dataset.d); $('[data-exp]', dialog).textContent = `Expires ${dateIn(days)}`;});
  $('[data-sl]', dialog).addEventListener('submit', event => {
   event.preventDefault();
   const entry = {name: $('#sl-name', dialog).value.trim() || 'Shortlist', ids: [...selected], created: dateIn(0), expires: dateIn(days), opens: 0, status: 'active', code: randomCode(5)};
   shortlists = [entry, ...shortlists];
   saveShortlists();
   const url = `https://${HOST}/s/${entry.code}`;
   $('.dialog-inner', dialog).innerHTML = `<span class="tool-icon big green">${icon('check', 'i-lg')}</span><h2 style="margin-top:14px">Shortlist created</h2><p class="dialog-sub">${entry.ids.length} students · expires ${entry.expires}</p><div class="hub-url">${icon('link', 'i-sm')}${short(url)}</div><div class="dialog-actions"><button class="btn btn-primary" type="button" data-copy-link="${url}">${icon('copy', 'i-sm')}Copy link</button><a class="btn btn-light" href="#shortlists" data-close>View shortlists</a></div>`;
   selected.clear();
   if ($('[data-tbody]')) refreshTable();
  });
 };

 // Events inside the workspace
 main.addEventListener('input', event => {
  const key = event.target.dataset.f;
  if (key) {filters[key] = event.target.value; refreshTable();}
 });
 main.addEventListener('change', event => {
  const t = event.target;
  if (t.matches('[data-sel]')) {t.checked ? selected.add(Number(t.dataset.sel)) : selected.delete(Number(t.dataset.sel)); refreshTable();}
  if (t.matches('[data-sel-all]')) {visible().filter(eligible).forEach(s => t.checked ? selected.add(s.id) : selected.delete(s.id)); refreshTable();}
 });
 main.addEventListener('click', event => {
  const t = event.target;
  const quick = t.closest('[data-quick]');
  if (quick) {filters.quick = quick.dataset.quick; pressed(quick.parentElement, quick); refreshTable(); return;}
  if (t.closest('[data-open]')) openDrawer(Number(t.closest('[data-open]').dataset.open));
  if (t.closest('[data-clear]')) {Object.assign(filters, {q: '', dept: '', year: '', consent: '', ready: '', quick: 'all'}); roster();}
  if (t.closest('[data-clear-sel]')) {selected.clear(); refreshTable();}
  if (t.closest('[data-export]')) exportDialog();
  if (t.closest('[data-shortlist]')) shortlistDialog();
  const revoke = t.closest('[data-revoke]');
  if (revoke) {
   const entry = shortlists[Number(revoke.dataset.revoke)];
   const dialog = openDialog(`<h2>Revoke “${escapeHTML(entry.name)}”?</h2><p class="dialog-sub">The link stops working straight away. This can’t be undone.</p><div class="dialog-actions"><button class="btn btn-dark" type="button" data-yes>Revoke link</button><button class="btn btn-light" type="button" data-close>Cancel</button></div>`);
   $('[data-yes]', dialog).addEventListener('click', () => {entry.status = 'revoked'; saveShortlists(); dialog.close(); shortlistsView(); toast('Shortlist link revoked');});
  }
  if (t.closest('[data-import-sample]')) {importState = 'preview'; importView();}
  if (t.closest('[data-import-reset]')) {importState = 'upload'; importView();}
  if (t.closest('[data-import-go]')) {importState = 'done'; importView(); toast('Invitations sent (simulated)');}
 });

 route();
 if (params.has('student')) openDrawer(Number(params.get('student')));
}

// ------------------------------------------------------------------ Start
const SCREENS = {signin: initSignIn, dashboard: initDashboard, gid: initGID, resumes: initResumes, builder: initBuilder, preview: initPreview, analytics: initAnalytics, jobs: initJobs, tailoring: initTailoring, roadmap: initRoadmap, interview: initInterview, settings: initSettings, subscription: initSubscription, consent: initConsent, institution: initInstitution};

document.addEventListener('DOMContentLoaded', () => {
 initShell();
 SCREENS[document.body.dataset.page]?.();
});
