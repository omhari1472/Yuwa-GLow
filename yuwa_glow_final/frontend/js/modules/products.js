import API from '../api.js';
import CONFIG from '../config.js';

const ProductsModule = {
    async init() {
        const container = document.querySelector('.product-grid-container'); // Ensure this selector exists or use main
        if (!container) return;

        this.renderLoading(container);
        
        const productsRes = await API.getProducts();
        const categoriesRes = await API.getCategories();

        if (productsRes.success && categoriesRes.success) {
            this.render(container, productsRes.data, categoriesRes.data);
        } else {
            this.renderError(container, 'Failed to load products.');
        }
    },

    render(container, products, categories) {
        let html = '';
        
        categories.forEach(cat => {
            const catProducts = products.filter(p => p.category_id === cat.id);
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

        container.innerHTML = html;
    },

    productCardTemplate(product) {
        const imgUrl = product.images?.[0] 
            ? `${CONFIG.STORAGE_URL}${product.images[0].image_url}` 
            : 'assets/images/placeholder.png';

        return `
            <div class="product-card fade-in">
                <a href="product-details.html?id=${product.id}" class="product-image-link">
                    <img src="${imgUrl}" alt="${product.name}">
                </a>
                <div class="product-info">
                    <h3 class="product-title"><a href="product-details.html?id=${product.id}">${product.name}</a></h3>
                    <p class="product-description">${product.description.substring(0, 80)}...</p>
                    <p class="product-price">$${product.price}</p>
                </div>
            </div>
        `;
    },

    renderLoading(container) {
        container.innerHTML = '<div class="loader">Loading our collection...</div>';
    },

    renderError(container, msg) {
        container.innerHTML = `<div class="error-msg">${msg}</div>`;
    }
};

export default ProductsModule;
