'use strict';

// Helpers shared by the website and the workspace: selectors, icons, toasts, dialogs,
// scroll reveals and QR codes (rendered as SVG with the bundled qrcode-generator).

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const icon = (name, cls = '') => `<svg class="i ${cls}" aria-hidden="true"><use href="#ic-${name}"/></svg>`;
const escapeHTML = value => String(value).replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

let toastTimer = 0;
function toast(message) {
 let node = $('#toast');
 if (!node) {
  node = document.createElement('div');
  node.id = 'toast';
  node.className = 'toast';
  node.setAttribute('role', 'status');
  document.body.append(node);
 }
 node.innerHTML = `${icon('check')}<span>${escapeHTML(message)}</span>`;
 node.classList.add('show');
 clearTimeout(toastTimer);
 toastTimer = setTimeout(() => node.classList.remove('show'), 3200);
}

// One reusable dialog: openDialog(html) fills it, any [data-close] inside closes it.
function openDialog(html, {wide = false} = {}) {
 let dialog = $('#dialog');
 if (!dialog) {
  dialog = document.createElement('dialog');
  dialog.id = 'dialog';
  dialog.className = 'dialog';
  dialog.innerHTML = `<button class="dialog-close" type="button" data-close aria-label="Close">${icon('x')}</button><div class="dialog-inner"></div>`;
  dialog.addEventListener('click', event => {
   if (event.target === dialog || event.target.closest('[data-close]')) dialog.close();
  });
  document.body.append(dialog);
 }
 dialog.style.width = wide ? 'min(820px, calc(100% - 32px))' : '';
 $('.dialog-inner', dialog).innerHTML = html;
 if (!dialog.open) dialog.showModal();
 return dialog;
}

// Draws a scannable QR code for `text` into `node` as crisp SVG.
function renderQR(node, text) {
 if (!node || typeof qrcode === 'undefined') return;
 const qr = qrcode(0, 'M');
 qr.addData(text);
 qr.make();
 const count = qr.getModuleCount(), quiet = 2, size = count + quiet * 2;
 let path = '';
 for (let r = 0; r < count; r++) for (let c = 0; c < count; c++) if (qr.isDark(r, c)) path += `M${c + quiet} ${r + quiet}h1v1h-1z`;
 node.innerHTML = `<svg viewBox="0 0 ${size} ${size}" role="img" aria-label="QR code for ${escapeHTML(text)}" shape-rendering="crispEdges"><rect width="${size}" height="${size}" fill="#fff"/><path d="${path}" fill="#0b1220"/></svg>`;
}

// Copies text and confirms with a toast.
async function copyText(text, message = 'Link copied') {
 try {await navigator.clipboard.writeText(text);} catch {/* clipboard unavailable: still confirm */}
 toast(message);
}

// Containers whose children fade up one after another as they enter the screen.
const STAGGER = '.problem-grid, .feature-grid, .benefit-grid, .plan-grid, .about-grid, .contact-routes, .stepper-list, .footer-grid, .faq-layout .acc, .pricing-faq .acc';

// Splits a heading into words that rise into place in turn. Inline pieces such as the
// headline's link chip move as one unit; the text stays readable for assistive tech.
function splitWords(heading) {
 if (heading.classList.contains('split')) return;
 let index = 0;
 const unit = node => {
  const word = document.createElement('span');
  word.className = 'w';
  const inner = document.createElement('span');
  inner.style.setProperty('--i', index++);
  inner.append(node);
  word.append(inner);
  return word;
 };
 const walk = parent => [...parent.childNodes].forEach(node => {
  if (node.nodeType === Node.TEXT_NODE) {
   const parts = node.textContent.split(/(\s+)/).filter(Boolean);
   node.replaceWith(...parts.map(part => (/^\s+$/.test(part) ? document.createTextNode(part) : unit(document.createTextNode(part)))));
  } else if (node.nodeType === Node.ELEMENT_NODE) {
   if (node.matches('.h1-chip, svg, img')) {const word = unit(node.cloneNode(true)); word.classList.add('w-unit'); node.replaceWith(word);}
   else walk(node);
  }
 });
 walk(heading);
 heading.classList.add('split');
}

// Fades sections in as they enter the screen (skipped for reduced motion). Once an element has
// arrived, its reveal classes are removed so its own hover and transform styles take over again.
function initReveals(root = document) {
 if (!document.documentElement.classList.contains('js')) return;
 $$(STAGGER, root).forEach(group => [...group.children].forEach((child, i) => {
  if (child.classList.contains('reveal') || child.hidden) return;
  child.classList.add('reveal');
  child.style.setProperty('--d', `${Math.min(i, 7) * 80}ms`);
 }));
 $$('.h1.reveal, .h2.reveal, .reveal .h1, .reveal .h2, .closing-panel .h2, .ring-copy .h2', root).forEach(splitWords);
 const items = $$('.reveal, .split', root);
 const settle = el => {
  if (el.classList.contains('split')) return;
  const delay = parseFloat(getComputedStyle(el).transitionDelay) * 1000 || 0;
  setTimeout(() => {el.classList.remove('reveal', 'in'); el.style.removeProperty('--d');}, delay + 1300);
 };
 if (!('IntersectionObserver' in window)) {items.forEach(el => el.classList.add('in')); return;}
 const observer = new IntersectionObserver(entries => entries.forEach(entry => {
  if (!entry.isIntersecting) return;
  entry.target.classList.add('in');
  observer.unobserve(entry.target);
  settle(entry.target);
 }), {rootMargin: '0px 0px -6% 0px'});
 items.forEach(el => observer.observe(el));
}

document.addEventListener('DOMContentLoaded', () => {
 $$('[data-qr]').forEach(node => renderQR(node, node.dataset.qr));
 $$('[data-copy]').forEach(button => button.addEventListener('click', () => copyText(button.dataset.copy)));
});
