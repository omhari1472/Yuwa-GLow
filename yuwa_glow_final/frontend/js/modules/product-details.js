import API from '../api.js';
import CONFIG from '../config.js';

const ProductDetailsModule = {
    product: null,
    selectedVariant: null,
    currentImageIndex: 0,

    async init() {
        const container = document.querySelector('.product-detail-layout');
        if (!container) return;

        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id');

        if (!productId) {
            this.renderError(container, 'No product specified');
            return;
        }

        this.renderLoading(container);

        try {
            const res = await API.getProduct(productId);
            if (res.success && res.data?.data) {
                this.product = res.data.data;
                this.render(container);
                this.initImageGallery();
                this.initVariantSelector();
                this.updatePageMeta();
            } else {
                this.renderError(container, 'Product not found');
            }
        } catch (error) {
            console.error('Product Details Error:', error);
            this.renderError(container, 'Failed to load product');
        }
    },

    render(container) {
        const product = this.product;
        const placeholder = 'assets/images/placeholder.png';
        const images = product.images || [];
        const variants = product.variants || [];

        // Get main image
        const mainImg = images.length > 0
            ? `${CONFIG.STORAGE_URL}${images[0].image_url}`
            : placeholder;

        // Build thumbnails HTML
        const thumbnailsHtml = images.length > 0
            ? images.map((img, idx) => `
                <img src="${CONFIG.STORAGE_URL}${img.image_url}"
                     alt="${product.name} - Image ${idx + 1}"
                     class="thumbnail ${idx === 0 ? 'active' : ''}"
                     data-index="${idx}"
                     onerror="this.src='${placeholder}'">
            `).join('')
            : `<img src="${placeholder}" alt="${product.name}" class="thumbnail active">`;

        // Build variants HTML
        const variantsHtml = variants.length > 0 ? `
            <div class="product-variants">
                <h3>Available Options</h3>
                <div class="variant-options">
                    ${variants.map((v, idx) => `
                        <button class="variant-btn ${idx === 0 ? 'active' : ''}"
                                data-variant-id="${v.id}"
                                data-price="${v.price}">
                            ${v.variant_name}${v.variant_value ? `: ${v.variant_value}` : ''}
                        </button>
                    `).join('')}
                </div>
            </div>
        ` : '';

        // Determine initial price (first variant or base price)
        const displayPrice = variants.length > 0 ? variants[0].price : product.price;

        // Build benefits list if description contains bullet points
        const benefitsHtml = product.benefits ? `
            <div class="product-benefits">
                <h3>Key Benefits</h3>
                <ul>
                    ${product.benefits.split('\n').filter(b => b.trim()).map(b => `<li>${b.trim()}</li>`).join('')}
                </ul>
            </div>
        ` : '';

        // Build usage instructions
        const usageHtml = product.usage ? `
            <div class="product-usage">
                <h3>How to Use</h3>
                <p>${product.usage}</p>
            </div>
        ` : '';

        container.innerHTML = `
            <!-- Product Gallery -->
            <div class="product-gallery fade-in">
                <div class="main-product-image">
                    <img src="${mainImg}" alt="${product.name}" id="mainImage" onerror="this.src='${placeholder}'">
                </div>
                <div class="thumbnail-images">
                    ${thumbnailsHtml}
                </div>
            </div>

            <!-- Product Info -->
            <div class="product-detail-info fade-in" style="animation-delay: 0.2s;">
                <p class="product-category">${product.category?.name || 'YUWA GLOW'}</p>
                <h1 class="product-detail-title">${product.name}</h1>
                <p class="product-detail-price" id="productPrice">$${parseFloat(displayPrice).toFixed(2)}</p>
                <p class="product-detail-description">${product.description}</p>

                ${variantsHtml}
                ${benefitsHtml}
                ${usageHtml}

                <div class="product-cta">
                    <a href="https://wa.me/1234567890?text=I'm interested in ${encodeURIComponent(product.name)}"
                       target="_blank"
                       class="cta-button whatsapp-btn">WhatsApp</a>
                    <a href="contact.html?product=${encodeURIComponent(product.name)}"
                       class="cta-button enquiry-btn">Send Enquiry</a>
                </div>
            </div>
        `;
    },

    initImageGallery() {
        const thumbnails = document.querySelectorAll('.thumbnail');
        const mainImage = document.getElementById('mainImage');

        thumbnails.forEach(thumb => {
            thumb.addEventListener('click', () => {
                thumbnails.forEach(t => t.classList.remove('active'));
                thumb.classList.add('active');
                mainImage.src = thumb.src;
                this.currentImageIndex = parseInt(thumb.dataset.index) || 0;
            });
        });
    },

    initVariantSelector() {
        const variantBtns = document.querySelectorAll('.variant-btn');
        const priceElement = document.getElementById('productPrice');

        variantBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                variantBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const price = btn.dataset.price;
                if (priceElement && price) {
                    priceElement.textContent = `$${parseFloat(price).toFixed(2)}`;
                }

                this.selectedVariant = btn.dataset.variantId;
            });
        });
    },

    updatePageMeta() {
        if (this.product) {
            document.title = `${this.product.name} | YUWA GLOW`;
            const metaDesc = document.querySelector('meta[name="description"]');
            if (metaDesc) {
                metaDesc.content = this.product.description.substring(0, 160);
            }
        }
    },

    renderLoading(container) {
        container.innerHTML = `
            <div class="loading-state" style="grid-column: 1 / -1; text-align: center; padding: 100px 0;">
                <div class="loader">Loading product details...</div>
            </div>
        `;
    },

    renderError(container, message) {
        container.innerHTML = `
            <div class="error-state" style="grid-column: 1 / -1; text-align: center; padding: 100px 0;">
                <h2>Oops!</h2>
                <p>${message}</p>
                <a href="products.html" class="cta-button" style="margin-top: 20px;">Browse Products</a>
            </div>
        `;
    }
};

export default ProductDetailsModule;
