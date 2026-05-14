document.addEventListener("DOMContentLoaded", () => {
    // 1. Initialize Lenis (Buttery Smooth Scroll)
    window.lenis = new Lenis({
        duration: 1.5,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: true, // Optimized for mobile
        touchMultiplier: 1.5,
        infinite: false,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // GSAP Integration with Lenis
    gsap.registerPlugin(ScrollTrigger);
    
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time)=>{
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile Menu Logic
    const mobileToggle = document.getElementById('mobile-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-menu a');

    const toggleMenu = () => {
        const isActive = mobileToggle.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        
        // Update ARIA attributes
        mobileToggle.setAttribute('aria-expanded', isActive);
        mobileMenu.setAttribute('aria-hidden', !isActive);

        if (isActive) {
            document.body.style.overflow = 'hidden';
            lenis.stop();
        } else {
            document.body.style.overflow = '';
            lenis.start();
        }
    };

    mobileToggle.addEventListener('click', toggleMenu);
    mobileLinks.forEach(link => {
        link.addEventListener('click', toggleMenu);
    });

    // 2. Animations
    const tl = gsap.timeline();

    // Hero Sequence: 1. Reveal Background, 2. Reveal Text
    tl.to('.hero-reveal', {
        clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
        duration: 1.5,
        opacity: 1,
        ease: "power4.inOut"
    })
    .fromTo('.split-text', 
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, ease: "power4.out" },
        "-=0.5" // Text starts 500ms after bg reveal begins
    )
    .fromTo('.hero .fade-up',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power3.out" },
        "-=1.2"
    );

    // Image Clip-Path Reveals for the rest of the page
    gsap.utils.toArray('.reveal-img:not(.hero-reveal)').forEach(img => {
        gsap.to(img, {
            clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
            duration: 1.5,
            ease: "power4.inOut",
            scrollTrigger: {
                trigger: img,
                start: "top 85%",
            }
        });
    });

    // Standard Fade Ups
    gsap.utils.toArray('.fade-up:not(.hero .fade-up)').forEach(el => {
        gsap.to(el, {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
                trigger: el,
                start: "top 85%"
            }
        });
    });
    
    // Parallax hero image
    gsap.to('.hero-bg-img', {
        yPercent: 20,
        ease: "none",
        scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: true
        }
    });

    // 3. Before/After Slider Interaction
    const baSlider = document.querySelector('.ba-slider');
    const baWrapper = document.querySelector('.ba-image-wrapper');
    const baHandle = document.querySelector('.ba-handle');

    if (baSlider && baWrapper && baHandle) {
        // Initial state: Set to 80% to show mostly the finished result
        const initialPos = 80;
        baWrapper.style.width = `${initialPos}%`;
        baHandle.style.left = `${initialPos}%`;

        const move = (e) => {
            let x = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
            let rect = baSlider.getBoundingClientRect();
            let pos = ((x - rect.left) / rect.width) * 100;
            
            pos = Math.max(0, Math.min(100, pos));
            
            baWrapper.style.width = `${pos}%`;
            baHandle.style.left = `${pos}%`;
        };

        const startSliding = () => {
            baSlider.addEventListener('mousemove', move);
            baSlider.addEventListener('touchmove', move);
        };

        const stopSliding = () => {
            baSlider.removeEventListener('mousemove', move);
            baSlider.removeEventListener('touchmove', move);
        };

        baSlider.addEventListener('mousedown', startSliding);
        baSlider.addEventListener('touchstart', startSliding);
        window.addEventListener('mouseup', stopSliding);
        window.addEventListener('touchend', stopSliding);
        
        baSlider.addEventListener('click', move);
    }

// Modal Logic (Global)
window.openModal = function(modalId) {
    const overlay = document.getElementById('modal-overlay');
    const modal = document.getElementById(modalId);
    
    if (overlay && modal) {
        overlay.classList.add('active');
        modal.classList.add('active');
        document.documentElement.style.overflow = 'hidden';
    }
};

window.closeModals = function() {
    const overlay = document.getElementById('modal-overlay');
    if (overlay) overlay.classList.remove('active');
    
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('active');
    });
    document.documentElement.style.overflow = '';
};

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModals();
});

    // Magnetic Effect for Buttons (Premium UI - Disabled on touch)
    const magneticBtns = document.querySelectorAll('.btn-primary, .btn-outline');
    if (window.innerWidth > 1024) {
        magneticBtns.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                gsap.to(btn, {
                    x: x * 0.3,
                    y: y * 0.3,
                    duration: 0.4,
                    ease: "power2.out"
                });
            });
            
            btn.addEventListener('mouseleave', () => {
                gsap.to(btn, {
                    x: 0,
                    y: 0,
                    duration: 0.6,
                    ease: "elastic.out(1, 0.3)"
                });
            });
        });
    }

    // Fix for Local File Protocol Navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.lenis.scrollTo(targetElement, { offset: -80 });
            }
        });
    });

    // Form Submission Logic
    const contactForm = document.querySelector('.lead-filter-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button');
            const originalText = btn.innerText;
            
            btn.innerText = 'Sending...';
            btn.disabled = true;

            setTimeout(() => {
                btn.innerText = 'Proposal Requested ✓';
                btn.style.background = 'var(--success)';
                contactForm.reset();
                
                setTimeout(() => {
                    btn.innerText = originalText;
                    btn.style.background = '';
                    btn.disabled = false;
                }, 3000);
            }, 1500);
        });
    }
});
