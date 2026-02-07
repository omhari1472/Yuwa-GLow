import ProductsModule from './modules/products.js';
import ProductDetailsModule from './modules/product-details.js';
import BlogsModule from './modules/blogs.js';
import BlogDetailsModule from './modules/blog-details.js';
import GalleryModule from './modules/gallery.js';
import CareersModule from './modules/careers.js';
import CareerDetailsModule from './modules/career-details.js';
import PartnersModule from './modules/partners.js';
import HomeModule from './modules/home.js';

document.addEventListener('DOMContentLoaded', () => {
    initCommonUI();

    const path = window.location.pathname;

    // Module Routing
    const initModules = async () => {
        try {
            // Home Page Detection
            // Matches: "/", "/index.html", "/frontend/", "/frontend/index.html"
            const isHomePage = path === '/' ||
                             path.endsWith('index.html') ||
                             path.endsWith('/') ||
                             path.includes('/yuwa_glow_final/'); // Catch-all for dev environment root

            if (isHomePage && !path.includes('admin')) {
                await HomeModule.init();
            } else if (path.includes('product-details')) {
                await ProductDetailsModule.init();
            } else if (path.includes('products')) {
                await ProductsModule.init();
            } else if (path.includes('blog-details')) {
                await BlogDetailsModule.init();
            } else if (path.includes('blog')) {
                await BlogsModule.init();
            } else if (path.includes('gallery')) {
                await GalleryModule.init();
            } else if (path.includes('career-details')) {
                await CareerDetailsModule.init();
            } else if (path.includes('career')) {
                await CareersModule.init();
            } else if (path.includes('partners')) {
                await PartnersModule.init();
            }
        } finally {
            // ALWAYS trigger reveal after modules are done or if they fail
            window.startScrollObserver();
            // Hide page loader after content is ready (only on home page)
            hidePageLoader();
        }
    };

    initModules();
});

// Cinematic page loader — wait for brand reveal animations to finish
function hidePageLoader() {
    const loader = document.getElementById('pageLoader');
    if (loader) {
        // Let the logo shimmer + gold line + tagline play out (~1.8s), then reveal
        setTimeout(() => {
            loader.classList.add('hidden');
            document.body.classList.add('page-revealed');
            setTimeout(() => loader.remove(), 800);
        }, 1800);
    } else {
        document.body.classList.add('page-revealed');
    }
}

window.startScrollObserver = function() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.15 });

    const targets = document.querySelectorAll('.fade-in, .stagger-wrapper');
    targets.forEach(el => observer.observe(el));

    // Force reveal for elements already in viewport
    setTimeout(() => {
        targets.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                el.classList.add('visible');
            }
        });
    }, 100);
};

function initCommonUI() {
    // Mobile Nav
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (navToggle && navLinks) {
        // Toggle menu function
        const toggleMenu = (e) => {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            navLinks.classList.toggle('open');
            navToggle.classList.toggle('nav-open');
        };

        // Close menu function
        const closeMenu = () => {
            navLinks.classList.remove('open');
            navToggle.classList.remove('nav-open');
        };

        // Use addEventListener for better reliability
        navToggle.addEventListener('click', toggleMenu);

        // Also add touchend for mobile devices that might have issues with click
        navToggle.addEventListener('touchend', (e) => {
            e.preventDefault();
            toggleMenu();
        }, { passive: false });

        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeMenu);
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (navLinks.classList.contains('open')) {
                if (!navLinks.contains(e.target) && !navToggle.contains(e.target)) {
                    closeMenu();
                }
            }
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navLinks.classList.contains('open')) {
                closeMenu();
            }
        });
    }

    // Scroll Progress + Header auto-hide
    const scrollIndicator = document.querySelector('.scroll-indicator');
    const header = document.querySelector('.main-header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;

        if (scrollIndicator) {
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            scrollIndicator.style.width = scrolled + "%";
        }

        // Smart header: hide on scroll down, show on scroll up
        if (header && winScroll > 200) {
            if (winScroll > lastScroll && winScroll - lastScroll > 5) {
                header.classList.add('header-hidden');
            } else if (lastScroll > winScroll && lastScroll - winScroll > 5) {
                header.classList.remove('header-hidden');
            }
        } else if (header) {
            header.classList.remove('header-hidden');
        }
        lastScroll = winScroll;
    }, { passive: true });
}