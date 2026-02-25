/**
 * Sigal Landing Page — Enhanced JavaScript
 *
 * Features:
 * - Canvas-based floating particle system
 * - IntersectionObserver-driven scroll reveal animations
 * - Navbar opacity transition on scroll
 * - Smooth scroll for anchor links
 * - Hero glitch effect on hover
 */
document.addEventListener('DOMContentLoaded', () => {

    // ========== PARTICLE SYSTEM ==========
    const canvas = document.getElementById('particles-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        const particles = [];
        const PARTICLE_COUNT = 60;
        const colors = [
            'rgba(168, 85, 247,',   // purple
            'rgba(192, 132, 252,',  // lighter purple
            'rgba(20, 184, 166,',   // teal
        ];

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        // @note Seed particles with random position, size, velocity, and color
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                r: Math.random() * 2.5 + 0.3,
                vx: (Math.random() - 0.5) * 0.25,
                vy: -(Math.random() * 0.35 + 0.05),
                alpha: Math.random() * 0.5 + 0.1,
                color: colors[Math.floor(Math.random() * colors.length)],
            });
        }

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;

                // Wrap around screen edges
                if (p.y < -10) p.y = canvas.height + 10;
                if (p.x < -10) p.x = canvas.width + 10;
                if (p.x > canvas.width + 10) p.x = -10;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `${p.color}${p.alpha})`;
                ctx.fill();
            });
            requestAnimationFrame(animate);
        };
        animate();
    }

    // ========== SCROLL REVEAL ANIMATIONS ==========
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // @note Stagger by data-delay attribute or index
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all .reveal elements
    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach((el, index) => {
        // Auto-stagger siblings
        if (!el.dataset.delay) {
            el.dataset.delay = index * 50;
        }
        revealObserver.observe(el);
    });

    // ========== NAVBAR SCROLL EFFECT ==========
    const nav = document.getElementById('main-nav');
    if (nav) {
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    if (window.scrollY > 80) {
                        nav.classList.add('scrolled');
                    } else {
                        nav.classList.remove('scrolled');
                    }
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    // ========== HERO GLITCH ON HOVER ==========
    const title = document.querySelector('.hero-title');
    if (title) {
        title.addEventListener('mouseover', () => {
            title.style.textShadow = '3px 3px 0px #a855f7, -3px -3px 0px #14b8a6';
            setTimeout(() => {
                title.style.textShadow = 'none';
            }, 250);
        });
    }

    // ========== SMOOTH SCROLL FOR ANCHOR LINKS ==========
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
});
