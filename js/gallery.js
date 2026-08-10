/* ═══════════════════════════════════════════════════════════
   РИВЬЕРА ХОЛЛ — просмотрщик фото
   Открытие по тапу, свайпы, щипок и двойной тап для зума,
   перетаскивание увеличенного кадра, свайп вниз — закрыть.
   ═══════════════════════════════════════════════════════════ */
(() => {
'use strict';

const tiles = [...document.querySelectorAll('[data-shot]')];
if (!tiles.length) return;

const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
const shots = tiles.map(t => {
  const img = t.querySelector('img');
  return { src: t.dataset.full || img.currentSrc || img.src, cap: t.dataset.cap || '', alt: img.alt || '' };
});

/* ── разметка просмотрщика ──────────────────────────────── */
const lb = document.createElement('div');
lb.className = 'lb';
lb.setAttribute('role', 'dialog');
lb.setAttribute('aria-modal', 'true');
lb.setAttribute('aria-label', 'Просмотр фотографии');
lb.innerHTML = `
  <div class="lb__stage"><img class="lb__img" alt=""></div>
  <div class="lb__top">
    <span class="lb__count"></span>
    <button class="lb__x" type="button" aria-label="Закрыть">
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
    </button>
  </div>
  <button class="lb__nav lb__nav--prev" type="button" aria-label="Предыдущее фото">
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M15 5l-7 7 7 7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
  </button>
  <button class="lb__nav lb__nav--next" type="button" aria-label="Следующее фото">
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9 5l7 7-7 7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
  </button>
  <p class="lb__cap"></p>`;
document.body.appendChild(lb);

const stage = lb.querySelector('.lb__stage');
const img   = lb.querySelector('.lb__img');
const cap   = lb.querySelector('.lb__cap');
const count = lb.querySelector('.lb__count');
const prevB = lb.querySelector('.lb__nav--prev');
const nextB = lb.querySelector('.lb__nav--next');

const MAX = 4;                       // предел увеличения
let idx = 0, scale = 1, tx = 0, ty = 0;
let opener = null;                   // куда вернуть фокус

/* ── трансформация кадра ────────────────────────────────── */
const apply = (animate) => {
  img.classList.toggle('is-anim', !!animate && !calm);
  img.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;
  lb.classList.toggle('is-zoomed', scale > 1.02);
};

const reset = (animate) => { scale = 1; tx = 0; ty = 0; apply(animate); };

/* границы: увеличенный кадр не должен отрываться от экрана */
const clamp = () => {
  const r = img.getBoundingClientRect();
  const base = { w: r.width / scale, h: r.height / scale };
  const ox = Math.max(0, (base.w * scale - stage.clientWidth) / 2);
  const oy = Math.max(0, (base.h * scale - stage.clientHeight) / 2);
  tx = Math.min(ox, Math.max(-ox, tx));
  ty = Math.min(oy, Math.max(-oy, ty));
};

/* зум к точке экрана (x, y) */
const zoomTo = (next, x, y, animate) => {
  next = Math.min(MAX, Math.max(1, next));
  const r = img.getBoundingClientRect();
  const cx = r.left + r.width / 2;
  const cy = r.top + r.height / 2;
  const k = next / scale;
  tx = (tx - (x - cx)) * k + (x - cx);
  ty = (ty - (y - cy)) * k + (y - cy);
  scale = next;
  if (scale === 1) { tx = 0; ty = 0; } else clamp();
  apply(animate);
};

/* ── показ кадра ────────────────────────────────────────── */
const show = (i, animate) => {
  idx = (i + shots.length) % shots.length;
  const s = shots[idx];
  img.src = s.src;
  img.alt = s.alt;
  cap.textContent = s.cap;
  cap.hidden = !s.cap;
  count.textContent = `${idx + 1} / ${shots.length}`;
  reset(animate);
};

const open = (i, from) => {
  opener = from || null;
  show(i, false);
  lb.classList.add('is-open');
  document.body.classList.add('lb-lock');
  requestAnimationFrame(() => lb.classList.add('is-in'));
  lb.querySelector('.lb__x').focus({ preventScroll: true });
};

const close = () => {
  lb.classList.remove('is-in');
  const done = () => {
    lb.classList.remove('is-open');
    document.body.classList.remove('lb-lock');
    img.removeAttribute('src');
    if (opener) opener.focus({ preventScroll: true });
  };
  calm ? done() : setTimeout(done, 280);
};

const step = (dir) => show(idx + dir, false);

tiles.forEach((t, i) => t.addEventListener('click', () => open(i, t)));
lb.querySelector('.lb__x').addEventListener('click', close);
prevB.addEventListener('click', () => step(-1));
nextB.addEventListener('click', () => step(1));

/* одиночная фотография — стрелки не нужны */
if (shots.length < 2) { prevB.hidden = true; nextB.hidden = true; }

/* ── клавиатура ─────────────────────────────────────────── */
addEventListener('keydown', (e) => {
  if (!lb.classList.contains('is-open')) return;
  if (e.key === 'Escape')     { scale > 1 ? reset(true) : close(); }
  if (e.key === 'ArrowLeft')  step(-1);
  if (e.key === 'ArrowRight') step(1);
  if (e.key === '0')          reset(true);
});

/* ── колесо мыши: зум к курсору ─────────────────────────── */
stage.addEventListener('wheel', (e) => {
  e.preventDefault();
  zoomTo(scale * (e.deltaY < 0 ? 1.18 : 1 / 1.18), e.clientX, e.clientY, false);
}, { passive: false });

/* ── указатели: свайп, перетаскивание, щипок ────────────── */
const pts = new Map();
let start = null, pinch = null, moved = false, lastTap = 0;

const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const mid  = (a, b) => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });

stage.addEventListener('pointerdown', (e) => {
  if (e.target.closest('.lb__nav, .lb__x')) return;
  stage.setPointerCapture(e.pointerId);
  pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
  moved = false;

  if (pts.size === 2) {
    const [a, b] = [...pts.values()];
    pinch = { d: dist(a, b), s: scale, c: mid(a, b) };
    start = null;
  } else {
    start = { x: e.clientX, y: e.clientY, tx, ty, t: performance.now() };
  }
});

stage.addEventListener('pointermove', (e) => {
  if (!pts.has(e.pointerId)) return;
  pts.set(e.pointerId, { x: e.clientX, y: e.clientY });

  if (pts.size === 2 && pinch) {                       // щипок
    const [a, b] = [...pts.values()];
    const k = dist(a, b) / pinch.d;
    zoomTo(pinch.s * k, pinch.c.x, pinch.c.y, false);
    moved = true;
    return;
  }
  if (!start) return;

  const dx = e.clientX - start.x, dy = e.clientY - start.y;
  if (Math.abs(dx) > 6 || Math.abs(dy) > 6) moved = true;

  if (scale > 1) {                                     // тянем увеличенный кадр
    tx = start.tx + dx; ty = start.ty + dy;
    clamp(); apply(false);
  } else {                                             // листаем / тянем вниз
    tx = dx; ty = Math.max(0, dy);
    img.style.transform = `translate(${tx}px, ${ty}px)`;
    lb.style.opacity = String(Math.max(.35, 1 - ty / 420));
  }
});

const release = (e) => {
  if (!pts.has(e.pointerId)) return;
  const p = pts.get(e.pointerId);
  pts.delete(e.pointerId);

  if (pts.size === 1) { pinch = null; const [q] = [...pts.values()]; start = { x: q.x, y: q.y, tx, ty, t: performance.now() }; return; }
  if (pts.size > 0) return;
  pinch = null;
  lb.style.opacity = '';

  if (scale > 1) { start = null; return; }             // увеличенный кадр не листаем

  if (start && moved) {
    const dx = p.x - start.x, dy = p.y - start.y;
    const fast = performance.now() - start.t < 400;
    if (dy > 110 && dy > Math.abs(dx)) { close(); start = null; return; }
    if (Math.abs(dx) > (fast ? 45 : 90) && Math.abs(dx) > Math.abs(dy)) {
      step(dx < 0 ? 1 : -1); start = null; return;
    }
    reset(true);                                        // не хватило — вернуть на место
  } else if (start && !moved) {
    const now = performance.now();
    if (now - lastTap < 300) {                          // двойной тап — зум
      zoomTo(scale > 1.02 ? 1 : 2.6, p.x, p.y, true);
      lastTap = 0;
    } else {
      lastTap = now;
    }
  }
  start = null;
};

stage.addEventListener('pointerup', release);
stage.addEventListener('pointercancel', release);

/* закрытие по клику мимо фотографии (только мышью) */
stage.addEventListener('click', (e) => {
  if (e.pointerType === 'touch' || moved || scale > 1.02) return;
  if (e.target === stage) close();
});

/* ── адрес вида #p3 — можно делиться ссылкой на кадр ───── */
const fromHash = () => {
  const m = /^#p(\d+)$/.exec(location.hash);
  if (m) {
    const i = +m[1] - 1;
    if (i >= 0 && i < shots.length) open(i, tiles[i]);
  }
};
fromHash();
addEventListener('hashchange', fromHash);

})();
