document.addEventListener('DOMContentLoaded', function() {

    // --- Basic Setup ---
    const isTouchDevice = () => 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    // --- Mobile Navigation ---
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    const mainHeader = document.querySelector('.main-header');

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('open');
            mainHeader.classList.toggle('nav-open');
        });
    }

    // --- Scroll Indicator ---
    const scrollIndicator = document.querySelector('.scroll-indicator');
    
    function updateScrollIndicator() {
        if (scrollIndicator) {
            const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
            const scrollPercent = (scrollTop / (scrollHeight - clientHeight)) * 100;
            scrollIndicator.style.width = `${scrollPercent}%`;
        }
    }

    // --- Parallax Effect ---
    const parallaxSection = document.querySelector('.parallax-section');

    function handleParallax() {
        if (parallaxSection && !isTouchDevice()) {
            const scrollPosition = window.pageYOffset;
            const parallaxSpeed = 0.3;
            const newY = (scrollPosition - parallaxSection.offsetTop) * parallaxSpeed;
            parallaxSection.style.backgroundPosition = `center ${newY}px`;
        }
    }

    // --- Product Gallery ---
    const mainImage = document.getElementById('mainImage');
    const thumbnails = document.querySelectorAll('.thumbnail');

    if (mainImage && thumbnails.length > 0) {
        thumbnails.forEach(thumbnail => {
            thumbnail.addEventListener('click', function() {
                thumbnails.forEach(thumb => thumb.classList.remove('active'));
                this.classList.add('active');
                mainImage.style.opacity = '0';
                setTimeout(() => {
                    mainImage.src = this.src;
                    mainImage.style.opacity = '1';
                }, 300);
            });
        });
    }

    // --- Partner Filtering ---
    const stateFilter = document.getElementById('stateFilter');
    const districtFilter = document.getElementById('districtFilter');
    const partnerCards = document.querySelectorAll('.partner-card');

    function filterPartners() {
        if (!stateFilter || !districtFilter) return;
        const selectedState = stateFilter.value;
        const districtQuery = districtFilter.value.toLowerCase();

        partnerCards.forEach(card => {
            const cardState = card.dataset.state;
            const cardDistrict = card.dataset.district.toLowerCase();
            
            const stateMatch = selectedState === 'all' || selectedState === cardState;
            const districtMatch = districtQuery === '' || cardDistrict.includes(districtQuery);

            if (stateMatch && districtMatch) {
                card.classList.remove('hidden');
            } else {
                card.classList.add('hidden');
            }
        });
    }

    if (partnerCards.length > 0) {
        stateFilter.addEventListener('change', filterPartners);
        districtFilter.addEventListener('keyup', filterPartners);
    }
    
    // --- Lightbox Gallery ---
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const galleryImages = document.querySelectorAll('.gallery-image');
    const lightboxClose = document.querySelector('.lightbox-close');

    if (lightbox && lightboxImage && galleryImages.length > 0) {
        galleryImages.forEach(image => {
            image.addEventListener('click', () => {
                lightbox.classList.add('active');
                lightboxImage.src = image.src;
            });
        });

        const closeLightbox = () => {
            lightbox.style.animation = 'fadeOut 0.3s ease';
            lightbox.querySelector('.lightbox-image').style.animation = 'zoomOut 0.3s ease';
            setTimeout(() => {
                lightbox.classList.remove('active');
                lightbox.style.animation = '';
                lightbox.querySelector('.lightbox-image').style.animation = '';
            }, 300);
        };

        if(lightboxClose) {
            lightboxClose.addEventListener('click', closeLightbox);
        }
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }

    // --- Video Card ---
    const videoCards = document.querySelectorAll('.video-card');
    let currentlyPlaying = null;

    videoCards.forEach(card => {
        const video = card.querySelector('video');
        const playButton = card.querySelector('.play-button-overlay');

        card.addEventListener('click', () => {
            if (currentlyPlaying && currentlyPlaying !== video) {
                currentlyPlaying.pause();
            }
            
            video.controls = true;
            video.play();
            if(playButton) playButton.style.display = 'none';
            currentlyPlaying = video;
        });

        video.addEventListener('pause', () => {
             video.controls = false;
             if(playButton) playButton.style.display = 'block';
             if(currentlyPlaying === video) {
                currentlyPlaying = null;
             }
        });
    });

    // --- Contact Form URL Params ---
    const contactSubjectField = document.getElementById('subject');
    if (contactSubjectField) {
        const urlParams = new URLSearchParams(window.location.search);
        const subject = urlParams.get('subject');
        const product = urlParams.get('product');

        if (subject) {
            contactSubjectField.value = subject;
        }
        if (product) {
            contactSubjectField.value = `Enquiry about ${product}`;
        }
    }


    // --- Event Listeners ---
    window.addEventListener('scroll', () => {
        updateScrollIndicator();
        handleParallax();
    });
    
    // --- Intersection Observer for Animations ---
    const animatedElements = document.querySelectorAll('.reveal-text, .fade-in');

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        rootMargin: '0px',
        threshold: 0.15
    });

    animatedElements.forEach(element => {
        if (element) {
            observer.observe(element);
        }
    });

});