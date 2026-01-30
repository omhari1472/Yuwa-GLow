import API from '../../../js/api.js';
import CONFIG from '../../../js/config.js';
import UI from '../utils.js';

const GalleryAdminModule = {
    photos: [],
    videos: [],
    transformations: [],
    editingPhotoId: null,
    editingVideoId: null,
    editingTransformationId: null,

    async init() {
        this.checkAuth();
        this.initEventListeners();
        await this.loadGalleryItems();
        await this.loadTransformations();
    },

    checkAuth() {
        if (!localStorage.getItem('admin_token')) window.location.href = '../index.html';
    },

    async loadGalleryItems() {
        UI.loading.grid('photos-list', 4);
        UI.loading.grid('videos-list', 4);

        const res = await API.admin.gallery.list();
        if (res.success) {
            const items = res.data.data || [];
            this.photos = items.filter(item => item.type === 'image');
            this.videos = items.filter(item => item.type === 'video');
            this.renderPhotos();
            this.renderVideos();
        }
    },

    async loadTransformations() {
        UI.loading.grid('transformations-list', 3);
        const res = await API.admin.transformations.list();
        if (res.success) {
            this.transformations = res.data.data || [];
            this.renderTransformations();
        }
    },

    renderPhotos() {
        const container = document.getElementById('photos-list');
        const countEl = document.getElementById('photos-count');
        if (!container) return;

        countEl.textContent = `(${this.photos.length})`;

        if (this.photos.length === 0) {
            container.innerHTML = `
                <div class="empty-section" style="grid-column: 1/-1;">
                    <svg viewBox="0 0 24 24"><path fill="currentColor" d="M21,19V5C21,3.89 20.1,3 19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19M8.5,13.5L11,16.5L14.5,12L19,18H5L8.5,13.5Z" /></svg>
                    <p>No photos added yet</p>
                </div>
            `;
            return;
        }

        container.innerHTML = this.photos.map(item => {
            const status = item.status || 'published';
            const statusClass = status === 'published' ? 'active' : 'draft';

            return `
                <div class="gallery-admin-card fade-in">
                    <div class="gallery-media-preview">
                        <img src="${CONFIG.STORAGE_URL}${item.media_url}" alt="${item.title}">
                    </div>
                    <div class="gallery-info">
                        <div class="user-info">
                            <strong>${item.title}</strong>
                            <span><span class="status ${statusClass}" style="font-size: 10px;">${status}</span></span>
                        </div>
                        <div style="display: flex; gap: 8px;">
                            <button class="btn-icon" onclick="window.GalleryAdmin.openEditPhotoModal(${item.id})">
                                <svg style="width:18px;height:18px" viewBox="0 0 24 24"><path fill="currentColor" d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" /></svg>
                            </button>
                            <button class="btn-icon btn-delete" onclick="window.GalleryAdmin.deletePhoto(${item.id})">
                                <svg style="width:18px;height:18px" viewBox="0 0 24 24"><path fill="currentColor" d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19V4M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" /></svg>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    },

    renderVideos() {
        const container = document.getElementById('videos-list');
        const countEl = document.getElementById('videos-count');
        if (!container) return;

        countEl.textContent = `(${this.videos.length})`;

        if (this.videos.length === 0) {
            container.innerHTML = `
                <div class="empty-section" style="grid-column: 1/-1;">
                    <svg viewBox="0 0 24 24"><path fill="currentColor" d="M10,15L15.19,12L10,9V15M21.56,7.17C21.69,7.64 21.78,8.27 21.84,9.07C21.91,9.87 21.94,10.56 21.94,11.16L22,12C22,14.19 21.84,15.8 21.56,16.83C21.31,17.73 20.73,18.31 19.83,18.56C19.36,18.69 18.5,18.78 17.18,18.84C15.88,18.91 14.69,18.94 13.59,18.94L12,19C7.81,19 5.2,18.84 4.17,18.56C3.27,18.31 2.69,17.73 2.44,16.83C2.31,16.36 2.22,15.73 2.16,14.93C2.09,14.13 2.06,13.44 2.06,12.84L2,12C2,9.81 2.16,8.2 2.44,7.17C2.69,6.27 3.27,5.69 4.17,5.44C4.64,5.31 5.5,5.22 6.82,5.16C8.12,5.09 9.31,5.06 10.41,5.06L12,5C16.19,5 18.8,5.16 19.83,5.44C20.73,5.69 21.31,6.27 21.56,7.17Z" /></svg>
                    <p>No videos added yet</p>
                </div>
            `;
            return;
        }

        container.innerHTML = this.videos.map(item => {
            const status = item.status || 'published';
            const statusClass = status === 'published' ? 'active' : 'draft';

            return `
                <div class="gallery-admin-card fade-in">
                    <div class="gallery-media-preview">
                        <iframe src="${this.formatEmbedUrl(item.media_url)}" frameborder="0"></iframe>
                    </div>
                    <div class="gallery-info">
                        <div class="user-info">
                            <strong>${item.title}</strong>
                            <span><span class="status ${statusClass}" style="font-size: 10px;">${status}</span></span>
                        </div>
                        <div style="display: flex; gap: 8px;">
                            <button class="btn-icon" onclick="window.GalleryAdmin.openEditVideoModal(${item.id})">
                                <svg style="width:18px;height:18px" viewBox="0 0 24 24"><path fill="currentColor" d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" /></svg>
                            </button>
                            <button class="btn-icon btn-delete" onclick="window.GalleryAdmin.deleteVideo(${item.id})">
                                <svg style="width:18px;height:18px" viewBox="0 0 24 24"><path fill="currentColor" d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19V4M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" /></svg>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    },

    renderTransformations() {
        const container = document.getElementById('transformations-list');
        const countEl = document.getElementById('transformations-count');
        if (!container) return;

        countEl.textContent = `(${this.transformations.length})`;

        if (this.transformations.length === 0) {
            container.innerHTML = `
                <div class="empty-section" style="grid-column: 1/-1;">
                    <svg viewBox="0 0 24 24"><path fill="currentColor" d="M19,3H5C3.89,3 3,3.89 3,5V19C3,20.11 3.89,21 5,21H19C20.11,21 21,20.11 21,19V5C21,3.89 20.11,3 19,3M19,19H5V5H19V19M13.96,12.29L11.21,15.83L9.25,13.47L6.5,17H17.5L13.96,12.29Z" /></svg>
                    <p>No transformations added yet</p>
                </div>
            `;
            return;
        }

        container.innerHTML = this.transformations.map(item => {
            const status = item.status || 'draft';
            const statusClass = status === 'published' ? 'active' : 'draft';

            return `
                <div class="transformation-admin-card fade-in">
                    <div class="transformation-images">
                        <img src="${CONFIG.STORAGE_URL}${item.before_image}" alt="Before">
                        <div class="transformation-arrow">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M5 12h14M12 5l7 7-7 7"/>
                            </svg>
                        </div>
                        <img src="${CONFIG.STORAGE_URL}${item.after_image}" alt="After">
                    </div>
                    <div class="transformation-info">
                        <div class="user-info">
                            <h4>${item.title}</h4>
                            <p>${item.description || ''}</p>
                            <span class="status ${statusClass}" style="font-size: 10px;">${status}</span>
                        </div>
                        <div style="display: flex; gap: 8px;">
                            <button class="btn-icon" onclick="window.GalleryAdmin.openEditTransformationModal(${item.id})">
                                <svg style="width:18px;height:18px" viewBox="0 0 24 24"><path fill="currentColor" d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" /></svg>
                            </button>
                            <button class="btn-icon btn-delete" onclick="window.GalleryAdmin.deleteTransformation(${item.id})">
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
        // Photo buttons and form
        document.getElementById('add-photo-btn')?.addEventListener('click', () => this.openAddPhotoModal());
        document.getElementById('photo-form').onsubmit = async (e) => {
            e.preventDefault();
            await this.handlePhotoSubmit(e.target);
        };

        // Video buttons and form
        document.getElementById('add-video-btn')?.addEventListener('click', () => this.openAddVideoModal());
        document.getElementById('video-form').onsubmit = async (e) => {
            e.preventDefault();
            await this.handleVideoSubmit(e.target);
        };

        // Transformation buttons and form
        document.getElementById('add-transformation-btn')?.addEventListener('click', () => this.openAddTransformationModal());
        document.getElementById('transformation-form').onsubmit = async (e) => {
            e.preventDefault();
            await this.handleTransformationSubmit(e.target);
        };

        // Image previews
        const photoInput = document.getElementById('photo-image-upload');
        if (photoInput) {
            photoInput.onchange = () => this.previewImage(photoInput, 'photo-image-preview');
        }

        const beforeInput = document.getElementById('before-image-upload');
        const afterInput = document.getElementById('after-image-upload');
        if (beforeInput) {
            beforeInput.onchange = () => this.previewImage(beforeInput, 'before-image-preview');
        }
        if (afterInput) {
            afterInput.onchange = () => this.previewImage(afterInput, 'after-image-preview');
        }
    },

    previewImage(input, previewId) {
        const preview = document.getElementById(previewId);
        preview.innerHTML = '';
        if (input.files[0]) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = document.createElement('img');
                img.src = e.target.result;
                img.className = 'preview-item';
                preview.appendChild(img);
            };
            reader.readAsDataURL(input.files[0]);
        }
    },

    initPhotoStatusDropdown(selectedValue = 'published') {
        UI.initDropdown('photo-status-dropdown', [
            { value: 'published', text: 'Published (Visible)', selected: selectedValue === 'published' },
            { value: 'draft', text: 'Draft (Hidden)', selected: selectedValue === 'draft' }
        ]);
    },

    initVideoStatusDropdown(selectedValue = 'published') {
        UI.initDropdown('video-status-dropdown', [
            { value: 'published', text: 'Published (Visible)', selected: selectedValue === 'published' },
            { value: 'draft', text: 'Draft (Hidden)', selected: selectedValue === 'draft' }
        ]);
    },

    initTransformationStatusDropdown(selectedValue = 'published') {
        UI.initDropdown('transformation-status-dropdown', [
            { value: 'published', text: 'Published (Visible)', selected: selectedValue === 'published' },
            { value: 'draft', text: 'Draft (Hidden)', selected: selectedValue === 'draft' }
        ]);
    },

    // Photo Modal Functions
    openAddPhotoModal() {
        this.editingPhotoId = null;
        document.getElementById('photo-form').reset();
        document.getElementById('photo-image-preview').innerHTML = '';
        document.getElementById('existing-photo-image').innerHTML = '';
        document.getElementById('photo-modal-title').textContent = 'Add Photo';
        this.initPhotoStatusDropdown('published');
        UI.modal.open('photo-modal');
    },

    openEditPhotoModal(id) {
        const item = this.photos.find(i => i.id === id);
        if (!item) return;

        this.editingPhotoId = id;
        document.getElementById('photo-modal-title').textContent = 'Edit Photo';
        document.getElementById('photo-title').value = item.title;
        document.getElementById('photo-image-preview').innerHTML = '';

        const existingContainer = document.getElementById('existing-photo-image');
        existingContainer.innerHTML = `
            <p class="text-muted" style="margin-bottom: 8px; font-size: 12px;">Current Image:</p>
            <img src="${CONFIG.STORAGE_URL}${item.media_url}" class="preview-item" style="max-width: 200px;">
        `;

        this.initPhotoStatusDropdown(item.status || 'published');
        UI.modal.open('photo-modal');
    },

    closePhotoModal() {
        this.editingPhotoId = null;
        UI.modal.close('photo-modal');
    },

    async handlePhotoSubmit(form) {
        const formData = new FormData(form);
        let res;
        if (this.editingPhotoId) {
            res = await API.admin.gallery.update(this.editingPhotoId, formData);
        } else {
            res = await API.admin.gallery.create(formData);
        }

        if (res.success) {
            this.closePhotoModal();
            this.loadGalleryItems();
            UI.notify(this.editingPhotoId ? 'Photo updated!' : 'Photo added!');
        } else {
            UI.notify(res.message, 'error');
        }
    },

    async deletePhoto(id) {
        UI.confirm({
            title: 'Remove Photo',
            message: 'Delete this photo?',
            onConfirm: async () => {
                const res = await API.admin.gallery.delete(id);
                if (res.success) {
                    this.loadGalleryItems();
                    UI.notify('Photo removed');
                }
            }
        });
    },

    // Video Modal Functions
    openAddVideoModal() {
        this.editingVideoId = null;
        document.getElementById('video-form').reset();
        document.getElementById('video-modal-title').textContent = 'Add Video';
        this.initVideoStatusDropdown('published');
        UI.modal.open('video-modal');
    },

    openEditVideoModal(id) {
        const item = this.videos.find(i => i.id === id);
        if (!item) return;

        this.editingVideoId = id;
        document.getElementById('video-modal-title').textContent = 'Edit Video';
        document.getElementById('video-title').value = item.title;
        document.getElementById('video-url').value = item.media_url;

        this.initVideoStatusDropdown(item.status || 'published');
        UI.modal.open('video-modal');
    },

    closeVideoModal() {
        this.editingVideoId = null;
        UI.modal.close('video-modal');
    },

    async handleVideoSubmit(form) {
        const formData = new FormData(form);
        let res;
        if (this.editingVideoId) {
            res = await API.admin.gallery.update(this.editingVideoId, formData);
        } else {
            res = await API.admin.gallery.create(formData);
        }

        if (res.success) {
            this.closeVideoModal();
            this.loadGalleryItems();
            UI.notify(this.editingVideoId ? 'Video updated!' : 'Video added!');
        } else {
            UI.notify(res.message, 'error');
        }
    },

    async deleteVideo(id) {
        UI.confirm({
            title: 'Remove Video',
            message: 'Delete this video?',
            onConfirm: async () => {
                const res = await API.admin.gallery.delete(id);
                if (res.success) {
                    this.loadGalleryItems();
                    UI.notify('Video removed');
                }
            }
        });
    },

    // Transformation Modal Functions
    openAddTransformationModal() {
        this.editingTransformationId = null;
        document.getElementById('transformation-form').reset();
        document.getElementById('before-image-preview').innerHTML = '';
        document.getElementById('after-image-preview').innerHTML = '';
        document.getElementById('existing-transformation-images').innerHTML = '';
        document.getElementById('transformation-modal-title').textContent = 'Add Transformation';
        this.initTransformationStatusDropdown('published');
        UI.modal.open('transformation-modal');
    },

    openEditTransformationModal(id) {
        const item = this.transformations.find(i => i.id === id);
        if (!item) return;

        this.editingTransformationId = id;
        document.getElementById('transformation-modal-title').textContent = 'Edit Transformation';
        document.getElementById('transformation-title').value = item.title;
        document.getElementById('transformation-description').value = item.description || '';
        document.getElementById('before-image-preview').innerHTML = '';
        document.getElementById('after-image-preview').innerHTML = '';

        const existingContainer = document.getElementById('existing-transformation-images');
        existingContainer.innerHTML = `
            <p class="text-muted" style="margin-bottom: 8px; font-size: 12px;">Current Images:</p>
            <div style="display: flex; gap: 16px;">
                <div style="text-align: center;">
                    <img src="${CONFIG.STORAGE_URL}${item.before_image}" class="preview-item" style="width: 120px; height: 90px;">
                    <p class="text-muted" style="font-size: 11px; margin-top: 4px;">Before</p>
                </div>
                <div style="text-align: center;">
                    <img src="${CONFIG.STORAGE_URL}${item.after_image}" class="preview-item" style="width: 120px; height: 90px;">
                    <p class="text-muted" style="font-size: 11px; margin-top: 4px;">After</p>
                </div>
            </div>
        `;

        this.initTransformationStatusDropdown(item.status || 'draft');
        UI.modal.open('transformation-modal');
    },

    closeTransformationModal() {
        this.editingTransformationId = null;
        UI.modal.close('transformation-modal');
    },

    async handleTransformationSubmit(form) {
        const formData = new FormData(form);
        let res;
        if (this.editingTransformationId) {
            res = await API.admin.transformations.update(this.editingTransformationId, formData);
        } else {
            res = await API.admin.transformations.create(formData);
        }

        if (res.success) {
            this.closeTransformationModal();
            this.loadTransformations();
            UI.notify(this.editingTransformationId ? 'Transformation updated!' : 'Transformation added!');
        } else {
            UI.notify(res.message, 'error');
        }
    },

    async deleteTransformation(id) {
        UI.confirm({
            title: 'Remove Transformation',
            message: 'Delete this before/after pair?',
            onConfirm: async () => {
                const res = await API.admin.transformations.delete(id);
                if (res.success) {
                    this.loadTransformations();
                    UI.notify('Transformation removed');
                }
            }
        });
    }
};

window.GalleryAdmin = GalleryAdminModule;
export default GalleryAdminModule;
