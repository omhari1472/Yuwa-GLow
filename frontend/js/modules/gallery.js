import API from '../api.js';
import CONFIG from '../config.js';

const GalleryModule = {
    async init() {
        const imagesGrid = document.getElementById('gallery-images');
        const videosGrid = document.getElementById('gallery-videos');
        const imagesSection = document.getElementById('gallery-images-section');
        const videosSection = document.getElementById('gallery-videos-section');
        const transformationsList = document.getElementById('transformations-list');
        const transformationsSection = document.getElementById('transformations-section');

        // Load gallery (images and videos)
        if (imagesGrid || videosGrid) {
            await this.loadGallery(imagesGrid, videosGrid, imagesSection, videosSection);
        }

        // Load transformations
        if (transformationsList) {
            await this.loadTransformations(transformationsList, transformationsSection);
        }
    },

    async loadGallery(imagesGrid, videosGrid, imagesSection, videosSection) {
        // Show loading state
        if (imagesGrid) this.renderLoading(imagesGrid);
        if (videosGrid) this.renderLoading(videosGrid);

        try {
            const res = await API.getGallery();
            if (res.success) {
                const items = res.data?.data || res.data || [];

                // Separate images and videos
                const images = items.filter(item => item.type === 'image');
                const videos = items.filter(item => item.type === 'video');

                // Render images
                if (imagesGrid) {
                    if (images.length > 0) {
                        this.renderImages(imagesGrid, images);
                    } else {
                        this.renderEmpty(imagesGrid, 'No images yet');
                        if (imagesSection) imagesSection.style.display = 'none';
                    }
                }

                // Render videos
                if (videosGrid) {
                    if (videos.length > 0) {
                        this.renderVideos(videosGrid, videos);
                    } else {
                        this.renderEmpty(videosGrid, 'No videos yet');
                        if (videosSection) videosSection.style.display = 'none';
                    }
                }

                // Hide both sections if no content
                if (images.length === 0 && videos.length === 0) {
                    if (imagesSection) imagesSection.style.display = 'block';
                    if (imagesGrid) this.renderEmpty(imagesGrid, 'Our gallery is being updated. Check back soon!');
                    if (videosSection) videosSection.style.display = 'none';
                }
            }
        } catch (error) {
            console.error('Gallery Module Error:', error);
        }
    },

    async loadTransformations(container, section) {
        this.renderTransformationsLoading(container);

        try {
            const res = await API.getTransformations();
            if (res.success) {
                const items = res.data?.data || res.data || [];

                if (items.length > 0) {
                    this.renderTransformations(container, items);
                } else {
                    // Hide section if no transformations
                    if (section) section.style.display = 'none';
                }
            } else {
                if (section) section.style.display = 'none';
            }
        } catch (error) {
            console.error('Transformations load error:', error);
            if (section) section.style.display = 'none';
        }
    },

    renderImages(container, images) {
        container.innerHTML = images.map(item => `
            <div class="gallery-item fade-in">
                <img src="${CONFIG.STORAGE_URL}${item.media_url}" alt="${item.title}" loading="lazy">
                <div class="gallery-overlay">
                    <p>${item.title}</p>
                </div>
            </div>
        `).join('');
    },

    renderVideos(container, videos) {
        container.innerHTML = videos.map(item => `
            <div class="gallery-item gallery-video-item fade-in">
                <iframe src="${this.formatEmbedUrl(item.media_url)}" title="${item.title}" frameborder="0" allowfullscreen loading="lazy"></iframe>
                <div class="gallery-overlay">
                    <p>${item.title}</p>
                </div>
            </div>
        `).join('');
    },

    renderTransformations(container, items) {
        container.innerHTML = items.map(item => `
            <div class="transformation-row fade-in">
                <div class="before-after-pair">
                    <div class="ba-image before">
                        <img src="${CONFIG.STORAGE_URL}${item.before_image}" alt="Before Treatment" loading="lazy">
                        <span class="ba-badge">Before</span>
                    </div>
                    <div class="ba-arrow">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
                    </div>
                    <div class="ba-image after">
                        <img src="${CONFIG.STORAGE_URL}${item.after_image}" alt="After Treatment" loading="lazy">
                        <span class="ba-badge">After</span>
                    </div>
                </div>
                <div class="transformation-caption">
                    <h3>${item.title}</h3>
                    <p>${item.description || ''}</p>
                </div>
            </div>
        `).join('');
    },

    formatEmbedUrl(url) {
        if (url.includes('youtube.com/watch?v=')) return url.replace('watch?v=', 'embed/');
        if (url.includes('youtu.be/')) {
            const videoId = url.split('youtu.be/')[1].split('?')[0];
            return `https://www.youtube.com/embed/${videoId}`;
        }
        return url;
    },

    renderEmpty(container, message) {
        container.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
                <p style="color: #666; font-size: 16px;">${message}</p>
            </div>
        `;
    },

    renderLoading(container) {
        const skeletons = Array(6).fill(`
            <div class="gallery-item skeleton" style="padding-bottom: 100%; position: relative; border-radius: 12px;"></div>
        `).join('');
        container.innerHTML = skeletons;
    },

    renderTransformationsLoading(container) {
        const skeletons = Array(3).fill(`
            <div class="transformation-row skeleton" style="height: 200px; border-radius: 12px; margin-bottom: 24px;"></div>
        `).join('');
        container.innerHTML = skeletons;
    }
};

export default GalleryModule;
