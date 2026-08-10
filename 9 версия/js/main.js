document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Lenis Smooth Scroll
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smooth: true,
    });
    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    gsap.registerPlugin(ScrollTrigger);
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time)=>{ lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);

    // 2. Hero Animations
    gsap.from('.gs-reveal', { y: 50, opacity: 0, duration: 1.5, ease: 'power3.out', stagger: 0.2, delay: 0.2 });
    gsap.from('.gs-scale', { scale: 0.9, opacity: 0, duration: 1.5, ease: 'power3.out', delay: 0.5 });
    
    // Анимация волны в логотипе
    gsap.to('.hero-wave-icon path', {
        strokeDasharray: "100",
        strokeDashoffset: "0",
        duration: 2,
        ease: "power2.inOut",
        repeat: -1,
        yoyo: true
    });

    // 3. WOW-Эффект "Минимум текста" (Скролл-подсветка текста)
    const textBlocks = document.querySelectorAll('.text-block');
    textBlocks.forEach(block => {
        ScrollTrigger.create({
            trigger: block,
            start: "top 60%", // Когда текст доходит до середины экрана
            end: "top 30%",
            onEnter: () => block.classList.add('active'),
            onLeaveBack: () => block.classList.remove('active'),
        });
    });

    // 4. Аккуратные появления блоков
    gsap.utils.toArray('.gs-fade-up').forEach(el => {
        gsap.from(el, {
            y: 40, opacity: 0, duration: 1, ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 85%' }
        });
    });

    // 5. Пинтерест-маски (Шторка в форме волны)
    gsap.utils.toArray('.gs-mask').forEach(mask => {
        gsap.from(mask, {
            clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0 100%)',
            duration: 1.5, ease: 'power3.out',
            scrollTrigger: { trigger: mask, start: 'top 85%' }
        });
    });

    // 6. Легкий дорогой параллакс внутри фото
    gsap.utils.toArray('.gs-parallax').forEach(img => {
        gsap.to(img, {
            yPercent: -20, ease: 'none',
            scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true }
        });
    });

    // 7. Расширение видео-маски
    gsap.to('.gs-video-expand', {
        width: '100%', borderRadius: '40px',
        scrollTrigger: { trigger: '.video-section', start: 'top 75%', end: 'bottom bottom', scrub: true }
    });
});
