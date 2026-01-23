import API from '../api.js';
import CONFIG from '../config.js';

const GalleryModule = {
    async init() {
        const galleryGrid = document.querySelector('.gallery-grid');
        if (!galleryGrid) return;

        const res = await API.getGallery();
        if (res.success) {
            this.render(galleryGrid, res.data);
        }
    },

    render(container, items) {
        container.innerHTML = items.map(item => `
            <div class="gallery-item fade-in">
                ${item.type === 'image' 
                    ? `<img src="${CONFIG.STORAGE_URL}${item.media_url}" alt="${item.title}">`
                    : `<iframe src="${this.formatEmbedUrl(item.media_url)}" title="${item.title}" frameborder="0" allowfullscreen></iframe>`
                }
                <div class="gallery-overlay">
                    <p>${item.title}</p>
                </div>
            </div>
        `).join('');
    },

    formatEmbedUrl(url) {
        if (url.includes('youtube.com/watch?v=')) {
            return url.replace('watch?v=', 'embed/');
        }
        return url;
    }
};

export default GalleryModule;
