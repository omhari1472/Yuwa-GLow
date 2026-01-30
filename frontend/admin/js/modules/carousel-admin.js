import API from '../../../js/api.js';
import CONFIG from '../../../js/config.js';
import UI from '../utils.js';

const CarouselAdminModule = {
    items: [],
    editingId: null,
    draggedItem: null,

    async init() {
        this.checkAuth();
        this.initEventListeners();
        await this.loadItems();
        this.initStatusDropdown();
    },

    checkAuth() {
        if (!localStorage.getItem('admin_token')) window.location.href = '../index.html';
    },

    async loadItems() {
        UI.loading.grid('carousel-list', 3);
        const res = await API.admin.carousel.list();
        if (res.success) {
            this.items = res.data.data || [];
            this.render();
        }
    },

    initStatusDropdown(selectedValue = 'active') {
        UI.initDropdown('carousel-status-dropdown', [
            { value: 'active', text: 'Active (Visible)', selected: selectedValue === 'active' },
            { value: 'inactive', text: 'Inactive (Hidden)', selected: selectedValue === 'inactive' }
        ]);
    },

    render() {
        const container = document.getElementById('carousel-list');
        const countEl = document.getElementById('carousel-count');
        const hintEl = document.getElementById('carousel-hint');
        if (!container) return;

        countEl.textContent = `(${this.items.length})`;

        if (this.items.length === 0) {
            hintEl.style.display = 'none';
            container.innerHTML = `
                <div class="empty-carousel" style="grid-column: 1/-1;">
                    <div class="empty-icon">
                        <svg viewBox="0 0 24 24"><path fill="currentColor" d="M22,16V4A2,2 0 0,0 20,2H8A2,2 0 0,0 6,4V16A2,2 0 0,0 8,18H20A2,2 0 0,0 22,16M11,12L13.03,14.71L16,11L20,16H8M2,6V20A2,2 0 0,0 4,22H18V20H4V6" /></svg>
                    </div>
                    <h3>No Carousel Images Yet</h3>
                    <p>Add images to display in the homepage carousel.</p>
                    <button class="btn btn-primary" id="empty-add-btn">
                        <svg class="nav-icon" style="width:18px;height:18px;margin-right:8px" viewBox="0 0 24 24"><path fill="currentColor" d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" /></svg>
                        Add First Image
                    </button>
                </div>
            `;
            document.getElementById('empty-add-btn')?.addEventListener('click', () => this.openAddModal());
            return;
        }

        // Show hint when there are items
        hintEl.style.display = this.items.length > 1 ? 'flex' : 'none';

        container.innerHTML = this.items.map((item, index) => {
            const statusClass = item.status === 'active' ? 'active' : 'draft';

            return `
                <div class="carousel-card fade-in" draggable="true" data-id="${item.id}" data-index="${index}">
                    <div class="carousel-card-image">
                        <img src="${CONFIG.STORAGE_URL}${item.image_url}" alt="Slide ${index + 1}">
                        <div class="carousel-card-order">${index + 1}</div>
                        <div class="carousel-card-drag" title="Drag to reorder">
                            <svg viewBox="0 0 24 24"><path fill="currentColor" d="M9,3H11V5H9V3M13,3H15V5H13V3M9,7H11V9H9V7M13,7H15V9H13V7M9,11H11V13H9V11M13,11H15V13H13V11M9,15H11V17H9V15M13,15H15V17H13V15M9,19H11V21H9V19M13,19H15V21H13V19Z" /></svg>
                        </div>
                    </div>
                    <div class="carousel-card-footer">
                        <div class="carousel-card-info">
                            <span class="slide-label">Slide ${index + 1}</span>
                            <span class="status ${statusClass}" style="font-size: 10px;">${item.status}</span>
                        </div>
                        <div class="carousel-card-actions">
                            <button class="btn-icon" onclick="window.CarouselAdmin.openEditModal(${item.id})" title="Edit">
                                <svg style="width:18px;height:18px" viewBox="0 0 24 24"><path fill="currentColor" d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" /></svg>
                            </button>
                            <button class="btn-icon btn-delete" onclick="window.CarouselAdmin.delete(${item.id})" title="Delete">
                                <svg style="width:18px;height:18px" viewBox="0 0 24 24"><path fill="currentColor" d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19V4M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" /></svg>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        this.initDragAndDrop();
    },

    initDragAndDrop() {
        const cards = document.querySelectorAll('.carousel-card');
        const container = document.getElementById('carousel-list');

        cards.forEach(card => {
            card.addEventListener('dragstart', (e) => {
                this.draggedItem = card;
                card.classList.add('dragging');
                e.dataTransfer.effectAllowed = 'move';
            });

            card.addEventListener('dragend', () => {
                card.classList.remove('dragging');
                this.draggedItem = null;
                this.saveOrder();
            });

            card.addEventListener('dragover', (e) => {
                e.preventDefault();
                if (!this.draggedItem || this.draggedItem === card) return;

                const rect = card.getBoundingClientRect();
                const midX = rect.left + rect.width / 2;

                if (e.clientX < midX) {
                    container.insertBefore(this.draggedItem, card);
                } else {
                    container.insertBefore(this.draggedItem, card.nextSibling);
                }
            });
        });
    },

    async saveOrder() {
        const cards = document.querySelectorAll('.carousel-card');
        const order = Array.from(cards).map(card => parseInt(card.dataset.id));

        const res = await API.admin.carousel.reorder(order);
        if (res.success) {
            UI.notify('Order saved');
            this.loadItems();
        } else {
            UI.notify('Failed to save order', 'error');
        }
    },

    initEventListeners() {
        document.getElementById('open-add-modal')?.addEventListener('click', () => this.openAddModal());

        const imageInput = document.getElementById('carousel-image-upload');
        if (imageInput) {
            imageInput.onchange = () => {
                const preview = document.getElementById('carousel-image-preview');
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

        document.getElementById('carousel-form').onsubmit = async (e) => {
            e.preventDefault();
            await this.handleSubmit(e.target);
        };
    },

    async handleSubmit(form) {
        const formData = new FormData(form);

        let res;
        if (this.editingId) {
            res = await API.admin.carousel.update(this.editingId, formData);
        } else {
            res = await API.admin.carousel.create(formData);
        }

        if (res.success) {
            this.closeModal();
            this.loadItems();
            UI.notify(this.editingId ? 'Carousel image updated!' : 'Image added to carousel!');
        } else {
            UI.notify(res.message, 'error');
        }
    },

    openAddModal() {
        this.editingId = null;
        document.getElementById('carousel-form').reset();
        document.getElementById('carousel-image-preview').innerHTML = '';
        document.getElementById('existing-carousel-image').innerHTML = '';
        document.getElementById('modal-title').textContent = 'Add Carousel Image';
        this.initStatusDropdown('active');
        UI.modal.open('carousel-modal');
    },

    openEditModal(id) {
        const item = this.items.find(i => i.id === id);
        if (!item) return;

        this.editingId = id;
        document.getElementById('modal-title').textContent = 'Edit Carousel Image';
        document.getElementById('carousel-image-preview').innerHTML = '';

        // Show existing image
        const existingContainer = document.getElementById('existing-carousel-image');
        existingContainer.innerHTML = `
            <p class="text-muted" style="margin-bottom: 8px; font-size: 12px;">Current Image:</p>
            <img src="${CONFIG.STORAGE_URL}${item.image_url}" class="preview-item" style="max-width: 100%;">
        `;

        this.initStatusDropdown(item.status || 'active');
        UI.modal.open('carousel-modal');
    },

    async delete(id) {
        UI.confirm({
            title: 'Remove Image',
            message: 'Delete this carousel image?',
            onConfirm: async () => {
                const res = await API.admin.carousel.delete(id);
                if (res.success) {
                    this.loadItems();
                    UI.notify('Image removed');
                }
            }
        });
    },

    closeModal() {
        this.editingId = null;
        UI.modal.close('carousel-modal');
    }
};

window.CarouselAdmin = CarouselAdminModule;
export default CarouselAdminModule;
