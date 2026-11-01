/* ============================================================
   Bilingual (FA/EN) + RTL switch, mobile menu, scroll reveal
   ============================================================ */
(function () {
  const html = document.documentElement;
  const langBtn = document.getElementById('langBtn');
  const langCurrent = langBtn.querySelector('.lang-current');
  const burger = document.getElementById('burger');
  const navLinks = document.getElementById('navLinks');

  /* ---------- 1. Language ---------- */
  const STORE_KEY = 'portfolio-lang';

  function applyLang(lang) {
    const isFa = lang === 'fa';
    html.setAttribute('lang', lang);
    html.setAttribute('dir', isFa ? 'rtl' : 'ltr');
    html.dataset.lang = lang;

    document.querySelectorAll('[data-fa][data-en]').forEach(function (el) {
      const value = el.dataset[lang];
      if (value !== undefined) el.innerHTML = value;
    });

    // document title
    const titleEl = document.querySelector('title');
    if (titleEl && titleEl.dataset[lang]) document.title = titleEl.dataset[lang];

    // CV download: Persian file in FA mode, English file in EN mode
    document.querySelectorAll('.cv-link').forEach(function (a) {
      a.setAttribute('href', isFa ? 'assets/cv-fa.pdf' : 'assets/cv-en.pdf');
      a.setAttribute('download', isFa ? 'Ziaulhaq-Rahimi-CV-FA.pdf' : 'Ziaulhaq-Rahimi-CV-EN.pdf');
    });

    // button shows the language you can switch TO
    langCurrent.textContent = isFa ? 'EN' : 'فا';
    langBtn.setAttribute('aria-label', isFa ? 'Switch to English' : 'تغییر به فارسی');

    try { localStorage.setItem(STORE_KEY, lang); } catch (e) {}
  }

  let current = 'fa';
  try {
    const saved = localStorage.getItem(STORE_KEY);
    if (saved === 'en' || saved === 'fa') current = saved;
    else if (navigator.language && !navigator.language.toLowerCase().startsWith('fa')) current = 'en';
  } catch (e) {}
  applyLang(current);

  langBtn.addEventListener('click', function () {
    current = current === 'fa' ? 'en' : 'fa';
    applyLang(current);
  });

  /* ---------- 2. Mobile menu ---------- */
  burger.addEventListener('click', function () {
    const open = navLinks.classList.toggle('open');
    burger.setAttribute('aria-expanded', String(open));
  });
  navLinks.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') {
      navLinks.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
    }
  });

  /* ---------- 3. Nav shadow on scroll ---------- */
  const nav = document.getElementById('nav');
  const onScroll = function () {
    nav.classList.toggle('scrolled', window.scrollY > 8);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- 4. Scroll reveal ---------- */
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05, rootMargin: '0px 0px -30px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- 5. Active nav link ---------- */
  const sections = document.querySelectorAll('section[id]');
  const links = navLinks.querySelectorAll('a');
  if ('IntersectionObserver' in window) {
    const spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          links.forEach(function (l) {
            l.classList.toggle('active', l.getAttribute('href') === '#' + entry.target.id);
          });
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- 6. Year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
