'use strict';

// Website interactions. Uses helpers from core.js.
{
 const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 const inView = (node, callback, threshold = 0.3) => {
  if (!node) return;
  new IntersectionObserver(([entry]) => callback(entry.isIntersecting), {threshold}).observe(node);
 };

 // ---------- Header ----------
 const nav = $('.nav'), toggle = $('.nav-toggle'), mobile = $('#nav-mobile');
 const onScroll = () => nav?.classList.toggle('scrolled', window.scrollY > 8);
 window.addEventListener('scroll', onScroll, {passive: true});
 onScroll();
 toggle?.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') !== 'true';
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  mobile.hidden = !open;
 });

 // ---------- Smooth, inertial scrolling (Lenis), paused while the home intro plays ----------
 const introPlaying = document.documentElement.classList.contains('intro-playing');
 if (!reducedMotion && window.Lenis) {
  const lenis = new Lenis({lerp: 0.09, wheelMultiplier: 0.95, anchors: {offset: -96}});
  const loop = time => {lenis.raf(time); requestAnimationFrame(loop);};
  requestAnimationFrame(loop);
  if (introPlaying) {
   lenis.stop();
   document.addEventListener('intro:reveal', () => lenis.start(), {once: true});
   setTimeout(() => lenis.start(), 7000);
  }
 }

 // ---------- Reveals (held back on the home page until the intro hands over) ----------
 if (introPlaying) {
  let started = false;
  const go = () => {if (!started) {started = true; initReveals();}};
  document.addEventListener('intro:reveal', go, {once: true});
  setTimeout(go, 7000);
 } else initReveals();

 // ---------- Hero laptop: drawn at 640px, scaled down to fit narrower columns ----------
 const laptop = $('.laptop');
 if (laptop) {
  const fit = () => laptop.style.setProperty('--lz', Math.min(1, laptop.parentElement.clientWidth / 640).toFixed(3));
  fit();
  window.addEventListener('resize', fit);
 }

 // ---------- Grow on scroll: [data-grow] frames reach full width at the middle of the screen ----------
 const growers = $$('[data-grow]');
 if (reducedMotion) growers.forEach(el => el.style.setProperty('--grow', '1'));
 else if (growers.length) {
  let queued = false;
  const update = () => {
   queued = false;
   const half = window.innerHeight / 2;
   growers.forEach(el => {
    const box = el.getBoundingClientRect();
    const distance = Math.abs(box.top + box.height / 2 - half);
    const t = Math.min(1, Math.max(0, (1 - distance / (half * 1.25)) * 1.5));
    el.style.setProperty('--grow', (t * t * (3 - 2 * t)).toFixed(3));
   });
  };
  const queue = () => {if (!queued) {queued = true; requestAnimationFrame(update);}};
  window.addEventListener('scroll', queue, {passive: true});
  window.addEventListener('resize', queue);
  update();
 }

 // ---------- Launch film: plays muted while on screen, pauses when it leaves ----------
 const film = $('[data-film]');
 if (film) {
  film.muted = true;
  if (reducedMotion) {film.removeAttribute('autoplay'); film.pause(); film.controls = true;}
  else inView(film, visible => (visible ? film.play().catch(() => {}) : film.pause()), 0.25);
 }

 // ---------- Steppers: advance on their own until someone picks a step ----------
 $$('[data-stepper]').forEach(stepper => {
  const steps = $$('[role="tab"]', stepper), panels = $$('[role="tabpanel"]', stepper);
  let index = 0, timer = 0, auto = !reducedMotion, visible = false;
  const show = (next, focus = false) => {
   index = (next + steps.length) % steps.length;
   steps.forEach((step, i) => {
    step.setAttribute('aria-selected', String(i === index));
    step.tabIndex = i === index ? 0 : -1;
    step.classList.remove('timing');
   });
   panels.forEach((panel, i) => {panel.hidden = i !== index;});
   $$('[data-qr]', panels[index]).forEach(node => renderQR(node, node.dataset.qr));
   if (focus) steps[index].focus();
   schedule();
  };
  const schedule = () => {
   clearTimeout(timer);
   if (!auto || !visible) return;
   void steps[index].offsetWidth;
   steps[index].classList.add('timing');
   timer = setTimeout(() => show(index + 1), 5200);
  };
  const stop = () => {auto = false; clearTimeout(timer); steps.forEach(s => s.classList.remove('timing'));};
  steps.forEach((step, i) => step.addEventListener('click', () => {stop(); show(i);}));
  stepper.addEventListener('keydown', event => {
   const moves = {ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1};
   if (event.target.matches('[role="tab"]') && event.key in moves) {event.preventDefault(); stop(); show(index + moves[event.key], true);}
  });
  inView(stepper, isIn => {visible = isIn; isIn ? schedule() : clearTimeout(timer);});
 });

 // ---------- Global ID map: lines from the GID to each CVID ----------
 const map = $('[data-gid-map]');
 if (map) {
  const svg = $('.gid-lines', map), hub = $('.map-gid', map), cards = $$('[data-map-cvid]', map);
  let active = 0, cycle = 0;
  const draw = () => {
   const box = map.getBoundingClientRect(), h = hub.getBoundingClientRect();
   const x1 = h.right - box.left, y1 = h.top + h.height / 2 - box.top;
   svg.innerHTML = cards.map((card, i) => {
    const c = card.getBoundingClientRect(), x2 = c.left - box.left, y2 = c.top + c.height / 2 - box.top, mid = (x1 + x2) / 2;
    return `<path class="${i === active ? 'on' : ''}" d="M${x1} ${y1} C${mid} ${y1}, ${mid} ${y2}, ${x2} ${y2}"/>`;
   }).join('');
  };
  const select = i => {active = i; cards.forEach((card, n) => card.classList.toggle('on', n === i)); draw();};
  cards.forEach((card, i) => {
   card.addEventListener('mouseenter', () => {clearInterval(cycle); select(i);});
   card.addEventListener('focus', () => {clearInterval(cycle); select(i);});
   card.addEventListener('click', () => {clearInterval(cycle); select(i);});
  });
  window.addEventListener('resize', draw, {passive: true});
  inView(map, isIn => {
   clearInterval(cycle);
   if (isIn) {draw(); if (!reducedMotion) cycle = setInterval(() => select((active + 1) % cards.length), 2600);}
  }, 0.2);
  draw();
 }

 // ---------- Feature ring: turns on its own, continuously; the card nearest the top is described ----------
 // Hovering a card slows the ring; choosing one glides it to the top and holds it there for a moment.
 // On narrow screens the cards form a swipeable row that advances on its own.
 const ring = $('[data-ring]');
 if (ring) {
  const track = $('.ring-track', ring), cards = $$('[data-ring-card]', ring), infos = $$('[data-ring-info]', ring), dots = $$('[data-ring-dot]', ring);
  const count = cards.length, step = 360 / count, SPEED = 360 / 48; // degrees per second: one turn in 48s
  const narrow = () => window.matchMedia('(max-width: 760px)').matches;
  let rotation = 0, active = -1, speed = 1, targetSpeed = 1, glide = null, holdUntil = 0, last = 0, frame = 0, visible = false, rowTimer = 0, rowPausedUntil = 0;

  const mark = index => {
   if (index === active) return;
   active = index;
   cards.forEach((card, i) => card.classList.toggle('on', i === active));
   infos.forEach((info, i) => {info.hidden = i !== active;});
   dots.forEach((dot, i) => dot.classList.toggle('on', i === active));
  };
  // Card i sits at i × step + rotation degrees; the one closest to 0° is at the top.
  const nearest = () => ((Math.round(-rotation / step) % count) + count) % count;
  const draw = () => track.style.setProperty('--ring-rot', `${rotation.toFixed(3)}deg`);

  const tick = now => {
   const dt = Math.min(0.05, (now - last) / 1000);
   last = now;
   if (glide) {
    const t = Math.min(1, (now - glide.start) / glide.duration);
    rotation = glide.from + (glide.to - glide.from) * (1 - (1 - t) ** 4);
    if (t === 1) {glide = null; holdUntil = now + 1800;}
   } else if (now > holdUntil) {
    speed += (targetSpeed - speed) * Math.min(1, dt * 3);
    rotation -= SPEED * speed * dt;
   }
   draw();
   mark(nearest());
   frame = requestAnimationFrame(tick);
  };
  const spin = on => {
   cancelAnimationFrame(frame);
   if (on && !reducedMotion && !narrow()) {last = performance.now(); frame = requestAnimationFrame(tick);}
  };

  // Narrow screens: scroll the row to a card, and move on every few seconds.
  const showInRow = index => {
   const target = ((index % count) + count) % count, card = cards[target];
   mark(target);
   track.scrollTo({left: card.offsetLeft - (track.clientWidth - card.offsetWidth) / 2, behavior: reducedMotion ? 'auto' : 'smooth'});
  };
  const row = on => {
   clearInterval(rowTimer);
   if (on && !reducedMotion && narrow()) rowTimer = setInterval(() => {if (performance.now() > rowPausedUntil) showInRow(active + 1);}, 3200);
  };

  const goTo = index => {
   const target = ((index % count) + count) % count;
   if (narrow()) {showInRow(target); rowPausedUntil = performance.now() + 6000; return;}
   const to = -target * step + Math.round((rotation + target * step) / 360) * 360;
   if (reducedMotion) {rotation = to; draw(); mark(target); return;}
   glide = {from: rotation, to, start: performance.now(), duration: 1100};
  };
  cards.forEach((card, i) => {
   card.addEventListener('click', () => goTo(i));
   card.addEventListener('mouseenter', () => {targetSpeed = 0.2;});
   card.addEventListener('mouseleave', () => {targetSpeed = 1;});
  });
  $('[data-ring-prev]', ring).addEventListener('click', () => goTo(active - 1));
  $('[data-ring-next]', ring).addEventListener('click', () => goTo(active + 1));
  ring.addEventListener('focusin', event => {if (event.target.matches(':focus-visible')) targetSpeed = 0;});
  ring.addEventListener('focusout', () => {targetSpeed = 1;});
  track.addEventListener('touchstart', () => {rowPausedUntil = performance.now() + 6000;}, {passive: true});
  inView(ring, isIn => {visible = isIn; spin(isIn); row(isIn);}, 0.1);
  window.addEventListener('resize', () => {spin(visible); row(visible);});
  draw();
  mark(0);
 }

 // ---------- Product preview: live workspace screens in a browser frame ----------
 const preview = $('[data-preview]');
 if (preview) {
  const view = $('[data-preview-view]', preview), frame = $('iframe', view), url = $('[data-preview-url]', preview), tabs = $$('[data-preview-tab]', preview);
  const fit = () => {frame.style.transform = `scale(${view.clientWidth / 1440})`;};
  const load = src => {frame.src = src;};
  tabs.forEach(tab => tab.addEventListener('click', () => {
   tabs.forEach(t => t.setAttribute('aria-selected', String(t === tab)));
   load(tab.dataset.previewTab);
   url.textContent = `app.cv-maker.app/${tab.dataset.previewTab.split('/')[1].split('.')[0]}`;
  }));
  window.addEventListener('resize', fit, {passive: true});
  fit();
  inView(preview, isIn => {if (isIn && !frame.getAttribute('src')) load(frame.dataset.src);}, 0.05);
 }

 // ---------- FAQ: show every question ----------
 const all = $('[data-faq-all]');
 all?.addEventListener('click', () => {
  const open = all.getAttribute('aria-expanded') !== 'true';
  $$('[data-faq] [data-more]').forEach(item => {item.hidden = !open;});
  all.setAttribute('aria-expanded', String(open));
  all.firstChild.textContent = open ? 'Show fewer FAQs' : 'View all FAQs';
 });

 // ---------- Legal links: approved copy is still pending ----------
 $$('[data-legal]').forEach(button => button.addEventListener('click', () => openDialog(`<span class="pending">Pending approval</span><h2 class="h3" style="margin-top:14px">${escapeHTML(button.dataset.legal)}</h2><p class="body" style="margin-top:12px">The approved ${escapeHTML(button.dataset.legal.toLowerCase())} will be published here. Until then, contact <a class="blue" href="mailto:support@cv-maker.app">support@cv-maker.app</a> with any questions.</p>`)));

 // ---------- Features: filter by group ----------
 const filter = $('[data-filter]');
 filter?.addEventListener('click', event => {
  const button = event.target.closest('[data-filter-group]');
  if (!button) return;
  $$('[data-filter-group]', filter).forEach(b => b.setAttribute('aria-pressed', String(b === button)));
  $$('.feature-card').forEach(card => {card.hidden = button.dataset.filterGroup !== 'all' && card.dataset.group !== button.dataset.filterGroup;});
 });

 // ---------- Pricing: one plan at a time on narrow screens ----------
 const planSwitch = $('[data-plan-switch]'), planTable = $('[data-plan-table]');
 planSwitch?.addEventListener('click', event => {
  const button = event.target.closest('[data-plan-col]');
  if (!button) return;
  $$('[data-plan-col]', planSwitch).forEach(b => b.setAttribute('aria-pressed', String(b === button)));
  planTable.dataset.show = button.dataset.planCol;
 });

 // ---------- Contact and demo forms: hand the message to the visitor's email app ----------
 const mailto = (to, subject, lines) => `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.filter(Boolean).join('\n'))}`;
 const contact = $('#contact-form');
 if (contact) {
  let kind = 'support';
  const to = {support: 'support@cv-maker.app', business: 'partners@cv-maker.app'};
  $$('[data-contact]', contact).forEach(button => button.addEventListener('click', () => {
   kind = button.dataset.contact;
   $$('[data-contact]', contact).forEach(b => b.setAttribute('aria-pressed', String(b === button)));
   $('[data-company]', contact).hidden = kind !== 'business';
   contact.elements.company.disabled = kind !== 'business';
   $('[data-email-label]', contact).textContent = kind === 'business' ? 'Work email' : 'Email';
   $('[data-contact-to]', contact).textContent = to[kind];
  }));
  contact.addEventListener('submit', event => {
   event.preventDefault();
   if (!contact.reportValidity()) return;
   const f = contact.elements;
   window.location.href = mailto(to[kind], kind === 'business' ? 'Business enquiry — CV-MAKER' : 'Support request — CV-MAKER', [f.message.value, '', f.name.value, f.email.value, kind === 'business' ? f.company.value : '']);
   toast(`Your email app should open with this message to ${to[kind]}.`);
  });
 }
 const demo = $('#demo-form');
 demo?.addEventListener('submit', event => {
  event.preventDefault();
  if (!demo.reportValidity()) return;
  const f = demo.elements;
  window.location.href = mailto('partners@cv-maker.app', `Institutional demo — ${f.institution.value}`, [`Name: ${f.name.value}`, `Work email: ${f.email.value}`, `Institution: ${f.institution.value}`, `Approx. students: ${f.students.value}`]);
  toast('Your email app should open with this request to partners@cv-maker.app.');
 });
}
