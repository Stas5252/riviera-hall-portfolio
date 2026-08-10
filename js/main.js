/* ═══════════════════════════════════════════════════════════
   РИВЬЕРА ХОЛЛ — версия 4 · сценарии
   ═══════════════════════════════════════════════════════════ */
(() => {
'use strict';

const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ── занавес ────────────────────────────────────────────── */
addEventListener('load', () => setTimeout(() => document.body.classList.add('ready'), 900));
setTimeout(() => document.body.classList.add('ready'), 3200); // страховка

/* ── шапка: прячется вниз, темнеет после героя ──────────── */
const bar = $('#bar');
let lastY = 0;
const onBar = () => {
  const y = scrollY;
  bar.classList.toggle('solid', y > innerHeight * .45);
  bar.classList.toggle('tuck', y > lastY && y > innerHeight * .75 && !document.body.classList.contains('nav-open'));
  lastY = y;
};

/* ── мобильное меню ─────────────────────────────────────── */
const burger = $('#burger');
const drawer = $('#drawer');
let lockY = 0;                                     // куда вернуть страницу после закрытия
const setNav = (open) => {
  const body = document.body;
  if (open) lockY = scrollY;
  body.classList.toggle('nav-open', open);
  body.classList.toggle('lock', open);             // блокируем прокрутку под меню
  if (open) {
    body.style.top = `-${lockY}px`;
  } else if (body.style.top) {
    body.style.top = '';
    scrollTo({ top: lockY, behavior: 'instant' });
  }
  burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  if (drawer) drawer.setAttribute('aria-hidden', open ? 'false' : 'true');
};
setNav(false);
burger.addEventListener('click', () => setNav(!document.body.classList.contains('nav-open')));
$$('#drawer a').forEach(a => a.addEventListener('click', () => setNav(false)));
addEventListener('keydown', (e) => { if (e.key === 'Escape') setNav(false); });

/* ── смена кадров в героe ───────────────────────────────── */
const shots = $$('#heroStack .shot');
if (shots.length > 1 && !calm) {
  let i = 0;
  setInterval(() => {
    shots[i].classList.remove('is-on');
    i = (i + 1) % shots.length;
    shots[i].classList.add('is-on');
  }, 5200);
}

/* ── первый экран закреплён; контент наезжает сверху ────── */
const heroType  = $('.hero__lower');
const portalImg = $('#portalImg');
const portalBox = portalImg && portalImg.parentElement;
const dock      = $('#dock');
const bookBox   = $('#book');

const onScroll = () => {
  onBar();

  // мобильная панель действий: после первого экрана и до формы заявки
  if (dock) {
    const formNear = bookBox && bookBox.getBoundingClientRect().top < innerHeight * .75;
    document.body.classList.toggle('dock-on', scrollY > innerHeight * .85 && !formNear);
  }

  // 0 → 1 по мере ухода первого экрана: текст мягко уходит вглубь
  if (heroType) {
    const p = Math.min(1, Math.max(0, scrollY / (innerHeight * .8)));
    const o = (1 - p * 1.15).toFixed(3);
    heroType.style.opacity = o;
    heroType.style.transform = `translateY(${(-p * 40).toFixed(1)}px)`;
  }

  // параллакс внутри арки-портала
  if (portalBox) {
    const b = portalBox.getBoundingClientRect();
    if (b.bottom > 0 && b.top < innerHeight) {
      const k = (b.top + b.height / 2 - innerHeight / 2) / innerHeight; // −1…1
      portalImg.style.transform = `translateY(${(k * 9).toFixed(2)}%)`;
    }
  }
};
addEventListener('scroll', onScroll, { passive: true });
addEventListener('resize', onScroll);
onScroll();

/* ── появление блоков ───────────────────────────────────── */
const seen = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('on'); seen.unobserve(e.target); }
  });
}, { threshold: .12, rootMargin: '0px 0px -8% 0px' });
$$('.rise').forEach(el => seen.observe(el));

/* ── счётчики ───────────────────────────────────────────── */
const counters = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    counters.unobserve(e.target);
    const el = e.target;
    const to = +el.dataset.to;
    const suffix = el.dataset.suffix || '';
    if (calm) { el.textContent = to.toLocaleString('ru-RU') + suffix; return; }
    const t0 = performance.now(), dur = 1500;
    const step = (t) => {
      const k = Math.min(1, (t - t0) / dur);
      const eased = 1 - Math.pow(1 - k, 3);
      el.textContent = Math.round(to * eased).toLocaleString('ru-RU') + suffix;
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });
}, { threshold: .6 });
$$('.num').forEach(el => counters.observe(el));

/* ── медальон с фото у списка услуг ─────────────────────── */
const peek = $('#peek'), peekImg = $('#peekImg'), roster = $('#roster');
if (peek && roster && matchMedia('(pointer:fine)').matches) {
  let x = innerWidth / 2, y = innerHeight / 2, cx = x, cy = y, live = false;

  roster.addEventListener('pointerover', (e) => {
    const li = e.target.closest('li');
    if (!li) return;
    peekImg.src = li.dataset.img;
    peek.classList.add('on');
    live = true;
  });
  roster.addEventListener('pointerout', (e) => {
    if (e.relatedTarget && roster.contains(e.relatedTarget)) return;
    peek.classList.remove('on');
    live = false;
  });
  addEventListener('pointermove', (e) => { x = e.clientX; y = e.clientY; }, { passive: true });

  const glide = () => {
    cx += (x - cx) * .13;
    cy += (y - cy) * .13;
    if (live) peek.style.translate = `${cx}px ${cy}px`;
    requestAnimationFrame(glide);
  };
  peek.style.left = '0'; peek.style.top = '0';
  glide();
}

/* ── горизонтальная галерея: колесо + перетаскивание ────── */
$$('[data-rail]').forEach(rail => {
  rail.addEventListener('wheel', (e) => {
    if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
    const room = rail.scrollWidth - rail.clientWidth;
    const next = rail.scrollLeft + e.deltaY;
    if (next > 0 && next < room) { e.preventDefault(); rail.scrollLeft = next; }
  }, { passive: false });

  // перетаскивание — только мышью: на тач-экранах работает родная прокрутка,
  // иначе она складывалась бы с ручной и лента «улетала» вдвое быстрее
  let down = false, sx = 0, sl = 0;
  rail.addEventListener('pointerdown', (e) => {
    if (e.pointerType !== 'mouse') return;
    down = true; sx = e.clientX; sl = rail.scrollLeft;
    rail.classList.add('drag'); rail.setPointerCapture(e.pointerId);
  });
  rail.addEventListener('pointermove', (e) => {
    if (!down) return;
    rail.scrollLeft = sl - (e.clientX - sx);
  });
  const up = () => { down = false; rail.classList.remove('drag'); };
  rail.addEventListener('pointerup', up);
  rail.addEventListener('pointercancel', up);
});

/* ── отзывы ─────────────────────────────────────────────── */
const says = $$('#saysTrack .say');
const sayPics = $$('.says__pics img');
if (says.length) {
  let n = 0;
  const count = $('#sayCount');
  const show = (k) => {
    says[n].classList.remove('is-on');
    sayPics[n]?.classList.remove('is-on');
    n = (k + says.length) % says.length;
    says[n].classList.add('is-on');
    sayPics[n]?.classList.add('is-on');
    count.textContent = `${String(n + 1).padStart(2, '0')} / ${String(says.length).padStart(2, '0')}`;
  };
  $('#sayNext').addEventListener('click', () => show(n + 1));
  $('#sayPrev').addEventListener('click', () => show(n - 1));
  if (!calm) setInterval(() => show(n + 1), 8000);
}

/* ── форма ──────────────────────────────────────────────── */
const form = $('#form');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const need = [...form.querySelectorAll('[required]')];
    const bad = need.find(i => !i.value.trim());
    if (bad) { bad.focus(); bad.style.borderColor = '#E8A0A0'; return; }
    need.forEach(i => i.style.borderColor = '');
    // TODO: отправка на почту / в CRM / в Telegram-бота
    $('#formOk').classList.add('on');
    form.reset();
  });
}

/* ── плавный переход по якорям с учётом шапки ───────────── */
$$('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href');
    if (id.length < 2) return;
    const t = $(id);
    if (!t) return;
    e.preventDefault();
    // отступ на высоту закреплённой шапки, чтобы заголовок не уезжал под неё
    const off = id === '#top' ? 0 : bar.offsetHeight + 10;
    scrollTo({ top: Math.max(0, t.getBoundingClientRect().top + scrollY - off), behavior: calm ? 'auto' : 'smooth' });
  });
});

})();
