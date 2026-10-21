// Home page, following the redesign brief's section order (section 4) and draft copy.
import { icon, arrowBtn, sitePage, planCards, skyWaves, logoMark } from './shared.mjs';

const GID_URL = 'https://cv-maker.app/id/GID-12345-67890';

const waves = skyWaves;

// Section 2 visual: a static PDF next to the same person's live profile on a laptop.
// Everything sits straight and still; the laptop is drawn in CSS so a supplied device design can replace it.
const showcase = `<div class="showcase reveal" aria-label="A static PDF resume next to a live CV-MAKER profile on a laptop">
  <figure class="sc-side sc-old">
   <div class="paper" aria-hidden="true">
    <div class="paper-file"><span class="file-tag">${icon('pdf', 'i-sm')}PDF</span><span class="mono">alex_morgan_resume_final_v3.pdf</span></div>
    <strong class="paper-name">Alex Morgan</strong>
    <span class="paper-role">Senior Product Designer</span>
    <span class="paper-h">Experience</span>
    <span class="paper-row"><b>Acme Corporation</b><span>2021 – Now</span></span>
    <i></i><i class="short"></i><i></i>
    <span class="paper-h">Education</span>
    <span class="paper-row"><b>State University</b><span>2017</span></span>
    <i class="short"></i>
    <span class="paper-h">Skills</span>
    <i></i><i class="short"></i>
    <span class="paper-foot">${icon('clock', 'i-sm')}Last edited 3 months ago<span class="stamp">Outdated</span></span>
   </div>
   <figcaption><span class="sc-tag">Before</span><strong>A static file</strong><span>Every edit means sending a new PDF. Recruiters keep the old one.</span></figcaption>
  </figure>
  <div class="sc-link" aria-hidden="true"><span class="sc-line"></span><span class="sc-badge">${icon('arrow-right', 'i-sm')}</span><span class="sc-line"></span></div>
  <figure class="sc-side sc-new">
   <div class="laptop" aria-hidden="true">
    <div class="laptop-lid"><span class="laptop-cam"></span>
     <div class="laptop-screen">
      <div class="hub-bar"><span class="hub-dots"><i></i><i></i><i></i></span><span class="hub-url">${icon('lock', 'i-sm')}cv-maker.app/id/GID-12345-67890</span><span class="live-pill">Live</span></div>
      <div class="hub-body">
       <div class="hub-profile">
        <span class="hub-avatar">AM</span>
        <strong class="hub-name">Alex Morgan</strong>
        <span class="hub-role">Senior Product Designer · Acme Corporation</span>
        <span class="hub-gid mono">${icon('fingerprint', 'i-sm')}GID-12345-67890</span>
        <div class="hub-qr qr" data-qr="${GID_URL}"></div>
        <span class="hub-updated">${icon('refresh', 'i-sm')}Updated today</span>
       </div>
       <div class="hub-main">
        <span class="hub-label">Resumes on this identity</span>
        <ul class="hub-cvids">
         <li><span class="hub-doc">${icon('doc', 'i-sm')}</span><span><b>Product Designer</b><em class="mono">/cv/design-a1b2</em></span><span class="hub-tag">Primary</span></li>
         <li><span class="hub-doc">${icon('doc', 'i-sm')}</span><span><b>UX Researcher</b><em class="mono">/cv/research-e5f6</em></span></li>
         <li><span class="hub-doc">${icon('doc', 'i-sm')}</span><span><b>Design Lead</b><em class="mono">/cv/lead-g7h8</em></span></li>
        </ul>
        <div class="hub-stats"><span><b>1,204</b>views</span><span><b>806</b>unique viewers</span><span><b>3</b>live CVIDs</span></div>
        <span class="hub-label">Recent views</span>
        <ul class="hub-views"><li><span>India · Desktop</span><time>2h ago</time></li><li><span>United Kingdom · Mobile</span><time>1d ago</time></li></ul>
       </div>
      </div>
     </div>
    </div>
    <div class="laptop-base"><span class="laptop-notch"></span></div>
   </div>
   <figcaption><span class="sc-tag blue">After</span><strong>One living identity</strong><span>Update once. Everyone with your link sees the latest version.</span></figcaption>
  </figure>
 </div>
 <p class="illustrative">Illustrative example. Views are shown by country and device, never by person.</p>`;

const hero = `<section class="hero sky" aria-labelledby="hero-title">
 <span class="sky-glow" aria-hidden="true"></span><span class="sky-shape" aria-hidden="true"></span>
 ${waves('sky-waves')}
 <div class="container hero-copy">
  <span class="badge reveal">${icon('fingerprint', 'i-sm')}One Global ID · a resume for every role</span>
  <h1 class="h1 reveal" id="hero-title" style="--d:60ms">Your career is <span class="nowrap">bigger <span class="h1-chip" aria-hidden="true">${icon('link')}</span></span> than a resume.</h1>
  <p class="lead reveal" style="--d:120ms">Build a resume, share it as a live link, and bring your professional identity and career tools together in one place.</p>
  <div class="hero-ctas reveal" style="--d:180ms">${arrowBtn('Create your resume', 'app/builder.html', 'btn-primary btn-lg')}<a class="btn btn-light btn-lg" href="#video">Watch how it works</a></div>
 </div>
 <div class="container">${showcase}</div>
</section>`;

// The launch film, right after the hero. It grows to full width as it reaches the middle of the screen.
const film = `<section class="section film" id="video" aria-labelledby="video-title">
 <div class="container section-head center reveal">
  <span class="eyebrow">See it in action</span>
  <h2 class="h2" id="video-title">Watch a resume come alive.</h2>
  <p class="lead">From a static PDF to one living identity: a Global ID, a resume for every role, and a link that always shows your latest work.</p>
 </div>
 <div class="grow" data-grow>
  <div class="grow-frame film-frame">
   <video class="film-video" muted loop playsinline autoplay preload="metadata" poster="assets/livecv-launch-poster.jpg" aria-label="CV-MAKER launch film: why a static resume falls behind, how a Global ID and live CVIDs work, and how to get started" data-film><source src="assets/livecv-launch.mp4" type="video/mp4"></video>
  </div>
 </div>
</section>`;

const problems = [
  ['file', 'Copies go out of date', 'Every edit means rebuilding and resending a file, while the copies people already have stay as they were.'],
  ['layers', 'Your story is scattered', 'Old files, job portals, email attachments and several versions of the same document, with no single source of truth.'],
  ['eye', 'Little visibility', 'Once a file is sent, there is little sign of whether anyone opened it or what happened next.'],
];
const problem = `<section class="section" id="problem" aria-labelledby="problem-title">
 <div class="container">
  <div class="section-head reveal">
   <span class="eyebrow">The problem</span>
   <h2 class="h2" id="problem-title">Your career moves forward. Your resume should too.</h2>
   <div><p class="lead">Career information ends up scattered, and static files stop matching the person who sent them.</p><a class="link" href="#how" style="margin-top:14px">Explore CV-MAKER ${icon('arrow-right', 'i-sm')}</a></div>
  </div>
  <div class="problem-grid">
   ${problems.map(([ic, title, text], i) => `<article class="problem-card reveal" style="--d:${i * 80}ms"><span class="label">0${i + 1}</span><span class="tile-icon">${icon(ic)}</span><h3 class="h4">${title}</h3><p class="small">${text}</p></article>`).join('\n   ')}
  </div>
 </div>
</section>`;

const steps = [
  ['Create or upload', 'Choose the fresher or experienced path, then start from scratch or upload a PDF or Word resume.'],
  ['Refine', 'Edit each section and use the writing assistant to improve, shorten or add metrics.'],
  ['Preview', 'Review the finished resume exactly as it will look.'],
  ['Download a PDF or make it live', 'Export a submission-ready PDF, or publish a CVID: a permanent link with a QR card.'],
  ['Manage identity and tools', 'Connect your resumes to your Global ID and open career tools from one dashboard.'],
];
const stepPanels = [
  `<div class="mini mini-start">
    <div class="seg" aria-hidden="true"><button aria-pressed="false">Fresher</button><button aria-pressed="true">Experienced</button></div>
    <div class="mini-options">
     <div class="mini-option">${icon('file')}<b>Build from scratch</b><span>Guided sections</span></div>
     <div class="mini-option on">${icon('upload')}<b>Upload a resume</b><span>PDF or Word</span><span class="mini-progress"><i></i></span><span class="mini-note">Reading your resume…</span></div>
    </div>
   </div>`,
  `<div class="mini mini-refine">
    <span class="label">Summary</span>
    <p class="mini-text">Product designer with 6 years of experience. <mark>Redesigned onboarding for a fintech app.</mark></p>
    <div class="mini-tools">${['Improve', 'Shorten', 'Elaborate', 'Professional'].map((t) => `<span class="chip grey">${t}</span>`).join('')}<span class="chip">${icon('sparkles', 'i-sm')}Add metrics</span></div>
    <div class="mini-suggest">${icon('sparkles', 'i-sm')}<span>Redesigned onboarding for a fintech app, <b>lifting activation by 18%</b>.</span></div>
   </div>`,
  `<div class="mini mini-preview">
    <div class="mini-doc"><strong>ALEX MORGAN</strong><span>Senior Product Designer · Remote</span><i></i><i></i><i class="s"></i><b>Experience</b><i></i><i></i><i class="s"></i><b>Skills</b><i class="s"></i></div>
    <span class="chip green">${icon('check', 'i-sm')}Ready to share</span>
   </div>`,
  `<div class="mini mini-output">
    <div class="mini-choice">${icon('download')}<b>Download PDF</b><span>A static file for applications</span></div>
    <div class="mini-choice on">${icon('link')}<b>Make it live</b><span>A permanent CVID link</span></div>
    <div class="mini-live"><div class="qr" data-qr="https://cv-maker.app/cv/design-a1b2"></div><div><span class="label">Your CVID</span><b class="mono">cv-maker.app/cv/design-a1b2</b><span class="live-pill">Live</span></div></div>
   </div>`,
  `<div class="mini mini-dash">
    <div class="mini-gid">${icon('fingerprint')}<div><span class="label">Global ID</span><b class="mono">GID-12345-67890</b></div><span class="live-pill">Live</span></div>
    ${['Product Designer', 'UX Researcher', 'Design Lead'].map((r, i) => `<div class="mini-row">${icon('doc', 'i-sm')}<span>${r}</span><span class="chip ${i === 2 ? 'grey' : 'green'}">${i === 2 ? 'Draft' : 'Live'}</span></div>`).join('')}
    <div class="mini-toolrow">${[['target', 'Jobs'], ['wand', 'Tailor'], ['route', 'Roadmap'], ['message', 'Interview']].map(([ic, t]) => `<span>${icon(ic, 'i-sm')}${t}</span>`).join('')}</div>
   </div>`,
];
const how = `<section class="section how" id="how" aria-labelledby="how-title">
 <div class="container">
  <div class="section-head reveal">
   <span class="eyebrow">How CV-MAKER works</span>
   <h2 class="h2" id="how-title">From first draft to a live link, in five steps.</h2>
   <div>${arrowBtn('Start building', 'app/builder.html', 'btn-dark')}</div>
  </div>
  <div class="stepper reveal" data-stepper>
   <div class="stepper-list" role="tablist" aria-label="How CV-MAKER works">
    ${steps.map(([title, text], i) => `<button class="step" type="button" role="tab" id="step-${i + 1}" aria-controls="step-panel-${i + 1}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}"><span class="step-num">${i + 1}</span><span class="step-copy"><b>${title}</b><span>${text}</span></span><span class="step-bar"><i></i></span></button>`).join('\n    ')}
   </div>
   <div class="stepper-stage">
    ${stepPanels.map((panel, i) => `<div class="step-panel" role="tabpanel" id="step-panel-${i + 1}" aria-labelledby="step-${i + 1}"${i === 0 ? '' : ' hidden'}>${panel}</div>`).join('\n    ')}
   </div>
  </div>
 </div>
</section>`;

const cvids = [
  ['Product Designer', 'design-a1b2', 18],
  ['UX Researcher', 'research-e5f6', 11],
  ['Design Lead', 'lead-g7h8', 7],
];
const gid = `<section class="section gid-section" id="gid" aria-labelledby="gid-title">
 <div class="container">
  <div class="section-head center reveal">
   <span class="eyebrow">Global ID and CVIDs</span>
   <h2 class="h2" id="gid-title">One professional identity. Resumes for every direction.</h2>
   <p class="lead">One person has one Global ID. That GID connects to multiple CVIDs, and each CVID is a different resume with its own link and its own job matches.</p>
  </div>
  <div class="gid-map reveal" data-gid-map>
   <svg class="gid-lines" aria-hidden="true"></svg>
   <div class="map-gid card">
    <span class="gid-icon">${icon('fingerprint', 'i-lg')}</span>
    <span class="label">Global ID · your account</span>
    <strong class="mono">GID-12345-67890</strong>
    <span class="small">Your persistent identity and public hub: headline, current role and a chosen primary resume.</span>
   </div>
   <div class="map-cvids">
    ${cvids.map(([role, slug, matches], i) => `<button type="button" class="map-cvid card${i === 0 ? ' on' : ''}" data-map-cvid="${i}"><span class="map-cvid-top"><span class="label">CVID</span><span class="live-pill">Live</span></span><b>${role} resume</b><span class="mono small">cv-maker.app/cv/${slug}</span><span class="map-matches">${icon('target', 'i-sm')}${matches} job matches for this CVID</span></button>`).join('\n    ')}
   </div>
  </div>
  <div class="gid-defs reveal">
   <div><span class="tile-icon">${icon('fingerprint')}</span><b>Global ID</b><p class="small">Account-level. One per person, and it stays with you.</p></div>
   <div><span class="tile-icon">${icon('link')}</span><b>CVID</b><p class="small">A permanent shareable link for one specific resume.</p></div>
   <div><span class="tile-icon">${icon('target')}</span><b>Job matches</b><p class="small">Found for each CVID, not one feed for the whole account.</p></div>
  </div>
  <p class="center-cta reveal"><a class="link" href="features.html#gid">Understand GID and CVID ${icon('arrow-right', 'i-sm')}</a></p>
 </div>
</section>`;

const benefitsList = [
  ['layers', 'Structured resume', 'Guided sections for fresher and experienced paths.'],
  ['download', 'PDF option', 'Download a submission-ready file whenever one is needed.'],
  ['link', 'Live link', 'Share a CVID connected to your latest saved resume.'],
  ['qr', 'QR / share card', 'Hand over your resume in person with a QR card.'],
  ['chart', 'Resume analytics', 'See supported views and activity for each CVID.'],
  ['sparkles', 'Connected career tools', 'Job Discovery, Tailoring, Roadmap and Interview Prep.'],
];
const benefits = `<section class="section benefits" id="benefits" aria-labelledby="benefits-title">
 <div class="container">
  <div class="section-head reveal">
   <span class="eyebrow">Core benefits</span>
   <h2 class="h2" id="benefits-title">Share a link, not just a file.</h2>
   <div><p class="lead">Keep a PDF for applications that need one, and share a live resume everywhere else.</p><a class="link" href="features.html" style="margin-top:14px">Explore features ${icon('arrow-right', 'i-sm')}</a></div>
  </div>
  <div class="benefit-grid">
   ${benefitsList.map(([ic, title, text], i) => `<div class="benefit reveal" style="--d:${i * 50}ms"><span class="tile-icon">${icon(ic)}</span><b>${title}</b><span class="small">${text}</span></div>`).join('\n   ')}
  </div>
 </div>
</section>`;

// Section 7: eight features on a slowly turning ring; the card at the top is described below.
const features = [
  ['builder', 'Resume Builder', 'Build a structured resume through a fresher or experienced path, with a preview that follows every edit.', 'v-builder'],
  ['live-cv', 'Live CV', 'Turn a resume into a CVID: a permanent link and QR card you can share anywhere.', 'v-live'],
  ['gid', 'Global ID', 'Keep one persistent professional identity that connects all of your CVIDs.', 'v-gid'],
  ['analytics', 'Analytics', 'See supported views and activity for each CVID, separate from account totals.', 'v-analytics'],
  ['job-discovery', 'Job Discovery', 'Browse job matches for a specific CVID, with match strength and why each one fits.', 'v-jobs'],
  ['job-tailoring', 'Job Tailoring', 'Paste a job description to get a tailored resume and a matching cover letter.', 'v-tailor'],
  ['career-roadmap', 'Career Roadmap', 'Map a path from your current field toward an optional target field.', 'v-roadmap'],
  ['interview-prep', 'Interview Prep', 'Get a study guide, practice questions and a quick reference for a target role.', 'v-interview'],
];
const visuals = {
  'v-builder': `<div class="v v-builder"><i class="w60"></i><i class="w40"></i><span></span><i></i><i></i><i class="w70"></i><b class="cursor"></b></div>`,
  'v-live': `<div class="v v-live"><div class="qr" data-qr="https://cv-maker.app/cv/design-a1b2"></div><span class="mono">cv/design-a1b2</span></div>`,
  'v-gid': `<div class="v v-gid">${icon('fingerprint', 'i-lg')}<span class="mono">GID-12345</span><span class="v-gid-dots"><i></i><i></i><i></i></span></div>`,
  'v-analytics': `<div class="v v-analytics">${[40, 62, 48, 80, 66, 92, 74].map((h) => `<i style="--h:${h}%"></i>`).join('')}</div>`,
  'v-jobs': `<div class="v v-jobs">${[92, 81, 67].map((m) => `<div><span></span><b style="--m:${m}%"></b><em>${m}%</em></div>`).join('')}</div>`,
  'v-tailor': `<div class="v v-tailor"><span class="v-doc"></span>${icon('arrow-right', 'i-sm')}<span class="v-doc on"></span><span class="v-doc on"></span></div>`,
  'v-roadmap': `<div class="v v-roadmap"><i></i><i></i><i></i><i class="on"></i></div>`,
  'v-interview': `<div class="v v-interview"><span>Q</span><span class="a">A</span><span>Q</span></div>`,
};
const ring = `<section class="section ring-section" id="tools" aria-labelledby="tools-title">
 <div class="ring" data-ring>
  <div class="ring-track" aria-hidden="false">
   ${features.map(([id, title, , v], i) => `<button type="button" class="ring-card" data-ring-card="${i}" aria-label="${title}" style="--i:${i}">${visuals[v]}<b>${title}</b></button>`).join('\n   ')}
  </div>
  <div class="ring-copy container">
   <span class="eyebrow">Career tools</span>
   <h2 class="h2" id="tools-title">More support for every step of your job search.</h2>
   <div class="ring-detail" aria-live="polite">
    ${features.map(([id, title, text], i) => `<div class="ring-info" data-ring-info="${i}"${i === 0 ? '' : ' hidden'}><b>${title}</b><p class="body">${text}</p><a class="link" href="features.html#${id}">View feature ${icon('arrow-right', 'i-sm')}</a></div>`).join('\n    ')}
   </div>
   <div class="ring-controls"><button type="button" class="ring-btn" data-ring-prev aria-label="Previous feature">${icon('chevron-left')}</button><span class="ring-dots">${features.map((_, i) => `<i data-ring-dot="${i}"></i>`).join('')}</span><button type="button" class="ring-btn" data-ring-next aria-label="Next feature">${icon('chevron-right')}</button></div>
  </div>
 </div>
</section>`;

const preview = `<section class="section dark preview" id="preview" aria-labelledby="preview-title">
 <div class="container">
  <div class="section-head reveal">
   <span class="eyebrow">Product preview</span>
   <h2 class="h2" id="preview-title">Explore the workspace.</h2>
   <div><p class="lead">A clickable MVP of the CV-MAKER workspace, filled with sample data. Try the dashboard, the builder and a live CV.</p></div>
  </div>
  <div class="preview-tabs reveal" data-preview>
   <div class="seg seg-dark" role="tablist" aria-label="Workspace screens">
    <button type="button" role="tab" aria-selected="true" data-preview-tab="app/dashboard.html?embed=1">Dashboard</button>
    <button type="button" role="tab" aria-selected="false" data-preview-tab="app/builder.html?embed=1&amp;step=editor">Builder</button>
    <button type="button" role="tab" aria-selected="false" data-preview-tab="app/preview.html?embed=1&amp;live=1">Live CV</button>
   </div>
   <div class="browser">
    <div class="browser-bar"><i></i><i></i><i></i><span class="mono" data-preview-url>app.cv-maker.app/dashboard</span><span class="chip grey">Sample data</span></div>
    <div class="browser-view" data-preview-view><iframe title="CV-MAKER workspace preview" loading="lazy" tabindex="-1" data-src="app/dashboard.html?embed=1"></iframe></div>
   </div>
   <div class="preview-ctas">${arrowBtn('Explore the workspace', 'app/dashboard.html', 'btn-primary btn-lg')}<a class="btn btn-ghost btn-lg" href="app/builder.html">Get started</a></div>
  </div>
 </div>
</section>`;

const pricing = `<section class="section" id="pricing" aria-labelledby="pricing-title">
 <div class="container">
  <div class="section-head reveal">
   <span class="eyebrow">Pricing preview</span>
   <h2 class="h2" id="pricing-title">Plans for every stage of a career.</h2>
   <div><p class="lead">Start with one resume and add live links and career tools as you grow. Names, prices and allowances appear once approved.</p><a class="link" href="pricing.html" style="margin-top:14px">Compare plans ${icon('arrow-right', 'i-sm')}</a></div>
  </div>
  ${planCards([['CVIDs', '[CVID limit]'], ['AI writing', '[AI allowance]'], ['Analytics', '[Analytics access]']])}
 </div>
</section>`;

// Section 10: the brief's FAQ draft. Policy-dependent answers stay marked as pending.
const faqs = [
  ['What is CV-MAKER?', 'CV-MAKER helps you create and manage resumes, share a resume through a live link, maintain a professional identity, and access career tools.'],
  ['What is a Global ID (GID)?', 'Your GID is your persistent professional identity on CV-MAKER. It acts as a hub for the individual resumes linked to your account.'],
  ['What is a CVID?', 'A CVID is a shareable link for one specific resume.'],
  ['Does my Live CV update when I edit it?', 'The live-resume workflow updates the existing CVID when its resume is edited and saved.', 'Visibility conditions to confirm'],
  ['Can I download a PDF?', 'Yes. The resume preview offers a PDF download.'],
  ['Who can see my live resume?', '<span class="ph">[Confirm public visibility, privacy controls and access rules]</span>', 'Pending approval'],
  ['Can I create multiple resumes?', 'Yes. A GID can connect to multiple CVIDs.', 'Plan limits pending', true],
  ['What does Job Tailoring do?', 'It uses a job description to generate a tailored resume version and a matching cover letter.', null, true],
  ['How much does CV-MAKER cost?', '<span class="ph">[Insert approved plan prices and billing periods]</span>', 'Pending approval', true],
  ['What is the difference between a GID and a CVID?', 'The GID represents your overall professional identity; each CVID represents an individual resume, such as one tailored for a particular role.', null, true],
  ['Can I upload an existing resume?', 'Yes. Upload a Word or PDF resume and it is read into the builder. Review the extracted information for accuracy.', null, true],
  ['How does Job Discovery work?', 'Job Discovery matches job listings to a specific resume and shows match strength and an explanation of the match, where available.', null, true],
  ['What do Career Roadmap and Interview Prep provide?', 'Career Roadmap creates a path from a current field toward an optional target field. Interview Prep provides role-specific study material and practice questions and answers.', null, true],
  ['What happens when I reach a usage limit?', '<span class="ph">[Insert approved limit, reset period and available next step]</span>', 'Pending approval', true],
  ['Can I cancel or change my plan?', '<span class="ph">[Insert approved cancellation, renewal and plan-change policy]</span>', 'Pending approval', true],
];
const faq = `<section class="section" id="faq" aria-labelledby="faq-title">
 <div class="container faq-layout">
  <div class="faq-side reveal">
   <span class="eyebrow">FAQs</span>
   <h2 class="h2" id="faq-title">Questions, answered.</h2>
   <p class="body">Draft answers. Anything that depends on privacy, pricing or policy is marked pending until it is approved.</p>
   <button class="btn btn-light" type="button" data-faq-all aria-expanded="false">View all FAQs<span class="btn-arrow">${icon('plus', 'i-sm')}</span></button>
  </div>
  <div class="acc reveal" data-faq>
   ${faqs.map(([q, a, pending, more], i) => `<details${i === 0 ? ' open' : ''}${more ? ' data-more hidden' : ''}><summary>${q}<span class="acc-icon" aria-hidden="true"></span></summary><div class="acc-body">${pending ? `<span class="pending">${pending}</span><br>` : ''}${a}</div></details>`).join('\n   ')}
  </div>
 </div>
</section>`;

const closing = `<section class="section closing" aria-labelledby="closing-title">
 <div class="grow" data-grow>
  <div class="grow-frame closing-panel">
   <span class="closing-glow" aria-hidden="true"></span>
   <h2 class="h2" id="closing-title">Build your next opportunity on a stronger foundation.</h2>
   <p class="lead">Start with a structured resume. Download it as a PDF, or make it live when you're ready.</p>
   ${arrowBtn('Create your resume', 'app/builder.html', 'btn-light btn-lg')}
  </div>
 </div>
 ${waves('sky-waves', '#fff')}
</section>`;

// The logo intro: resumes fly into the CV mark, "CV-MAKER" joins it, and the lockup lands in the header.
const intro = `
<div class="intro" aria-hidden="true">
 <div class="intro-bg"></div>
 <div class="intro-card intro-card-a"><span class="intro-file"><b>PDF</b>resume_v1.pdf</span><strong></strong><em></em><i></i><i></i><i class="short"></i><i></i><i class="short"></i></div>
 <div class="intro-card intro-card-b"><span class="intro-file"><b>PDF</b>resume_final.pdf</span><strong></strong><em></em><i></i><i></i><i class="short"></i><i></i><i class="short"></i></div>
 <div class="intro-logo"><span class="intro-lockup">${logoMark('intro-mark')}<span class="intro-word">CV-MAKER</span></span></div>
</div>`;

export const home = sitePage({
  file: 'index.html',
  title: 'CV-MAKER — Your career is bigger than a resume.',
  description: 'Build a resume, share it as a live link, and bring your professional identity and career tools together in one place.',
  extraHead: `\n  <link rel="stylesheet" href="css/intro.css">\n  <script>if(!matchMedia('(prefers-reduced-motion: reduce)').matches && 'animate' in document.documentElement)document.documentElement.classList.add('intro-playing')</script>`,
  body: `${intro}\n${hero}\n${film}\n${problem}\n${how}\n${gid}\n${benefits}\n${ring}\n${preview}\n${pricing}\n${faq}\n${closing}`,
  scripts: ['js/intro.js'],
});
