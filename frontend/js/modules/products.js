import API from '../api.js';
import CONFIG from '../config.js';

const ProductsModule = {
    products: [],
    categories: [],

    async init() {
        const categoriesView = document.getElementById('categories-view');
        const productsView = document.getElementById('products-view');
        
        if (!categoriesView || !productsView) return;

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
        const hash = window.location.hash.replace('#', '').toLowerCase();
        const categoriesView = document.getElementById('categories-view');
        const productsView = document.getElementById('products-view');

        if (hash && ['hair', 'skin', 'makeup'].includes(hash)) {
            categoriesView.style.display = 'none';
            productsView.style.display = 'block';
            this.renderCategoryProducts(hash);
        } else {
            categoriesView.style.display = 'block';
            productsView.style.display = 'none';
            // Scroll to top when returning to categories
            window.scrollTo(0, 0);
        }
    },

    renderCategoryProducts(categoryName) {
        const titleEl = document.getElementById('current-category-title');
        const gridEl = document.getElementById('category-products-grid');
        
        if (!titleEl || !gridEl) return;

        titleEl.innerText = `${categoryName.charAt(0).toUpperCase() + categoryName.slice(1)} Collection`;
        
        // Find category ID based on name
        const category = this.categories.find(c => c.name.toLowerCase().includes(categoryName));
        
        let filteredProducts = [];
        if (category) {
            filteredProducts = this.products.filter(p => p.category_id == category.id);
        } else {
            // Fallback: search in product names or descriptions if category not found in metadata
            filteredProducts = this.products.filter(p => 
                p.name.toLowerCase().includes(categoryName) || 
                p.description.toLowerCase().includes(categoryName)
            );
        }

        if (filteredProducts.length === 0) {
            gridEl.innerHTML = `<p class="text-center" style="grid-column: 1/-1; padding: 50px; font-size: 1.2rem; color: #666;">No products found in this collection yet. Check back soon!</p>`;
        } else {
            gridEl.innerHTML = filteredProducts.map(product => this.productCardTemplate(product)).join('');
        }

        // Re-trigger scroll observer for new items
        if (window.startScrollObserver) {
            window.startScrollObserver();
        }
    },

    productCardTemplate(product) {
        const placeholder = 'assets/images/placeholder.png';
        const imgUrl = (product.images && product.images[0]) 
            ? `${CONFIG.STORAGE_URL}${product.images[0].image_url}` 
            : placeholder;

        const productId = product.id;

        return `
            <div class="product-card fade-in" style="background: white; border-radius: 15px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.05);">
                <a href="product-details.html?id=${productId}" class="product-image-link" style="display: block; height: 350px;">
                    <img src="${imgUrl}" alt="${product.name}" onerror="this.src='${placeholder}'" style="width: 100%; height: 100%; object-fit: cover;">
                </a>
                <div class="product-info" style="padding: 20px; text-align: center;">
                    <h3 style="margin-bottom: 10px; font-size: 18px;"><a href="product-details.html?id=${productId}" style="color: #3a3a3a; text-decoration: none;">${product.name}</a></h3>
                    <p style="color: #6b7280; font-size: 14px; margin-bottom: 15px;">${product.description ? product.description.substring(0, 80) : ''}...</p>
                    <p style="color: var(--primary-gold); font-weight: 700; font-size: 20px;">₹${product.price}</p>
                </div>
            </div>
        `;
    }
};

export default ProductsModule;