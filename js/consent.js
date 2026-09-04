/* ═══════════════════════════════════════════════════════════
   РИВЬЕРА ХОЛЛ — cookie и веб-аналитика
   Подключается на КАЖДОЙ странице. Баннер рисует сам, поэтому
   его разметку не нужно дублировать по файлам.
   Яндекс.Метрика стартует только после явного «Принять».
   ═══════════════════════════════════════════════════════════ */
(() => {
'use strict';

const METRIKA_ID = '112129398';                 // ← номер счётчика Яндекс.Метрики
const KEY = 'rh-cookie';
const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ── загрузка счётчика ──────────────────────────────────── */
const loadMetrika = () => {
  if (!METRIKA_ID || window.ym) return;
  (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
   m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0];
   k.async=1;k.src=r;a.parentNode.insertBefore(k,a)})
   (window,document,'script','https://mc.yandex.ru/metrika/tag.js','ym');
  ym(METRIKA_ID, 'init', {
    webvisor: true,          // проверьте маскирование полей в настройках счётчика
    clickmap: true,
    trackLinks: true,
    accurateTrackBounce: true
  });
};

/* цель — доступна всем скриптам страницы */
window.rhGoal = (goal) => { if (window.ym && METRIKA_ID) ym(METRIKA_ID, 'reachGoal', goal); };

/* На площадку чаще звонят, чем пишут. Считаем клики по телефону и мессенджерам,
   иначе Метрика увидит десятую часть обращений, а Директ будет учиться на ней. */
addEventListener('click', (e) => {
  const a = e.target.closest('a[href]');
  if (!a) return;
  const href = a.getAttribute('href') || '';
  if (href.startsWith('tel:'))                       window.rhGoal('call_click');
  else if (/wa\.me|whatsapp/i.test(href))            window.rhGoal('whatsapp_click');
  else if (/t\.me|telegram/i.test(href))             window.rhGoal('telegram_click');
  else if (/vk\.com|max\.ru/i.test(href))            window.rhGoal('messenger_click');
}, { passive: true });

/* ── баннер ─────────────────────────────────────────────── */
const saved = localStorage.getItem(KEY);
if (saved === 'yes') { loadMetrika(); return; }
if (saved === 'no') return;

const box = document.createElement('div');
box.className = 'cookie';
box.setAttribute('role', 'dialog');
box.setAttribute('aria-label', 'Использование cookie');
box.innerHTML = `
  <p class="cookie__text">Мы используем cookie, чтобы сайт работал и чтобы понимать, какие
  страницы вам интересны. Аналитику включаем только с вашего согласия —
  <a href="privacy.html">подробнее в Политике</a>.</p>
  <div class="cookie__row">
    <button type="button" class="cookie__btn cookie__btn--no">Отклонить</button>
    <button type="button" class="cookie__btn cookie__btn--yes">Принять</button>
  </div>`;

const mount = () => {
  document.body.appendChild(box);
  requestAnimationFrame(() => box.classList.add('on'));

  const decide = (answer) => {
    localStorage.setItem(KEY, answer);
    box.classList.remove('on');
    setTimeout(() => box.remove(), calm ? 0 : 450);
    if (answer === 'yes') loadMetrika();
  };
  box.querySelector('.cookie__btn--yes').addEventListener('click', () => decide('yes'));
  box.querySelector('.cookie__btn--no').addEventListener('click', () => decide('no'));
};

document.readyState === 'loading'
  ? addEventListener('DOMContentLoaded', mount)
  : mount();

})();
