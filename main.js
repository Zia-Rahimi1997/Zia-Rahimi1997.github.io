document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Lenis Smooth Scroll Setup
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // 2. Custom Magnetic Cursor
    // Only apply if user is not on a mobile touch device
    if (window.matchMedia("(pointer: fine)").matches) {
        const cursor = document.querySelector('.cursor');
        const cursorFollower = document.querySelector('.cursor-follower');
        const magneticElements = document.querySelectorAll('.magnetic, a');

        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
            
            setTimeout(() => {
                cursorFollower.style.left = e.clientX + 'px';
                cursorFollower.style.top = e.clientY + 'px';
            }, 80);
        });

        magneticElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('hover');
                cursorFollower.style.opacity = '0';
            });
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('hover');
                cursorFollower.style.opacity = '1';
                cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            });
        });
    }

    // 3. Typed.js Setup
    new Typed('#typed-text', {
        strings: [
            'Banking Operations Professional',
            'Oracle FLEXCUBE Expert',
            'Cash Management Specialist',
            'AML & KYC Compliance Analyst'
        ],
        typeSpeed: 50,
        backSpeed: 30,
        backDelay: 2000,
        loop: true,
        cursorChar: '|',
    });

    // 4. Vanilla Tilt for 3D Cards
    VanillaTilt.init(document.querySelectorAll(".tilt"), {
        max: 5,
        speed: 400,
        glare: true,
        "max-glare": 0.1,
        perspective: 1000
    });

    // 5. Particles.js Luxury Network Background
    particlesJS("particles-js", {
        particles: {
            number: { value: 40, density: { enable: true, value_area: 800 } },
            color: { value: "#14B8A6" }, 
            shape: { type: "circle" },
            opacity: { value: 0.3, random: false },
            size: { value: 2, random: true },
            line_linked: {
                enable: true,
                distance: 150,
                color: "#2563EB", 
                opacity: 0.2,
                width: 1
            },
            move: {
                enable: true,
                speed: 1,
                direction: "none",
                random: true,
                straight: false,
                out_mode: "out",
                bounce: false,
            }
        },
        interactivity: {
            detect_on: "canvas",
            events: {
                onhover: { enable: true, mode: "grab" },
                onclick: { enable: true, mode: "push" },
                resize: true
            },
            modes: {
                grab: { distance: 140, line_linked: { opacity: 0.5 } },
                push: { particles_nb: 3 }
            }
        },
        retina_detect: true
    });

    // 6. GSAP Animations Setup
    gsap.registerPlugin(ScrollTrigger);

    // Hero content initial load animation
    gsap.to(".fade-up", {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out"
    });

    // Hero image initial load animation
    gsap.to(".fade-in-right", {
        x: 0,
        opacity: 1,
        duration: 1.2,
        delay: 0.5,
        ease: "power3.out"
    });

    // Scroll Reveal animations for sections
    const revealElements = document.querySelectorAll(".reveal");
    revealElements.forEach((el) => {
        gsap.to(el, {
            scrollTrigger: {
                trigger: el,
                start: "top 85%",
                toggleActions: "play none none reverse"
            },
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out"
        });
    });

    // 7. Live Number Counters
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
        ScrollTrigger.create({
            trigger: counter,
            start: "top 80%",
            once: true,
            onEnter: () => {
                const target = +counter.getAttribute('data-target');
                let count = 0;
                const updateCount = () => {
                    const increment = target / 40;
                    if(count < target) {
                        count += increment;
                        counter.innerText = Math.ceil(count);
                        setTimeout(updateCount, 40);
                    } else {
                        counter.innerText = target;
                    }
                };
                updateCount();
            }
        });
    });
});
