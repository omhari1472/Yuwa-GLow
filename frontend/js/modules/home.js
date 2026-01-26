const HomeModule = {
    init: async () => {
        console.log('Home Module Initialized');
        initHeroCarousel();
    }
};

function initHeroCarousel() {
    const slides = document.querySelectorAll('.hero-slide');
    const track = document.querySelector('.carousel-slides');
    if (slides.length === 0 || !track) return;

    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    const dots = document.querySelectorAll('.dot');
    let currentSlide = 0;
    let slideInterval;
    const intervalTime = 3000;

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
        dots[currentSlide].classList.add('active');
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