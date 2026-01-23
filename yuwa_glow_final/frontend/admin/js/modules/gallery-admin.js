import API from '../../../js/api.js';
import CONFIG from '../../../js/config.js';
import UI from '../utils.js';

const GalleryAdminModule = {
    items: [],

    async init() {
        this.checkAuth();
        await this.loadItems();
        this.initEventListeners();
    },

    checkAuth() {
        if (!localStorage.getItem('admin_token')) {
            window.location.href = '../login.html';
        }
    },

    async loadItems() {
        const res = await API.admin.gallery.list(); // Need to add to api.js
        if (res.success) {
            this.items = res.data.data;
            this.render();
        }
    },

    render() {
        const container = document.getElementById('gallery-list');
        if (!container) return;

        container.innerHTML = this.items.map(item => `
            <div class="gallery-admin-card fade-in">
                <div class="gallery-media-preview">
                    ${item.type === 'image' 
                        ? `<img src="${CONFIG.STORAGE_URL}${item.media_url}" alt="${item.title}">`
                        : `<iframe src="${this.formatEmbedUrl(item.media_url)}" frameborder="0"></iframe>`
                    }
                </div>
                <div class="gallery-info">
                    <strong>${item.title}</strong>
                    <span class="badge">${item.type.toUpperCase()}</span>
                    <button class="btn-icon btn-delete" onclick="window.GalleryAdmin.delete(${item.id})">
                        <svg style="width:18px;height:18px" viewBox="0 0 24 24"><path fill="currentColor" d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19V4M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" /></svg>
                    </button>
                </div>
            </div>
        `).join('');
    },

    formatEmbedUrl(url) {
        if (url.includes('youtube.com/watch?v=')) return url.replace('watch?v=', 'embed/');
        return url;
    },

    initEventListeners() {
        const addBtn = document.getElementById('open-add-modal');
        if (addBtn) addBtn.onclick = () => UI.modal.open('gallery-modal');

        const typeSelect = document.getElementById('g-type');
        typeSelect.onchange = () => {
            document.getElementById('image-field').style.display = typeSelect.value === 'image' ? 'block' : 'none';
            document.getElementById('video-field').style.display = typeSelect.value === 'video' ? 'block' : 'none';
        };

        const form = document.getElementById('gallery-form');
        if (form) {
            form.onsubmit = async (e) => {
                e.preventDefault();
                const formData = new FormData(form);
                const res = await API.admin.gallery.create(formData);
                if (res.success) {
                    UI.modal.close('gallery-modal');
                    this.loadItems();
                    form.reset();
                }
            };
        }
    },

    async delete(id) {
        if (confirm('Delete this gallery item?')) {
            const res = await API.admin.gallery.delete(id);
            if (res.success) this.loadItems();
        }
    }
};

window.GalleryAdmin = GalleryAdminModule;
export default GalleryAdminModule;
