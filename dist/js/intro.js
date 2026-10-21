'use strict';

// Home page intro: two resume versions arrive, fly into the CV mark,
// "CV-MAKER" grows out beside it, and the lockup glides into the header.
// A click, key press, scroll or touch skips it. site.js starts the page reveals on 'intro:reveal'.
{
 const root = document.documentElement;
 const intro = $('.intro');
 if (intro && root.classList.contains('intro-playing')) {
  const CARD_W = 190;
  const ease = 'cubic-bezier(.22,1,.36,1)', glide = 'cubic-bezier(.65,0,.35,1)';

  const logo = $('.intro-logo', intro), lockup = $('.intro-lockup', intro);
  const mark = $('.intro-mark', intro), word = $('.intro-word', intro), bg = $('.intro-bg', intro);
  const [cardA, cardB] = $$('.intro-card', intro);
  const animations = [];
  const play = (el, frames, options) => {const a = el.animate(frames, {fill: 'forwards', easing: ease, ...options}); animations.push(a); return a;};
  const skipEvents = ['click', 'keydown', 'wheel', 'touchstart'];

  let revealed = false, finished = false;
  const reveal = () => {if (!revealed) {revealed = true; document.dispatchEvent(new Event('intro:reveal'));}};
  const finish = () => {
   if (finished) return;
   finished = true;
   skipEvents.forEach(type => window.removeEventListener(type, finish));
   animations.forEach(a => a.cancel());
   intro.remove();
   root.classList.remove('intro-playing');
   root.style.overflow = '';
   reveal();
  };

  const start = async () => {
   if (finished) return;
   root.style.overflow = 'hidden';
   const vw = window.innerWidth, vh = window.innerHeight;
   const markSize = Math.min(88, vw * 0.18);
   const wordSize = Math.min(52, vw * 0.09);
   const gap = Math.round(markSize * 0.28);
   mark.style.width = mark.style.height = `${markSize}px`;
   word.style.fontSize = `${wordSize}px`;
   lockup.style.gap = `${gap}px`;
   lockup.style.height = `${markSize}px`;

   const lockupW = markSize + gap + wordSize * 5.4;
   const lockupH = markSize;
   const centerX = (vw - lockupW) / 2;
   const centerY = (vh - lockupH) / 2;
   const markOnlyX = (vw - markSize) / 2;
   Object.assign(logo.style, {width: `${lockupW}px`, height: `${lockupH}px`, transform: `translate(${markOnlyX}px, ${centerY}px)`});

   const icon = {x: 0, y: 0, scale: markSize / CARD_W};
   const fit = Math.min(1, vw / 480);
   const pose = (x, y, r, s = 1) => `translate(${x * fit}px, ${y * fit}px) rotate(${r}deg) scale(${s * fit})`;
   const at = (x, y, s) => `translate(${x}px, ${y}px) rotate(0deg) scale(${s})`;
   const restA = pose(-74, 6, -8), restB = pose(70, -6, 6);

   // 1. A resume arrives, then a newer version beside it.
   play(cardA, [{opacity: 0, transform: pose(-210, 70, -18, .9)}, {opacity: 1, transform: restA}], {duration: 600, delay: 80});
   play(cardB, [{opacity: 0, transform: pose(210, 70, 18, .9)}, {opacity: 1, transform: restB}], {duration: 600, delay: 400});
   await wait(1050);
   if (finished) return;

   // 2. Both fly into the CV mark as the mark appears.
   [[cardA, restA], [cardB, restB]].forEach(([card, rest], i) => play(card, [
    {opacity: 1, transform: rest},
    {opacity: 1, transform: at(icon.x, icon.y, icon.scale), offset: .82},
    {opacity: 0, transform: at(icon.x, icon.y, icon.scale * .7)},
   ], {duration: 640, delay: i * 80, easing: glide}));
   play(mark, [{opacity: 0, transform: 'scale(.82)'}, {opacity: 1, transform: 'scale(1)'}], {duration: 620, delay: 160});
   await wait(800);
   if (finished) return;
   play(mark, [{transform: 'scale(1)'}, {transform: 'scale(1.06)'}, {transform: 'scale(1)'}], {duration: 380, easing: 'ease-out', fill: 'none'});
   await wait(240);
   if (finished) return;

   // 3. "CV-MAKER" grows out of the mark and the lockup settles in the centre.
   play(word, [{opacity: 0, clipPath: 'inset(0 100% 0 0)'}, {opacity: 1, clipPath: 'inset(0 0 0 0)'}], {duration: 680});
   play(logo, [{transform: `translate(${markOnlyX}px, ${centerY}px)`}, {transform: `translate(${centerX}px, ${centerY}px)`}], {duration: 680});
   await wait(880);
   if (finished) return;

   // 4. The lockup glides onto the header logo while the page fades in underneath.
   const target = $('.nav .nav-bar > .nav-logo').getBoundingClientRect();
   const scale = target.height / lockupH;
   play(logo, [{transform: `translate(${centerX}px, ${centerY}px) scale(1)`}, {transform: `translate(${target.left}px, ${target.top}px) scale(${scale})`}], {duration: 820, easing: glide});
   play(bg, [{opacity: 1}, {opacity: 0}], {duration: 700, delay: 160});
   await wait(380);
   reveal();
   await wait(460);
   finish();
  };

  skipEvents.forEach(type => window.addEventListener(type, finish, {passive: true}));
  start();
 }
}
