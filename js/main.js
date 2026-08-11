/* ═══════════════════════════════════════════════════════════
   РИВЬЕРА ХОЛЛ — версия 4 · сценарии
   ═══════════════════════════════════════════════════════════ */
(() => {
'use strict';

const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Скрипт подключается и к страницам без шапки и меню — там этих узлов нет.
   Поэтому всё, что зависит от разметки главной, проверяется на существование. */

/* ── занавес ────────────────────────────────────────────── */
setTimeout(() => document.body.classList.add('ready'), 900);

/* ── шапка: прячется вниз, темнеет после героя ──────────── */
const bar = $('#bar');
let lastY = 0;
const onBar = () => {
  if (!bar) return;
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
  burger?.setAttribute('aria-expanded', open ? 'true' : 'false');
  drawer?.setAttribute('aria-hidden', open ? 'false' : 'true');
};
if (burger) {
  setNav(false);
  burger.addEventListener('click', () => setNav(!document.body.classList.contains('nav-open')));
  $$('#drawer a').forEach(a => a.addEventListener('click', () => setNav(false)));
  addEventListener('keydown', (e) => { if (e.key === 'Escape') setNav(false); });
}

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

const bookBox   = $('#book');

const onScroll = () => {
  onBar();

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
    const delay = +(el.dataset.delay || 0);
    
    setTimeout(() => {
      const t0 = performance.now(), dur = 1500;
      const step = (t) => {
        const k = Math.min(1, (t - t0) / dur);
        const eased = 1 - Math.pow(1 - k, 3);
        el.textContent = Math.round(to * eased).toLocaleString('ru-RU') + suffix;
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, delay);
  });
}, { threshold: .25 });
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


/* ── форма ──────────────────────────────────────────────── */
const form = $('#form');
if (form) {
  const agree = $('#agree');
  const okBox = $('#formOk');

  const okTitle = okBox.querySelector('.form__ok-title');
  const okSub   = okBox.querySelector('.form__ok-sub');

  const sayOk = () => {
    form.classList.add('form--sent');          // прячем поля, остаётся благодарность
    okBox.classList.remove('form__ok--err');
    okBox.classList.add('on');
  };
  const sayErr = (text) => {
    okTitle.textContent = 'Заявка не отправилась';
    okSub.textContent = text;
    okBox.classList.add('form__ok--err', 'on');
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const need = [...form.querySelectorAll('input[required]')];
    const bad = need.find(i => !i.value.trim());
    if (bad) { bad.focus(); bad.style.borderColor = '#E8A0A0'; return; }
    need.forEach(i => i.style.borderColor = '');

    if (agree && !agree.checked) {
      agree.closest('.agree').classList.add('agree--err');
      agree.focus();
      return;
    }
    agree?.closest('.agree').classList.remove('agree--err');

    const btn = form.querySelector('.send');
    btn.disabled = true;
    btn.classList.add('is-sending');

    const payload = Object.fromEntries(new FormData(form).entries());
    payload.page = location.href;
    payload.ts = new Date().toISOString();

    try {
      // ENDPOINT задаётся после выбора хостинга: почта, Telegram-бот или CRM
      const ENDPOINT = form.dataset.endpoint || '';
      if (!ENDPOINT) throw new Error('endpoint not configured');

      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('HTTP ' + res.status);

      sayOk();
      window.rhGoal?.('form_sent');
      form.reset();
    } catch (err) {
      // молча терять заявку нельзя — показываем телефон
      // Селектор .mgr__tel остался от прежней вёрстки, такого узла на странице нет —
      // сообщение выходило оборванным: «Позвоните, пожалуйста, напрямую:» и пустота.
      const tel = document.querySelector('.booking-contacts b, .drawer__tel')?.textContent.trim();
      sayErr(tel ? 'Позвоните, пожалуйста, напрямую: ' + tel
                 : 'Попробуйте, пожалуйста, позвонить нам напрямую.');
      console.error('Форма не отправлена:', err);
    } finally {
      btn.disabled = false;
      btn.classList.remove('is-sending');
    }
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
    // (на страницах галерей и документов шапки нет — отсюда проверка)
    const off = id === '#top' ? 0 : (bar ? bar.offsetHeight + 10 : 10);
    scrollTo({ top: Math.max(0, t.getBoundingClientRect().top + scrollY - off), behavior: calm ? 'auto' : 'smooth' });
  });
});

/* ── карусель отзывов (Swiper) ──────────────────────────── */
/* Библиотека могла не догрузиться — без этой проверки падает весь скрипт,
   а вместе с ним меню, форма и счётчики. */
if ($('.reviews-slider') && window.Swiper) {
  new Swiper('.reviews-slider', {
    /* speed:0 при включённом «уменьшить движение» — не косметика, а починка.
       В CSS для таких пользователей стоит transition-duration:.01ms !important,
       оно перебивает 300ms, которые Swiper ставит инлайном. Событие transitionend
       при такой длительности не приходит, Swiper остаётся с animating:true
       и после первого клика стрелки перестают листать совсем.
       С нулевой скоростью он переключает слайд сразу, без ожидания анимации. */
    speed: calm ? 0 : 300,
    /* Было loop:true — и карусель не листалась вообще: стрелки нажимаются,
       activeIndex не меняется, слайд отщёлкивает назад. Режим loop в Swiper 11
       не уживается с этой связкой: slidesPerView:'auto' + centeredSlides +
       overflow:visible у контейнера (он нужен, чтобы на десктопе выглядывали
       соседние карточки). Проверено перебором: с loop:false листается,
       с loop:true — нет, при прочих равных.
       rewind даёт то же ощущение бесконечности: после последнего отзыва
       переходим к первому, только без плавной склейки. */
    rewind: true,
    grabCursor: true,
    spaceBetween: 20,
    slidesPerView: 1,
    breakpoints: {
      900: {
        slidesPerView: 'auto',
        spaceBetween: 40,
      }
    },
    navigation: {
      nextEl: '.reviews-arrow--next',
      prevEl: '.reviews-arrow--prev',
    },
  });
}

})();
