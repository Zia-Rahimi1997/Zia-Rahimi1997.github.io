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

  function applyLang(lang, animate) {
    if (animate) document.body.classList.add('lang-swap');
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

    if (animate) setTimeout(function () { document.body.classList.remove('lang-swap'); }, 170);

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
    applyLang(current, true);
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


  /* ---------- 7. Motion preferences ---------- */
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!reduce) document.documentElement.classList.add('motion');

  /* ---------- 8. Scroll progress + back-to-top ---------- */
  const spBar = document.getElementById('spBar');
  const toTop = document.getElementById('toTop');
  function onScrollUI() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
    if (spBar) spBar.style.width = pct.toFixed(2) + '%';
    if (toTop) toTop.classList.toggle('show', window.scrollY > 520);
  }
  window.addEventListener('scroll', onScrollUI, { passive: true });
  window.addEventListener('resize', onScrollUI);
  onScrollUI();
  if (toTop) {
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    });
  }

  /* ---------- 9. Counting numbers ---------- */
  const counters = document.querySelectorAll('.stat-num[data-count]');
  function runCounter(el) {
    const target = parseInt(el.dataset.count, 10) || 0;
    const suffix = el.dataset.suffix || '';
    if (reduce) { el.textContent = target + suffix; return; }
    const dur = 1150, t0 = performance.now();
    (function tick(now) {
      const k = Math.min((now - t0) / dur, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - k, 3))) + suffix;
      if (k < 1) requestAnimationFrame(tick);
    })(t0);
  }
  if ('IntersectionObserver' in window && counters.length) {
    const cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { runCounter(e.target); cio.unobserve(e.target); }
      });
    }, { threshold: 0.55 });
    counters.forEach(function (c) { cio.observe(c); });
  } else {
    counters.forEach(runCounter);
  }

  /* ---------- 10. Pointer spotlight + portrait tilt (desktop only) ---------- */
  if (canHover && !reduce) {
    document.querySelectorAll('.card, .skill-card, .ach, .timeline li, .train, .lang-card, .contact-item, .philosophy, .vision')
      .forEach(function (el) { el.classList.add('spot'); });

    let queued = false, lastX = 0, lastY = 0, lastTarget = null;
    document.addEventListener('pointermove', function (e) {
      lastX = e.clientX; lastY = e.clientY;
      lastTarget = e.target && e.target.closest ? e.target.closest('.spot') : null;
      if (queued || !lastTarget) return;
      queued = true;
      requestAnimationFrame(function () {
        queued = false;
        if (!lastTarget) return;
        const r = lastTarget.getBoundingClientRect();
        lastTarget.style.setProperty('--mx', (lastX - r.left) + 'px');
        lastTarget.style.setProperty('--my', (lastY - r.top) + 'px');
      });
    }, { passive: true });

    const art = document.querySelector('.hero-art');
    const portrait = document.querySelector('.avatar-card');
    if (art && portrait) {
      art.addEventListener('pointermove', function (e) {
        const r = art.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        portrait.style.transform =
          'rotateY(' + (px * 9).toFixed(2) + 'deg) rotateX(' + (-py * 9).toFixed(2) + 'deg)';
      });
      art.addEventListener('pointerleave', function () { portrait.style.transform = ''; });
    }
  }

  /* ---------- 11. Chips appear in sequence ---------- */
  document.querySelectorAll('.chips').forEach(function (group) {
    group.querySelectorAll('.chip').forEach(function (chip, i) {
      chip.style.transitionDelay = Math.min(i * 32, 400) + 'ms';
      chip.style.setProperty('--i', i);
    });
  });


  /* ---------- 12. Timeline rail grows as you scroll ---------- */
  const tlEl = document.querySelector('.timeline');
  function railUpdate() {
    if (!tlEl) return;
    const r = tlEl.getBoundingClientRect();
    if (reduce) { tlEl.style.setProperty('--tl', '100%'); return; }
    const anchor = window.innerHeight * 0.62;
    let p = (anchor - r.top) / (r.height * 0.9);
    p = Math.max(0, Math.min(1, p));
    tlEl.style.setProperty('--tl', (p * 100).toFixed(2) + '%');
  }
  window.addEventListener('scroll', railUpdate, { passive: true });
  window.addEventListener('resize', railUpdate);
  railUpdate();

  /* ---------- 13. Language bars fill when they come into view ---------- */
  const barGrid = document.querySelector('.lang-grid');
  if (barGrid) {
    const bars = barGrid.querySelectorAll('.bar i');
    bars.forEach(function (b) {
      b.dataset.w = b.style.width || '100%';
      if (!reduce) b.style.width = '0%';
    });
    const fill = function () {
      bars.forEach(function (b, i) {
        setTimeout(function () {
          b.style.transition = 'width 1.15s cubic-bezier(.22,1,.36,1)';
          b.style.width = b.dataset.w;
        }, reduce ? 0 : i * 140);
      });
    };
    if ('IntersectionObserver' in window) {
      const bio = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { fill(); bio.disconnect(); } });
      }, { threshold: 0.35 });
      bio.observe(barGrid);
    } else { fill(); }
  }

  /* ---------- 6. Year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
