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
                ${variantsHtml}
            </div>

            <!-- Product Info -->
            <div class="product-detail-info fade-in" style="animation-delay: 0.2s;">
                <p class="product-category">${product.category?.name || 'YUVA GLOW'}</p>
                <h1 class="product-detail-title">${product.name}</h1>
                <p class="product-detail-price" id="productPrice">₹${parseFloat(displayPrice).toFixed(2)}</p>
                <p class="product-detail-description">${product.description}</p>

                ${benefitsHtml}
                ${usageHtml}

                <div class="product-cta">
                    <a href="https://wa.me/917300045513?text=Hi, I'm interested in ${encodeURIComponent(product.name)}"
                       target="_blank"
                       class="cta-button whatsapp-btn">
                       <svg width="20" height="20" viewBox="0 0 24 24" style="vertical-align: middle; margin-right: 8px;">
                           <path fill="currentColor" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                       </svg>
                       WhatsApp
                    </a>
                    <a href="contact.html?product=${encodeURIComponent(product.name)}"
                       class="cta-button enquiry-btn">
                       <svg width="18" height="18" viewBox="0 0 24 24" style="vertical-align: middle; margin-right: 8px;">
                           <path fill="currentColor" d="M20,8L12,13L4,8V6L12,11L20,6M20,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6C22,4.89 21.1,4 20,4Z"/>
                       </svg>
                       Send Enquiry
                    </a>
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
                    priceElement.textContent = `₹${parseFloat(price).toFixed(2)}`;
                }

                this.selectedVariant = btn.dataset.variantId;
            });
        });
    },

    updatePageMeta() {
        if (this.product) {
            document.title = `${this.product.name} | YUVA GLOW`;
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
