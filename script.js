/* ================================================================
   RAFI AHMMED — PORTFOLIO WEBSITE
   SCRIPT.JS
   ----------------------------------------------------------------
   Features:
   1.  Navbar scroll effect (shrink on scroll)
   2.  Active nav link highlighting on scroll
   3.  Mobile menu toggle
   4.  Smooth scrolling (native + offset fix)
   5.  Scroll reveal animations (Intersection Observer)
   6.  Back-to-top button
   7.  Particle background generation
   8.  Current year in footer
   ================================================================ */

(function () {
    'use strict';

    /* ================================================================
       1. NAVBAR SCROLL EFFECT
       Shrinks navbar and adds shadow when user scrolls down
       ================================================================ */
    const navbar = document.getElementById('navbar');

    function handleNavScroll() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    /* ================================================================
       2. ACTIVE NAV LINK HIGHLIGHTING
       Highlights the current section's nav link based on scroll position
       ================================================================ */
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function highlightActiveLink() {
        const scrollPos = window.scrollY + 100; // offset for navbar height

        sections.forEach(function (section) {
            var sectionTop = section.offsetTop;
            var sectionHeight = section.offsetHeight;
            var sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(function (link) {
                    link.classList.remove('active');
                    // Match the href to the section id
                    if (link.getAttribute('href') === '#' + sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // Combined scroll handler (throttled for performance)
    var ticking = false;
    function onScroll() {
        if (!ticking) {
            window.requestAnimationFrame(function () {
                handleNavScroll();
                highlightActiveLink();
                handleBackToTop();
                ticking = false;
            });
            ticking = true;
        }
    }

    window.addEventListener('scroll', onScroll);

    /* ================================================================
       3. MOBILE MENU TOGGLE
       Opens/closes the mobile navigation menu
       ================================================================ */
    var menuToggle = document.getElementById('menuToggle');
    var navLinksEl = document.getElementById('navLinks');

    menuToggle.addEventListener('click', function () {
        menuToggle.classList.toggle('active');
        navLinksEl.classList.toggle('active');
    });

    // Close mobile menu when a link is clicked
    navLinks.forEach(function (link) {
        link.addEventListener('click', function () {
            menuToggle.classList.remove('active');
            navLinksEl.classList.remove('active');
        });
    });

    /* ================================================================
       4. SMOOTH SCROLLING
       Native smooth scroll via CSS, but we also handle any edge cases
       and close the mobile menu on click.
       ================================================================ */
    // Smooth scroll is handled by CSS `scroll-behavior: smooth`
    // and `scroll-padding-top` on the html element.
    // This is a fallback for any anchor clicks that need extra handling.
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var targetId = this.getAttribute('href');
            if (targetId === '#') return;

            var targetEl = document.querySelector(targetId);
            if (targetEl) {
                e.preventDefault();
                targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    /* ================================================================
       5. SCROLL REVEAL ANIMATIONS
       Uses IntersectionObserver to reveal elements as they enter viewport
       ================================================================ */
    var revealElements = document.querySelectorAll('.interest-card, .social-card');

    if ('IntersectionObserver' in window) {
        var revealObserver = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        // Apply staggered delay if data-delay is set
                        var delay = entry.target.getAttribute('data-delay') || 0;
                        entry.target.style.transitionDelay = delay + 'ms';
                        entry.target.classList.add('revealed');
                        // Unobserve once revealed so it doesn't re-trigger
                        revealObserver.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.15, // Trigger when 15% visible
                rootMargin: '0px 0px -50px 0px'
            }
        );

        revealElements.forEach(function (el) {
            revealObserver.observe(el);
        });
    } else {
        // Fallback: just reveal everything
        revealElements.forEach(function (el) {
            el.classList.add('revealed');
        });
    }

    /* ================================================================
       6. BACK TO TOP BUTTON
       Shows a floating button after scrolling down; scrolls to top on click
       ================================================================ */
    var backToTopBtn = document.getElementById('backToTop');

    function handleBackToTop() {
        if (window.scrollY > 400) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    }

    backToTopBtn.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    /* ================================================================
       7. PARTICLE BACKGROUND
       Generates floating dots in the hero section for a subtle,
       dynamic feel. Lightweight — uses DOM elements, no canvas.
       ================================================================ */
    var particlesContainer = document.getElementById('particles');
    var particleCount = 30;

    if (particlesContainer) {
        for (var i = 0; i < particleCount; i++) {
            var particle = document.createElement('span');
            particle.className = 'particle';

            // Random positioning and sizing
            var size = Math.random() * 4 + 1;            // 1px - 5px
            var posX = Math.random() * 100;               // 0% - 100%
            var posY = Math.random() * 100;               // 0% - 100%
            var duration = Math.random() * 10 + 10;       // 10s - 20s
            var delay = Math.random() * 10;               // 0s - 10s
            var opacity = Math.random() * 0.5 + 0.1;      // 0.1 - 0.6

            // Alternate between blue and purple particles
            var color = Math.random() > 0.5
                ? 'rgba(0, 212, 255, ' + opacity + ')'
                : 'rgba(168, 85, 247, ' + opacity + ')';

            // Apply styles
            particle.style.cssText =
                'position:absolute;' +
                'width:' + size + 'px;' +
                'height:' + size + 'px;' +
                'left:' + posX + '%;' +
                'top:' + posY + '%;' +
                'background:' + color + ';' +
                'border-radius:50%;' +
                'animation:particleFloat ' + duration + 's ease-in-out ' + delay + 's infinite;' +
                'pointer-events:none;';

            particlesContainer.appendChild(particle);
        }
    }

    // Inject particle keyframes dynamically (kept in JS to keep CSS clean)
    var styleSheet = document.createElement('style');
    styleSheet.textContent =
        '@keyframes particleFloat {' +
        '0%, 100% { transform: translate(0, 0); }' +
        '25% { transform: translate(20px, -30px); }' +
        '50% { transform: translate(-15px, 15px); }' +
        '75% { transform: translate(10px, -20px); }' +
        '}';
    document.head.appendChild(styleSheet);

    /* ================================================================
       8. CURRENT YEAR IN FOOTER
       ================================================================ */
    var yearEl = document.getElementById('currentYear');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

    /* ================================================================
       INITIAL CALLS — Run on load
       ================================================================ */
    handleNavScroll();
    highlightActiveLink();
    handleBackToTop();

})();
