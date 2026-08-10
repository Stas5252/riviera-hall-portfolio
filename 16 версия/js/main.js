// ================================================
// РИВЬЕРА ХОЛЛ — ВЕРСИЯ 16 (ULTIMATE LUXURY)
// Cinematic GSAP & Scrollytelling
// ================================================

document.addEventListener('DOMContentLoaded', () => {
    gsap.registerPlugin(ScrollTrigger);

    // ================= LENIS SMOOTH SCROLL =================
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
    });

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time)=>{
        lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    // 1. PRELOADER & HERO REVEAL
    const tlPreloader = gsap.timeline();
    tlPreloader
        .to('.preloader__logo', { opacity: 0, duration: 0.5, delay: 0.5 })
        .to('.preloader', { yPercent: -100, duration: 1, ease: 'power4.inOut' })
        .call(() => document.body.classList.remove('is-loading'))
        .to('.hero-logo', { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }, "-=0.2")
        .to('.v16-hero__title', { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' }, "-=0.8")
        .to('.v16-hero__bottom', { opacity: 1, duration: 1, ease: 'power2.out' }, "-=0.5");

    // 2. HERO SLIDER (Сверхмедленный кинематографичный crossfade)
    const slides = document.querySelectorAll('.v16-hero__slide');
    if (slides.length > 1) {
        let currentSlide = 0;
        setInterval(() => {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }, 8000); // 8 секунд
    }

    // Параллакс фона первого экрана
    gsap.to('.v16-hero__bg', {
        yPercent: 15,
        ease: 'none',
        scrollTrigger: {
            trigger: '.v16-hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true
        }
    });

    // 3. НАВИГАЦИЯ (Появление фона)
    const nav = document.querySelector('.nav-luxury');
    ScrollTrigger.create({
        trigger: '.v16-about',
        start: 'top top+=100',
        onEnter: () => nav.classList.add('nav-luxury--scrolled'),
        onLeaveBack: () => nav.classList.remove('nav-luxury--scrolled')
    });

    // 4. PARALLAX SCROLLYTELLING (Смещение элементов)
    if (window.innerWidth > 1024) {
        gsap.utils.toArray('[data-speed]').forEach(el => {
            const speed = parseFloat(el.getAttribute('data-speed'));
            // Ограниченный множитель (60), чтобы элементы не налетали друг на друга
            const yOffset = (1 - speed) * 60; 
            
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

    // 5. АНИМАЦИЯ ПОЯВЛЕНИЯ ЛИНИЙ В ЦЕНТРЕ (HANDCREAM)
    if(window.innerWidth > 1024) {
        gsap.utils.toArray('.core-point').forEach(point => {
            const line = point.querySelector('.cp-line');
            if(line) {
                const targetWidth = getComputedStyle(line).width;
                
                gsap.fromTo(line, 
                    { width: 0, opacity: 0 },
                    { 
                        width: targetWidth, opacity: 0.3, duration: 1.5, ease: 'power3.inOut',
                        scrollTrigger: {
                            trigger: '.v16-core',
                            start: 'top 60%'
                        }
                    }
                );
                
                gsap.from(point, {
                    opacity: 0, y: 15, duration: 1, delay: 0.5,
                    scrollTrigger: {
                        trigger: '.v16-core',
                        start: 'top 60%'
                    }
                });
            }
        });
    }

    // ================= ДОФАМИН ЭФФЕКТЫ =================

    // 6. КАСТОМНЫЙ КУРСОР
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    
    if (window.innerWidth > 1024 && cursorDot && cursorOutline) {
        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;
            
            // Dot follows exactly
            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;
            
            // Outline follows with slight delay using GSAP
            gsap.to(cursorOutline, {
                x: posX,
                y: posY,
                duration: 0.15,
                ease: 'power2.out'
            });
        });

        // Hover states
        const hoverElements = document.querySelectorAll('a, button, input, select, .arch-shape');
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                if(el.classList.contains('video-container') || el.closest('.video-container')) {
                    document.body.classList.add('hovering-play');
                } else {
                    document.body.classList.add('hovering');
                }
            });
            el.addEventListener('mouseleave', () => {
                document.body.classList.remove('hovering');
                document.body.classList.remove('hovering-play');
            });
        });
    }

    // 7. МАГНИТНЫЕ КНОПКИ
    const magneticBtns = document.querySelectorAll('.v16-btn-outline, .v16-btn-primary, .nav-luxury__btn');
    magneticBtns.forEach(btn => {
        btn.classList.add('magnetic-btn');
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            gsap.to(btn, {
                x: x * 0.3,
                y: y * 0.3,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
        
        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, {
                x: 0,
                y: 0,
                duration: 0.7,
                ease: 'elastic.out(1, 0.3)'
            });
        });
    });

    // 8. TEXT REVEAL ANIMATION (Дофаминовое появление текста)
    const revealTitles = document.querySelectorAll('.v16-h2:not(.v16-hero__title), .v16-desc');
    revealTitles.forEach(title => {
        // Оборачиваем содержимое
        title.innerHTML = `<span class="word-wrap"><span class="word-inner" style="display:inline-block">${title.innerHTML}</span></span>`;
        
        ScrollTrigger.create({
            trigger: title,
            start: 'top 85%',
            onEnter: () => title.querySelector('.word-wrap').classList.add('is-revealed')
        });
    });

    // Пересчет триггеров после загрузки картинок
    window.addEventListener('load', () => {
        ScrollTrigger.refresh();
    });
});
