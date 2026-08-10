// ================================================
// РИВЬЕРА ХОЛЛ — 12 МЕГА-ФИНАЛЬНАЯ ВЕРСИЯ
// Нативный скролл + GSAP анимации + Кастомный курсор
// ================================================

document.addEventListener('DOMContentLoaded', () => {
    gsap.registerPlugin(ScrollTrigger);

    // ===== 1. КАСТОМНЫЙ КУРСОР =====
    const cursor = document.getElementById('cursor');
    if (cursor && window.innerWidth > 768) {
        let cx = 0, cy = 0, tx = 0, ty = 0;

        document.addEventListener('mousemove', (e) => {
            tx = e.clientX; ty = e.clientY;
        });

        function updateCursor() {
            cx += (tx - cx) * 0.12;
            cy += (ty - cy) * 0.12;
            cursor.style.transform = `translate(${cx}px, ${cy}px)`;
            requestAnimationFrame(updateCursor);
        }
        updateCursor();

        // Hover-эффект на кликабельных элементах
        document.querySelectorAll('a, button, .grid__item, .video').forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('cursor--hover'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('cursor--hover'));
        });
    }

    // ===== 2. НАВИГАЦИЯ =====
    const nav = document.getElementById('nav');
    ScrollTrigger.create({
        trigger: '#hero',
        start: 'bottom top+=100',
        onEnter: () => nav.classList.add('nav--scrolled'),
        onLeaveBack: () => nav.classList.remove('nav--scrolled'),
    });

    // ===== 3. HERO ВХОД =====
    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    heroTl
        .to('.anim-fade', { opacity: 1, duration: 1.4, stagger: 0.2 }, 0.5)
        .to('.anim-word', { y: 0, duration: 1.6, stagger: 0.15, ease: 'power4.out' }, 0.3);

    // Легкий параллакс на Hero фото
    const heroBg = document.getElementById('heroBg');
    if (heroBg) {
        gsap.to(heroBg, {
            yPercent: 15,
            ease: 'none',
            scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true }
        });
    }

    // ===== 4. ПОЯВЛЕНИЕ БЛОКОВ =====
    gsap.utils.toArray('.anim-up').forEach(el => {
        gsap.to(el, {
            y: 0, opacity: 1, duration: 1, ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 88%' }
        });
    });

    // ===== 5. ГАЛЕРЕИ — STAGGER =====
    document.querySelectorAll('.grid').forEach(grid => {
        const items = grid.querySelectorAll('.grid__item');
        gsap.to(items, {
            y: 0, opacity: 1, duration: 0.9, stagger: 0.12, ease: 'power2.out',
            scrollTrigger: { trigger: grid, start: 'top 85%' }
        });
    });

    // ===== 6. ДЕКОРАТИВНАЯ ЛИНИЯ =====
    gsap.to('.anim-line', {
        scaleX: 1, duration: 1.5, ease: 'power2.inOut',
        scrollTrigger: { trigger: '.divider-section', start: 'top 80%' }
    });

    // ===== 7. COUNTUP ЧИСЕЛ =====
    document.querySelectorAll('.facts__num[data-count]').forEach(el => {
        const target = parseInt(el.dataset.count);
        if (isNaN(target)) return;
        const suffix = target === 10 ? '+' : '';
        const obj = { val: 0 };
        gsap.to(obj, {
            val: target, duration: 2.2, ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 88%' },
            onUpdate: () => { el.textContent = Math.floor(obj.val) + suffix; }
        });
    });

    // ===== 8. ПАРАЛЛАКС ВИДЕО =====
    const videoImg = document.querySelector('.video img');
    if (videoImg) {
        gsap.to(videoImg, {
            yPercent: -8, ease: 'none',
            scrollTrigger: { trigger: '.video', start: 'top bottom', end: 'bottom top', scrub: true }
        });
    }

    // ===== 9. REFRESH ПОСЛЕ ЗАГРУЗКИ ВСЕХ ФОТО =====
    window.addEventListener('load', () => {
        ScrollTrigger.refresh();
    });
});
