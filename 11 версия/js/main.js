document.addEventListener('DOMContentLoaded', () => {
    
    // БЕЗ LENIS. Используем только нативный скролл браузера.
    gsap.registerPlugin(ScrollTrigger);

    // 1. Анимация появления Hero
    gsap.from('.gs-reveal', { y: 30, opacity: 0, duration: 1.2, ease: 'power2.out', stagger: 0.2 });
    
    // 2. Крутящийся бейдж (Пинтерест деталь)
    gsap.to('.rotating-badge svg', {
        rotation: 360,
        duration: 20,
        repeat: -1,
        ease: "none"
    });

    // 3. Плавное всплытие блоков по мере скролла
    gsap.utils.toArray('.gs-fade-up').forEach(el => {
        gsap.from(el, {
            y: 40, opacity: 0, duration: 1, ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 90%' }
        });
    });

    // 4. Анимация нарисованной стрелочки (Пинтерест стиль)
    const arrow = document.querySelector('.drawn-arrow');
    if(arrow) {
        gsap.to(arrow, {
            strokeDashoffset: 0,
            duration: 1.5,
            ease: "power2.out",
            scrollTrigger: { trigger: '.drawn-arrow-box', start: 'top 85%' }
        });
    }

    // ВАЖНО: Обновляем триггеры, когда все тяжелые картинки загрузятся
    window.addEventListener('load', () => {
        ScrollTrigger.refresh();
    });
});
