import API from '../api.js';
import CONFIG from '../config.js';

const ProductsModule = {
    async init() {
        const container = document.querySelector('.product-grid-container');
        if (!container) return;

        this.renderLoading(container);
        
        try {
            const [productsRes, categoriesRes] = await Promise.all([
                API.getProducts(),
                API.getCategories()
            ]);

            if (productsRes.success && categoriesRes.success) {
                const products = productsRes.data.data || productsRes.data || [];
                const categories = categoriesRes.data.data || categoriesRes.data || [];
                
                console.log(`Debug: Loaded ${products.length} products`);
                
                if (products.length === 0) {
                    this.renderEmpty(container);
                } else {
                    this.render(container, products, categories);
                }
            } else {
                this.renderError(container, 'Failed to load products.');
            }
        } catch (error) {
            console.error('Products Module Init Error:', error);
            this.renderError(container, 'A system error occurred.');
        }
    },

    render(container, products, categories) {
        let html = `
            <section class="page-header fade-in">
                <div class="container">
                    <h1>Our Collection</h1>
                    <p>Experience the science of radiance.</p>
                </div>
            </section>
        `;
        
        categories.forEach(cat => {
            const catProducts = products.filter(p => p.category_id == cat.id);
            if (catProducts.length === 0) return;

            html += `
                <section id="cat-${cat.id}" class="container section-padding">
                    <h2 class="section-title fade-in">${cat.name}</h2>
                    <div class="product-grid">
                        ${catProducts.map(product => this.productCardTemplate(product)).join('')}
                    </div>
                </section>
            `;
        });

        const orphanedProducts = products.filter(p => !categories.some(cat => cat.id == p.category_id));
        if (orphanedProducts.length > 0) {
            html += `
                <section id="cat-others" class="container section-padding">
                    <h2 class="section-title fade-in">More Essentials</h2>
                    <div class="product-grid">
                        ${orphanedProducts.map(product => this.productCardTemplate(product)).join('')}
                    </div>
                </section>
            `;
        }

        container.innerHTML = html;
    },

    productCardTemplate(product) {
        const placeholder = 'assets/images/placeholder.png';
        
        // Clean up double slashes if any
        const baseUrl = CONFIG.STORAGE_URL.endsWith('/') ? CONFIG.STORAGE_URL : CONFIG.STORAGE_URL + '/';
        
        const imgUrl = (product.images && product.images[0]) 
            ? `${baseUrl}${product.images[0].image_url}` 
            : placeholder;

        return `
            <div class="product-card fade-in">
                <a href="product-details.html?id=${product.id}" class="product-image-link">
                    <img src="${imgUrl}" alt="${product.name}" onerror="this.src='${placeholder}'; this.onerror=null;">
                </a>
                <div class="product-info">
                    <h3 class="product-title"><a href="product-details.html?id=${product.id}">${product.name}</a></h3>
                    <p class="product-description">${product.description.substring(0, 80)}...</p>
                    <p class="product-price">$${product.price}</p>
                </div>
            </div>
        `;
    },

    renderEmpty(container) {
        container.innerHTML = `
            <div class="container section-padding text-center" style="min-height: 50vh;">
                <h2 class="section-title">Collection Coming Soon</h2>
                <p>We are currently updating our products. Stay tuned!</p>
            </div>
        `;
    },

    renderLoading(container) {
        container.innerHTML = `<div class="container section-padding text-center"><div class="loader">Unveiling Radiance...</div></div>`;
    },

    renderError(container, msg) {
        container.innerHTML = `<div class="container section-padding text-center"><p>${msg}</p></div>`;
    }
};

export default ProductsModule;
