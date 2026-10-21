// Workspace MVP pages (dist/app/): a clickable prototype with sample data, following the brief's
// sections 7 and 8. Screens share one app shell; the institution workspace has its own shell.
import { icon, sprite, head, brandLockup } from './shared.mjs';

const ROOT = '../';
const NAV = [
  ['Workspace', [['dashboard', 'Dashboard', 'dashboard'], ['gid', 'Global ID', 'fingerprint'], ['resumes', 'My Resumes', 'doc'], ['analytics', 'Analytics', 'chart']]],
  ['Career tools', [['jobs', 'Job Discovery', 'target'], ['tailoring', 'Job Tailoring', 'wand'], ['roadmap', 'Career Roadmap', 'route'], ['interview', 'Interview Prep', 'message']]],
];
const scripts = `<script src="${ROOT}js/vendor/qrcode.js" defer></script>\n<script src="${ROOT}js/core.js" defer></script>\n<script src="${ROOT}js/app.js" defer></script>`;
const appHead = (title, description) => head({ title: `${title} — CV-MAKER`, description, root: ROOT, css: ['app.css'], extra: `\n  <meta name="robots" content="noindex">\n  <script>if(new URLSearchParams(location.search).has('embed')){document.documentElement.classList.add('embed');const b=document.createElement('base');b.target='_top';document.head.append(b)}</script>` });

const sidebar = (page) => `<aside class="side" id="side" aria-label="Workspace">
  <a class="side-logo" href="dashboard.html" aria-label="CV-MAKER dashboard">${brandLockup()}</a>
  <a class="btn btn-primary side-new" href="builder.html">${icon('plus', 'i-sm')}New resume</a>
  <nav class="side-nav">
   ${NAV.map(([label, items]) => `<span class="label side-label">${label}</span>${items.map(([id, name, ic]) => `<a href="${id}.html"${id === page ? ' aria-current="page"' : ''}>${icon(ic)}${name}</a>`).join('')}`).join('\n   ')}
  </nav>
  <div class="side-foot">
   <a href="settings.html"${page === 'settings' ? ' aria-current="page"' : ''}>${icon('settings')}Profile &amp; settings</a>
   <a href="subscription.html"${page === 'subscription' ? ' aria-current="page"' : ''}>${icon('card')}Subscription</a>
   <a href="${ROOT}index.html">${icon('arrow-left')}Back to website</a>
  </div>
 </aside>`;

const topbar = (crumb) => `<header class="topbar">
   <button class="side-toggle" type="button" aria-label="Open navigation" aria-controls="side" aria-expanded="false">${icon('menu')}</button>
   <nav class="crumbs" aria-label="Breadcrumb"><a href="dashboard.html">${icon('dashboard', 'i-sm')}Dashboard</a>${crumb ? `<span>/</span><b>${crumb}</b>` : ''}</nav>
   <span class="chip grey demo-chip">${icon('info', 'i-sm')}Demo workspace · sample data</span>
   <div class="account">
    <button class="account-btn" type="button" aria-expanded="false" aria-haspopup="menu"><span class="avatar">AM</span><span class="account-name">Alex Morgan</span>${icon('chevron-down', 'i-sm')}</button>
    <div class="account-menu" role="menu" hidden>
     <a role="menuitem" href="settings.html">${icon('user', 'i-sm')}Profile &amp; settings</a>
     <a role="menuitem" href="subscription.html">${icon('card', 'i-sm')}Subscription</a>
     <a role="menuitem" href="index.html">${icon('logout', 'i-sm')}Sign out</a>
    </div>
   </div>
  </header>`;

const shell = ({ page, title, crumb = title, description, body }) => `${appHead(title, description)}
<body class="app" data-page="${page}">
<a class="skip-link" href="#main">Skip to content</a>
${sprite()}
<div class="app-shell">
 ${sidebar(page)}
 <div class="app-main">
  ${topbar(page === 'dashboard' ? '' : crumb)}
  <main class="app-content" id="main">
${body.trim()}
  </main>
 </div>
</div>
<noscript><p class="noscript">The CV-MAKER workspace prototype needs JavaScript.</p></noscript>
${scripts}
</body>
</html>
`;

const pageHead = (title, sub, actions = '') => `<div class="page-head"><div><h1 class="ptitle">${title}</h1>${sub ? `<p class="psub">${sub}</p>` : ''}</div>${actions ? `<div class="page-actions">${actions}</div>` : ''}</div>`;
const panel = (title, body, action = '', cls = '') => `<section class="panel ${cls}"><div class="panel-head"><h2 class="panel-title">${title}</h2>${action}</div>${body}</section>`;
const usage = (label, allowance) => `<p class="usage">${icon('info', 'i-sm')}${label}: <span class="ph">[Usage]</span> of <span class="ph">${allowance}</span> · resets <span class="ph">[Reset period]</span></p>`;
const backLink = `<a class="back" href="dashboard.html">${icon('arrow-left', 'i-sm')}Back to dashboard</a>`;

// ---------------------------------------------------------------- Sign in
const signIn = `${appHead('Sign in', 'Sign in to the CV-MAKER workspace.')}
<body class="auth-page" data-page="signin">
${sprite()}
<main class="auth" id="main">
 <a class="auth-logo" href="${ROOT}index.html" aria-label="CV-MAKER home">${brandLockup()}</a>
 <form class="auth-card" data-signin>
  <h1 class="ptitle">Sign in to CV-MAKER</h1>
  <p class="psub">Pick up where you left off: your Global ID, resumes and career tools.</p>
  <div class="field"><label for="si-email">Email</label><input class="input" id="si-email" type="email" autocomplete="email" placeholder="you@example.com"></div>
  <div class="field"><label for="si-pass">Password</label><input class="input" id="si-pass" type="password" autocomplete="current-password" placeholder="••••••••"></div>
  <button class="btn btn-primary btn-lg" type="submit">Sign in</button>
  <a class="btn btn-light btn-lg" href="dashboard.html">Continue with the demo workspace</a>
  <p class="small center">New to CV-MAKER? <a class="blue" href="builder.html">Create your resume</a></p>
  <p class="small center"><span class="pending">To confirm</span> Sign-in methods and registration rules are pending.</p>
 </form>
 <a class="back" href="${ROOT}index.html">${icon('arrow-left', 'i-sm')}Back to website</a>
</main>
${scripts}
</body>
</html>
`;

// ---------------------------------------------------------------- Dashboard (7.1)
const dashboard = shell({
  page: 'dashboard', title: 'Dashboard', description: 'Your CV-MAKER dashboard.',
  body: `${pageHead('<span data-greeting>Welcome back</span>, Alex', 'Your identity, resumes and career tools in one place.', `<div class="seg" role="group" aria-label="Show as" data-user-state><button type="button" aria-pressed="true" data-state="returning">Returning user</button><button type="button" aria-pressed="false" data-state="new">New user</button></div>`)}
<div data-state-view="returning">
 <div class="welcome panel">
  <div><span class="label">Continue working</span><h2 class="h4" data-continue-title>Design Systems resume</h2><p class="small" data-continue-meta>Draft · edited yesterday</p></div>
  <div class="welcome-actions"><a class="btn btn-primary" href="builder.html?step=editor">${icon('edit', 'i-sm')}Continue editing</a><a class="btn btn-light" href="builder.html">${icon('plus', 'i-sm')}Create a resume</a></div>
 </div>
 <div class="dash-grid">
  ${panel('Global ID', `<div class="gid-tile"><span class="gid-tile-icon">${icon('fingerprint', 'i-lg')}</span><div><b class="mono">GID-12345-67890</b><span class="live-pill">Live</span></div></div>
   <div class="gid-qr-row"><div class="qr" data-qr="https://cv-maker.app/id/GID-12345-67890"></div><p class="small">Your public hub shows your headline, current role and primary resume. Scan the code to open it.</p></div>
   <div class="row-actions"><a class="btn btn-light btn-sm" href="gid.html">Manage</a><button class="btn btn-ghost btn-sm" type="button" data-hub-preview>${icon('eye', 'i-sm')}Preview hub</button><button class="btn btn-ghost btn-sm" type="button" data-copy="https://cv-maker.app/id/GID-12345-67890">${icon('copy', 'i-sm')}Copy link</button></div>`, '', 'span-4')}
  ${panel('My Resumes', `<div class="list" data-resume-summary></div>`, `<a class="link" href="resumes.html">View all ${icon('arrow-right', 'i-sm')}</a>`, 'span-8')}
  ${panel('Analytics · last 30 days', `<div class="stat-row"><div class="stat"><span class="small">Total views</span><b>1,204</b></div><div class="stat"><span class="small">Unique viewers</span><b>806</b></div><div class="stat"><span class="small">Last opened</span><b>2h ago</b></div></div><div class="spark" data-spark></div><p class="hint">Views of all live CVIDs. Unique viewers are counted per device. Viewers are never identified.</p>`, `<a class="link" href="analytics.html">Details ${icon('arrow-right', 'i-sm')}</a>`, 'span-6')}
  ${panel('Career tools', `<div class="tools">${[['jobs', 'target', 'Job Discovery', '18 matches for Product Designer'], ['tailoring', 'wand', 'Job Tailoring', 'Tailor a resume to a job'], ['roadmap', 'route', 'Career Roadmap', 'Plan your next move'], ['interview', 'message', 'Interview Prep', 'Practise for a role']].map(([id, ic, t, d]) => `<a class="tool" href="${id}.html"><span class="tool-icon">${icon(ic)}</span><b>${t}</b><span class="small">${d}</span></a>`).join('')}</div>`, '', 'span-6')}
 </div>
</div>
<div data-state-view="new" hidden>
 <div class="onboard panel">
  <span class="tool-icon big">${icon('sparkles', 'i-lg')}</span>
  <h2 class="h3">Let's build your first resume.</h2>
  <p class="body">Create one from scratch or upload a Word or PDF file. Once it is complete you can download it as a PDF or make it live.</p>
  <div class="welcome-actions"><a class="btn btn-primary btn-lg" href="builder.html">Create a resume</a><a class="btn btn-light btn-lg" href="builder.html?start=upload">${icon('upload', 'i-sm')}Upload a resume</a></div>
  <ol class="unlock">
   <li><span class="unlock-num">1</span><div><b>Complete a resume</b><span class="small">Fresher or experienced path</span></div></li>
   <li><span class="unlock-num">2</span><div><b>Make it live</b><span class="small">Get a CVID link and QR card under your Global ID</span></div></li>
   <li><span class="unlock-num">3</span><div><b>Unlock career tools</b><span class="small">Job Discovery, analytics and tailoring work from a completed resume</span></div></li>
  </ol>
 </div>
</div>`,
});

// ---------------------------------------------------------------- Global ID / Hub (7.3, flow E)
const gid = shell({
  page: 'gid', title: 'Global ID', description: 'Manage your Global ID and public hub.',
  body: `${pageHead('Global ID', 'Your account-level identity. Each CVID sits underneath it.', `<button class="btn btn-light" type="button" data-hub-preview>${icon('eye', 'i-sm')}Preview public hub</button>`)}
<div class="gid-layout">
 ${panel('Hub details', `<form class="form" data-gid-form>
   <div class="field"><label for="g-headline">Headline</label><input class="input" id="g-headline" name="headline" value="Designing calm, useful products"></div>
   <div class="form-2"><div class="field"><label for="g-role">Current role</label><input class="input" id="g-role" name="role" value="Senior Product Designer"></div><div class="field"><label for="g-company">Current company</label><input class="input" id="g-company" name="company" value="Acme Corporation"></div></div>
   <div class="field"><label for="g-primary">Primary resume</label><select class="select" id="g-primary" name="primary"><option value="design">Product Designer · cv-maker.app/cv/design-a1b2</option><option value="research">UX Researcher · cv-maker.app/cv/research-e5f6</option></select><span class="hint">Only live resumes can be the primary resume on your hub.</span></div>
   <div class="form-foot"><button class="btn btn-primary" type="submit">Save changes</button><span class="hint" data-saved></span></div>
  </form>`)}
 <div class="stack">
  ${panel('Public link', `<div class="link-card"><div class="qr" data-qr="https://cv-maker.app/id/GID-12345-67890"></div><div><span class="label">Your hub</span><b class="mono">cv-maker.app/id/GID-12345-67890</b><span class="live-pill">Live</span><div class="row-actions"><button class="btn btn-primary btn-sm" type="button" data-copy="https://cv-maker.app/id/GID-12345-67890">${icon('copy', 'i-sm')}Copy link</button><button class="btn btn-light btn-sm" type="button" data-share="https://cv-maker.app/id/GID-12345-67890">${icon('share', 'i-sm')}Share card</button></div></div></div><p class="hint"><span class="pending">To confirm</span> Who can see the hub and whether it is indexed by search engines is pending.</p>`)}
  ${panel('How GID and CVIDs connect', `<div class="tree"><div class="tree-root">${icon('fingerprint')}<b class="mono">GID-12345-67890</b><span class="small">Account level</span></div><ul class="tree-kids" data-gid-tree></ul></div>`)}
 </div>
</div>`,
});

// ---------------------------------------------------------------- My Resumes (7.2)
const resumes = shell({
  page: 'resumes', title: 'My Resumes', description: 'Manage your resumes and CVIDs.',
  body: `${pageHead('My Resumes', 'Every resume can become its own CVID under your Global ID.', `<a class="btn btn-primary" href="builder.html">${icon('plus', 'i-sm')}New resume</a>`)}
<div class="banner">${icon('fingerprint', 'i-sm')}<span>All resumes are connected to <b class="mono">GID-12345-67890</b>. Live resumes have their own CVID link.</span></div>
<div class="toolbar"><div class="seg" role="group" aria-label="Filter" data-resume-filter><button type="button" aria-pressed="true" data-filter="all">All</button><button type="button" aria-pressed="false" data-filter="live">Live</button><button type="button" aria-pressed="false" data-filter="draft">Draft</button></div><div class="seg" role="group" aria-label="Demo state" data-demo-state><button type="button" aria-pressed="true" data-demo="list">With resumes</button><button type="button" aria-pressed="false" data-demo="empty">Empty state</button></div></div>
<div class="resume-list" data-resume-list aria-live="polite"></div>`,
});

// ---------------------------------------------------------------- Builder (flows A and B)
const sections = ['contact', 'summary', 'experience', 'education', 'projects', 'skills'];
const builder = shell({
  page: 'builder', title: 'Resume Builder', crumb: 'Resume Builder', description: 'Create or upload a resume.',
  body: `<div class="builder" data-builder>
 <ol class="flow-steps" aria-label="Progress">${['Path', 'Start', 'Edit', 'Preview'].map((s, i) => `<li data-flow-step="${i}"><span>${i + 1}</span>${s}</li>`).join('')}</ol>
 <section class="b-step" data-step="path">
  ${pageHead('Which path fits you?', 'We adjust the sections and guidance to where you are in your career.')}
  <div class="choice-grid">
   <button class="choice" type="button" data-path="fresher"><span class="tool-icon big">${icon('graduation', 'i-lg')}</span><b>Fresher</b><span class="small">Students and recent graduates. Projects, education and skills come first.</span></button>
   <button class="choice" type="button" data-path="experienced"><span class="tool-icon big">${icon('briefcase', 'i-lg')}</span><b>Experienced</b><span class="small">Working professionals. Experience and results come first.</span></button>
  </div>
 </section>
 <section class="b-step" data-step="start" hidden>
  ${pageHead('How would you like to start?', 'You can review and change everything afterwards.')}
  <div class="choice-grid">
   <button class="choice" type="button" data-start="scratch"><span class="tool-icon big">${icon('file', 'i-lg')}</span><b>Build from scratch</b><span class="small">Guided sections with examples.</span></button>
   <label class="choice drop" data-drop><input type="file" accept=".pdf,.doc,.docx" hidden data-upload><span class="tool-icon big">${icon('upload', 'i-lg')}</span><b>Upload a resume</b><span class="small">Drop a PDF or Word file, or choose one. We read it into the builder.</span></label>
  </div>
  <button class="link sample-file" type="button" data-sample-upload>${icon('file', 'i-sm')}No file handy? Try a sample resume</button>
  <div class="parse panel" data-parse hidden>
   <div class="parse-row">${icon('file')}<b data-parse-name>resume.pdf</b><span class="small" data-parse-state>Reading your resume…</span></div>
   <div class="bar"><i data-parse-bar></i></div>
   <p class="small" data-parse-note>Extracting contact details, experience, education and skills.</p>
  </div>
  <button class="back" type="button" data-to="path">${icon('arrow-left', 'i-sm')}Change path</button>
 </section>
 <section class="b-step" data-step="editor" hidden>
  <div class="editor-head">
   <div><h1 class="ptitle" data-editor-title>Product Designer resume</h1><p class="psub"><span class="chip grey" data-path-chip>Experienced path</span> <span class="hint" data-save-state>All changes saved</span></p></div>
   <div class="page-actions"><a class="btn btn-light" href="dashboard.html">Save &amp; exit</a><a class="btn btn-primary" href="preview.html">Preview ${icon('arrow-right', 'i-sm')}</a></div>
  </div>
  <div class="parsed banner" data-parsed hidden>${icon('check', 'i-sm')}<span>We read <b data-parsed-name></b>. Please review each section: extracted details can contain mistakes.</span></div>
  <div class="editor">
   <nav class="sec-nav" aria-label="Sections" data-sec-nav>${sections.map((s, i) => `<button type="button" data-sec="${s}"${i === 0 ? ' aria-current="true"' : ''}><span class="sec-dot"></span>${s[0].toUpperCase() + s.slice(1)}</button>`).join('')}</nav>
   <div class="sec-form panel" data-sec-form></div>
   <div class="live-preview"><div class="preview-label"><span class="label">Live preview</span><span class="live-pill">Updating</span></div><div class="resume-doc small-doc" data-resume-doc></div></div>
  </div>
 </section>
</div>`,
});

// ---------------------------------------------------------------- Preview (flow C)
const preview = shell({
  page: 'preview', title: 'Preview', crumb: 'Preview', description: 'Preview your resume and choose PDF or live.',
  body: `${pageHead('Preview', 'Check your resume, then download a PDF or make it live.', `<a class="btn btn-light" href="builder.html?step=editor">${icon('edit', 'i-sm')}Edit</a>`)}
<div class="preview-layout">
 <div class="paper"><div class="resume-doc" data-resume-doc></div></div>
 <aside class="stack">
  <div class="live-state panel" data-live-state hidden><span class="live-pill">Live</span><div class="link-card"><div class="qr" data-live-qr></div><div><span class="label">Your CVID</span><b class="mono" data-live-url></b><div class="row-actions"><button class="btn btn-primary btn-sm" type="button" data-live-copy>${icon('copy', 'i-sm')}Copy link</button><a class="btn btn-light btn-sm" href="gid.html">Global ID</a></div></div></div><p class="hint">Edits you save update this link.</p></div>
  ${panel('Choose your output', `<div class="output">
    <button class="out-card" type="button" data-pdf><span class="tool-icon">${icon('download')}</span><span><b>Download PDF</b><span class="small">A static, submission-ready file.</span></span></button>
    <button class="out-card primary" type="button" data-make-live><span class="tool-icon">${icon('link')}</span><span><b>Make it live</b><span class="small">A permanent CVID link and QR card.</span></span></button>
   </div>`)}
  ${backLink}
 </aside>
</div>`,
});

// ---------------------------------------------------------------- Analytics (7.4)
const analytics = shell({
  page: 'analytics', title: 'Analytics', description: 'Views and activity for your live resumes.',
  body: `${pageHead('Analytics', 'Account totals and per-CVID activity, kept separate.', `<div class="seg" role="group" aria-label="Timeframe" data-range><button type="button" aria-pressed="false" data-days="7">7 days</button><button type="button" aria-pressed="true" data-days="30">30 days</button><button type="button" aria-pressed="false" data-days="90">90 days</button></div>`)}
<div class="scope" role="group" aria-label="Scope" data-scope></div>
<div data-analytics aria-live="polite"></div>
<p class="hint defs">${icon('info', 'i-sm')}<b>Views</b>: times a CVID link was opened. <b>Unique viewers</b>: distinct devices. <b>Last opened</b>: most recent view. Countries and devices come from approximate, anonymous data. CV-MAKER never shows who a viewer is. <span class="pending">Definitions to confirm</span></p>`,
});

// ---------------------------------------------------------------- Job Discovery (flow F)
const jobs = shell({
  page: 'jobs', title: 'Job Discovery', description: 'Job matches for each CVID.',
  body: `${pageHead('Job Discovery', 'Matches are found for one CVID at a time, never for the whole account.', `<div class="seg" role="group" aria-label="Demo state" data-job-demo><button type="button" aria-pressed="true" data-demo="results">Matches</button><button type="button" aria-pressed="false" data-demo="none">No matches</button><button type="button" aria-pressed="false" data-demo="error">Error</button></div>`)}
<div class="scope" role="group" aria-label="Resume" data-job-scope></div>
<div data-jobs aria-live="polite"></div>
<p class="hint">${icon('info', 'i-sm')}<span class="pending">To confirm</span> Listing source, refresh frequency, coverage and apply behaviour are pending.</p>`,
});

// ---------------------------------------------------------------- Job Tailoring (flow G)
const tailoring = shell({
  page: 'tailoring', title: 'Job Tailoring', description: 'Tailor a resume and cover letter to a job.',
  body: `${pageHead('Job Tailoring', 'Paste a job description to generate a tailored resume and a matching cover letter.', `<div class="seg" role="group" aria-label="Demo state" data-limit-demo><button type="button" aria-pressed="true" data-limit="ok">Available</button><button type="button" aria-pressed="false" data-limit="reached">Limit reached</button></div>`)}
${usage('Tailorings used', '[Tailoring allowance]')}
<div data-limit-view="ok">
 <div class="tool-layout">
  ${panel('Job description', `<form class="form" data-tailor-form>
    <div class="field"><label for="t-base">Start from</label><select class="select" id="t-base"><option>Product Designer resume</option><option>UX Researcher resume</option></select></div>
    <div class="field"><label for="t-jd">Job description</label><textarea class="textarea" id="t-jd" rows="9" placeholder="Paste the job description here" required></textarea><button class="link sample" type="button" data-sample-jd>Use a sample job description</button></div>
    <button class="btn btn-primary" type="submit">${icon('sparkles', 'i-sm')}Generate</button>
   </form>`)}
  <div data-tailor-result>${panel('Result', `<div class="empty small-empty"><span class="tool-icon big">${icon('wand', 'i-lg')}</span><b>Your tailored resume and cover letter appear here</b><span class="small">Nothing is saved until you choose to.</span></div>`)}</div>
 </div>
</div>
<div data-limit-view="reached" hidden>
 <div class="limit panel"><span class="tool-icon big amber">${icon('alert', 'i-lg')}</span><h2 class="h4">You've used your Job Tailoring allowance</h2><p class="body">Your plan includes <span class="ph">[Tailoring allowance]</span>, which resets <span class="ph">[Reset period]</span>. <span class="ph">[Approved next step]</span></p><div class="row-actions"><a class="btn btn-primary" href="${ROOT}pricing.html">Compare plans</a><a class="btn btn-light" href="dashboard.html">Back to dashboard</a></div></div>
</div>`,
});

// ---------------------------------------------------------------- Career Roadmap (flow H)
const roadmap = shell({
  page: 'roadmap', title: 'Career Roadmap', description: 'Plan a path from your current field to a target field.',
  body: `${pageHead('Career Roadmap', 'A path from your current field toward an optional target field.')}
${usage('Roadmaps used', '[Roadmap allowance]')}
<div class="tool-layout">
 ${panel('Your direction', `<form class="form" data-roadmap-form>
   <div class="field"><label for="r-now">Current field</label><input class="input" id="r-now" value="Product design" required></div>
   <div class="field"><label for="r-target">Target field <span class="hint">(optional)</span></label><input class="input" id="r-target" value="Design leadership"></div>
   <button class="btn btn-primary" type="submit">${icon('sparkles', 'i-sm')}Generate roadmap</button>
  </form>`)}
 <div data-roadmap-result>${panel('Roadmap', `<div class="empty small-empty"><span class="tool-icon big">${icon('route', 'i-lg')}</span><b>Your roadmap appears here</b><span class="small">Stages, skills to build and milestones.</span></div>`)}</div>
</div>
${backLink}`,
});

// ---------------------------------------------------------------- Interview Prep (flow H)
const interview = shell({
  page: 'interview', title: 'Interview Prep', description: 'Study material and practice questions for a target role.',
  body: `${pageHead('Interview Prep', 'A study guide, practice questions and a quick reference for a target role.')}
${usage('Prep sessions used', '[Interview prep allowance]')}
<div class="tool-layout">
 ${panel('Target role', `<form class="form" data-interview-form>
   <div class="field"><label for="i-role">Role</label><input class="input" id="i-role" value="Senior Product Designer" required></div>
   <div class="field"><label for="i-level">Seniority</label><select class="select" id="i-level"><option>Senior</option><option>Mid-level</option><option>Lead</option></select></div>
   <button class="btn btn-primary" type="submit">${icon('sparkles', 'i-sm')}Generate prep</button>
  </form>`)}
 <div data-interview-result>${panel('Prep material', `<div class="empty small-empty"><span class="tool-icon big">${icon('message', 'i-lg')}</span><b>Your prep material appears here</b><span class="small">Study guide, practice Q&amp;A and quick reference.</span></div>`)}</div>
</div>
${backLink}`,
});

// ---------------------------------------------------------------- Account (7.5)
const settings = shell({
  page: 'settings', title: 'Profile & settings', description: 'Account details and controls.',
  body: `${pageHead('Profile &amp; settings', 'Account details and implemented account controls.')}
<div class="gid-layout">
 ${panel('Profile', `<form class="form" data-profile-form>
   <div class="form-2"><div class="field"><label for="p-name">Full name</label><input class="input" id="p-name" value="Alex Morgan"></div><div class="field"><label for="p-email">Email</label><input class="input" id="p-email" type="email" value="alex.morgan@email.com"></div></div>
   <div class="field"><label for="p-loc">Location</label><input class="input" id="p-loc" value="Remote"></div>
   <div class="form-foot"><button class="btn btn-primary" type="submit">Save profile</button></div>
  </form>`)}
 <div class="stack">
  ${panel('Security &amp; privacy', `<ul class="settings-list"><li><span>${icon('lock', 'i-sm')}Password and sign-in methods</span><span class="pending">To confirm</span></li><li><span>${icon('shield', 'i-sm')}Two-step verification</span><span class="pending">To confirm</span></li><li><span>${icon('eye', 'i-sm')}Public visibility of GID and CVIDs</span><span class="pending">To confirm</span></li><li><span>${icon('building', 'i-sm')}Institution access and consent</span><a class="link" href="consent.html">Review</a></li></ul>`)}
  ${panel('Subscription', `<p class="body">Plan <span class="ph">[Plan name]</span></p><a class="link" href="subscription.html">Manage subscription ${icon('arrow-right', 'i-sm')}</a>`)}
 </div>
</div>`,
});

const consent = shell({
  page: 'consent', title: 'Institution access', crumb: 'Institution access', description: 'Choose whether your college can see your CV-MAKER.',
  body: `${pageHead('Institution access', 'You decide whether a college placement cell can see your resume.')}
<div data-consent aria-live="polite"></div>
${backLink}`,
});

const subscription = shell({
  page: 'subscription', title: 'Subscription', description: 'Plan and usage.',
  body: `${pageHead('Subscription', 'Your plan and usage. Shown once billing data is available.')}
<div class="gid-layout">
 ${panel('Current plan', `<div class="plan-now on-dark"><span class="ph">[Plan name]</span><b><span class="ph">[Price]</span> / <span class="ph">[Billing period]</span></b><span class="small">Renews <span class="ph">[Renewal date]</span></span></div><div class="usage-list">${[['CVIDs', '[CVID limit]'], ['AI writing', '[AI allowance]'], ['Job Tailoring', '[Tailoring allowance]'], ['Career Roadmap', '[Roadmap allowance]'], ['Interview Prep', '[Interview prep allowance]']].map(([k, v]) => `<div><span>${k}</span><span class="bar"><i style="width:40%"></i></span><span class="ph">${v}</span></div>`).join('')}</div><a class="btn btn-light" href="${ROOT}pricing.html">Compare plans</a>`)}
 ${panel('Membership states', `<div class="seg" role="group" aria-label="State" data-member-state>${['Available', 'Limit reached', 'Upgrade required', 'Payment pending'].map((s, i) => `<button type="button" aria-pressed="${i === 0}" data-member="${i}">${s}</button>`).join('')}</div><div class="member-view" data-member-view></div>`)}
</div>`,
});

// ---------------------------------------------------------------- Institution workspace (7.6, flows J–L)
const institution = `${appHead('Placement workspace', 'Institution placement workspace.')}
<body class="app inst" data-page="institution">
<a class="skip-link" href="#main">Skip to content</a>
${sprite()}
<div class="app-shell">
 <aside class="side" id="side" aria-label="Placement workspace">
  <a class="side-logo" href="institution.html" aria-label="CV-MAKER placement workspace">${brandLockup()}</a>
  <div class="inst-badge">${icon('building', 'i-sm')}<div><b>Your College</b><span class="small">Placement workspace</span></div></div>
  <nav class="side-nav" data-inst-nav>
   <span class="label side-label">Placement</span>
   <a href="#roster" aria-current="page" data-tab="roster">${icon('users')}Roster</a>
   <a href="#shortlists" data-tab="shortlists">${icon('link')}Shortlists</a>
   <a href="#import" data-tab="import">${icon('upload')}Import roster</a>
   <a href="#officers" data-tab="officers">${icon('user')}Officers</a>
  </nav>
  <div class="side-foot">
   <a href="consent.html">${icon('shield')}Student consent view</a>
   <a href="${ROOT}for-institutions.html">${icon('arrow-left')}Back to website</a>
  </div>
 </aside>
 <div class="app-main">
  <header class="topbar">
   <button class="side-toggle" type="button" aria-label="Open navigation" aria-controls="side" aria-expanded="false">${icon('menu')}</button>
   <nav class="crumbs" aria-label="Breadcrumb"><a href="institution.html">${icon('building', 'i-sm')}Placement workspace</a><span>/</span><b data-inst-crumb>Roster</b></nav>
   <span class="chip grey demo-chip">${icon('info', 'i-sm')}Demo · sample students</span>
   <div class="account"><button class="account-btn" type="button" aria-expanded="false" aria-haspopup="menu"><span class="avatar">PO</span><span class="account-name">Placement officer</span>${icon('chevron-down', 'i-sm')}</button><div class="account-menu" role="menu" hidden><a role="menuitem" href="index.html">${icon('logout', 'i-sm')}Sign out</a></div></div>
  </header>
  <main class="app-content" id="main" data-inst></main>
 </div>
</div>
<aside class="drawer" data-drawer hidden aria-label="Student details"></aside>
${scripts}
</body>
</html>
`;

export const appPages = {
  'index.html': signIn,
  'dashboard.html': dashboard,
  'gid.html': gid,
  'resumes.html': resumes,
  'builder.html': builder,
  'preview.html': preview,
  'analytics.html': analytics,
  'jobs.html': jobs,
  'tailoring.html': tailoring,
  'roadmap.html': roadmap,
  'interview.html': interview,
  'settings.html': settings,
  'subscription.html': subscription,
  'consent.html': consent,
  'institution.html': institution,
};
