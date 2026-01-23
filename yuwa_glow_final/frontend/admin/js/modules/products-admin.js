import API from '../../../js/api.js';
import CONFIG from '../../../js/config.js';
import UI from '../utils.js';

const ProductsAdminModule = {
    products: [],
    
    async init() {
        this.checkAuth();
        this.initEventListeners();
        Promise.all([this.loadProducts(), this.loadCategories()]);
    },

    checkAuth() { if (!localStorage.getItem('admin_token')) window.location.href = '../login.html'; },

    async loadProducts() {
        const res = await API.admin.products.list();
        if (res.success) { this.products = res.data.data || []; this.render(); }
    },

    async loadCategories() {
        const res = await API.admin.categories.list();
        if (res.success) {
            const select = document.getElementById('product-category');
            if (select) {
                const categories = res.data.data || [];
                let options = '<option value="">Select Category</option>';
                options += categories.map(cat => `<option value="${cat.id}">${cat.name}</option>`).join('');
                options += '<option value="new" style="font-weight:bold; color:var(--primary-gold)">+ Add New Category</option>';
                select.innerHTML = options;
            }
        }
    },

    render() {
        const container = document.getElementById('product-list');
        if (!container) return;
        if (this.products.length === 0) {
            UI.renderEmptyState('product-list', {
                icon: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12,2L2,7V17L12,22L22,17V7L12,2M10.1,16.5L6.6,14.6L12,11.5L17.4,14.6L13.9,16.5L12,17.5L10.1,16.5M12,4.5L19,8.2L12,11.8L5,8.2L12,4.5Z" /></svg>',
                title: 'No Products Yet',
                message: 'Your premium catalog is empty.',
                btnText: 'Add First Product',
                btnId: 'empty-add-btn'
            });
            document.getElementById('empty-add-btn')?.addEventListener('click', () => this.openAddModal());
            return;
        }
        container.innerHTML = this.products.map(p => `
            <tr>
                <td><img src="${p.images && p.images[0] ? CONFIG.STORAGE_URL + p.images[0].image_url : '../../assets/images/placeholder.png'}" class="table-thumb"></td>
                <td><div class="user-info"><strong>${p.name}</strong><span>ID: #${p.id}</span></div></td>
                <td><span class="badge">${p.category?.name || 'Uncategorized'}</span></td>
                <td><strong>$${p.price}</strong></td>
                <td><span class="status ${p.status}">${p.status}</span></td>
                <td>
                    <button class="btn-icon" onclick="window.ProductsAdmin.openEditModal(${p.id})"><svg style="width:18px;height:18px" viewBox="0 0 24 24"><path fill="currentColor" d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" /></svg></button>
                    <button class="btn-icon btn-delete" onclick="window.ProductsAdmin.openDeleteModal(${p.id})"><svg style="width:18px;height:18px" viewBox="0 0 24 24"><path fill="currentColor" d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19V4M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" /></svg></button>
                </td>
            </tr>
        `).join('');
    },

    initEventListeners() {
        document.getElementById('open-add-modal')?.addEventListener('click', () => this.openAddModal());
        const categorySelect = document.getElementById('product-category');
        categorySelect?.addEventListener('change', (e) => {
            const newCatGroup = document.getElementById('new-category-group');
            if (newCatGroup) {
                newCatGroup.style.display = e.target.value === 'new' ? 'block' : 'none';
                if (e.target.value === 'new') document.getElementById('new-category-name').focus();
            }
        });
        const imageInput = document.getElementById('image-upload');
        if (imageInput) {
            imageInput.onchange = () => {
                const previewContainer = document.getElementById('image-preview');
                previewContainer.innerHTML = '';
                [...imageInput.files].forEach(file => {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        const img = document.createElement('img');
                        img.src = e.target.result;
                        img.className = 'preview-item';
                        previewContainer.appendChild(img);
                    };
                    reader.readAsDataURL(file);
                });
            };
        }
        const form = document.getElementById('product-form');
        if (form) {
            form.onsubmit = async (e) => {
                e.preventDefault();
                const formData = new FormData(form);
                if (formData.get('category_id') === 'new') {
                    const catRes = await API.admin.categories.create({ name: formData.get('new_category_name'), status: 'active' });
                    if (catRes.success) { formData.set('category_id', catRes.data.data.id); await this.loadCategories(); }
                }
                const id = document.getElementById('product-id').value;
                if (id) formData.append('_method', 'PATCH');
                let res = id ? await API.admin.products.update(id, formData) : await API.admin.products.create(formData);
                if (res.success) {
                    this.closeModal();
                    this.loadProducts();
                    UI.notify(`Product ${id ? 'updated' : 'created'} successfully!`);
                } else {
                    UI.notify(res.message, 'error');
                }
            };
        }
    },

    openAddModal() {
        const form = document.getElementById('product-form');
        if (form) form.reset();
        document.getElementById('product-id').value = '';
        const newCatGroup = document.getElementById('new-category-group');
        if (newCatGroup) newCatGroup.style.display = 'none';
        document.getElementById('image-preview').innerHTML = '';
        document.getElementById('modal-title').innerText = 'Add New Product';
        UI.modal.open('product-modal');
    },

    openEditModal(id) {
        const p = this.products.find(x => x.id === id);
        if (!p) return;
        document.getElementById('product-id').value = p.id;
        document.getElementById('p-name').value = p.name;
        document.getElementById('product-category').value = p.category_id;
        document.getElementById('p-price').value = p.price;
        document.getElementById('p-status').value = p.status;
        document.getElementById('p-description').value = p.description;
        document.getElementById('modal-title').innerText = 'Edit Product';
        UI.modal.open('product-modal');
    },

    closeModal() { UI.modal.close('product-modal'); },
    openDeleteModal(id) { this.deleteId = id; UI.modal.open('delete-modal'); document.getElementById('confirm-delete-btn').onclick = () => this.confirmDelete(); },
    closeDeleteModal() { UI.modal.close('delete-modal'); },
    async confirmDelete() {
        const res = await API.admin.products.delete(this.deleteId);
        if (res.success) { this.closeDeleteModal(); this.loadProducts(); UI.notify('Product deleted successfully'); }
        else { UI.notify(res.message, 'error'); }
    }
};

window.ProductsAdmin = ProductsAdminModule;
export default ProductsAdminModule;
