// assets/js/main.js
gsap.registerPlugin(ScrollTrigger);

// Smooth Scroll (Lenis-like with native + GSAP)
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Language System (Full 3-language)
const translations = {
    en: {
        navHome: "Home",
        navAbout: "About",
        navExp: "Experience",
        navSkills: "Skills",
        navProjects: "Projects",
        navContact: "Contact",
        heroTitle: "Senior Banking Professional",
        heroSubtitle: "Oracle FLEXCUBE • AML/KYC • Digital Payments",
        heroDesc: "Precision in high-volume banking operations. Excellence in service & compliance.",
        ctaDownload: "Download CV",
        aboutTitle: "About Me",
        experienceTitle: "Professional Journey"
    },
    fa: {
        navHome: "خانه",
        navAbout: "درباره من",
        navExp: "تجربه",
        navSkills: "مهارت‌ها",
        navProjects: "پروژه‌ها",
        navContact: "تماس",
        heroTitle: "متخصص ارشد بانکی",
        heroSubtitle: "اوراکل FLEXCUBE • AML/KYC • پرداخت دیجیتال",
        heroDesc: "دقت در عملیات بانکی پرحجم. تعالی در خدمات و رعایت مقررات.",
        ctaDownload: "دانلود رزومه",
        aboutTitle: "درباره من",
        experienceTitle: "مسیر حرفه‌ای"
    },
    ps: {
        navHome: "کور",
        navAbout: "زما په اړه",
        navExp: "تجربه",
        navSkills: "مهارتونه",
        navProjects: "پروژه‌ګان",
        navContact: "اړیکه",
        heroTitle: "لوړ پوړی بانکي متخصص",
        heroSubtitle: "اوراکل FLEXCUBE • AML/KYC • ډیجیټل تادیات",
        heroDesc: "د لوړ حجم بانکي عملیاتو کې دقت. په خدماتو او اطاعت کې غوره والي.",
        ctaDownload: "رزومه ډاونلوډ کړئ",
        aboutTitle: "زما په اړه",
        experienceTitle: "مسلکي سفر"
    }
};

let currentLang = 'en';

function switchLanguage(lang) {
    currentLang = lang;
    document.documentElement.lang = lang === 'fa' || lang === 'ps' ? lang : 'en';
    
    document.querySelectorAll('[data-translate]').forEach(el => {
        const key = el.getAttribute('data-translate');
        if (translations[lang][key]) {
            el.textContent = translations[lang][key];
        }
    });
    
    // Update active button
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });
}

// Animations
function initAnimations() {
    // Hero animation
    gsap.from(".hero-content > *", {
        y: 60,
        opacity: 0,
        duration: 1.2,
        stagger: 0.2,
        ease: "power4.out"
    });

    // Section reveals
    document.querySelectorAll('section').forEach((section, i) => {
        gsap.from(section, {
            scrollTrigger: {
                trigger: section,
                start: "top 80%",
            },
            y: 80,
            opacity: 0,
            duration: 1,
            delay: i * 0.1
        });
    });

    // Counter animation for stats
    function animateCounter(el, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);
        const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
                el.textContent = Math.floor(target) + (target % 1 !== 0 ? '+' : '');
                clearInterval(timer);
            } else {
                el.textContent = Math.floor(start) + '+';
            }
        }, 16);
    }
}

// Theme Toggle (Dark/Light)
function toggleTheme() {
    document.documentElement.classList.toggle('light-mode');
    localStorage.setItem('theme', document.documentElement.classList.contains('light-mode') ? 'light' : 'dark');
}

// Resume Download
function downloadResume() {
    const link = document.createElement('a');
    link.href = 'assets/Ziaulhaq_Rahimi_CV.pdf'; // Will be added later
    link.download = 'Ziaulhaq_Rahimi_CV.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
    initSmoothScroll();
    initAnimations();
    
    // Keyboard support
    document.addEventListener('keydown', (e) => {
        if (e.key === '/' && document.activeElement.tagName !== "INPUT") {
            // Quick search or focus
        }
    });
    
    console.log('%c✅ Zia Rahimi Portfolio Loaded Successfully\nPremium • Fast • Multilingual', 'color:#14B8A6; font-family:monospace; font-size:13px');
});

// Expose functions globally
window.switchLanguage = switchLanguage;
window.toggleTheme = toggleTheme;
window.downloadResume = downloadResume;
