import ProductsModule from './modules/products.js';
import BlogsModule from './modules/blogs.js';
import GalleryModule from './modules/gallery.js';

console.log('Main.js is being loaded...');

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded. Path:', window.location.pathname);
    
    initCommonUI();

    const path = window.location.pathname;
    
    // Explicitly check for both .html and clean URLs
    if (path.endsWith('products.html') || path.endsWith('/products') || path === '/' || path.includes('products')) {
        console.log('Products page detected. Initializing module...');
        ProductsModule.init();
    } else if (path.includes('blog')) {
        console.log('Blog page detected. Initializing module...');
        BlogsModule.init();
    } else if (path.includes('gallery')) {
        console.log('Gallery page detected. Initializing module...');
        GalleryModule.init();
    } else {
        console.log('No specific module matched for this path.');
    }
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
}
