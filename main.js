document.addEventListener("DOMContentLoaded", () => {
    // 1. Initialize Lenis (Buttery Smooth Scroll)
    const isLocal = window.location.protocol === 'file:';
    window.lenis = new Lenis({
        duration: 1.5,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smooth: true,
        smoothTouch: !isLocal, // Disable on local files to avoid security warnings
        mouseMultiplier: 1,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    gsap.registerPlugin(ScrollTrigger);
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);

    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    });

    // Mobile Menu Logic
    const mobileToggle = document.getElementById('mobile-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-menu a');

    const toggleMenu = () => {
        const isActive = mobileToggle.classList.toggle('active');
        mobileMenu.classList.toggle('active');
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
    mobileLinks.forEach(link => link.addEventListener('click', toggleMenu));

    // 2. Modal Data & Logic
    const modalData = {
        'case-1': { title: 'Rental Refresh', location: 'Covent Garden, WC2', img: 'assets/lux_covent.png', desc: 'Rapid property refresh delivered in 5 days to minimize void periods for the landlord.' },
        'case-2': { title: 'Internal Refurb', location: 'Vauxhall, SW8', img: 'assets/lux_drylining.png', desc: 'Full internal refurbishment including drylining and first-fix electrical/plumbing for a modern residential project.' },
        'case-3': { title: 'Kitchen & Bath Upgrade', location: 'Chelsea, SW3', timescale: '4 Weeks', img: 'assets/lux_chelsea.png', scope: 'High-end renovation of primary kitchen and two bathrooms. Included bespoke cabinetry fitting, marble tiling, and installation of premium brass fixtures.', result: 'Seamless, luxury finish delivered on time for a private client.' },
        'case-4': { title: 'Full Residential Refurbishment', location: 'Mayfair, W1', timescale: '12 Weeks', img: 'assets/lux_mayfair.png', scope: 'Complete top-to-bottom renovation of a heritage apartment. Structural reconfigurations, ornate cornicing restoration, and full integrated smart home installation.', result: 'Property value increased by approximately 25% post-completion.' },
        'case-5': { title: 'Commercial Painting', location: 'City of London, EC2', timescale: '2 Weeks', img: 'assets/lux_city.png', scope: 'Night-shift painting and snagging for a 15,000 sq ft office space. Required strict coordination to ensure zero disruption to daytime business operations.', result: 'Flawless finish delivered within the tight handover window.' },
        'who-landlords': { title: 'Minimize Void Periods', desc: 'We understand that every day your property is vacant, you\'re losing money. Our <strong>Rental Property Refresh</strong> service is designed specifically for high-speed delivery without compromising on quality.', list: ['Rapid end-of-tenancy painting', 'Professional floor and carpet cleaning', 'Minor repairs & snagging', 'Gas & Electrical safety certificates'], btn: 'Get a Fast Quote' },
        'who-managers': { title: 'Reliable Maintenance Partner', desc: 'Tired of chasing unreliable contractors? We provide a seamless maintenance partnership with full administrative support.', list: ['Full RAMS & Insurance documents provided', 'Detailed photo-reporting of progress', 'Planned preventive maintenance', 'Out-of-hours service available'], btn: 'Partner With Us' },
        'who-developers': { title: 'The Finishing Phase', desc: 'We specialize in the critical "finishing phase" where quality and attention to detail determine the final property value.', list: ['Specialist drylining & partition teams', 'High-volume painting capacity', 'Snagging liquidation specialists', 'Strict adherence to site safety & deadlines'], btn: 'Discuss Your Project' },
        'who-homeowners': { title: 'Surgical Home Renovations', desc: 'Transforming your home should be an exciting process, not a stressful one. We bring commercial-grade organization to private renovations.', list: ['Surgical protection of your furniture and floors', 'Transparent, itemized quotes with no surprises', 'Respectful, polite, and tidy site teams', 'Direct communication with project managers'], btn: 'Start Your Journey' }
    };

    const modalOverlay = document.getElementById('modal-overlay');
    const dynamicModal = document.getElementById('dynamic-modal');

    window.openModal = function(id) {
        const data = modalData[id];
        if (!data) return;

        let content = `
            <span class="close-btn" onclick="closeModals()">&times;</span>
            <h2>${data.title}</h2>
            ${data.location ? `<div class="modal-meta"><span><strong>Location:</strong> ${data.location}</span>${data.timescale ? `<span><strong>Timescale:</strong> ${data.timescale}</span>` : ''}</div>` : ''}
            ${data.img ? `<img src="${data.img}" alt="${data.title}">` : ''}
            ${data.desc ? `<p>${data.desc}</p>` : ''}
            ${data.scope ? `<p><strong>Scope:</strong> ${data.scope}</p>` : ''}
            ${data.result ? `<p><strong>Result:</strong> ${data.result}</p>` : ''}
            ${data.list ? `<ul>${data.list.map(item => `<li>${item}</li>`).join('')}</ul>` : ''}
            ${data.btn ? `<a href="#contact-form" class="btn-primary modal-btn" onclick="closeModals()">${data.btn}</a>` : ''}
            ${id.startsWith('exp-') ? `<a href="#contact-form" class="btn-primary modal-btn" onclick="closeModals()">Request a Proposal</a>` : ''}
        `;

        dynamicModal.innerHTML = content;
        modalOverlay.classList.add('active');
        dynamicModal.classList.add('active');
        document.documentElement.style.overflow = 'hidden';
        if (window.lenis) lenis.stop();
    };

    window.closeModals = function() {
        modalOverlay.classList.remove('active');
        dynamicModal.classList.remove('active');
        document.documentElement.style.overflow = '';
        if (window.lenis) lenis.start();
    };

    modalOverlay.addEventListener('click', (e) => { if(e.target === modalOverlay) closeModals(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModals(); });

    // 3. Editorial Layout Logic
    const editorialItems = document.querySelectorAll('.editorial-item');
    const editorialImages = document.querySelectorAll('.editorial-img');

    editorialItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            const id = item.getAttribute('data-id');
            
            // Update items
            editorialItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            
            // Update images
            editorialImages.forEach(img => {
                if (img.getAttribute('data-id') === id) {
                    img.classList.add('active');
                } else {
                    img.classList.remove('active');
                }
            });
        });
    });

    // 4. Animations & Interactions
    if (document.querySelector('.hero-reveal')) {
        const tl = gsap.timeline();
        tl.to('.hero-reveal', { scale: 1, opacity: 1, duration: 1.8, ease: "power3.out" })
          .fromTo('.split-text', { y: 100, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, ease: "power4.out" }, "-=0.5")
          .fromTo('.hero .fade-up', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power3.out" }, "-=1.2");
    }

    gsap.utils.toArray('.reveal-img:not(.hero-reveal)').forEach(img => {
        gsap.to(img, { clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)', duration: 1.5, ease: "power4.inOut", scrollTrigger: { trigger: img, start: "top 85%" } });
    });

    gsap.utils.toArray('.fade-up:not(.hero .fade-up)').forEach(el => {
        gsap.to(el, { y: 0, opacity: 1, duration: 1, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 85%" } });
    });
    
    if (document.querySelector('.hero-bg-img')) {
        gsap.to('.hero-bg-img', { yPercent: 20, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
    }

    // 5. Bento Card Spotlight & Parallax Effect
    if (window.innerWidth > 1024) {
        document.querySelectorAll('.bento-card').forEach(card => {
            const img = card.querySelector('.service-img');
            
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                // Spotlight logic
                card.style.setProperty('--mouse-x', `${x}px`);
                card.style.setProperty('--mouse-y', `${y}px`);

                // Parallax logic
                const px = (x / rect.width) - 0.5;
                const py = (y / rect.height) - 0.5;
                
                gsap.to(img, {
                    x: px * 30,
                    y: py * 30,
                    scale: 1.15,
                    duration: 0.8,
                    ease: "power2.out"
                });
            });
            
            card.addEventListener('mouseleave', () => {
                gsap.to(img, {
                    x: 0,
                    y: 0,
                    scale: 1,
                    duration: 1,
                    ease: "power2.out"
                });
            });
        });
    }


    // Magnetic Buttons
    if (window.innerWidth > 1024) {
        document.querySelectorAll('.btn-primary, .btn-outline').forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                gsap.to(btn, { x: (e.clientX - rect.left - rect.width/2) * 0.3, y: (e.clientY - rect.top - rect.height/2) * 0.3, duration: 0.4, ease: "power2.out" });
            });
            btn.addEventListener('mouseleave', () => { gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.3)" }); });
        });
    }

    // Form Logic

    const contactForm = document.querySelector('.lead-filter-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button');
            const originalText = btn.innerText;
            btn.innerText = 'Sending...'; btn.disabled = true;
            setTimeout(() => {
                btn.innerText = 'Proposal Requested ✓'; btn.style.background = 'var(--success)';
                contactForm.reset();
                setTimeout(() => { btn.innerText = originalText; btn.style.background = ''; btn.disabled = false; }, 3000);
            }, 1500);
        });
    }

    // Anchor Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) window.lenis.scrollTo(target, { offset: -80 });
        });
    });
});
