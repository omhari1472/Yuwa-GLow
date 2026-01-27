import API from '../api.js';
import CONFIG from '../config.js';

const ProductsModule = {
    products: [],
    categories: [],
    currentCategory: null,

    async init() {
        const categoriesView = document.getElementById('categories-view');
        const productsView = document.getElementById('products-view');
        const detailView = document.getElementById('product-detail-view');
        
        if (!categoriesView || !productsView || !detailView) return;

        // Listen for hash changes
        window.addEventListener('hashchange', () => this.handleRouting());

        try {
            const [productsRes, categoriesRes] = await Promise.all([
                API.getProducts(),
                API.getCategories()
            ]);

            this.products = productsRes.data?.data || productsRes.data || [];
            this.categories = categoriesRes.data?.data || categoriesRes.data || [];
            
            this.handleRouting();
        } catch (error) {
            console.error('Products Module Error:', error);
        }
    },

    handleRouting() {
        const hash = window.location.hash.replace('#', '');
        const categoriesView = document.getElementById('categories-view');
        const productsView = document.getElementById('products-view');
        const detailView = document.getElementById('product-detail-view');
        const mainElement = document.getElementById('main-product-section');

        if (!categoriesView || !productsView || !detailView || !mainElement) return;

        // Reset displays
        categoriesView.style.display = 'none';
        productsView.style.display = 'none';
        detailView.style.display = 'none';

        // Reset background classes
        mainElement.classList.remove('hair-products-bg', 'skin-products-bg', 'makeup-products-bg');

        if (hash === 'hair') {
            mainElement.classList.add('hair-products-bg');
        } else if (hash === 'skin') {
            mainElement.classList.add('skin-products-bg');
        } else if (hash === 'makeup') {
            mainElement.classList.add('makeup-products-bg');
        }

        if (hash === 'hair') {
            // Category List: #hair
            this.currentCategory = hash.toLowerCase();
            productsView.style.display = 'block';
            this.renderCategoryProducts(this.currentCategory);
            window.scrollTo(0, 0);
        } else if (hash.startsWith('product/')) {
            // Product Detail: #product/ID
            const productId = hash.split('/')[1];
            detailView.style.display = 'block';
            this.renderProductDetail(productId);
            window.scrollTo(0, 0);
        } else if (['hair', 'skin', 'makeup'].includes(hash.toLowerCase())) {
            // Category List: #skin, #makeup
            this.currentCategory = hash.toLowerCase();
            productsView.style.display = 'block';
            this.renderCategoryProducts(this.currentCategory);
            window.scrollTo(0, 0);
        } else {
            // Landing: Categories
            categoriesView.style.display = 'block';
            this.currentCategory = null;
            window.scrollTo(0, 0);
        }
    },

    toSlug(text) {
        if (!text) return '';
        return text.toString().toLowerCase()
            .replace(/\s+/g, '-')           // Replace spaces with -
            .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
            .replace(/\-\-+/g, '-')         // Replace multiple - with single -
            .replace(/^-+/, '')             // Trim - from start of text
            .replace(/-+$/, '');            // Trim - from end of text
    },

    renderCategoryProducts(categoryName) {
        const titleEl = document.getElementById('current-category-title');
        const gridEl = document.getElementById('category-products-grid');
        
        if (!titleEl || !gridEl) return;

        if (['hair', 'skin', 'makeup'].includes(categoryName)) {
            titleEl.style.display = 'none';
        } else {
            titleEl.style.display = 'block';
            titleEl.innerText = `${categoryName.charAt(0).toUpperCase() + categoryName.slice(1)} Products`;
        }
        
        // Find category ID based on name
        const category = this.categories.find(c => c.name.toLowerCase().includes(categoryName));
        
        let filteredProducts = [];
        if (category) {
            filteredProducts = this.products.filter(p => p.category_id == category.id);
        } else {
            // Fallback: search in product names or descriptions if category not found in metadata
            filteredProducts = this.products.filter(p => 
                p.name.toLowerCase().includes(categoryName) || 
                (p.description && p.description.toLowerCase().includes(categoryName))
            );
        }

        if (filteredProducts.length === 0) {
            gridEl.innerHTML = `<p class="text-center" style="grid-column: 1/-1; padding: 50px; font-size: 1.2rem; color: #666;">No products found in this collection yet. Check back soon!</p>`;
        } else {
            gridEl.innerHTML = filteredProducts.map(product => this.productCardTemplate(product)).join('');
        }

        if (window.startScrollObserver) window.startScrollObserver();
    },

    productCardTemplate(product) {
        const placeholder = 'assets/images/placeholder.png';
        const imgUrl = (product.images && product.images[0])
            ? `${CONFIG.STORAGE_URL}${product.images[0].image_url}`
            : placeholder;

        const productId = product.id;

        return `
            <div class="product-card fade-in" style="background: white; border-radius: 15px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.05);">
                <a href="#product/${productId}" class="product-image-link" style="display: block; height: 350px; background: #f5f5f5;">
                    <img src="${imgUrl}" alt="${product.name}" loading="lazy" onerror="this.src='${placeholder}'" style="width: 100%; height: 100%; object-fit: cover;">
                </a>
                <div class="product-info" style="padding: 20px; text-align: center;">
                    <h3 style="margin-bottom: 10px; font-size: 18px;"><a href="#product/${productId}" style="color: #3a3a3a; text-decoration: none;">${product.name}</a></h3>
                    <p style="color: #6b7280; font-size: 14px; margin-bottom: 15px;">${product.description ? (product.description.replace(/<[^>]*>/g, '').substring(0, 80)) : ''}...</p>
                    <p style="color: var(--primary-gold); font-weight: 700; font-size: 20px;">₹${product.price}</p>
                </div>
            </div>
        `;
    },

    // Skeleton loader template for products
    skeletonCardTemplate() {
        return `
            <div class="skeleton-card fade-in" style="background: white; border-radius: 15px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.05);">
                <div class="skeleton" style="height: 350px; border-radius: 0;"></div>
                <div style="padding: 20px; text-align: center;">
                    <div class="skeleton skeleton-text medium" style="margin: 0 auto 10px;"></div>
                    <div class="skeleton skeleton-text long" style="margin-bottom: 8px;"></div>
                    <div class="skeleton skeleton-text short" style="margin: 0 auto;"></div>
                </div>
            </div>
        `;
    },

    // Show skeleton loaders while loading
    showSkeletonLoaders(gridEl, count = 6) {
        if (!gridEl) return;
        gridEl.innerHTML = Array(count).fill(this.skeletonCardTemplate()).join('');
    },

    renderProductDetail(id) {
        const container = document.getElementById('product-detail-content');
        const mainElement = document.getElementById('main-product-section');
        if (!container) return;

        // Find product by ID
        const product = this.products.find(p => String(p.id) === String(id));

        if (!product) {
            container.innerHTML = `<div class="text-center"><h2>Product Not Found</h2><p>The product you are looking for does not exist.</p></div>`;
            return;
        }

        // Apply background based on category
        if (mainElement) {
            mainElement.classList.remove('hair-products-bg', 'skin-products-bg', 'makeup-products-bg');
            // Assuming category_id maps to 1:Hair, 2:Skin, 3:Makeup or checking category object if populated
            // Since we don't have direct mapping logic visible, we try to match category name or ID
            // Best effort: Check if product.category exists or filter categories list
            const category = this.categories.find(c => c.id == product.category_id);
            if (category) {
                const catName = category.name.toLowerCase();
                if (catName.includes('hair')) mainElement.classList.add('hair-products-bg');
                else if (catName.includes('skin')) mainElement.classList.add('skin-products-bg');
                else if (catName.includes('makeup')) mainElement.classList.add('makeup-products-bg');
            }
        }

        const placeholder = 'assets/images/placeholder.png';
        const mainImgUrl = (product.images && product.images[0]) 
            ? `${CONFIG.STORAGE_URL}${product.images[0].image_url}` 
            : placeholder;

        // Thumbnail HTML
        let thumbnailsHtml = '';
        if (product.images && product.images.length > 1) {
            thumbnailsHtml = `
                <div class="thumbnail-images">
                    ${product.images.map((img, index) => `
                        <img src="${CONFIG.STORAGE_URL}${img.image_url}" class="thumbnail ${index === 0 ? 'active' : ''}" onclick="this.parentElement.previousElementSibling.src = this.src; document.querySelectorAll('.thumbnail').forEach(el => el.classList.remove('active')); this.classList.add('active');" alt="${product.name} view ${index + 1}">
                    `).join('')}
                </div>
            `;
        }

        // Render Detail View
        container.innerHTML = `
            <div class="product-image-section">
                <img src="${mainImgUrl}" class="main-product-image" alt="${product.name}" style="width: 100%; border-radius: 10px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
                ${thumbnailsHtml}
            </div>
            <div class="product-info-section">
                <h1 class="product-detail-title">${product.name}</h1>
                <p class="product-detail-price">₹${product.price}</p>
                
                <div class="product-detail-description">
                    ${product.description || 'No description available.'}
                </div>

                <div class="product-cta">
                    <a href="contact.html?enquiry=${encodeURIComponent(product.name)}" class="cta-button enquiry-btn">Enquire Now</a>
                    <a href="https://wa.me/917300045513?text=${encodeURIComponent('I am interested in ' + product.name)}" target="_blank" class="cta-button" style="background: #25D366;">WhatsApp</a>
                </div>
            </div>
        `;
        
        // Ensure Layout is correct
        container.style.display = 'grid';
        container.style.gridTemplateColumns = window.innerWidth <= 768 ? '1fr' : '1fr 1fr';
        container.style.gap = '50px';
        container.style.alignItems = 'start';
    }
};

export default ProductsModule;