import API from '../../../js/api.js';
import CONFIG from '../../../js/config.js';
import UI from '../utils.js';

const GalleryAdminModule = {
    items: [],
    filteredItems: [],
    editingId: null,

    async init() {
        this.checkAuth();
        this.initEventListeners();
        await this.loadItems();
        this.initTypeDropdown();
        this.initStatusDropdown();
        this.initSearchFilter();
    },

    initSearchFilter() {
        UI.initSearchFilter('gallery-search', {
            placeholder: 'Search by title...',
            filters: [
                {
                    key: 'type',
                    label: 'All Types',
                    options: [
                        { value: 'image', text: 'Image' },
                        { value: 'video', text: 'Video' }
                    ]
                },
                {
                    key: 'status',
                    label: 'All Status',
                    options: [
                        { value: 'published', text: 'Published' },
                        { value: 'draft', text: 'Draft' }
                    ]
                }
            ],
            onSearch: (term, filters) => {
                this.filteredItems = UI.filterItems(this.items, term, filters, ['title']);
                this.render();
                UI.updateSearchCount('gallery-search', this.filteredItems.length, this.items.length);
            }
        });
        UI.updateSearchCount('gallery-search', this.items.length, this.items.length);
    },

    checkAuth() { if (!localStorage.getItem('admin_token')) window.location.href = '../login.html'; },

    async loadItems() {
        UI.loading.grid('gallery-list', 6);
        const res = await API.admin.gallery.list();
        if (res.success) {
            this.items = res.data.data || [];
            this.filteredItems = [...this.items];
            this.render();
        }
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

    initStatusDropdown(selectedValue = 'published') {
        UI.initDropdown('gallery-status-dropdown', [
            { value: 'published', text: 'Published (Visible)', selected: selectedValue === 'published' },
            { value: 'draft', text: 'Draft (Hidden)', selected: selectedValue === 'draft' }
        ]);
    },

    render() {
        const container = document.getElementById('gallery-list');
        if (!container) return;
        const items = this.filteredItems;
        if (items.length === 0) {
            UI.renderEmptyState('gallery-list', {
                icon: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M21,19V5C21,3.89 20.1,3 19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19M8.5,13.5L11,16.5L14.5,12L19,18H5L8.5,13.5Z" /></svg>',
                title: this.items.length === 0 ? 'Gallery is Empty' : 'No Matching Items',
                message: this.items.length === 0 ? 'Upload brand images or add video links.' : 'Try adjusting your search or filters.',
                btnText: this.items.length === 0 ? 'Add Media' : null,
                btnId: 'empty-gallery-btn'
            });
            if (this.items.length === 0) {
                document.getElementById('empty-gallery-btn')?.addEventListener('click', () => this.openAddModal());
            }
            return;
        }
        container.innerHTML = items.map(item => {
            const status = item.status || 'published';
            const statusClass = status === 'published' ? 'active' : 'draft';

            return `
                <div class="gallery-admin-card fade-in">
                    <div class="gallery-media-preview">
                        ${item.type === 'image'
                            ? `<img src="${CONFIG.STORAGE_URL}${item.media_url}" alt="${item.title}">`
                            : `<iframe src="${this.formatEmbedUrl(item.media_url)}" frameborder="0"></iframe>`
                        }
                    </div>
                    <div class="gallery-info">
                        <div class="user-info">
                            <strong>${item.title}</strong>
                            <span>${item.type.toUpperCase()} <span class="status ${statusClass}" style="margin-left: 5px; font-size: 10px;">${status}</span></span>
                        </div>
                        <div style="display: flex; gap: 8px;">
                            <button class="btn-icon" onclick="window.GalleryAdmin.openEditModal(${item.id})">
                                <svg style="width:18px;height:18px" viewBox="0 0 24 24"><path fill="currentColor" d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" /></svg>
                            </button>
                            <button class="btn-icon btn-delete" onclick="window.GalleryAdmin.delete(${item.id})">
                                <svg style="width:18px;height:18px" viewBox="0 0 24 24"><path fill="currentColor" d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19V4M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" /></svg>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    },

    formatEmbedUrl(url) {
        if (url.includes('youtube.com/watch?v=')) return url.replace('watch?v=', 'embed/');
        if (url.includes('youtu.be/')) return url.replace('youtu.be/', 'youtube.com/embed/');
        if (url.includes('vimeo.com/')) {
            const id = url.split('/').pop();
            return `https://player.vimeo.com/video/${id}`;
        }
        return url;
    },

    initEventListeners() {
        document.getElementById('open-add-modal')?.addEventListener('click', () => this.openAddModal());

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
            await this.handleSubmit(e.target);
        };
    },

    async handleSubmit(form) {
        const formData = new FormData(form);

        let res;
        if (this.editingId) {
            res = await API.admin.gallery.update(this.editingId, formData);
        } else {
            res = await API.admin.gallery.create(formData);
        }

        if (res.success) {
            this.closeModal();
            this.loadItems();
            UI.notify(this.editingId ? 'Gallery item updated!' : 'Media added to gallery!');
        } else {
            UI.notify(res.message, 'error');
        }
    },

    openAddModal() {
        this.editingId = null;
        document.getElementById('gallery-form').reset();
        document.getElementById('gallery-image-preview').innerHTML = '';
        document.getElementById('existing-gallery-image').innerHTML = '';
        document.getElementById('modal-title').textContent = 'Add Gallery Media';
        this.initTypeDropdown('image');
        this.initStatusDropdown('published');
        document.getElementById('image-field').style.display = 'block';
        document.getElementById('video-field').style.display = 'none';
        UI.modal.open('gallery-modal');
    },

    openEditModal(id) {
        const item = this.items.find(i => i.id === id);
        if (!item) return;

        this.editingId = id;
        document.getElementById('modal-title').textContent = 'Edit Gallery Media';
        document.getElementById('gallery-title').value = item.title;
        document.getElementById('gallery-image-preview').innerHTML = '';

        // Show existing media
        const existingContainer = document.getElementById('existing-gallery-image');
        if (item.type === 'image') {
            existingContainer.innerHTML = `
                <p class="text-muted" style="margin-bottom: 8px; font-size: 12px;">Current Image:</p>
                <img src="${CONFIG.STORAGE_URL}${item.media_url}" class="preview-item" style="max-width: 200px;">
            `;
        } else {
            existingContainer.innerHTML = '';
        }

        this.initTypeDropdown(item.type);
        this.initStatusDropdown(item.status || 'published');
        document.getElementById('image-field').style.display = item.type === 'image' ? 'block' : 'none';
        document.getElementById('video-field').style.display = item.type === 'video' ? 'block' : 'none';

        if (item.type === 'video') {
            document.querySelector('[name="media_url"]').value = item.media_url;
        }

        UI.modal.open('gallery-modal');
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

    closeModal() {
        this.editingId = null;
        UI.modal.close('gallery-modal');
    }
};

window.GalleryAdmin = GalleryAdminModule;
export default GalleryAdminModule;
