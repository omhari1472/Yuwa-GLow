import ProductsModule from './modules/products.js';
import BlogsModule from './modules/blogs.js';
import GalleryModule from './modules/gallery.js';

document.addEventListener('DOMContentLoaded', () => {
    console.log('YUWA GLOW Engine Active');
    
    initCommonUI();
    
    const path = window.location.pathname;
    
    // Module Routing
    const initModules = async () => {
        try {
            if (path.includes('products')) {
                await ProductsModule.init();
            } else if (path.includes('blog')) {
                await BlogsModule.init();
            } else if (path.includes('gallery')) {
                await GalleryModule.init();
            }
        } finally {
            // ALWAYS trigger reveal after modules are done or if they fail
            startScrollObserver();
        }
    };

    initModules();
});

function startScrollObserver() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.05 });

    const targets = document.querySelectorAll('.fade-in');
    targets.forEach(el => observer.observe(el));

    // FORCE REVEAL for elements at the very top (header, hero)
    // This ensures the user doesn't see a blank screen on load
    setTimeout(() => {
        targets.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight) {
                el.classList.add('visible');
            }
        });
    }, 300);
}

function initCommonUI() {
    // Mobile Nav
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    if (navToggle) {
        navToggle.onclick = () => navLinks.classList.toggle('open');
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