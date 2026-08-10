// ================================================
// РИВЬЕРА ХОЛЛ — 13 ВЕРСИЯ (ЖУРНАЛЬНЫЙ ГЛЯНЕЦ)
// GSAP Анимации + Слайдер главного экрана
// ================================================

document.addEventListener('DOMContentLoaded', () => {
    gsap.registerPlugin(ScrollTrigger);

    // ===== 1. НАВИГАЦИЯ =====
    const nav = document.getElementById('nav');
    ScrollTrigger.create({
        trigger: '#hero',
        start: 'bottom top+=50',
        onEnter: () => nav.classList.add('nav--scrolled'),
        onLeaveBack: () => nav.classList.remove('nav--scrolled'),
    });

    // ===== 2. HERO СЛАЙДЕР =====
    const slides = document.querySelectorAll('.hero__slide');
    if (slides.length > 1) {
        let currentSlide = 0;
        setInterval(() => {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }, 5000); // Смена каждые 5 секунд
    }

    // ===== 3. ВСТУПИТЕЛЬНАЯ АНИМАЦИЯ (HERO) =====
    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    heroTl
        .to('.hero__title-top', { y: 0, opacity: 1, duration: 1.2, ease: 'power4.out' }, 0.2)
        .to('.hero__title-bottom', { y: 0, opacity: 1, duration: 1.2, ease: 'power4.out' }, 0.4)
        .to('.hero__subtitle', { y: 0, opacity: 1, duration: 1 }, 0.6)
        .to('.hero__scroll', { y: 0, opacity: 1, duration: 1 }, 0.8);

    // Легкий параллакс самого слайдера
    gsap.to('.hero__bg-slider', {
        yPercent: 20,
        ease: 'none',
        scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true }
    });

    // ===== 4. ПОЯВЛЕНИЕ ЭЛЕМЕНТОВ (FADE UP) =====
    gsap.utils.toArray('.anim-up').forEach(el => {
        gsap.to(el, {
            y: 0, opacity: 1, duration: 1.2, ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 85%' }
        });
    });

    // ===== 5. STAGGER АНИМАЦИИ ДЛЯ ГАЛЕРЕЙ И ТРИГГЕРОВ =====
    // Триггеры "О площадке"
    gsap.from('.trigger', {
        x: -20, opacity: 0, duration: 0.8, stagger: 0.1, ease: 'power2.out',
        scrollTrigger: { trigger: '.about__triggers', start: 'top 85%' }
    });

    // Линии в формате "Крема"
    gsap.from('.formats__path', {
        strokeDashoffset: 100, strokeDasharray: "100 100", duration: 2, ease: 'power2.out',
        scrollTrigger: { trigger: '.formats', start: 'top 60%' }
    });
    
    // Элементы в формате "Крема"
    gsap.from('.format-item', {
        opacity: 0, scale: 0.8, duration: 0.8, stagger: 0.15, ease: 'back.out(1.5)',
        scrollTrigger: { trigger: '.formats', start: 'top 60%' }
    });

    // ===== 6. ПАРАЛЛАКС ДЛЯ ФОТОГРАФИЙ (ОПЦИОНАЛЬНО) =====
    // Немного смещаем маленькое фото в блоке "О площадке"
    gsap.to('.arch-photo--small', {
        y: -40,
        ease: 'none',
        scrollTrigger: { trigger: '.about', start: 'top bottom', end: 'bottom top', scrub: true }
    });

    // ===== 7. ОБНОВЛЕНИЕ ПРИ ЗАГРУЗКЕ =====
    window.addEventListener('load', () => {
        ScrollTrigger.refresh();
    });
});
