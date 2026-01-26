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
    console.log('YUVA GLOW Engine Active');

    initCommonUI();

    const path = window.location.pathname;

    console.log('Current path:', path);

    // Module Routing
    const initModules = async () => {
        try {
            // Home Page Detection
            // Matches: "/", "/index.html", "/frontend/", "/frontend/index.html"
            const isHomePage = path === '/' || 
                             path.endsWith('index.html') || 
                             path.endsWith('/') ||
                             path.includes('/yuwa_glow_final/'); // Catch-all for dev environment root

            if (isHomePage && !path.includes('admin')) { // Exclude admin if it exists
                console.log('Detected Home Page');
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
        }
    };

    initModules();
});

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
        // Remove any existing listeners (not strictly possible without reference, but good practice in frameworks)
        // Here we just ensure we add it once or replace the logic.
        
        navToggle.onclick = (e) => {
            e.preventDefault(); // Prevent default button behavior
            e.stopPropagation(); // Stop bubbling
            console.log('Hamburger clicked'); // Debugging
            
            navLinks.classList.toggle('open');
            navToggle.classList.toggle('nav-open');
        };

        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('open');
                navToggle.classList.remove('nav-open');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            // Check if menu is open
            if (navLinks.classList.contains('open')) {
                // If click is outside navLinks and not on the toggle button
                if (!navLinks.contains(e.target) && !navToggle.contains(e.target)) {
                    navLinks.classList.remove('open');
                    navToggle.classList.remove('nav-open');
                }
            }
        });
    }

    // Scroll Progress
    const scrollIndicator = document.querySelector('.scroll-indicator');
    window.onscroll = () => {
        if (scrollIndicator) {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            scrollIndicator.style.width = scrolled + "%";
        }
    };
}