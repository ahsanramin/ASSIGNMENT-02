document.addEventListener('DOMContentLoaded', () => {

    // ===== PRELOADER =====
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.style.opacity = '0';
            preloader.style.transition = 'opacity 0.5s ease';
            setTimeout(() => preloader.remove(), 500);
        }, 800);
    }

    // ===== THEME TOGGLE =====
    const themeToggle = document.getElementById('theme-toggle');
    const pageWrapper = document.querySelector('.page-wrapper');
    const savedTheme = localStorage.getItem('techwave-theme');
    if (savedTheme === 'light') {
        themeToggle.checked = true;
        pageWrapper.classList.add('light-mode');
    }
    themeToggle.addEventListener('change', () => {
        if (themeToggle.checked) {
            localStorage.setItem('techwave-theme', 'light');
            pageWrapper.classList.add('light-mode');
        } else {
            localStorage.setItem('techwave-theme', 'dark');
            pageWrapper.classList.remove('light-mode');
        }
    });

    // ===== SMOOTH SCROLL =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
            }
        });
    });

    // ===== MOBILE MENU CLOSE =====
    const navLinks = document.querySelectorAll('.nav-links a');
    const navToggle = document.getElementById('nav-toggle');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 992) navToggle.checked = false;
        });
    });

    // ===== NAVBAR SCROLL SHADOW =====
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        navbar.style.boxShadow = window.scrollY > 50 ? '0 4px 25px rgba(0,0,0,0.4)' : 'none';
    });

    // ===== BUTTON RIPPLE =====
    document.querySelectorAll('.btn-gradient, .btn-outline').forEach(btn => {
        btn.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const ripple = document.createElement('span');
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });

    // ===== RIPPLE CSS =====
    const style = document.createElement('style');
    style.textContent = `
        .btn-gradient, .btn-outline { position: relative; overflow: hidden; }
        .ripple {
            position: absolute; width: 0; height: 0; border-radius: 50%;
            background: rgba(255,255,255,0.5); transform: translate(-50%, -50%);
            pointer-events: none; animation: rippleEffect 0.6s linear;
        }
        @keyframes rippleEffect { to { width: 300px; height: 300px; opacity: 0; } }
    `;
    document.head.appendChild(style);

    // ===== FORM SUBMISSION =====
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = contactForm.querySelector('button');
            submitBtn.innerHTML = '<i class="fas fa-check-circle"></i> Message Sent!';
            submitBtn.style.background = 'linear-gradient(135deg, #4ade80, #22c55e)';
            submitBtn.style.boxShadow = '0 8px 24px rgba(74,222,128,0.4)';
            setTimeout(() => {
                submitBtn.innerHTML = 'Send Message <i class="fas fa-paper-plane"></i>';
                submitBtn.style.background = '';
                submitBtn.style.boxShadow = '';
                contactForm.reset();
            }, 3000);
        });
    }

    // ===== SCROLL REVEAL ANIMATIONS =====
    const observerOptions = { threshold: 0.15, rootMargin: '0px 0px -50px 0px' };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    document.querySelectorAll('section, footer').forEach(section => {
        section.classList.add('animate-out');
        observer.observe(section);
    });

    // ===== PARTICLE BACKGROUND (Hero) =====
    const canvas = document.getElementById('particle-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let animationFrame;

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 3 + 1;
                this.speedX = Math.random() * 1 - 0.5;
                this.speedY = Math.random() * 1 - 0.5;
                this.color = ['#ff6a3d', '#f83c8c', '#a855f7'][Math.floor(Math.random() * 3)];
                this.opacity = Math.random() * 0.5 + 0.2;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.globalAlpha = this.opacity;
                ctx.fill();
                ctx.globalAlpha = 1;
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
                if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
            }
        }

        function initParticles() {
            particles = [];
            const particleCount = Math.min(120, Math.floor(window.innerWidth / 10));
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        }
        initParticles();

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(particle => {
                particle.draw();
                particle.update();
            });
            animationFrame = requestAnimationFrame(animateParticles);
        }
        animateParticles();

        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            const heroObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        if (!animationFrame) animateParticles();
                    } else {
                        cancelAnimationFrame(animationFrame);
                        animationFrame = null;
                    }
                });
            }, { threshold: 0.1 });
            heroObserver.observe(heroSection);
        }
    }

    // ===== BACK TO TOP =====
    const backToTop = document.getElementById('back-to-top');
    window.addEventListener('scroll', () => {
        backToTop.classList.toggle('visible', window.scrollY > 500);
    });
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    // ===== UPDATE YEAR =====
    const footerText = document.querySelector('.footer-text');
    if (footerText) footerText.textContent = `© ${new Date().getFullYear()} TechWave Podcast. All rights reserved.`;
});