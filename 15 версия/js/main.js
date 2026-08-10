// ================================================
// РИВЬЕРА ХОЛЛ — 15 ВЕРСИЯ (ART DIRECTOR CONCEPT)
// Cinematic GSAP & Scrollytelling
// ================================================

document.addEventListener('DOMContentLoaded', () => {
    gsap.registerPlugin(ScrollTrigger);

    // ===== 1. PRELOADER & HERO REVEAL =====
    const tlPreloader = gsap.timeline();
    tlPreloader
        .to('.preloader__text', { opacity: 0, duration: 0.5, delay: 0.5 })
        .to('.preloader', { yPercent: -100, duration: 1, ease: 'power4.inOut' })
        .call(() => document.body.classList.remove('is-loading'))
        .fromTo('.hero-art__slide.active', 
            { scale: 1.1 }, 
            { scale: 1, duration: 2, ease: 'power3.out' }, 
            "-=0.5"
        )
        .to('.word', { y: 0, duration: 1.5, stagger: 0.2, ease: 'power4.out' }, "-=1.5")
        .to('.hero-art__bottom', { opacity: 1, duration: 1, ease: 'power2.out' }, "-=1");

    // ===== 2. HERO SLIDER (Сверхмедленный кинематографичный) =====
    const slides = document.querySelectorAll('.hero-art__slide');
    if (slides.length > 1) {
        let currentSlide = 0;
        setInterval(() => {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }, 8000); // 8 секунд на кадр
    }

    // Параллакс самого слайдера при скролле вниз
    gsap.to('.hero-art__bg-container', {
        yPercent: 20,
        ease: 'none',
        scrollTrigger: { trigger: '.hero-art', start: 'top top', end: 'bottom top', scrub: true }
    });

    // ===== 3. НАВИГАЦИЯ =====
    const nav = document.querySelector('.nav-art');
    ScrollTrigger.create({
        trigger: '.editorial-about',
        start: 'top top+=100',
        onEnter: () => nav.classList.add('nav-art--scrolled'),
        onLeaveBack: () => nav.classList.remove('nav-art--scrolled')
    });

    // ===== 4. PARALLAX SCROLLYTELLING (Контролируемое смещение) =====
    // Уменьшил множитель со 200 до 80, чтобы элементы не "улетали" слишком далеко и не ломали верстку
    if (window.innerWidth > 1024) {
        gsap.utils.toArray('[data-speed]').forEach(el => {
            const speed = parseFloat(el.getAttribute('data-speed'));
            const yOffset = (1 - speed) * 80; 
            
            gsap.fromTo(el, 
                { y: -yOffset }, 
                { 
                    y: yOffset,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: el,
                        start: 'top bottom',
                        end: 'bottom top',
                        scrub: true
                    }
                }
            );
        });
    }

    // ===== 5. АНИМАЦИЯ ПОЯВЛЕНИЯ ЛИНИЙ (КРЕМ ДЛЯ РУК) =====
    if(window.innerWidth > 1024) {
        gsap.utils.toArray('.art-point').forEach(point => {
            const line = point.querySelector('.art-line');
            if(line) {
                const targetWidth = getComputedStyle(line).width;
                
                gsap.fromTo(line, 
                    { width: 0, opacity: 0 },
                    { 
                        width: targetWidth, opacity: 0.3, duration: 1.5, ease: 'power3.inOut',
                        scrollTrigger: { trigger: '.art-center', start: 'top 50%' }
                    }
                );
                
                gsap.from(point, {
                    opacity: 0, y: 10, duration: 1, delay: 0.5,
                    scrollTrigger: { trigger: '.art-center', start: 'top 50%' }
                });
            }
        });
    }

    // ===== 6. REFRESH =====
    window.addEventListener('load', () => {
        ScrollTrigger.refresh();
    });
});
