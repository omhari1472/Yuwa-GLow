import API from '../../../js/api.js';
import CONFIG from '../../../js/config.js';
import UI from '../utils.js';

const GalleryAdminModule = {
    items: [],
    async init() {
        this.checkAuth();
        this.initEventListeners();
        await this.loadItems();
        this.initTypeDropdown();
    },
    checkAuth() { if (!localStorage.getItem('admin_token')) window.location.href = '../login.html'; },
    async loadItems() {
        const res = await API.admin.gallery.list();
        if (res.success) { this.items = res.data.data; this.render(); }
    },

    initTypeDropdown(selectedValue = 'image') {
        UI.initDropdown('gallery-type-dropdown', [
            { value: 'image', text: 'Premium Image', selected: selectedValue === 'image' },
            { value: 'video', text: 'Video (YouTube/Vimeo)', selected: selectedValue === 'video' }
        ], (value) => {
            document.getElementById('image-field').style.display = value === 'image' ? 'block' : 'none';
            document.getElementById('video-field').style.display = value === 'video' ? 'block' : 'none';
        });
    },

    render() {
        const container = document.getElementById('gallery-list');
        if (!container) return;
        if (this.items.length === 0) {
            UI.renderEmptyState('gallery-list', {
                icon: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M21,19V5C21,3.89 20.1,3 19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19M8.5,13.5L11,16.5L14.5,12L19,18H5L8.5,13.5Z" /></svg>',
                title: 'Gallery is Empty',
                message: 'Upload brand images or add video links.',
                btnText: 'Add Media',
                btnId: 'empty-gallery-btn'
            });
            document.getElementById('empty-gallery-btn')?.addEventListener('click', () => UI.modal.open('gallery-modal'));
            return;
        }
        container.innerHTML = this.items.map(item => `
            <div class="gallery-admin-card fade-in">
                <div class="gallery-media-preview">
                    ${item.type === 'image' 
                        ? `<img src="${CONFIG.STORAGE_URL}${item.media_url}" alt="${item.title}">`
                        : `<iframe src="${this.formatEmbedUrl(item.media_url)}" frameborder="0"></iframe>`
                    }
                </div>
                <div class="gallery-info">
                    <div class="user-info"><strong>${item.title}</strong><span>${item.type.toUpperCase()}</span></div>
                    <button class="btn-icon btn-delete" onclick="window.GalleryAdmin.delete(${item.id})"><svg style="width:18px;height:18px" viewBox="0 0 24 24"><path fill="currentColor" d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19V4M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" /></svg></button>
                </div>
            </div>
        `).join('');
    },
    formatEmbedUrl(url) { if (url.includes('youtube.com/watch?v=')) return url.replace('watch?v=', 'embed/'); return url; },
    initEventListeners() {
        document.getElementById('open-add-modal')?.addEventListener('click', () => { 
            document.getElementById('gallery-form').reset(); 
            document.getElementById('gallery-image-preview').innerHTML = ''; 
            this.initTypeDropdown('image');
            UI.modal.open('gallery-modal'); 
        });

        const imageInput = document.getElementById('gallery-image-upload');
        if (imageInput) {
            imageInput.onchange = () => {
                const preview = document.getElementById('gallery-image-preview');
                preview.innerHTML = '';
                if (imageInput.files[0]) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        const img = document.createElement('img');
                        img.src = e.target.result;
                        img.className = 'preview-item';
                        preview.appendChild(img);
                    };
                    reader.readAsDataURL(imageInput.files[0]);
                }
            };
        }

        document.getElementById('gallery-form').onsubmit = async (e) => {
            e.preventDefault();
            const res = await API.admin.gallery.create(new FormData(e.target));
            if (res.success) { UI.modal.close('gallery-modal'); this.loadItems(); UI.notify('Media added to gallery!'); }
            else { UI.notify(res.message, 'error'); }
        };
    },
    async delete(id) {
        UI.confirm({
            title: 'Remove Media',
            message: 'Delete this item?',
            onConfirm: async () => {
                const res = await API.admin.gallery.delete(id);
                if (res.success) { this.loadItems(); UI.notify('Removed'); }
            }
        });
    },
    closeModal() { UI.modal.close('gallery-modal'); }
};
window.GalleryAdmin = GalleryAdminModule;
export default GalleryAdminModule;
