// ============================================================
// ZIAULHAQ RAHIMI PORTFOLIO - MAIN JAVASCRIPT
// ============================================================

(function() {
    'use strict';

    // ============================================================
    // DOM ELEMENTS
    // ============================================================
    const loadingScreen = document.getElementById('loading-screen');
    const mainHeader = document.getElementById('main-header');
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileNav = document.getElementById('mobile-nav');
    const themeToggle = document.getElementById('theme-toggle');
    const backToTop = document.getElementById('back-to-top');
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    const typingText = document.getElementById('typing-text');
    const skillBars = document.querySelectorAll('.skill-progress');
    const statNumbers = document.querySelectorAll('.stat-number');
    const footerYear = document.getElementById('footer-year');

    // ============================================================
    // LOADING SCREEN
    // ============================================================
    function hideLoadingScreen() {
        if (loadingScreen) {
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
            }, 1800);
        }
    }

    // ============================================================
    // TYPING ANIMATION
    // ============================================================
    function initTypingAnimation() {
        if (!typingText) return;

        const name = 'Ziaulhaq Rahimi';
        let index = 0;
        let isDeleting = false;
        let typingSpeed = 120;

        function type() {
            const currentText = name.substring(0, index);
            typingText.textContent = currentText;

            if (!isDeleting && index < name.length) {
                index++;
                typingSpeed = 120;
            } else if (isDeleting && index > 0) {
                index--;
                typingSpeed = 60;
            } else {
                isDeleting = !isDeleting;
                typingSpeed = isDeleting ? 2000 : 500;
            }

            setTimeout(type, typingSpeed);
        }

        // Delay start until loading screen is gone
        setTimeout(type, 2000);
    }

    // ============================================================
    // STICKY NAVIGATION & SCROLL EFFECTS
    // ============================================================
    function handleScroll() {
        const scrollY = window.scrollY;

        // Header background
        if (mainHeader) {
            if (scrollY > 50) {
                mainHeader.classList.add('scrolled');
            } else {
                mainHeader.classList.remove('scrolled');
            }
        }

        // Back to top button
        if (backToTop) {
            if (scrollY > 500) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        }

        // Active nav link
        updateActiveNavLink();

        // Animate skill bars when in view
        animateSkillBars();

        // Animate stat counters
        animateCounters();
    }

    // ============================================================
    // ACTIVE NAV LINK ON SCROLL
    // ============================================================
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // ============================================================
    // MOBILE MENU
    // ============================================================
    function toggleMobileMenu() {
        if (!mobileMenuToggle || !mobileNav) return;

        const isOpen = mobileMenuToggle.classList.toggle('active');
        mobileNav.classList.toggle('open', isOpen);
        mobileMenuToggle.setAttribute('aria-expanded', isOpen);
        mobileNav.setAttribute('aria-hidden', !isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
    }

    function closeMobileMenu() {
        if (!mobileMenuToggle || !mobileNav) return;

        mobileMenuToggle.classList.remove('active');
        mobileNav.classList.remove('open');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
        mobileNav.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    // ============================================================
    // DARK / LIGHT MODE TOGGLE
    // ============================================================
    function initTheme() {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);
    }

    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    }

    // ============================================================
    // SMOOTH SCROLL
    // ============================================================
    function smoothScroll(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);

        if (targetSection) {
            const headerHeight = mainHeader ? mainHeader.offsetHeight : 72;
            const targetPosition = targetSection.offsetTop - headerHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }

        // Close mobile menu if open
        closeMobileMenu();
    }

    // ============================================================
    // BACK TO TOP
    // ============================================================
    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    // ============================================================
    // ANIMATED COUNTERS
    // ============================================================
    let countersAnimated = false;

    function animateCounters() {
        if (countersAnimated) return;

        const heroStats = document.querySelector('.hero-stats');
        if (!heroStats) return;

        const rect = heroStats.getBoundingClientRect();
        if (rect.top > window.innerHeight || rect.bottom < 0) return;

        countersAnimated = true;

        statNumbers.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2000;
            const startTime = performance.now();

            function updateCounter(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
                const current = Math.floor(eased * target);
                counter.textContent = current;

                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            }

            requestAnimationFrame(updateCounter);
        });
    }

    // ============================================================
    // SKILL BAR ANIMATION
    // ============================================================
    let skillsAnimated = false;

    function animateSkillBars() {
        if (skillsAnimated) return;

        const skillsSection = document.getElementById('skills');
        if (!skillsSection) return;

        const rect = skillsSection.getBoundingClientRect();
        if (rect.top > window.innerHeight || rect.bottom < 0) return;

        skillsAnimated = true;

        skillBars.forEach(bar => {
            const width = bar.getAttribute('data-width');
            setTimeout(() => {
                bar.style.width = width + '%';
            }, 200);
        });
    }

    // ============================================================
    // SECTION ANIMATION ON SCROLL
    // ============================================================
    function initSectionAnimations() {
        const sections = document.querySelectorAll('section');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('section-visible');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        sections.forEach(section => {
            section.classList.add('section-animate');
            observer.observe(section);
        });
    }

    // ============================================================
    // PARALLAX EFFECT FOR HERO
    // ============================================================
    function initParallax() {
        const heroSection = document.querySelector('.hero-section');
        if (!heroSection) return;

        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            if (scrolled < window.innerHeight) {
                const rate = scrolled * 0.3;
                heroSection.style.backgroundPositionY = rate + 'px';
            }
        });
    }

    // ============================================================
    // FOOTER YEAR
    // ============================================================
    function updateFooterYear() {
        if (footerYear) {
            footerYear.textContent = new Date().getFullYear();
        }
    }

    // ============================================================
    // KEYBOARD NAVIGATION
    // ============================================================
    function handleKeyboardNav(e) {
        // Escape to close mobile menu
        if (e.key === 'Escape') {
            closeMobileMenu();
        }
    }

    // ============================================================
    // TOUCH SWIPE FOR MOBILE MENU
    // ============================================================
    let touchStartY = 0;
    let touchEndY = 0;

    function handleTouchStart(e) {
        touchStartY = e.changedTouches[0].screenY;
    }

    function handleTouchEnd(e) {
        touchEndY = e.changedTouches[0].screenY;
        handleSwipe();
    }

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartY - touchEndY;

        // Swipe up to close menu
        if (diff > swipeThreshold && mobileNav && mobileNav.classList.contains('open')) {
            closeMobileMenu();
        }
    }

    // ============================================================
    // PREFERS REDUCED MOTION
    // ============================================================
    function respectReducedMotion() {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (prefersReducedMotion) {
            // Disable typing animation
            if (typingText) {
                typingText.textContent = 'Ziaulhaq Rahimi';
            }

            // Show all skill bars immediately
            skillBars.forEach(bar => {
                const width = bar.getAttribute('data-width');
                bar.style.width = width + '%';
            });
            skillsAnimated = true;

            // Show counters immediately
            statNumbers.forEach(counter => {
                counter.textContent = counter.getAttribute('data-target');
            });
            countersAnimated = true;
        }
    }

    // ============================================================
    // EVENT LISTENERS
    // ============================================================
    function initEventListeners() {
        // Scroll events
        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('resize', handleScroll, { passive: true });

        // Mobile menu
        if (mobileMenuToggle) {
            mobileMenuToggle.addEventListener('click', toggleMobileMenu);
        }

        // Theme toggle
        if (themeToggle) {
            themeToggle.addEventListener('click', toggleTheme);
        }

        // Smooth scroll for nav links
        navLinks.forEach(link => {
            link.addEventListener('click', smoothScroll);
        });

        mobileNavLinks.forEach(link => {
            link.addEventListener('click', smoothScroll);
        });

        // Back to top
        if (backToTop) {
            backToTop.addEventListener('click', scrollToTop);
        }

        // Keyboard navigation
        document.addEventListener('keydown', handleKeyboardNav);

        // Touch events for swipe
        document.addEventListener('touchstart', handleTouchStart, { passive: true });
        document.addEventListener('touchend', handleTouchEnd, { passive: true });

        // Click outside mobile menu to close
        document.addEventListener('click', (e) => {
            if (mobileNav && mobileNav.classList.contains('open')) {
                if (!mobileNav.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
                    closeMobileMenu();
                }
            }
        });
    }

    // ============================================================
    // INITIALIZATION
    // ============================================================
    function init() {
        hideLoadingScreen();
        initTheme();
        initTypingAnimation();
        initSectionAnimations();
        initParallax();
        updateFooterYear();
        respectReducedMotion();
        initEventListeners();
        handleScroll(); // Initial check
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
