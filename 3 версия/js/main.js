document.addEventListener('DOMContentLoaded', () => {

    // ============================
    // 1. PRELOADER
    // ============================
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('done');
        }, 1500);
    });
    // Fallback — убрать прелоадер через 3 сек в любом случае
    setTimeout(() => preloader.classList.add('done'), 3000);

    // ============================
    // 2. NAVBAR на скролле
    // ============================
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 80);
    });

    // ============================
    // 3. SCROLL REVEAL ANIMATIONS
    // ============================
    const revealElements = document.querySelectorAll('.reveal-up');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    revealElements.forEach(el => revealObserver.observe(el));

    // ============================
    // 4. HERO BACKGROUND SLIDER (Ken Burns)
    // ============================
    const heroSlides = document.querySelectorAll('.hero-slide');
    let currentHeroSlide = 0;
    
    if (heroSlides.length > 1) {
        setInterval(() => {
            heroSlides[currentHeroSlide].classList.remove('active');
            currentHeroSlide = (currentHeroSlide + 1) % heroSlides.length;
            heroSlides[currentHeroSlide].classList.add('active');
        }, 6000);
    }

    // ============================
    // 5. FULLSCREEN SLIDERS (Выездная церемония и банкеты)
    // ============================
    const fullSliders = document.querySelectorAll('.auto-slider-fullwidth');
    
    fullSliders.forEach(slider => {
        const slides = slider.querySelectorAll('.fs-slide');
        const counterCurrent = slider.querySelector('.current-slide');
        const progressBar = slider.querySelector('.slider-progress-bar');
        let currentSlide = 0;
        const INTERVAL = 4000;

        function nextSlide() {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
            
            if (counterCurrent) {
                counterCurrent.textContent = String(currentSlide + 1).padStart(2, '0');
            }
            
            // Перезапуск анимации прогресс-бара
            if (progressBar) {
                progressBar.style.animation = 'none';
                progressBar.offsetHeight; // force reflow
                progressBar.style.animation = `slider-timer ${INTERVAL}ms linear forwards`;
            }
        }

        setInterval(nextSlide, INTERVAL);
    });

    // ============================
    // 6. ANIMATED COUNTERS (Статистика)
    // ============================
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.getAttribute('data-target'));
                animateCounter(el, target);
                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(el => counterObserver.observe(el));

    function animateCounter(el, target) {
        const duration = 2000;
        const start = performance.now();
        
        function update(currentTime) {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing (ease-out cubic)
            const eased = 1 - Math.pow(1 - progress, 3);
            
            el.textContent = Math.round(eased * target);
            
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }
        requestAnimationFrame(update);
    }

    // ============================
    // 7. HORIZONTAL GALLERY (Drag to scroll)
    // ============================
    const hGalleries = document.querySelectorAll('.horizontal-gallery');
    
    hGalleries.forEach(gallery => {
        let isDown = false;
        let startX;
        let scrollLeft;

        gallery.addEventListener('mousedown', (e) => {
            isDown = true;
            gallery.style.cursor = 'grabbing';
            startX = e.pageX - gallery.offsetLeft;
            scrollLeft = gallery.scrollLeft;
        });
        gallery.addEventListener('mouseleave', () => { isDown = false; gallery.style.cursor = 'grab'; });
        gallery.addEventListener('mouseup', () => { isDown = false; gallery.style.cursor = 'grab'; });
        gallery.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - gallery.offsetLeft;
            const walk = (x - startX) * 2;
            gallery.scrollLeft = scrollLeft - walk;
        });
    });

    // ============================
    // 8. PARALLAX IMAGE (лёгкий эффект)
    // ============================
    const parallaxImg = document.querySelector('.parallax-image img');
    if (parallaxImg) {
        window.addEventListener('scroll', () => {
            const rect = parallaxImg.parentElement.getBoundingClientRect();
            const speed = 0.3;
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const offset = (window.innerHeight - rect.top) * speed;
                parallaxImg.style.transform = `translateY(-${offset * 0.15}px)`;
            }
        });
    }

    // ============================
    // 9. SMOOTH SCROLL
    // ============================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ============================
    // 10. FORM SUBMISSION
    // ============================
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('.submit-btn span');
            const originalText = btn.textContent;
            btn.textContent = 'Отправляем...';
            
            setTimeout(() => {
                btn.textContent = 'Успешно отправлено ✓';
                form.reset();
                setTimeout(() => { btn.textContent = originalText; }, 3000);
            }, 1200);
        });
    }

});
