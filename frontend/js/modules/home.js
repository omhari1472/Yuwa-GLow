import API from '../api.js';
import CONFIG from '../config.js';

const HomeModule = {
    init: async () => {
        // Load independent data in parallel
        await Promise.all([
            loadCarouselFromAPI(),
            loadCategoriesForBento()
        ]);
        initTrendingSlider();
    }
};

async function loadCategoriesForBento() {
    try {
        const res = await API.getCategories();
        if (res.success) {
            const categories = res.data?.data || res.data || [];
            if (categories.length > 0) {
                updateBentoGrid(categories);
            }
        }
    } catch (e) {
        console.error('Bento Load Error:', e);
    }
}

function updateBentoGrid(categories) {
    // Map CSS classes to category keywords to find the right image
    const mapping = {
        '.item-hair': ['hair'],
        '.item-skin': ['skin', 'face', 'body'],
        '.item-makeup': ['makeup', 'cosmetic'],
        '.item-tools': ['salon', 'tool', 'equipment']
    };

    Object.keys(mapping).forEach(selector => {
        const el = document.querySelector(selector);
        if (!el) return;
        
        const keywords = mapping[selector];
        // Find a category that matches one of the keywords
        const cat = categories.find(c => 
            keywords.some(k => c.name.toLowerCase().includes(k))
        );
        
        if (cat && cat.image_url) {
            const img = el.querySelector('img');
            if (img) {
                // Update image source to DB image
                img.src = `${CONFIG.STORAGE_URL}${cat.image_url}`;
            }
        }
    });
}

async function loadCarouselFromAPI() {
    const slidesContainer = document.getElementById('carousel-slides');
    const dotsContainer = document.getElementById('carousel-dots');

    if (!slidesContainer || !dotsContainer) return;

    try {
        const res = await API.getCarousel();
        if (res.success) {
            const items = res.data?.data || res.data || [];

            if (items.length === 0) {
                renderFallbackCarousel(slidesContainer, dotsContainer);
            } else {
                renderCarousel(slidesContainer, dotsContainer, items);
            }
        } else {
            renderFallbackCarousel(slidesContainer, dotsContainer);
        }
    } catch (error) {
        console.error('Carousel load error:', error);
        renderFallbackCarousel(slidesContainer, dotsContainer);
    }

    initHeroFadeSlider();
}

function renderCarousel(slidesContainer, dotsContainer, items) {
    slidesContainer.innerHTML = items.map((item, index) => {
        const desktopSrc = `${CONFIG.STORAGE_URL}${item.image_url}`;
        const tagline = item.subtitle || 'Crafted in India. Loved Globally.';
        const title = item.title || 'The Golden<br><span class="italic-accent">Standard.</span>';
        const desc = item.description || 'Luxury Ayurvedic formulations meet modern clinical science.';
        
        return `
            <div class="fade-slide ${index === 0 ? 'active' : ''}">
                <div class="hero-bg-wrapper">
                    <img src="${desktopSrc}" alt="${item.title || 'Yuva Glow'}" class="hero-bg-img" loading="${index === 0 ? 'eager' : 'lazy'}">
                    <div class="hero-overlay-gradient"></div>
                </div>
                <div class="container hero-content-center">
                    <span class="hero-tagline">${tagline}</span>
                    <h1 class="hero-title-large">${title}</h1>
                    <p class="hero-desc-text">${desc}</p>
                    <div class="hero-btn-wrapper">
                        <a href="${item.link || 'products.html'}" class="btn-editorial-outline">Discover More</a>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    dotsContainer.innerHTML = items.map((_, index) => `
        <button class="fade-dot ${index === 0 ? 'active' : ''}" data-index="${index}"></button>
    `).join('');
}

function renderFallbackCarousel(slidesContainer, dotsContainer) {
    const fallbackSlides = [
        {
            img: 'https://images.unsplash.com/photo-1616766098956-c81f12114571?q=80&w=1920&auto=format&fit=crop',
            tagline: 'Crafted in India',
            title: 'The Golden<br><span class="italic-accent">Standard.</span>',
            desc: 'Luxury Ayurvedic formulations meet modern clinical science.'
        },
        {
            img: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=1920&auto=format&fit=crop',
            tagline: 'Pure Potency',
            title: 'Rituals of<br><span class="italic-accent">Repair.</span>',
            desc: 'Biomimetic ingredients that penetrate deep for lasting transformation.'
        },
        {
            img: 'https://images.unsplash.com/photo-1629198727546-3729e46955a5?q=80&w=1920&auto=format&fit=crop',
            tagline: 'Modern Ayurveda',
            title: 'Science of<br><span class="italic-accent">Silk.</span>',
            desc: 'Infused with saffron and 24k gold for hair that gleams.'
        }
    ];

    slidesContainer.innerHTML = fallbackSlides.map((slide, index) => `
        <div class="fade-slide ${index === 0 ? 'active' : ''}">
            <div class="hero-bg-wrapper">
                <img src="${slide.img}" class="hero-bg-img">
                <div class="hero-overlay-gradient"></div>
            </div>
            <div class="container hero-content-center">
                <span class="hero-tagline">${slide.tagline}</span>
                <h1 class="hero-title-large">${slide.title}</h1>
                <p class="hero-desc-text">${slide.desc}</p>
                <div class="hero-btn-wrapper">
                    <a href="products.html" class="btn-editorial-outline">Discover Collection</a>
                </div>
            </div>
        </div>
    `).join('');

    dotsContainer.innerHTML = fallbackSlides.map((_, index) => `
        <button class="fade-dot ${index === 0 ? 'active' : ''}" data-index="${index}"></button>
    `).join('');
}

function initHeroFadeSlider() {
    const slides = document.querySelectorAll('.fade-slide');
    const dots = document.querySelectorAll('.fade-dot');
    let currentSlide = 0;
    const intervalTime = 6000;
    let slideInterval;

    if (slides.length === 0) return;

    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));

        slides[index].classList.add('active');
        if(dots[index]) dots[index].classList.add('active');
        currentSlide = index;
    }

    function nextSlide() {
        let nextIndex = (currentSlide + 1) % slides.length;
        showSlide(nextIndex);
    }

    function startAutoPlay() {
        if (slideInterval) clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, intervalTime);
    }

    function stopAutoPlay() {
        if (slideInterval) clearInterval(slideInterval);
    }

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            stopAutoPlay();
            showSlide(index);
            startAutoPlay();
        });
    });

    startAutoPlay();
}

function initTrendingSlider() {
    const container = document.querySelector('.trending-scroll-container');
    const prevBtn = document.querySelector('.prev-trend');
    const nextBtn = document.querySelector('.next-trend');

    if (!container || !prevBtn || !nextBtn) return;

    const scrollAmount = 320; 

    nextBtn.addEventListener('click', () => {
        container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });

    prevBtn.addEventListener('click', () => {
        container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });
}

export default HomeModule;
