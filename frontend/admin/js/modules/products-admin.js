import API from '../../../js/api.js';
import CONFIG from '../../../js/config.js';
import UI from '../utils.js';

const ProductsAdminModule = {
    products: [],
    filteredProducts: [],
    categories: [],
    currentProductId: null,
    quillEditor: null,
    variantCounter: 0,
    currentPage: 1,
    perPage: 10,

    async init() {
        this.checkAuth();
        this.initQuillEditor();
        this.initEventListeners();
        await Promise.all([this.loadProducts(), this.loadCategories()]);
        this.initStatusDropdown();
        this.initSearchFilter();
    },

    initQuillEditor() {
        this.quillEditor = new Quill('#editor-container', {
            theme: 'snow',
            placeholder: 'Describe the product benefits...',
            modules: {
                toolbar: [
                    ['bold', 'italic', 'underline'],
                    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                    ['clean']
                ]
            }
        });
    },

    initSearchFilter() {
        UI.initSearchFilter('product-search', {
            placeholder: 'Search products by name...',
            filters: [
                {
                    key: 'category_id',
                    label: 'All Categories',
                    options: this.categories.map(c => ({ value: c.id, text: c.name }))
                },
                {
                    key: 'status',
                    label: 'All Status',
                    options: [
                        { value: 'active', text: 'Active' },
                        { value: 'inactive', text: 'Inactive' }
                    ]
                }
            ],
            onSearch: (term, filters) => {
                this.filteredProducts = UI.filterItems(this.products, term, filters, ['name', 'description']);
                this.currentPage = 1;
                this.render();
                UI.updateSearchCount('product-search', this.filteredProducts.length, this.products.length);
            }
        });
        UI.updateSearchCount('product-search', this.products.length, this.products.length);
    },

    checkAuth() { if (!localStorage.getItem('admin_token')) window.location.href = '../index.html'; },

    async loadProducts() {
        UI.loading.table('product-list', 5, 6);
        const res = await API.admin.products.list();
        if (res.success) {
            this.products = res.data.data || [];
            this.filteredProducts = [...this.products];
            this.render();
        }
    },

    async loadCategories() {
        const res = await API.admin.categories.list();
        if (res.success) {
            this.categories = res.data.data || [];
            this.initCategoryDropdown();
        }
    },

    initStatusDropdown(selectedValue = 'active') {
        UI.initDropdown('product-status-dropdown', [
            { value: 'active', text: 'Active (Visible)', selected: selectedValue === 'active' },
            { value: 'inactive', text: 'Inactive (Hidden)', selected: selectedValue === 'inactive' }
        ]);
    },

    initCategoryDropdown(selectedId = null) {
        const options = this.categories.map(cat => ({
            value: cat.id,
            text: cat.name,
            selected: cat.id == selectedId
        }));
        options.push({ value: 'new', text: '+ Add New Category' });

        UI.initDropdown('product-category-dropdown', options, (value) => {
            const newCatGroup = document.getElementById('new-category-group');
            if (newCatGroup) {
                newCatGroup.style.display = value === 'new' ? 'block' : 'none';
                if (value === 'new') document.getElementById('new-category-name').focus();
            }
        });
    },

    render() {
        const container = document.getElementById('product-list');
        if (!container) return;

        if (this.filteredProducts.length === 0) {
            UI.renderEmptyState('product-list', {
                icon: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12,2L2,7V17L12,22L22,17V7L12,2M10.1,16.5L6.6,14.6L12,11.5L17.4,14.6L13.9,16.5L12,17.5L10.1,16.5M12,4.5L19,8.2L12,11.8L5,8.2L12,4.5Z" /></svg>',
                title: this.products.length === 0 ? 'No Products Yet' : 'No Matching Products',
                message: this.products.length === 0 ? 'Your premium catalog is empty.' : 'Try adjusting your search or filters.',
                btnText: this.products.length === 0 ? 'Add First Product' : null,
                btnId: 'empty-add-btn'
            });
            if (this.products.length === 0) {
                document.getElementById('empty-add-btn')?.addEventListener('click', () => this.openAddModal());
            }
            // Hide pagination when empty
            const paginationEl = document.getElementById('product-pagination');
            if (paginationEl) paginationEl.innerHTML = '';
            return;
        }

        // Apply pagination
        const { data: items, meta } = UI.pagination.paginate(this.filteredProducts, this.currentPage, this.perPage);

        container.innerHTML = items.map(p => `
            <tr>
                <td><img src="${p.images && p.images[0] ? CONFIG.STORAGE_URL + p.images[0].image_url : '../../assets/images/placeholder.png'}" class="table-thumb"></td>
                <td><div class="user-info"><strong>${p.name}</strong><span>ID: #${p.id}${p.variants?.length ? ` | ${p.variants.length} variants` : ''}</span></div></td>
                <td><span class="badge">${p.category?.name || 'N/A'}</span></td>
                <td><strong>₹${p.price}</strong></td>
                <td><span class="status ${p.status}">${p.status}</span></td>
                <td>
                    <button class="btn-icon" onclick="window.ProductsAdmin.openEditModal(${p.id})"><svg style="width:18px;height:18px" viewBox="0 0 24 24"><path fill="currentColor" d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" /></svg></button>
                    <button class="btn-icon btn-delete" onclick="window.ProductsAdmin.openDeleteModal(${p.id})"><svg style="width:18px;height:18px" viewBox="0 0 24 24"><path fill="currentColor" d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19V4M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" /></svg></button>
                </td>
            </tr>
        `).join('');

        // Render pagination
        UI.pagination.render('product-pagination', meta, (page) => {
            this.currentPage = page;
            this.render();
        });
    },

    initEventListeners() {
        document.getElementById('open-add-modal')?.addEventListener('click', () => this.openAddModal());

        // Add variant button
        document.getElementById('add-variant-btn')?.addEventListener('click', () => this.addVariantRow());

        // Image Preview Logic
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
                await this.handleSubmit(form);
            };
        }
    },

    async handleSubmit(form) {
        // Sync Quill content to hidden textarea
        const content = this.quillEditor.root.innerHTML;
        document.getElementById('p-description').value = (content === '<p><br></p>') ? '' : content;

        const submitBtn = form.querySelector('button[type="submit"]');
        UI.loading.button(submitBtn, true);
        const formData = new FormData(form);

        // Handle Custom Category Creation
        if (formData.get('category_id') === 'new') {
            const newCatName = formData.get('new_category_name');
            const catRes = await API.admin.categories.create({ name: newCatName, status: 'active' });
            if (catRes.success) {
                formData.set('category_id', catRes.data.data.id);
                await this.loadCategories();
            }
        }

        // Collect variants from the form
        const variants = this.collectVariants();
        if (variants.length > 0) {
            formData.append('variants', JSON.stringify(variants));
        }

        const id = document.getElementById('product-id').value;
        if (id) formData.append('_method', 'PATCH');

        let res = id ? await API.admin.products.update(id, formData) : await API.admin.products.create(formData);

        UI.loading.button(submitBtn, false);
        if (res.success) {
            this.closeModal();
            this.loadProducts();
            UI.notify(`Product ${id ? 'updated' : 'created'} successfully!`);
        } else {
            UI.notify(res.message, 'error');
        }
    },

    collectVariants() {
        const variants = [];
        document.querySelectorAll('.variant-row').forEach(row => {
            const variantId = row.dataset.variantId || null;
            const name = row.querySelector('[name="variant_name"]')?.value?.trim();
            const value = row.querySelector('[name="variant_value"]')?.value?.trim();
            const price = row.querySelector('[name="variant_price"]')?.value;

            if (name) {
                variants.push({
                    id: variantId,
                    variant_name: name,
                    variant_value: value || null,
                    price: price || null
                });
            }
        });
        return variants;
    },

    addVariantRow(variant = null) {
        const container = document.getElementById('variants-container');
        if (!container) return;

        this.variantCounter++;
        const variantId = variant?.id || '';
        const rowHtml = `
            <div class="variant-row" data-variant-id="${variantId}">
                <input type="text" name="variant_name" placeholder="Name (e.g. Size)" value="${variant?.variant_name || ''}" required>
                <input type="text" name="variant_value" placeholder="Value (e.g. 50ml)" value="${variant?.variant_value || ''}">
                <input type="number" step="0.01" name="variant_price" placeholder="Price" value="${variant?.price || ''}">
                <button type="button" class="remove-variant-btn" onclick="window.ProductsAdmin.removeVariantRow(this, ${variantId || 'null'})">&times;</button>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', rowHtml);
    },

    async removeVariantRow(btn, variantId) {
        const row = btn.closest('.variant-row');

        // If this is an existing variant (has ID), delete from server
        if (variantId && this.currentProductId) {
            const confirmed = confirm('Delete this variant? This cannot be undone.');
            if (!confirmed) return;

            const res = await API.admin.products.deleteVariant(this.currentProductId, variantId);
            if (!res.success) {
                UI.notify('Failed to delete variant', 'error');
                return;
            }
            UI.notify('Variant deleted');
        }

        row.remove();
    },

    renderExistingImages(images) {
        const container = document.getElementById('existing-images');
        if (!container) return;

        if (!images || images.length === 0) {
            container.innerHTML = '';
            return;
        }

        container.innerHTML = images.map(img => `
            <div class="preview-item-wrapper">
                <img src="${CONFIG.STORAGE_URL}${img.image_url}" class="preview-item" onerror="this.src='../../assets/images/placeholder.png'">
                <button type="button" class="delete-image-btn" onclick="window.ProductsAdmin.deleteImage(${img.id})">&times;</button>
            </div>
        `).join('');
    },

    async deleteImage(imageId) {
        if (!this.currentProductId) return;

        const confirmed = confirm('Delete this image? This cannot be undone.');
        if (!confirmed) return;

        const res = await API.admin.products.deleteImage(this.currentProductId, imageId);
        if (res.success) {
            // Reload the product data and re-render existing images
            const productRes = await API.admin.products.get(this.currentProductId);
            if (productRes.success) {
                const product = productRes.data.data;
                this.renderExistingImages(product.images);
                // Update local products array
                const idx = this.products.findIndex(p => p.id === this.currentProductId);
                if (idx !== -1) this.products[idx] = product;
            }
            UI.notify('Image deleted');
        } else {
            UI.notify('Failed to delete image', 'error');
        }
    },

    openAddModal() {
        document.getElementById('product-form').reset();
        document.getElementById('product-id').value = '';
        document.getElementById('p-description').value = '';
        if (this.quillEditor) this.quillEditor.setContents([]);
        document.getElementById('image-preview').innerHTML = '';
        document.getElementById('existing-images').innerHTML = '';
        document.getElementById('variants-container').innerHTML = '';
        document.getElementById('new-category-group').style.display = 'none';
        this.currentProductId = null;
        this.variantCounter = 0;
        this.initCategoryDropdown();
        this.initStatusDropdown('active');
        document.getElementById('modal-title').textContent = 'Add New Product';
        UI.modal.open('product-modal');
    },

    async openEditModal(id) {
        const p = this.products.find(x => x.id === id);
        if (!p) return;

        this.currentProductId = id;
        document.getElementById('product-id').value = p.id;
        document.getElementById('p-name').value = p.name;
        document.getElementById('p-price').value = p.price;
        document.getElementById('p-description').value = p.description;
        if (this.quillEditor) this.quillEditor.root.innerHTML = p.description || '';
        document.getElementById('image-preview').innerHTML = '';

        // Show existing images with delete buttons
        this.renderExistingImages(p.images);

        // Render existing variants
        document.getElementById('variants-container').innerHTML = '';
        this.variantCounter = 0;
        if (p.variants && p.variants.length > 0) {
            p.variants.forEach(v => this.addVariantRow(v));
        }

        this.initCategoryDropdown(p.category_id);
        this.initStatusDropdown(p.status);
        document.getElementById('modal-title').textContent = 'Edit Product';
        UI.modal.open('product-modal');
    },

    closeModal() { UI.modal.close('product-modal'); },

    openDeleteModal(id) {
        this.deleteId = id;
        UI.confirm({
            title: 'Delete Product',
            message: 'Are you sure you want to remove this item from the catalog?',
            onConfirm: async () => {
                const res = await API.admin.products.delete(this.deleteId);
                if (res.success) { this.loadProducts(); UI.notify('Product deleted'); }
            }
        });
    }
};

window.ProductsAdmin = ProductsAdminModule;
export default ProductsAdminModule;
