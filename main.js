(() => {
  'use strict';

  /* Flip the progressive-enhancement switch first, before anything that
     could throw. If this line runs, CSS enables the scroll-reveal
     animations; if this script never loads/executes, content simply
     stays statically visible (see style.css reveal system). */
  document.documentElement.classList.add('js-ready');

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isCoarse = window.matchMedia('(hover: none), (pointer: coarse)').matches;

  /* ===== Loader ===== */
  window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    setTimeout(() => loader && loader.classList.add('is-hidden'), 500);
  });

  /* ===== Year ===== */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ===== Theme toggle ===== */
  const root = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const savedTheme = localStorage.getItem('zr-theme');
  const systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  if (savedTheme) {
    root.setAttribute('data-theme', savedTheme);
  } else if (systemPrefersLight) {
    root.setAttribute('data-theme', 'light');
  }
  themeToggle && themeToggle.addEventListener('click', () => {
    const isLight = root.getAttribute('data-theme') === 'light';
    root.setAttribute('data-theme', isLight ? 'dark' : 'light');
    localStorage.setItem('zr-theme', isLight ? 'dark' : 'light');
  });

  /* ===== Nav scroll state + mobile menu ===== */
  const nav = document.getElementById('siteNav');
  const onScroll = () => {
    if (window.scrollY > 40) nav.classList.add('is-scrolled');
    else nav.classList.remove('is-scrolled');
    updateScrollProgress();
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const burger = document.getElementById('navBurger');
  const navMobile = document.getElementById('navMobile');
  burger && burger.addEventListener('click', () => {
    const open = burger.classList.toggle('is-open');
    navMobile.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
  });
  navMobile && navMobile.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    burger.classList.remove('is-open');
    navMobile.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
  }));

  /* ===== Scroll progress bar ===== */
  const progressEl = document.getElementById('scrollProgress');
  function updateScrollProgress() {
    if (!progressEl) return;
    const h = document.documentElement;
    const scrolled = (h.scrollTop || document.body.scrollTop);
    const height = h.scrollHeight - h.clientHeight;
    const pct = height > 0 ? (scrolled / height) * 100 : 0;
    progressEl.style.width = pct + '%';
  }

  /* ===== Custom cursor ===== */
  if (!isCoarse) {
    const dot = document.getElementById('cursorDot');
    const ring = document.getElementById('cursorRing');
    let mx = -100, my = -100, rx = -100, ry = -100;
    window.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      dot.style.left = mx + 'px'; dot.style.top = my + 'px';
    });
    (function loop() {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
      requestAnimationFrame(loop);
    })();
    document.querySelectorAll('a, button, [data-tilt]').forEach(el => {
      el.addEventListener('mouseenter', () => ring.classList.add('is-active'));
      el.addEventListener('mouseleave', () => ring.classList.remove('is-active'));
    });
  }

  /* ===== Magnetic buttons ===== */
  if (!isCoarse && !prefersReduced) {
    document.querySelectorAll('.btn--magnetic').forEach(btn => {
      btn.addEventListener('mousemove', e => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        btn.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
      });
      btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
    });
  }

  /* ===== Tilt cards ===== */
  if (!isCoarse && !prefersReduced) {
    document.querySelectorAll('[data-tilt]').forEach(card => {
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `perspective(700px) rotateX(${py * -6}deg) rotateY(${px * 8}deg) translateZ(0)`;
      });
      card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });
  }

  /* ===== Scroll reveal (IntersectionObserver) ===== */
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-line');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
  revealEls.forEach(el => revealObserver.observe(el));

  /* ===== Animated counters ===== */
  const counters = document.querySelectorAll('.stat__num');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const duration = 1400;
      const start = performance.now();
      function tick(now) {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        const val = Math.round(target * eased);
        el.textContent = val + suffix;
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.6 });
  counters.forEach(el => counterObserver.observe(el));

  /* ===== Skill bars + expertise meters fill on view ===== */
  document.querySelectorAll('.skillbar__track span, .expertise__meter span').forEach(el => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-filled');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    obs.observe(el);
  });

  /* ===== Timeline progress fill ===== */
  const timelineFill = document.getElementById('timelineFill');
  const timelineEl = document.querySelector('.timeline');
  if (timelineFill && timelineEl) {
    const updateTimeline = () => {
      const r = timelineEl.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = r.height;
      const visible = Math.min(Math.max(vh * 0.7 - r.top, 0), total);
      const pct = total > 0 ? (visible / total) * 100 : 0;
      timelineFill.style.height = pct + '%';
    };
    window.addEventListener('scroll', updateTimeline, { passive: true });
    window.addEventListener('resize', updateTimeline);
    updateTimeline();
  }

  /* ===== Typed.js-style rotating word (vanilla) ===== */
  const typedEl = document.getElementById('heroTyped');
  if (typedEl) {
    const words = ['compliance.', 'every transaction.', 'AML & KYC.', 'FLEXCUBE.'];
    let wi = 0, ci = 0, deleting = false;

    function typeTick() {
      const word = words[wi];
      if (!deleting) {
        ci++;
        typedEl.textContent = word.slice(0, ci);
        if (ci === word.length) {
          deleting = true;
          setTimeout(typeTick, 1600);
          return;
        }
      } else {
        ci--;
        typedEl.textContent = word.slice(0, ci);
        if (ci === 0) {
          deleting = false;
          wi = (wi + 1) % words.length;
        }
      }
      setTimeout(typeTick, deleting ? 40 : 70);
    }
    if (prefersReduced) {
      typedEl.textContent = words[0];
    } else {
      setTimeout(typeTick, 900);
    }
  }

  /* ===== Particle network canvas ===== */
  const canvas = document.getElementById('particleCanvas');
  if (canvas && !prefersReduced) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let w, h;

    function resize() {
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
      const count = Math.min(70, Math.floor((w * h) / 18000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.6 + 0.6
      }));
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#14B8A6';
      ctx.fillStyle = accent;
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        ctx.globalAlpha = 0.55;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.strokeStyle = accent;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i], b = particles[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 110) {
            ctx.globalAlpha = (1 - dist / 110) * 0.15;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(draw);
    }

    window.addEventListener('resize', resize);
    resize();
    requestAnimationFrame(draw);
  }

  /* ===== Contact form (static — no backend) ===== */
  const form = document.getElementById('contactForm');
  const formNote = document.getElementById('formNote');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const message = form.message.value.trim();
      const subject = encodeURIComponent(`Portfolio contact from ${name}`);
      const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
      window.location.href = `mailto:Ziarahimi2017@gmail.com?subject=${subject}&body=${body}`;
      formNote.textContent = 'Opening your email client to send this message…';
    });
  }

  /* ===== GSAP ScrollTrigger enhancement (progressive, optional) ===== */
  if (window.gsap && window.ScrollTrigger && !prefersReduced) {
    gsap.registerPlugin(ScrollTrigger);
    gsap.utils.toArray('.section__title').forEach(title => {
      gsap.fromTo(title, { backgroundPositionX: '0%' }, {
        backgroundPositionX: '0%',
        scrollTrigger: { trigger: title, start: 'top 85%' }
      });
    });
  }
})();
