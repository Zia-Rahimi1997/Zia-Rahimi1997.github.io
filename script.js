(function() {
    'use strict';

    var loadingScreen = document.getElementById('loading-screen');
    var mainHeader = document.getElementById('main-header');
    var mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    var mobileNav = document.getElementById('mobile-nav');
    var themeToggle = document.getElementById('theme-toggle');
    var backToTop = document.getElementById('back-to-top');
    var navLinks = document.querySelectorAll('.nav-link');
    var mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    var typingText = document.getElementById('typing-text');
    var skillBars = document.querySelectorAll('.skill-progress');
    var statNumbers = document.querySelectorAll('.stat-number');
    var footerYear = document.getElementById('footer-year');
    var sections = document.querySelectorAll('section');

    var countersAnimated = false;
    var skillsAnimated = false;
    var typingStarted = false;

    // ============================================================
    // LOADING SCREEN - Hide via JS with CSS fallback
    // ============================================================
    function hideLoadingScreen() {
        if (loadingScreen) {
            setTimeout(function() {
                loadingScreen.classList.add('hidden');
            }, 1800);
        }
    }

    // ============================================================
    // TYPING ANIMATION
    // ============================================================
    function initTypingAnimation() {
        if (!typingText || typingStarted) return;
        typingStarted = true;

        var name = 'Ziaulhaq Rahimi';
        var index = 0;
        var isDeleting = false;
        var typingSpeed = 120;

        function type() {
            var currentText = name.substring(0, index);
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

        setTimeout(type, 2200);
    }

    // ============================================================
    // STICKY NAVIGATION & SCROLL EFFECTS
    // ============================================================
    function handleScroll() {
        var scrollY = window.scrollY || window.pageYOffset;

        if (mainHeader) {
            if (scrollY > 50) {
                mainHeader.classList.add('scrolled');
            } else {
                mainHeader.classList.remove('scrolled');
            }
        }

        if (backToTop) {
            if (scrollY > 500) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        }

        updateActiveNavLink();
        animateSkillBars();
        animateCounters();
        animateSections();
    }

    // ============================================================
    // ACTIVE NAV LINK ON SCROLL
    // ============================================================
    function updateActiveNavLink() {
        var scrollPos = (window.scrollY || window.pageYOffset) + 100;

        for (var i = 0; i < sections.length; i++) {
            var section = sections[i];
            var sectionId = section.getAttribute('id');
            if (!sectionId) continue;

            var sectionTop = section.offsetTop;
            var sectionHeight = section.offsetHeight;

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                for (var j = 0; j < navLinks.length; j++) {
                    navLinks[j].classList.remove('active');
                    if (navLinks[j].getAttribute('href') === '#' + sectionId) {
                        navLinks[j].classList.add('active');
                    }
                }
            }
        }
    }

    // ============================================================
    // MOBILE MENU
    // ============================================================
    function toggleMobileMenu() {
        if (!mobileMenuToggle || !mobileNav) return;
        var isOpen = mobileMenuToggle.classList.toggle('active');
        if (isOpen) {
            mobileNav.classList.add('open');
        } else {
            mobileNav.classList.remove('open');
        }
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
        var savedTheme = localStorage.getItem('theme') || 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);
    }

    function toggleTheme() {
        var currentTheme = document.documentElement.getAttribute('data-theme');
        var newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    }

    // ============================================================
    // SMOOTH SCROLL
    // ============================================================
    function smoothScroll(e) {
        e.preventDefault();
        var targetId = this.getAttribute('href');
        var targetSection = document.querySelector(targetId);

        if (targetSection) {
            var headerHeight = mainHeader ? mainHeader.offsetHeight : 72;
            var targetPosition = targetSection.offsetTop - headerHeight;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }

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
    function animateCounters() {
        if (countersAnimated) return;

        var heroStats = document.querySelector('.hero-stats');
        if (!heroStats) return;

        var rect = heroStats.getBoundingClientRect();
        if (rect.top > window.innerHeight || rect.bottom < 0) return;

        countersAnimated = true;

        for (var i = 0; i < statNumbers.length; i++) {
            (function(counter) {
                var target = parseInt(counter.getAttribute('data-target'));
                var duration = 2000;
                var startTime = null;

                function updateCounter(currentTime) {
                    if (!startTime) startTime = currentTime;
                    var elapsed = currentTime - startTime;
                    var progress = Math.min(elapsed / duration, 1);
                    var eased = 1 - Math.pow(1 - progress, 3);
                    var current = Math.floor(eased * target);
                    counter.textContent = current;

                    if (progress < 1) {
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target;
                    }
                }

                requestAnimationFrame(updateCounter);
            })(statNumbers[i]);
        }
    }

    // ============================================================
    // SKILL BAR ANIMATION
    // ============================================================
    function animateSkillBars() {
        if (skillsAnimated) return;

        var skillsSection = document.getElementById('skills');
        if (!skillsSection) return;

        var rect = skillsSection.getBoundingClientRect();
        if (rect.top > window.innerHeight || rect.bottom < 0) return;

        skillsAnimated = true;

        for (var i = 0; i < skillBars.length; i++) {
            (function(bar) {
                var width = bar.getAttribute('data-width');
                setTimeout(function() {
                    bar.style.width = width + '%';
                }, 200 + i * 100);
            })(skillBars[i]);
        }
    }

    // ============================================================
    // SECTION ANIMATION ON SCROLL
    // ============================================================
    function animateSections() {
        for (var i = 0; i < sections.length; i++) {
            var rect = sections[i].getBoundingClientRect();
            if (rect.top < window.innerHeight - 100) {
                sections[i].classList.add('section-visible');
            }
        }
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
        if (e.key === 'Escape') {
            closeMobileMenu();
        }
    }

    // ============================================================
    // PREFERS REDUCED MOTION
    // ============================================================
    function respectReducedMotion() {
        var prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (prefersReducedMotion) {
            if (typingText) {
                typingText.textContent = 'Ziaulhaq Rahimi';
                typingStarted = true;
            }

            for (var i = 0; i < skillBars.length; i++) {
                var width = skillBars[i].getAttribute('data-width');
                skillBars[i].style.width = width + '%';
            }
            skillsAnimated = true;

            for (var j = 0; j < statNumbers.length; j++) {
                statNumbers[j].textContent = statNumbers[j].getAttribute('data-target');
            }
            countersAnimated = true;
        }
    }

    // ============================================================
    // EVENT LISTENERS
    // ============================================================
    function initEventListeners() {
        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('resize', handleScroll, { passive: true });

        if (mobileMenuToggle) {
            mobileMenuToggle.addEventListener('click', toggleMobileMenu);
        }

        if (themeToggle) {
            themeToggle.addEventListener('click', toggleTheme);
        }

        for (var i = 0; i < navLinks.length; i++) {
            navLinks[i].addEventListener('click', smoothScroll);
        }

        for (var j = 0; j < mobileNavLinks.length; j++) {
            mobileNavLinks[j].addEventListener('click', smoothScroll);
        }

        if (backToTop) {
            backToTop.addEventListener('click', scrollToTop);
        }

        document.addEventListener('keydown', handleKeyboardNav);

        document.addEventListener('click', function(e) {
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
        updateFooterYear();
        respectReducedMotion();
        initEventListeners();
        handleScroll();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
