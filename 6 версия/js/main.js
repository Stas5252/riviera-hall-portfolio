/* ═══════════════════════════════════════════════════════════
   РИВЬЕРА ХОЛЛ — версия 6
   Вертикальная прокрутка. Галереи листаются вбок по кругу.
   ═══════════════════════════════════════════════════════════ */
(() => {
'use strict';

const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;

const panels = $$('.panel');

/* ═══════════ ПРЕЛОАДЕР ═══════════ */
/* полоса показывает настоящую загрузку картинок, а не таймер */
(() => {
  const fill = $('#gateFill');
  const shots = $$('img');
  const total = Math.max(1, shots.length);
  let done = 0, opened = false;

  const draw = () => { if (fill) fill.style.width = Math.round(done / total * 100) + '%'; };

  const open = () => {
    if (opened) return;
    opened = true;
    if (fill) fill.style.width = '100%';
    setTimeout(() => document.body.classList.add('go'), 260);
  };

  const tick = () => { done++; draw(); if (done >= total) setTimeout(open, 180); };

  shots.forEach(img => {
    if (img.complete) tick();
    else { img.addEventListener('load', tick, { once: true });
           img.addEventListener('error', tick, { once: true }); }
  });
  draw();

  addEventListener('load', () => setTimeout(open, 400));
  setTimeout(open, 6000);            // страховка на медленной сети
})();

/* ═══════════ ПОЯВЛЕНИЕ ЭКРАНОВ ═══════════ */
const reveal = new IntersectionObserver((es) => {
  es.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('live');
    reveal.unobserve(e.target);
  });
}, { threshold: .12, rootMargin: '0px 0px -6% 0px' });
panels.forEach(p => reveal.observe(p));

/* ═══════════ ШАПКА, ТОН И ПРОГРЕСС ═══════════ */
const hud = $('#hud');
const meterNo = $('#meterNo');
const meterFill = $('#meterFill');
$('#meterAll').textContent = String(panels.length).padStart(2, '0');

const PROBE = 80;                     // линия под шапкой: по ней определяем экран
let toneNow = '';

let ticking = false;
const onScroll = () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    ticking = false;
    const y = scrollY;

    // тон интерфейса — по экрану под шапкой
    let k = 0;
    for (let i = 0; i < panels.length; i++) if (panels[i].offsetTop <= y + PROBE) k = i;
    const t = panels[k].dataset.tone || 'light';
    if (t !== toneNow) { toneNow = t; document.body.dataset.tone = t; }

    hud.classList.toggle('dressed', y > innerHeight * .55);

    const room = document.documentElement.scrollHeight - innerHeight;
    meterFill.style.width = (room > 0 ? (y / room) * 100 : 0) + '%';

    // номер экрана, занимающего середину окна
    const mid = y + innerHeight / 2;
    let n = 0;
    for (let i = 0; i < panels.length; i++) if (panels[i].offsetTop <= mid) n = i;
    meterNo.textContent = String(n + 1).padStart(2, '0');
  });
};
addEventListener('scroll', onScroll, { passive: true });
addEventListener('resize', onScroll);
onScroll();

/* ═══════════ ГАЛЕРЕИ ПО КРУГУ ═══════════ */
/* Кадров немного, поэтому набор дублируется трижды и прокрутка
   бесшовно перескакивает на копию — лента листается бесконечно. */
$$('.rack').forEach(rack => {
  const set = [...rack.children];
  const count = set.length;
  if (!count) return;

  for (let c = 0; c < 2; c++) set.forEach(n => rack.appendChild(n.cloneNode(true)));

  let span = 0;                       // ширина одного набора

  const measure = () => {
    const kids = rack.children;
    span = kids[count].offsetLeft - kids[0].offsetLeft;
    if (span > 0 && rack.scrollLeft < 1) rack.scrollLeft = span;
  };

  const wrap = () => {
    if (span <= 0) return;
    if (rack.scrollLeft <= 1) rack.scrollLeft += span;
    else if (rack.scrollLeft >= span * 2 - 1) rack.scrollLeft -= span;
  };

  rack.addEventListener('scroll', wrap, { passive: true });
  addEventListener('resize', measure);
  addEventListener('load', measure);
  if (document.fonts) document.fonts.ready.then(measure);
  measure();

  /* Колесо намеренно не перехватываем: лента бесконечная, и человек,
     листающий страницу вниз с курсором над галереей, застрял бы в ней
     навсегда. Вертикальное колесо всегда листает страницу; полка
     тянется мышью, пальцем и горизонтальным жестом тачпада. */

  // перетаскивание мышью
  let down = false, sx = 0, sl = 0;
  rack.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'touch') return;
    down = true; sx = e.clientX; sl = rack.scrollLeft;
    rack.classList.add('drag');
    rack.setPointerCapture(e.pointerId);
  });
  rack.addEventListener('pointermove', (e) => {
    if (!down) return;
    rack.scrollLeft = sl - (e.clientX - sx);
  });
  const up = () => { down = false; rack.classList.remove('drag'); };
  rack.addEventListener('pointerup', up);
  rack.addEventListener('pointercancel', up);
});

/* ═══════════ СЧЁТЧИКИ ═══════════ */
const counters = new IntersectionObserver((es) => {
  es.forEach(e => {
    if (!e.isIntersecting) return;
    counters.unobserve(e.target);
    const el = e.target;
    const to = +el.dataset.to, suffix = el.dataset.suffix || '';
    if (calm) { el.textContent = to.toLocaleString('ru-RU') + suffix; return; }
    const t0 = performance.now(), dur = 1500;
    const step = (t) => {
      const k = Math.min(1, (t - t0) / dur);
      el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3))).toLocaleString('ru-RU') + suffix;
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });
}, { threshold: .5 });
$$('.num').forEach(el => counters.observe(el));

/* ═══════════ ФОРМА ═══════════ */
const ask = $('#ask');
ask.addEventListener('submit', (e) => {
  e.preventDefault();
  const need = [...ask.querySelectorAll('[required]')];
  const bad = need.find(i => !i.value.trim());
  if (bad) { bad.focus(); bad.style.borderColor = '#E8A0A0'; return; }
  need.forEach(i => i.style.borderColor = '');
  // TODO: отправка на почту / в CRM / в Telegram-бота
  $('#askOk').classList.add('on');
  ask.reset();
});

})();
