document.addEventListener('DOMContentLoaded', () => {

    gsap.registerPlugin(ScrollTrigger);

    // ============================
    // 1. CUSTOM MAGNETIC CURSOR
    // ============================
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');
    const magnetics = document.querySelectorAll('.magnetic');

    let posX = 0, posY = 0;
    let mouseX = 0, mouseY = 0;

    gsap.to({}, 0.016, {
        repeat: -1,
        onRepeat: function() {
            posX += (mouseX - posX) / 9;
            posY += (mouseY - posY) / 9;
            gsap.set(follower, {
                css: { left: posX, top: posY }
            });
            gsap.set(cursor, {
                css: { left: mouseX, top: mouseY }
            });
        }
    });

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    magnetics.forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            follower.classList.add('hover-active');
        });
        btn.addEventListener('mouseleave', () => {
            follower.classList.remove('hover-active');
            gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'power3.out' });
        });
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const strength = btn.dataset.strength || 20;
            const x = ((e.clientX - rect.left) / rect.width - 0.5) * strength;
            const y = ((e.clientY - rect.top) / rect.height - 0.5) * strength;
            gsap.to(btn, { x: x, y: y, duration: 0.5, ease: 'power3.out' });
        });
    });


    // ============================
    // 2. HERO ANIMATIONS
    // ============================
    // Text reveal
    gsap.to('.hero-title .word', {
        y: 0, opacity: 1, duration: 1.5,
        stagger: 0.2, ease: 'power4.out', delay: 0.2
    });

    // Hero tent strips
    gsap.from('.tent-strip', {
        y: 100, opacity: 0, duration: 1.2,
        stagger: 0.05, ease: 'power3.out', delay: 0.8
    });


    // ============================
    // 3. PARALLAX EFFECTS
    // ============================
    // Standard parallax images
    gsap.utils.toArray('.parallax-img').forEach(img => {
        const speed = img.dataset.speed || 1.1;
        gsap.to(img, {
            yPercent: (speed - 1) * 100,
            ease: 'none',
            scrollTrigger: {
                trigger: img.parentElement,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true
            }
        });
    });

    // Moodboard floating items
    gsap.utils.toArray('.mood-item, .sticker').forEach(item => {
        const speed = item.dataset.speed || 1;
        gsap.to(item, {
            y: (speed - 1) * -300, // Move up relative to scroll
            ease: 'none',
            scrollTrigger: {
                trigger: item.closest('section'),
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1 // smooth scrubbing
            }
        });
    });


    // ============================
    // 4. TEXT & FADE REVEALS ON SCROLL
    // ============================
    gsap.utils.toArray('.text-reveal').forEach(title => {
        gsap.to(title.querySelectorAll('.word'), {
            y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: 'power3.out',
            scrollTrigger: {
                trigger: title,
                start: 'top 85%'
            }
        });
    });

    gsap.utils.toArray('.fade-up').forEach(el => {
        gsap.to(el, {
            y: 0, opacity: 1, duration: 1, ease: 'power3.out',
            scrollTrigger: {
                trigger: el,
                start: 'top 85%'
            }
        });
    });


    // ============================
    // 5. VIDEO SCALE ANIMATION
    // ============================
    gsap.to('.video-scale-wrapper', {
        width: '100%',
        borderRadius: '0px',
        scrollTrigger: {
            trigger: '.section-video',
            start: 'top 50%',
            end: 'bottom 100%',
            scrub: true
        }
    });


    // ============================
    // 6. REVIEWS HORIZONTAL SCROLL
    // ============================
    const reviewsTrack = document.querySelector('.reviews-track');
    if (reviewsTrack) {
        gsap.to(reviewsTrack, {
            x: () => -(reviewsTrack.scrollWidth - window.innerWidth + 80),
            ease: 'none',
            scrollTrigger: {
                trigger: '.section-reviews',
                start: 'top center',
                end: 'bottom top',
                scrub: 1,
                pin: true
            }
        });
    }

    // ============================
    // 7. FOOTER HUGE TEXT
    // ============================
    gsap.from('.footer-huge-text', {
        y: 200, opacity: 0,
        scrollTrigger: {
            trigger: '.footer',
            start: 'top 80%',
            end: 'bottom bottom',
            scrub: 1
        }
    });

});
