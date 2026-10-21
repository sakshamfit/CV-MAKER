// Features, Pricing, About Us, Contact and For Institutions pages, following the redesign brief.
import { icon, arrowBtn, sitePage, planCards, skyBackdrop } from './shared.mjs';

const pageHero = ({ eyebrow, title, lead, extra = '' }) => `<section class="page-hero sky" aria-labelledby="page-title">
 ${skyBackdrop()}
 <div class="container">
  <span class="eyebrow reveal">${eyebrow}</span>
  <h1 class="h1 reveal" id="page-title" style="--d:60ms">${title}</h1>
  <p class="lead reveal" style="--d:120ms">${lead}</p>${extra}
 </div>
</section>`;

const closing = (title, lead, cta = arrowBtn('Create your resume', 'app/builder.html', 'btn-light btn-lg')) => `<section class="section closing">
 <div class="container"><div class="closing-panel reveal"><span class="closing-glow" aria-hidden="true"></span><h2 class="h2">${title}</h2><p class="lead">${lead}</p>${cta}</div></div>
</section>`;

const acc = (items) => `<div class="acc">
   ${items.map(([q, a, pending], i) => `<details${i === 0 ? ' open' : ''}><summary>${q}<span class="acc-icon" aria-hidden="true"></span></summary><div class="acc-body">${pending ? `<span class="pending">${pending}</span><br>` : ''}${a}</div></details>`).join('\n   ')}
  </div>`;

// ---------------------------------------------------------------- Features (brief section 5)
const featureList = [
  ['build', 'builder', 'layers', 'Resume Builder & Live Preview', 'A structured resume builder with fresher and experienced paths, and a preview that reflects every edit.', 'Build a resume', 'app/builder.html'],
  ['build', 'upload', 'upload', 'Resume Upload & Parsing', 'Upload a Word or PDF resume and review the extracted content in the builder before you continue.', 'Upload a resume', 'app/builder.html?start=upload'],
  ['build', 'assistant', 'sparkles', 'Writing Assistant', 'Improve, Shorten, Elaborate, Professional and Add Metrics, plus spelling checks and guided starting points where implemented.', 'Improve my resume', 'app/builder.html?step=editor'],
  ['build', 'pdf', 'download', 'PDF Export', 'Download a submission-ready static file whenever an application needs one.', 'Preview a resume', 'app/preview.html'],
  ['share', 'live-cv', 'link', 'Live CV / CVID', 'Create a shareable live link with a QR share card. Editing and saving the resume updates the existing link.', 'Make it live', 'app/preview.html?make=live'],
  ['share', 'gid', 'fingerprint', 'Global ID', 'Maintain one persistent identity and public hub, linked to multiple CVIDs.', 'Explore GID', 'app/gid.html'],
  ['share', 'analytics', 'chart', 'Resume Analytics', 'See available views and supported country, device and activity metrics for each CVID.', 'View analytics', 'app/analytics.html'],
  ['tools', 'job-discovery', 'target', 'Job Discovery', 'See matching jobs for an individual CVID, with match strength and an explanation of why each one matches.', 'Find matching jobs', 'app/jobs.html'],
  ['tools', 'job-tailoring', 'wand', 'Job Tailoring', 'Use a job description to create a tailored resume version and a matching cover letter.', 'Tailor my resume', 'app/tailoring.html'],
  ['tools', 'career-roadmap', 'route', 'Career Roadmap', 'Generate a path from your current field toward an optional target field.', 'Plan my career', 'app/roadmap.html'],
  ['tools', 'interview-prep', 'message', 'Interview Prep', 'Generate a study guide, practice questions and answers, and a quick reference sheet for a target role.', 'Prepare for an interview', 'app/interview.html'],
  ['institutions', 'institutions', 'building', 'CV-MAKER For Institutions', 'A dedicated placement workspace: import a roster, invite students, track activation and consent, review readiness, filter, export XLSX and share time-limited recruiter shortlists. Students control whether their resume is visible.', 'Request an institutional demo', 'for-institutions.html#demo'],
];
const groupNames = { build: 'Build', share: 'Share', tools: 'Career tools', institutions: 'Institutions' };
export const features = sitePage({
  file: 'features.html',
  title: 'Features — CV-MAKER',
  description: 'Build, share and grow with CV-MAKER: resume builder, upload and parsing, writing assistant, PDF export, live CVIDs, Global ID, analytics and career tools.',
  body: `${pageHero({
    eyebrow: 'Features',
    title: 'Everything your resume needs, in one place.',
    lead: 'Build a structured resume, share it as a live link under one Global ID, and use career tools built around each resume.',
    extra: `\n  <div class="seg feature-filter reveal" role="group" aria-label="Filter features" style="--d:180ms" data-filter>
   <button type="button" aria-pressed="true" data-filter-group="all">All</button>${Object.entries(groupNames).map(([key, name]) => `<button type="button" aria-pressed="false" data-filter-group="${key}">${name}</button>`).join('')}
  </div>`,
  })}
<section class="section section-tight" aria-label="Features">
 <div class="container">
  <div class="feature-grid">
   ${featureList.map(([group, id, ic, title, text, cta, href]) => `<article class="feature-card reveal${group === 'institutions' ? ' accent' : ''}" id="${id}" data-group="${group}"><div class="feature-top"><span class="tile-icon">${icon(ic)}</span><span class="label">${groupNames[group]}</span></div><h2 class="h4">${title}</h2><p class="small">${text}</p>${id === 'assistant' ? `<div class="chip-row">${['Improve', 'Shorten', 'Elaborate', 'Professional', 'Add metrics'].map((t) => `<span class="chip grey">${t}</span>`).join('')}</div>` : ''}<a class="link" href="${href}">${cta} ${icon('arrow-right', 'i-sm')}</a></article>`).join('\n   ')}
  </div>
 </div>
</section>
${closing('Start with your resume. Grow from there.', 'Build it once, download a PDF when you need one, and make it live when you are ready.')}`,
});

// ---------------------------------------------------------------- Pricing (brief section 6)
// Every name, price, allowance and term stays a placeholder until the business owner approves it.
const resets = 'Resets every <span class="ph">[Reset period]</span>';
const compareGroups = [
  ['layers', 'Resumes and sharing', [
    ['CVID allowance', '[CVID limit]', 'Live resumes you can publish'],
    ['Resume builder', '[Included / not included]'],
    ['PDF export', '[Included / not included]'],
    ['Global ID and public hub', '[Included / not included]'],
    ['Resume analytics', '[Analytics access]', 'Which metrics are included'],
  ]],
  ['sparkles', 'AI career tools', [
    ['AI writing assistance', '[AI allowance]', resets],
    ['Job Tailoring', '[Tailoring allowance]', resets],
    ['Career Roadmap', '[Roadmap allowance]', resets],
    ['Interview Prep', '[Interview prep allowance]', resets],
  ]],
  ['card', 'Billing', [
    ['Renewal and cancellation', '[Billing terms]'],
    ['Refunds', '[Refund policy / link]'],
    ['Original or promotional price', '[Optional original price]', 'Shown only for a real, approved offer'],
  ]],
];
const pricingFaqs = [
  ['How often am I billed?', '<span class="ph">[Monthly / annual / lifetime / other]</span>', 'Pending approval'],
  ['Does my plan renew automatically?', '<span class="ph">[Billing terms]</span>', 'Pending approval'],
  ['How do I cancel?', '<span class="ph">[Cancellation policy]</span>', 'Pending approval'],
  ['Can I change plans?', '<span class="ph">[Plan-change policy]</span>', 'Pending approval'],
  ['What happens when I reach a usage limit?', '<span class="ph">[Insert approved limit, reset period and available next step]</span>', 'Pending approval'],
  ['What happens to my existing CVID links if I change plans?', '<span class="ph">[Confirm CVID link status after a plan change]</span>', 'Pending approval'],
];
const planHead = (n) => `<th scope="col" class="pt-plan${n === 2 ? ' featured' : ''}" data-col="${n}"><div class="pt-head"><span class="plan-tier">Plan ${n}</span><span class="pt-name"><span class="ph">[Plan name]</span></span><span class="pt-price"><span class="ph">[Price]</span><span class="plan-period">/ <span class="ph">[Billing period]</span></span></span><a class="btn ${n === 2 ? 'btn-primary' : 'btn-light'} btn-sm" href="app/builder.html">Get started</a></div></th>`;

export const pricing = sitePage({
  file: 'pricing.html',
  title: 'Pricing — CV-MAKER',
  description: 'Compare CV-MAKER plans side by side. Prices, allowances and terms are shown as placeholders until approved.',
  body: `${pageHero({
    eyebrow: 'Pricing',
    title: 'Plans that grow with you.',
    lead: 'Start with one resume, then add live links and career tools when you need them. Every plan shows its price, billing period, features and limits.',
    extra: `\n  <p class="price-status reveal" style="--d:180ms">${icon('info', 'i-sm')}Pricing is being finalised. Fields like <span class="ph">[Price]</span> are filled in once approved.</p>`,
  })}
<section class="section section-flush" aria-label="Plans">
 <div class="container">
  ${planCards([['CVIDs', '[CVID limit]'], ['Builder and PDF', '[Included / not included]'], ['Global ID', '[Included / not included]'], ['AI writing', '[AI allowance]'], ['Analytics', '[Analytics access]']])}
  <p class="plan-foot reveal">${icon('building', 'i-sm')}Buying for a college or placement cell? <a class="link" href="for-institutions.html#demo">Talk to us about CV-MAKER for Institutions ${icon('arrow-right', 'i-sm')}</a></p>
 </div>
</section>
<section class="section section-tight" aria-labelledby="compare-title">
 <div class="container">
  <div class="section-head reveal"><span class="eyebrow">Compare</span><h2 class="h2" id="compare-title">Compare every feature.</h2><p class="lead">Each row uses an explicit label: Included, Not included or a usage limit with its reset period.</p></div>
  <div class="seg plan-switch" role="group" aria-label="Show plan" data-plan-switch>${[1, 2, 3].map((n) => `<button type="button" aria-pressed="${n === 1}" data-plan-col="${n}">Plan ${n}</button>`).join('')}</div>
  <div class="pt-wrap card reveal" data-plan-table data-show="1">
   <table class="pt">
    <thead><tr><th scope="col" class="pt-corner"><div class="pt-head"><span class="plan-feats-label">Features</span><span class="small">Values appear once plans are approved.</span></div></th>${[1, 2, 3].map(planHead).join('')}</tr></thead>
    ${compareGroups.map(([ic, title, items]) => `<tbody><tr class="pt-group"><th colspan="4" scope="colgroup">${icon(ic, 'i-sm')}${title}</th></tr>${items.map(([name, value, note]) => `<tr><th scope="row">${name}${note ? `<span class="small">${note}</span>` : ''}</th>${[1, 2, 3].map((n) => `<td data-col="${n}"${n === 2 ? ' class="featured"' : ''}><span class="ph">${value}</span></td>`).join('')}</tr>`).join('')}</tbody>`).join('\n    ')}
   </table>
  </div>
  <div class="limit-note reveal"><span class="tile-icon">${icon('info')}</span><div><b>What happens at a limit</b><p class="small">Once the product rule is confirmed, this explains what you see when you reach an allowance and the next step you can take.</p></div><span class="pending">Pending approval</span></div>
 </div>
</section>
<section class="section section-tight" aria-labelledby="pricing-faq-title">
 <div class="container faq-layout">
  <div class="faq-side reveal"><span class="eyebrow">Pricing FAQs</span><h2 class="h2" id="pricing-faq-title">Billing questions.</h2><p class="body">Answers appear here once the billing policy is approved.</p><a class="btn btn-light" href="contact.html">Ask a billing question</a></div>
  ${acc(pricingFaqs)}
 </div>
</section>
${closing('Start with one resume.', 'Build it once, download a PDF when you need one, and make it live when you are ready.')}`,
});

// ---------------------------------------------------------------- About Us
export const about = sitePage({
  file: 'about.html',
  title: 'About Us — CV-MAKER',
  description: 'CV-MAKER is a career platform built around a persistent professional identity and live, shareable resumes.',
  body: `${pageHero({
    eyebrow: 'About CV-MAKER',
    title: 'A career is more than a file.',
    lead: 'CV-MAKER is a career platform by sakshamfit, built around a persistent professional identity and live, shareable resumes, with tools that support the job-search journey.',
  })}
<section class="section section-tight" aria-labelledby="why-title">
 <div class="container">
  <div class="section-head reveal"><span class="eyebrow">Why CV-MAKER</span><h2 class="h2" id="why-title">Built for two coordination problems.</h2><p class="lead">One for people looking for their next role, one for the colleges helping them get there.</p></div>
  <div class="about-grid">
   <article class="about-card card reveal"><span class="tile-icon">${icon('user')}</span><h3 class="h4">For professionals and students</h3><p class="small">Career information is scattered across old resume files, job portals, email attachments and several versions of the same document. People rebuild and resend resumes, while shared copies quickly go out of date and show little sign of engagement.</p></article>
   <article class="about-card card reveal" style="--d:80ms"><span class="tile-icon">${icon('building')}</span><h3 class="h4">For college placement teams</h3><p class="small">Placement season means large rosters in spreadsheets, chasing missing resumes, checking completeness by hand and preparing recruiter shortlists under time pressure, while respecting student privacy and consent.</p></article>
  </div>
 </div>
</section>
<section class="section section-tight" aria-labelledby="principles-title">
 <div class="container">
  <div class="section-head reveal"><span class="eyebrow">Principles</span><h2 class="h2" id="principles-title">Three commitments.</h2></div>
  <div class="problem-grid">
   ${[['fingerprint', 'One identity', 'Your Global ID is a persistent professional identity that stays with you.'], ['layers', 'Tailored for every role', 'Publish a CVID for each direction you take, each on its own link.'], ['refresh', 'Always live', 'Edit and save a resume, and its existing link shows the latest version.']].map(([ic, t, d], i) => `<article class="problem-card reveal" style="--d:${i * 80}ms"><span class="label">0${i + 1}</span><span class="tile-icon">${icon(ic)}</span><h3 class="h4">${t}</h3><p class="small">${d}</p></article>`).join('\n   ')}
  </div>
  <div class="future card reveal"><span class="pending">Future direction</span><p class="body">Over time, CV-MAKER may add an HR and recruitment experience and a job board that connects employers with the career identities and resumes students maintain on CV-MAKER. This is a direction, not a feature you can use today.</p></div>
 </div>
</section>
${closing('Build your next opportunity on a stronger foundation.', 'Create a structured resume, then share it as a PDF or a live link.')}`,
});

// ---------------------------------------------------------------- Contact
export const contact = sitePage({
  file: 'contact.html',
  title: 'Contact — CV-MAKER',
  description: 'Contact CV-MAKER support or the business team.',
  body: `${pageHero({ eyebrow: 'Contact', title: 'Talk to CV-MAKER.', lead: 'Questions about your resume or account, or a business enquiry: reach the right team.' })}
<section class="section section-tight" aria-label="Contact routes">
 <div class="container contact-layout">
  <div class="contact-routes">
   <article class="route card reveal"><span class="tile-icon">${icon('mail')}</span><div><h2 class="h4">Support</h2><p class="small">Building your resume, your account or billing.</p><a class="link" href="mailto:support@cv-maker.app">support@cv-maker.app</a></div></article>
   <article class="route card reveal" style="--d:60ms"><span class="tile-icon">${icon('briefcase')}</span><div><h2 class="h4">Business enquiries</h2><p class="small">Partnerships and integrations.</p><a class="link" href="mailto:partners@cv-maker.app">partners@cv-maker.app</a></div></article>
   <article class="route card reveal" style="--d:120ms"><span class="tile-icon">${icon('building')}</span><div><h2 class="h4">Colleges and institutions</h2><p class="small">A walkthrough of the placement workspace.</p><a class="link" href="for-institutions.html#demo">Request an institutional demo ${icon('arrow-right', 'i-sm')}</a></div></article>
   <p class="small"><span class="pending">To confirm</span> Support addresses and response times are awaiting approval. Response time: <span class="ph">[Response time]</span></p>
  </div>
  <form class="contact-form card reveal" id="contact-form" style="--d:100ms">
   <div class="seg" role="group" aria-label="Enquiry type"><button type="button" aria-pressed="true" data-contact="support">Support</button><button type="button" aria-pressed="false" data-contact="business">Business</button></div>
   <div class="form-grid">
    <div class="field"><label for="c-name">Full name</label><input class="input" id="c-name" name="name" autocomplete="name" required></div>
    <div class="field"><label for="c-email" data-email-label>Email</label><input class="input" id="c-email" name="email" type="email" autocomplete="email" required></div>
    <div class="field" data-company hidden><label for="c-company">Company</label><input class="input" id="c-company" name="company" autocomplete="organization" disabled required></div>
    <div class="field full"><label for="c-message">How can we help?</label><textarea class="textarea" id="c-message" name="message" required></textarea></div>
   </div>
   <div class="form-foot"><button class="btn btn-primary" type="submit">Send message<span class="btn-arrow">${icon('send', 'i-sm')}</span></button><p class="hint">Opens your email app with the message addressed to <span data-contact-to>support@cv-maker.app</span>.</p></div>
  </form>
 </div>
</section>`,
});

// ---------------------------------------------------------------- For Institutions (brief sections 5, 7.6, 8 J–L, 9)
const instSteps = [
  ['Set up and invite officers', 'We set up your institution and you invite placement officers into a workspace scoped to your students only.'],
  ['Import your roster', 'Upload CSV or XLSX, paste rows or add students one by one. Preview and fix validation errors before importing.'],
  ['Invite students and collect consent', 'Students see which institution is asking and what it can see, then choose Allow or Not now. They can consent later or withdraw.'],
  ['Review readiness', 'Track activation, consent, resume completeness and an advisory score that is for coaching only, never for gating drives.'],
  ['Filter, export and shortlist', 'Filter by course, batch, status or score, export the rows to XLSX, or share a recruiter shortlist that expires.'],
];
const instFaqs = [
  ['Who owns the student data?', 'The roster you upload is yours. The resume is the student’s. Information derived from a resume, such as a completeness or quality score, is computed under that student’s consent and stops appearing in your dashboard and exports if they withdraw it.'],
  ['What if a student refuses to consent?', 'They stay on your roster and still count against your seats. Their resume will not open and their quality columns export blank, with the row marked. They can consent later at any time.'],
  ['Do students have to pay?', 'No. Every student on your roster keeps a permanent Global ID and live resume links for life, at no cost, including after graduation and after your agreement ends. Other agreement benefits apply while they are enrolled.'],
  ['What happens at the end of the academic year?', 'Nothing automatic. The institution removes the batch that has graduated when ready. Nobody loses their CV-MAKER account or identity when the batch is removed.'],
  ['Is the quality score used to decide who gets placed?', 'No. It is advisory, to help students see where to improve and officers know whom to coach. It does not gate anyone from a drive.'],
  ['How long does it take to get a college running?', 'Roster upload itself takes minutes. The main variable is how quickly students activate their accounts and consent, which the dashboard makes visible.'],
  ['Can we try it before committing?', 'Yes. The pilot lets the institution try the workflow before committing. Ask for a demo to discuss an arrangement that fits your batch size.'],
];
const instPreview = `<div class="inst-preview card reveal" style="--d:220ms" aria-label="Sample placement dashboard">
   <div class="inst-stats">${[['Total students', '240'], ['Active', '198'], ['Invited', '42'], ['Avg completeness', '76%'], ['Advisory score', '71']].map(([k, v]) => `<div><span class="small">${k}</span><b>${v}</b></div>`).join('')}</div>
   <div class="inst-rows">${[['AM', 'Aditi Menon', 'B.Tech CSE', 'Consented', 92, 'green'], ['RK', 'Rahul Kumar', 'B.Tech ECE', 'Consented', 74, 'green'], ['SN', 'Sara Nair', 'MBA', 'Invited', null, 'amber'], ['VJ', 'Vikram Joshi', 'B.Tech ME', 'Not now', null, 'grey']].map(([i, n, c, s, v, tone]) => `<div><span class="avatar">${i}</span><b>${n}</b><span class="small">${c}</span><span class="chip ${tone}">${s}</span><span class="meter">${v == null ? '<span class="small">—</span>' : `<i style="--v:${v}%"></i><span class="small">${v}%</span>`}</span></div>`).join('')}</div>
   <p class="small">Sample data. Resume details stay hidden until a student consents.</p>
  </div>`;
export const institutions = sitePage({
  file: 'for-institutions.html',
  title: 'For Institutions — CV-MAKER',
  description: 'A dedicated placement workspace for colleges: roster onboarding, student invitations and consent, a readiness dashboard, filtering and export, and expiring recruiter shortlists.',
  body: `<section class="page-hero inst-hero sky" aria-labelledby="page-title">
 ${skyBackdrop()}
 <div class="container inst-hero-grid">
  <div>
   <span class="eyebrow reveal">CV-MAKER For Institutions</span>
   <h1 class="h1 reveal" id="page-title" style="--d:60ms">A placement workspace for colleges.</h1>
   <p class="lead reveal" style="--d:120ms">Import your roster, invite students, track activation and consent, review readiness, and share time-limited recruiter shortlists. Students stay in control of whether their resume is visible.</p>
   <div class="hero-ctas reveal" style="--d:180ms">${arrowBtn('Request an institutional demo', '#demo', 'btn-primary btn-lg')}<a class="btn btn-light btn-lg" href="app/institution.html">View the placement workspace</a></div>
  </div>
  ${instPreview}
 </div>
</section>
<section class="section section-tight" id="flow" aria-labelledby="flow-title">
 <div class="container">
  <div class="section-head reveal"><span class="eyebrow">How it works</span><h2 class="h2" id="flow-title">From roster to recruiter shortlist.</h2><p class="lead">A separate, institution-scoped workspace connected to student-facing CV-MAKER.</p></div>
  <div class="stepper reveal" data-stepper>
   <div class="stepper-list" role="tablist" aria-label="How the placement workspace works">
    ${instSteps.map(([title, text], i) => `<button class="step" type="button" role="tab" id="istep-${i + 1}" aria-controls="istep-panel-${i + 1}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}"><span class="step-num">${i + 1}</span><span class="step-copy"><b>${title}</b><span>${text}</span></span><span class="step-bar"><i></i></span></button>`).join('\n    ')}
   </div>
   <div class="stepper-stage">
    ${[
      `<div class="mini mini-dash"><div class="mini-gid">${icon('building')}<div><span class="label">Institution</span><b>Your College</b></div><span class="live-pill">Active</span></div>${['Placement officer · Invited', 'Placement officer · Active'].map((r) => `<div class="mini-row">${icon('user', 'i-sm')}<span>${r}</span></div>`).join('')}</div>`,
      `<div class="mini mini-start"><div class="mini-options"><div class="mini-option on">${icon('upload')}<b>Upload CSV / XLSX</b><span>roster_2026.xlsx</span><span class="mini-progress"><i></i></span><span class="mini-note">238 rows valid · 2 need fixing</span></div><div class="mini-option">${icon('table')}<b>Paste or add</b><span>One at a time</span></div></div></div>`,
      `<div class="mini mini-consent"><span class="label">Request from Your College</span><b>Your college would like to see your placement resume and readiness indicators.</b><div class="mini-consent-btns"><span class="btn btn-primary btn-sm">Allow</span><span class="btn btn-light btn-sm">Not now</span></div><span class="small">You can change this later in settings.</span></div>`,
      `<div class="mini mini-dash">${[['Aditi Menon', 92], ['Rahul Kumar', 74], ['Sara Nair', 58]].map(([n, v]) => `<div class="mini-row">${icon('user', 'i-sm')}<span>${n}</span><span class="meter"><i style="--v:${v}%"></i><span class="small">${v}%</span></span></div>`).join('')}<span class="small">Advisory only · for coaching</span></div>`,
      `<div class="mini mini-output"><div class="mini-choice">${icon('download')}<b>Export XLSX</b><span>Filtered rows</span></div><div class="mini-choice on">${icon('link')}<b>Recruiter shortlist</b><span>Expires in 14 days</span></div><div class="mini-live"><div><span class="label">Shortlist link</span><b class="mono">cv-maker.app/s/7h2k-9q</b><span class="chip amber">Re-checks consent on open</span></div></div></div>`,
    ].map((panel, i) => `<div class="step-panel" role="tabpanel" id="istep-panel-${i + 1}" aria-labelledby="istep-${i + 1}"${i === 0 ? '' : ' hidden'}>${panel}</div>`).join('\n    ')}
   </div>
  </div>
  <p class="small center-cta"><span class="pending">To confirm</span> Roster size, duplicate matching and shortlist expiry options are being confirmed with engineering.</p>
 </div>
</section>
<section class="section section-tight" aria-labelledby="consent-title">
 <div class="container">
  <div class="section-head reveal"><span class="eyebrow">Consent and continuity</span><h2 class="h2" id="consent-title">Students say yes first.</h2><p class="lead">Resume details and resume-derived metrics stay hidden until a student consents.</p></div>
  <div class="benefit-grid">
   ${[['shield', 'Clear request', 'Students see which institution is asking and what information it requests.'], ['refresh', 'Change any time', 'Students can consent later or withdraw. Withdrawal removes resume-derived data from the live dashboard and future exports.'], ['table', 'Marked, never hidden', 'Students who do not consent stay on the roster; their consent-gated fields export blank and the row is marked.'], ['fingerprint', 'Theirs for life', 'Students keep their Global ID and live resume links for free, after graduation and after the agreement ends.']].map(([ic, t, d], i) => `<div class="benefit reveal" style="--d:${i * 60}ms"><span class="tile-icon">${icon(ic)}</span><b>${t}</b><span class="small">${d}</span></div>`).join('\n   ')}
  </div>
  <div class="roadmap-row reveal"><span class="label">On the roadmap · planned</span>${['Campus drives', 'Resume review and sign-off', 'Placement outcome recording', 'Application tracker'].map((t) => `<span class="chip grey">${icon('clock', 'i-sm')}${t}</span>`).join('')}</div>
 </div>
</section>
<section class="section section-tight" id="demo" aria-labelledby="demo-title">
 <div class="container faq-layout">
  <form class="contact-form card reveal" id="demo-form">
   <span class="eyebrow">Get started</span>
   <h2 class="h3" id="demo-title">Request an institutional demo.</h2>
   <div class="form-grid">
    <div class="field"><label for="d-name">Full name</label><input class="input" id="d-name" name="name" autocomplete="name" required></div>
    <div class="field"><label for="d-email">Work email</label><input class="input" id="d-email" name="email" type="email" autocomplete="email" required></div>
    <div class="field"><label for="d-inst">Institution</label><input class="input" id="d-inst" name="institution" autocomplete="organization" required></div>
    <div class="field"><label for="d-size">Approx. students</label><input class="input" id="d-size" name="students" type="number" min="1" inputmode="numeric" required></div>
   </div>
   <div class="form-foot"><button class="btn btn-primary" type="submit">Request a demo<span class="btn-arrow">${icon('arrow-right', 'i-sm')}</span></button><p class="hint">Opens your email app, addressed to partners@cv-maker.app.</p></div>
  </form>
  <div><span class="eyebrow reveal">Institution FAQs</span>${acc(instFaqs)}</div>
 </div>
</section>`,
});
