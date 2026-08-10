// ================================================
// РИВЬЕРА ХОЛЛ — 14 ВЕРСИЯ (АБСОЛЮТНЫЙ PREMIUM)
// ================================================

document.addEventListener('DOMContentLoaded', () => {
    gsap.registerPlugin(ScrollTrigger);

    // ===== 1. НАВИГАЦИЯ =====
    const nav = document.getElementById('nav');
    ScrollTrigger.create({
        trigger: '#hero',
        start: 'bottom top+=100',
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
        }, 6000); // Смена каждые 6 секунд (плавнее и медленнее для Premium-ощущения)
    }

    // ===== 3. ВСТУПИТЕЛЬНАЯ АНИМАЦИЯ =====
    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    heroTl
        .to('.hero__title-word', { y: 0, opacity: 1, duration: 1.5, stagger: 0.2, ease: 'power4.out' }, 0.2)
        .to('.hero__quote', { y: 0, opacity: 1, duration: 1.2 }, 0.8)
        .to('.hero__bottom', { opacity: 1, duration: 1 }, 1.2);

    // Легкий параллакс слайдера
    gsap.to('.hero__slider', {
        yPercent: 15,
        ease: 'none',
        scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true }
    });

    // ===== 4. ПОЯВЛЕНИЕ ЭЛЕМЕНТОВ (FADE UP & ZOOM) =====
    gsap.utils.toArray('.anim-up').forEach(el => {
        gsap.to(el, {
            y: 0, opacity: 1, duration: 1.2, ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 85%' }
        });
    });

    gsap.utils.toArray('.anim-zoom').forEach(el => {
        gsap.to(el, {
            scale: 1, opacity: 1, duration: 1.5, ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 85%' }
        });
    });

    // ===== 5. STAGGER АНИМАЦИИ (ТРИГГЕРЫ И ТОЧКИ) =====
    // Триггеры в अबाउट
    gsap.from('.trigger-pill', {
        y: 20, opacity: 0, duration: 0.8, stagger: 0.1, ease: 'power2.out',
        scrollTrigger: { trigger: '.about__triggers', start: 'top 85%' }
    });

    // Анимация линий в блоке "Шатер по центру"
    if(window.innerWidth > 1024) {
        gsap.utils.toArray('.service-point').forEach(point => {
            const line = point.querySelector('.point-line');
            const targetWidth = getComputedStyle(line).width;
            
            gsap.fromTo(line, 
                { width: 0, opacity: 0 },
                { 
                    width: targetWidth, opacity: 0.3, duration: 1.5, ease: 'power3.inOut',
                    scrollTrigger: { trigger: '.events-center', start: 'top 60%' }
                }
            );
            
            gsap.from(point, {
                opacity: 0, y: 10, duration: 1, delay: 0.5,
                scrollTrigger: { trigger: '.events-center', start: 'top 60%' }
            });
        });
    }

    // ===== 6. REFRESH =====
    window.addEventListener('load', () => {
        ScrollTrigger.refresh();
    });
});
