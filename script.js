// ===== Lenis + GSAP Clean Setup =====
const lenis = new Lenis({
    duration: 0.8,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
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

// JS-3 FIX: null-guard so a DOM failure won't crash the entire script
if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
        const isOpening = !navLinks.classList.contains('active');
        menuToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.style.overflow = isOpening ? 'hidden' : '';
        // JS-4 FIX: Stop/start Lenis with the mobile nav
        if (isOpening) {
            lenis.stop();
        } else {
            lenis.start();
        }
    });

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
            lenis.start(); // JS-4 FIX
        });
    });

    // Mobile Nav Click Outside
    document.addEventListener('click', (e) => {
        if (navLinks.classList.contains('active') && !navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
            menuToggle.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
            lenis.start(); // JS-4 FIX
        }
    });
}

// ===== Hero Entrance =====
const splitHeroTitle = new SplitType('.hero-title', { types: 'lines, words, chars' });
const heroTl = gsap.timeline({ defaults: { ease: "expo.out" } });

heroTl
    .from(splitHeroTitle.chars, { 
        y: 80, 
        opacity: 0, 
        rotationX: -45,
        stagger: 0.015, 
        duration: 1.2, 
        transformOrigin: "0% 50% -50"
    })
    .from('.hero-description', { y: 20, opacity: 0, duration: 1 }, '-=0.8')
    .from('.hero-actions', { y: 20, opacity: 0, duration: 0.8 }, '-=0.6')
    .from('.hero-socials', { y: 15, opacity: 0, duration: 0.8 }, '-=0.5')
    .from('.hero-visual', { scale: 0.95, opacity: 0, duration: 1.2 }, '-=1');

// ===== Section Title Animations =====
// PERF-3 FIX: Store instances so we can revert on resize
const splitInstances = [];
const sectionTitles = document.querySelectorAll('.section-title');

function initSplitAnimations() {
    // Revert existing instances before re-splitting
    splitInstances.forEach(s => s.revert());
    splitInstances.length = 0;

    sectionTitles.forEach(title => {
        const splitTitle = new SplitType(title, { types: 'lines, words' });
        splitInstances.push(splitTitle);
        gsap.from(splitTitle.words, {
            scrollTrigger: {
                trigger: title,
                start: "top 85%",
            },
            y: 50,
            opacity: 0,
            stagger: 0.05,
            duration: 1.2,
            ease: "expo.out"
        });
    });
}

initSplitAnimations();

// Re-init on resize (debounced)
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        ScrollTrigger.refresh();
        initSplitAnimations();
    }, 300);
});

// ===== Parallax & Reveal for Images =====
gsap.utils.toArray('.image-inner').forEach(container => {
    const img = container.querySelector('img');
    if(img) {
        gsap.to(img, {
            yPercent: 20,
            ease: "none",
            scrollTrigger: {
                trigger: container,
                start: "top bottom", 
                end: "bottom top",
                scrub: true
            }
        });
    }
});

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
    lenis.stop();
    document.body.style.overflow = 'hidden';
}

function closeModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    lenis.start();
}

// Close modal on overlay click
document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            overlay.classList.remove('active');
            overlay.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
            lenis.start(); // JS-2 FIX
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
        lenis.start(); // JS-1 FIX — moved outside loop so it only runs once
    }
});

// ===== Refresh ScrollTrigger after load =====
window.addEventListener("load", () => {
    ScrollTrigger.refresh();
});

// ===== Custom Difference Cursor =====
const cursor = document.querySelector('.cursor-diff');
let mouseX = 0;
let mouseY = 0;
let cursorX = 0;
let cursorY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

// PERF-4 FIX: Pause cursor interpolation when tab is hidden
let cursorTickerId = null;

function startCursorTicker() {
    if (cursorTickerId) return;
    cursorTickerId = gsap.ticker.add(() => {
        cursorX += (mouseX - cursorX) * 0.5;
        cursorY += (mouseY - cursorY) * 0.5;
        if (cursor) {
            cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
        }
    });
}

function stopCursorTicker() {
    if (cursorTickerId) {
        gsap.ticker.remove(cursorTickerId);
        cursorTickerId = null;
    }
}

startCursorTicker();

document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        stopCursorTicker();
    } else {
        startCursorTicker();
    }
});

// Hover states for the cursor
const interactiveElements = document.querySelectorAll('a, button, .project-card, .btn, .nav-btn, .exp-item');

interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
        if(cursor) cursor.classList.add('hover-active');
    });
    el.addEventListener('mouseleave', () => {
        if(cursor) cursor.classList.remove('hover-active');
    });
});
