import API from '../api.js';
import CONFIG from '../config.js';

const HomeModule = {
    init: async () => {
        await loadCarouselFromAPI();
    }
};

async function loadCarouselFromAPI() {
    const slidesContainer = document.getElementById('carousel-slides');
    const dotsContainer = document.getElementById('carousel-dots');
    const carouselSection = document.getElementById('hero-carousel');

    if (!slidesContainer || !dotsContainer) return;

    try {
        const res = await API.getCarousel();
        if (res.success) {
            const items = res.data?.data || res.data || [];

            if (items.length === 0) {
                // Show fallback static images if no carousel items
                renderFallbackCarousel(slidesContainer, dotsContainer);
            } else {
                // Render dynamic carousel
                renderCarousel(slidesContainer, dotsContainer, items);
            }
        } else {
            // On error, show fallback
            renderFallbackCarousel(slidesContainer, dotsContainer);
        }
    } catch (error) {
        console.error('Carousel load error:', error);
        renderFallbackCarousel(slidesContainer, dotsContainer);
    }

    // Initialize carousel functionality after content is loaded
    initHeroCarousel();
}

function renderCarousel(slidesContainer, dotsContainer, items) {
    // Render slides with <picture> element for responsive images
    slidesContainer.innerHTML = items.map((item, index) => {
        const desktopSrc = `${CONFIG.STORAGE_URL}${item.image_url}`;
        const mobileSrc = item.mobile_image_url
            ? `${CONFIG.STORAGE_URL}${item.mobile_image_url}`
            : desktopSrc;

        return `
            <div class="hero-slide ${index === 0 ? 'active' : ''}">
                <picture>
                    <source media="(max-width: 768px)" srcset="${mobileSrc}">
                    <source media="(min-width: 769px)" srcset="${desktopSrc}">
                    <img src="${desktopSrc}" alt="Carousel Image ${index + 1}" ${index > 0 ? 'loading="lazy"' : ''}>
                </picture>
            </div>
        `;
    }).join('');

    // Render dots
    dotsContainer.innerHTML = items.map((_, index) => `
        <span class="dot ${index === 0 ? 'active' : ''}" data-slide="${index}"></span>
    `).join('');
}

function renderFallbackCarousel(slidesContainer, dotsContainer) {
    const fallbackSlides = [
        {
            eyebrow: 'Salon Professional',
            heading: 'Crafted for<br>Excellence',
            subtext: 'Advanced salon-grade formulations designed for repair, rebonding & nourishment.',
            theme: 'hero-slide--warm'
        },
        {
            eyebrow: 'The Science of Care',
            heading: 'Where Nature<br>Meets Precision',
            subtext: 'Biomimetic K-Cell technology for deep cellular repair and lasting transformation.',
            theme: 'hero-slide--dark'
        },
        {
            eyebrow: 'YuvaGlow Professional Co.',
            heading: 'Trusted by<br>Professionals',
            subtext: 'Premium hair care trusted by salon professionals across the country.',
            theme: 'hero-slide--gold'
        }
    ];

    slidesContainer.innerHTML = fallbackSlides.map((slide, index) => `
        <div class="hero-slide hero-slide--editorial ${slide.theme} ${index === 0 ? 'active' : ''}">
            <div class="hero-editorial-content">
                <span class="hero-eyebrow">${slide.eyebrow}</span>
                <div class="hero-gold-line"></div>
                <h1 class="hero-editorial-heading">${slide.heading}</h1>
                <p class="hero-editorial-sub">${slide.subtext}</p>
                <a href="products.html#hair" class="hero-editorial-cta">Explore Collection &rarr;</a>
            </div>
        </div>
    `).join('');

    dotsContainer.innerHTML = fallbackSlides.map((_, index) => `
        <span class="dot ${index === 0 ? 'active' : ''}" data-slide="${index}"></span>
    `).join('');
}

function initHeroCarousel() {
    const slides = document.querySelectorAll('.hero-slide');
    const track = document.querySelector('.carousel-slides');
    if (slides.length === 0 || !track) return;

    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    const dots = document.querySelectorAll('.dot');
    let currentSlide = 0;
    let slideInterval;
    const intervalTime = 5000;

    function showSlide(index) {
        // Wrap around
        if (index >= slides.length) currentSlide = 0;
        else if (index < 0) currentSlide = slides.length - 1;
        else currentSlide = index;

        // Slide the track
        track.style.transform = `translateX(-${currentSlide * 100}%)`;

        // Update active class for internal animations & dots
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));

        slides[currentSlide].classList.add('active');
        if (dots[currentSlide]) {
            dots[currentSlide].classList.add('active');
        }
    }

    function nextSlide() {
        showSlide(currentSlide + 1);
    }

    function prevSlide() {
        showSlide(currentSlide - 1);
    }

    function startAutoPlay() {
        stopAutoPlay(); // Ensure no duplicates
        slideInterval = setInterval(nextSlide, intervalTime);
    }

    function stopAutoPlay() {
        if (slideInterval) clearInterval(slideInterval);
    }

    // Event Listeners
    if(nextBtn) nextBtn.addEventListener('click', () => {
        nextSlide();
        startAutoPlay(); // Reset timer
    });

    if(prevBtn) prevBtn.addEventListener('click', () => {
        prevSlide();
        startAutoPlay(); // Reset timer
    });

    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            const slideIndex = parseInt(dot.getAttribute('data-slide'));
            showSlide(slideIndex);
            startAutoPlay(); // Reset timer
        });
    });

    // Start Auto Play
    startAutoPlay();

    // Pause on hover
    const carouselContainer = document.querySelector('.hero-carousel');
    if(carouselContainer) {
        carouselContainer.addEventListener('mouseenter', stopAutoPlay);
        carouselContainer.addEventListener('mouseleave', startAutoPlay);
    }
}

export default HomeModule;
