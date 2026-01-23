import API from '../api.js';
import CONFIG from '../config.js';

const GalleryModule = {
    async init() {
        const galleryGrid = document.querySelector('.gallery-grid');
        if (!galleryGrid) return;

        this.renderLoading(galleryGrid);

        try {
            const res = await API.getGallery();
            if (res.success) {
                const items = res.data?.data || res.data || [];
                
                if (items.length === 0) {
                    this.renderEmpty(galleryGrid);
                } else {
                    this.render(galleryGrid, items);
                }
            }
        } catch (error) {
            console.error('Gallery Module Error:', error);
        }
    },

    render(container, items) {
        container.innerHTML = items.map(item => `
            <div class="gallery-item fade-in">
                ${item.type === 'image' 
                    ? `<img src="${CONFIG.STORAGE_URL}${item.media_url}" alt="${item.title}" style="width: 100%; height: 300px; object-fit: cover;">`
                    : `<iframe src="${this.formatEmbedUrl(item.media_url)}" title="${item.title}" frameborder="0" allowfullscreen style="width: 100%; height: 300px;"></iframe>`
                }
                <div class="gallery-overlay">
                    <p>${item.title}</p>
                </div>
            </div>
        `).join('');
    },

    formatEmbedUrl(url) {
        if (url.includes('youtube.com/watch?v=')) return url.replace('watch?v=', 'embed/');
        return url;
    },

    renderEmpty(container) {
        container.innerHTML = `<div style="grid-column: 1 / -1; text-align: center; padding: 100px 0;"><h3>Our Gallery is being updated</h3></div>`;
    },

    renderLoading(container) {
        container.innerHTML = `<div style="grid-column: 1 / -1; text-align: center; padding: 100px 0;"><div class="loader">Loading Gallery...</div></div>`;
    }
};

export default GalleryModule;
