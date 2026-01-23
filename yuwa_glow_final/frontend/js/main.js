import ProductsModule from './modules/products.js';
import BlogsModule from './modules/blogs.js';
import GalleryModule from './modules/gallery.js';

document.addEventListener('DOMContentLoaded', () => {
    // Basic UI logic (Mobile Nav, etc.)
    initCommonUI();

    // Page-specific Module Activation
    const path = window.location.pathname;
    
    if (path.includes('products.html')) {
        ProductsModule.init();
    } else if (path.includes('blog.html')) {
        BlogsModule.init();
    } else if (path.includes('gallery.html')) {
        GalleryModule.init();
    }
    // Add more as modules are created
});

function initCommonUI() {
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    const mainHeader = document.querySelector('.main-header');

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('open');
            mainHeader.classList.toggle('nav-open');
        });
    }

    // Scroll Indicator
    const scrollIndicator = document.querySelector('.scroll-indicator');
    window.addEventListener('scroll', () => {
        if (scrollIndicator) {
            const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
            const scrollPercent = (scrollTop / (scrollHeight - clientHeight)) * 100;
            scrollIndicator.style.width = `${scrollPercent}%`;
        }
    });
}
