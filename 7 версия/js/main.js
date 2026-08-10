// ========================================
// РИВЬЕРА ХОЛЛ — GSAP ANIMATIONS
// Чистый нативный скролл + Легкие WOW-появления
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    gsap.registerPlugin(ScrollTrigger);

    // --- Навигация: Смена стиля при скролле ---
    const nav = document.getElementById('nav');
    ScrollTrigger.create({
        trigger: '#hero',
        start: 'bottom top',
        onEnter: () => nav.classList.add('nav--scrolled'),
        onLeaveBack: () => nav.classList.remove('nav--scrolled'),
    });

    // --- Hero: Красивое появление ---
    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    heroTl
        .to('.anim-fade', { opacity: 1, duration: 1.2, stagger: 0.15 }, 0.3)
        .to('.hero__title-line > *', { y: 0, duration: 1.4, stagger: 0.12 }, 0.4);

    // --- Все блоки с anim-up: Плавное всплытие при скролле ---
    gsap.utils.toArray('.anim-up').forEach((el, i) => {
        gsap.to(el, {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: el,
                start: 'top 88%',
                toggleActions: 'play none none none',
            }
        });
    });

    // --- Mosaic: Лёгкий hover scale уже в CSS ---
    // --- Но добавим stagger для появления группами ---
    document.querySelectorAll('.mosaic').forEach(grid => {
        const items = grid.querySelectorAll('.mosaic__item');
        gsap.to(items, {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: grid,
                start: 'top 85%',
            }
        });
    });

    // --- Видео: Небольшой параллакс фонового изображения ---
    const videoImg = document.querySelector('.video-block img');
    if (videoImg) {
        gsap.to(videoImg, {
            yPercent: -10,
            ease: 'none',
            scrollTrigger: {
                trigger: '.video-block',
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
            }
        });
    }

    // --- Facts: Анимация чисел (Countup) ---
    document.querySelectorAll('.facts__number').forEach(el => {
        const target = el.textContent.replace('+','').replace('/','');
        const hasPlus = el.textContent.includes('+');
        const hasSlash = el.textContent.includes('/');
        const num = parseInt(target);
        
        if (!isNaN(num) && num < 10000) {
            const obj = { val: 0 };
            gsap.to(obj, {
                val: num,
                duration: 2,
                ease: 'power2.out',
                scrollTrigger: { trigger: el, start: 'top 85%' },
                onUpdate: () => {
                    el.textContent = Math.floor(obj.val) + (hasPlus ? '+' : '') + (hasSlash ? '/7' : '');
                }
            });
        }
    });

    // --- Крутящийся бейдж (если он есть) ---
    const badge = document.querySelector('.rotating-badge svg');
    if (badge) {
        gsap.to(badge, { rotation: 360, duration: 20, repeat: -1, ease: 'none' });
    }

    // --- Обновляем ScrollTrigger когда все картинки загрузились ---
    window.addEventListener('load', () => {
        ScrollTrigger.refresh();
    });
});
