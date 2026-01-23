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

            // Robust data extraction
            const products = productsRes.data?.data || productsRes.data || [];
            const categories = categoriesRes.data?.data || categoriesRes.data || [];
            
            console.log('Final Products for render:', products);
            console.log('Final Categories for render:', categories);

            if (products.length === 0) {
                this.renderEmpty(container);
            } else {
                this.render(container, products, categories);
            }
        } catch (error) {
            console.error('Products Module Error:', error);
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
                    <h2 class="section-title fade-in" style="margin-bottom: 40px;">${cat.name}</h2>
                    <div class="product-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 30px;">
                        ${catProducts.map(product => this.productCardTemplate(product)).join('')}
                    </div>
                </section>
            `;
        });

        // Add orphaned products (those without a matching category in the list)
        const orphaned = products.filter(p => !categories.some(c => c.id == p.category_id));
        if (orphaned.length > 0) {
            html += `
                <section id="cat-others" class="container section-padding">
                    <h2 class="section-title fade-in">More Essentials</h2>
                    <div class="product-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 30px;">
                        ${orphaned.map(p => this.productCardTemplate(p)).join('')}
                    </div>
                </section>
            `;
        }

        container.innerHTML = html;
    },

    productCardTemplate(product) {
        const placeholder = 'assets/images/placeholder.png';
        const imgUrl = (product.images && product.images[0]) 
            ? `${CONFIG.STORAGE_URL}${product.images[0].image_url}` 
            : placeholder;

        return `
            <div class="product-card fade-in" style="background: white; border-radius: 15px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.05);">
                <a href="product-details.html?id=${product.id}" class="product-image-link" style="display: block; height: 350px;">
                    <img src="${imgUrl}" alt="${product.name}" onerror="this.src='${placeholder}'" style="width: 100%; height: 100%; object-fit: cover;">
                </a>
                <div class="product-info" style="padding: 20px; text-align: center;">
                    <h3 style="margin-bottom: 10px; font-size: 18px;"><a href="product-details.html?id=${product.id}" style="color: #3a3a3a; text-decoration: none;">${product.name}</a></h3>
                    <p style="color: #6b7280; font-size: 14px; margin-bottom: 15px;">${product.description.substring(0, 80)}...</p>
                    <p style="color: var(--primary-gold); font-weight: 700; font-size: 20px;">$${product.price}</p>
                </div>
            </div>
        `;
    },

    renderEmpty(container) {
        container.innerHTML = `<div class="container section-padding text-center"><h2>Collection Coming Soon</h2><p>Our team is currently updating the catalog.</p></div>`;
    },

    renderLoading(container) {
        container.innerHTML = `<div class="container section-padding text-center"><div class="loader">Loading Collection...</div></div>`;
    },

    renderError(container, msg) {
        container.innerHTML = `<div class="container section-padding text-center"><p>${msg}</p></div>`;
    }
};

export default ProductsModule;