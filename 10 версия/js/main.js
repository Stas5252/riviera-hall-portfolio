document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Плавный скролл (Lenis)
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smooth: true,
        // Оптимизация производительности
        smoothTouch: false,
    });
    
    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    gsap.registerPlugin(ScrollTrigger);
    
    // Обновляем ScrollTrigger при скролле Lenis
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time)=>{ lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);

    // ВАЖНО: Обновляем триггеры, когда все тяжелые картинки загрузятся
    window.addEventListener('load', () => {
        ScrollTrigger.refresh();
    });

    // 2. Анимация появления Hero
    gsap.from('.gs-reveal', { y: 30, opacity: 0, duration: 1.2, ease: 'power2.out', stagger: 0.2 });
    gsap.from('.gs-scale', { scale: 0.95, opacity: 0, duration: 1.2, ease: 'power2.out', delay: 0.4 });
    
    // 3. Крутящийся бейдж (Пинтерест деталь)
    gsap.to('.rotating-badge svg', {
        rotation: 360,
        duration: 20,
        repeat: -1,
        ease: "none"
    });

    // 4. Скролл-подсветка текста (Минимум текста эффект)
    const textBlocks = document.querySelectorAll('.t-block');
    textBlocks.forEach(block => {
        ScrollTrigger.create({
            trigger: block,
            start: "top 65%",
            end: "top 35%",
            onEnter: () => block.classList.add('active'),
            onLeaveBack: () => block.classList.remove('active'),
        });
    });

    // 5. Плавное всплытие блоков (Оптимизировано, без тяжелых clip-path для всех фото)
    gsap.utils.toArray('.gs-fade-up').forEach(el => {
        gsap.from(el, {
            y: 40, opacity: 0, duration: 1, ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 90%' }
        });
    });

    // Вместо сложной шторки используем простой scale + opacity для галерей, чтобы не тормозило
    gsap.utils.toArray('.gs-mask').forEach(el => {
        gsap.from(el, {
            y: 30, opacity: 0, duration: 1, ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 90%' }
        });
    });

    // 6. Легкий параллакс внутри фото
    gsap.utils.toArray('.gs-parallax').forEach(img => {
        gsap.to(img, {
            yPercent: -15, ease: 'none',
            scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true }
        });
    });

    // 7. Расширение видео (Пинтерест деталь)
    gsap.to('.gs-video-expand', {
        width: '100%', borderRadius: '24px',
        scrollTrigger: { trigger: '.video-section', start: 'top 80%', end: 'bottom bottom', scrub: true }
    });
});
