// ===== Lenis + GSAP Clean Setup =====
const lenis = new Lenis({
    duration: 1.2,
    smooth: true,
    smoothWheel: true,
    normalizeWheel: true
});

gsap.registerPlugin(ScrollTrigger);

lenis.on("scroll", (e) => {
    ScrollTrigger.update();
});

gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);

// ===== Mobile Menu =====
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const navItems = document.querySelectorAll('.nav-links a');

menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
    document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
});

navItems.forEach(item => {
    item.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// ===== Hero Entrance =====
const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });
heroTl
    .from('.badge-reveal', { y: 30, opacity: 0, duration: 0.8 })
    .from('.hero-title', { y: 60, opacity: 0, duration: 1.2 }, '-=0.5')
    .from('.hero-description', { y: 30, opacity: 0, duration: 0.8 }, '-=0.8')
    .from('.hero-actions', { y: 30, opacity: 0, duration: 0.8 }, '-=0.6')
    .from('.hero-socials', { y: 20, opacity: 0, duration: 0.6 }, '-=0.5')
    .from('.hero-visual', { scale: 0.92, opacity: 0, duration: 1 }, '-=1.2')
    .from('.floating-stat', { scale: 0.8, opacity: 0, duration: 0.6, stagger: 0.15 }, '-=0.6');

// ===== Number Counter =====
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = entry.target;
            const countTo = parseInt(target.getAttribute('data-target'));
            let count = 0;
            const duration = 2200;
            const increment = countTo / (duration / 16);

            const updateCount = () => {
                count += increment;
                if (count < countTo) {
                    if (countTo >= 1000000) {
                        target.innerText = (count / 1000000).toFixed(1) + 'M+';
                    } else if (countTo >= 1000) {
                        target.innerText = Math.ceil(count).toLocaleString() + '+';
                    } else {
                        target.innerText = Math.ceil(count);
                    }
                    requestAnimationFrame(updateCount);
                } else {
                    if (countTo >= 1000000) {
                        target.innerText = (countTo / 1000000).toFixed(1) + 'M+';
                    } else if (countTo >= 1000) {
                        target.innerText = countTo.toLocaleString() + '+';
                    } else {
                        target.innerText = countTo;
                    }
                }
            };
            updateCount();
            statsObserver.unobserve(target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-number').forEach(stat => statsObserver.observe(stat));

// ===== Navbar Scroll Effect =====
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ===== Mobile Nav Click Outside =====
document.addEventListener('click', (e) => {
    if (navLinks.classList.contains('active') && !navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
        menuToggle.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// ===== Project Modals & Accessibility =====
document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-hidden', 'true');
});

function openModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}

function closeModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}

// Close modal on overlay click
document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            overlay.classList.remove('active');
            overlay.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }
    });
});

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.active').forEach(modal => {
            modal.classList.remove('active');
            modal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        });
    }
});

// ===== Refresh ScrollTrigger =====

