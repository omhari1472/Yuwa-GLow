import API from '../../../js/api.js';
import CONFIG from '../../../js/config.js';
import UI from '../utils.js';

const ProductsAdminModule = {
    products: [],
    
    async init() {
        this.checkAuth();
        await this.loadProducts();
        await this.loadCategories();
        this.initEventListeners();
    },

    checkAuth() {
        if (!localStorage.getItem('admin_token')) {
            window.location.href = '../login.html';
        }
    },

    async loadProducts() {
        const res = await API.admin.products.list();
        if (res.success) {
            this.products = res.data.data;
            this.renderProducts();
        }
    },

    async loadCategories() {
        const res = await API.admin.categories.list();
        if (res.success) {
            const select = document.getElementById('product-category');
            if (select) {
                select.innerHTML = '<option value="">Select Category</option>' + 
                    res.data.data.map(cat => `<option value="${cat.id}">${cat.name}</option>`).join('');
            }
        }
    },

    renderProducts() {
        const container = document.getElementById('product-list');
        if (!container) return;

        container.innerHTML = this.products.map(p => `
            <tr>
                <td><img src="${p.images[0] ? CONFIG.STORAGE_URL + p.images[0].image_url : '../../assets/images/placeholder.png'}" class="table-thumb"></td>
                <td><strong>${p.name}</strong></td>
                <td><span class="badge">${p.category?.name || 'Uncategorized'}</span></td>
                <td>$${p.price}</td>
                <td><span class="status ${p.status}">${p.status}</span></td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-icon" onclick="window.ProductsAdmin.openEditModal(${p.id})" title="Edit">
                            <svg style="width:18px;height:18px" viewBox="0 0 24 24"><path fill="currentColor" d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" /></svg>
                        </button>
                        <button class="btn-icon btn-delete" onclick="window.ProductsAdmin.openDeleteModal(${p.id})" title="Delete">
                            <svg style="width:18px;height:18px" viewBox="0 0 24 24"><path fill="currentColor" d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19V4M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" /></svg>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    },

    initEventListeners() {
        const addBtn = document.getElementById('open-add-modal');
        if (addBtn) addBtn.onclick = () => this.openAddModal();

        const form = document.getElementById('product-form');
        if (form) {
            form.onsubmit = async (e) => {
                e.preventDefault();
                const formData = new FormData(form);
                const id = document.getElementById('product-id').value;
                
                let res;
                if (id) {
                    // Update - Laravel handles PATCH with _method spoofing in FormData
                    formData.append('_method', 'PATCH');
                    res = await API.admin.products.update(id, formData);
                } else {
                    res = await API.admin.products.create(formData);
                }

                if (res.success) {
                    this.closeModal();
                    this.loadProducts();
                    alert('Product saved successfully');
                } else {
                    alert(res.message);
                }
            };
        }
    },

    openAddModal() {
        document.getElementById('product-form').reset();
        document.getElementById('product-id').value = '';
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

    closeModal() {
        UI.modal.close('product-modal');
    },

    openDeleteModal(id) {
        this.deleteId = id;
        const confirmBtn = document.getElementById('confirm-delete-btn');
        confirmBtn.onclick = () => this.confirmDelete();
        UI.modal.open('delete-modal');
    },

    closeDeleteModal() {
        UI.modal.close('delete-modal');
    },

    async confirmDelete() {
        const res = await API.admin.products.delete(this.deleteId);
        if (res.success) {
            this.closeDeleteModal();
            this.loadProducts();
        } else {
            alert(res.message);
        }
    }
};

window.ProductsAdmin = ProductsAdminModule;
export default ProductsAdminModule;