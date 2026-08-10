document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Изменение фона navbar при скролле
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 2. Анимации при скролле (Intersection Observer)
    const animatedElements = document.querySelectorAll('.animate-up');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Отключаем наблюдение после появления
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => {
        scrollObserver.observe(el);
    });

    // 3. Аккордеон (Services)
    const accordionItems = document.querySelectorAll('.accordion-item');
    accordionItems.forEach(item => {
        item.addEventListener('click', () => {
            const icon = item.querySelector('.icon');
            if(icon.textContent === '+') {
                icon.textContent = '-';
            } else {
                icon.textContent = '+';
            }
            // В реальном проекте тут открывается контент
        });
    });

    // 4. Плавный скролл для якорных ссылок
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 100;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
  
                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // 5. Обработка формы (имитация)
    const form = document.querySelector('.elegant-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const btn = form.querySelector('.submit-btn');
            const originalText = btn.innerHTML;
            
            btn.innerHTML = 'ОТПРАВЛЯЕМ...';
            btn.style.opacity = '0.7';

            setTimeout(() => {
                btn.innerHTML = 'УСПЕШНО ОТПРАВЛЕНО &check;';
                
                form.reset();

                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.style.opacity = '1';
                }, 3000);
            }, 1500);
        });
    }
});
