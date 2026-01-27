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
                        <img src="${CONFIG.STORAGE_URL}${img.image_url}" class="thumbnail ${index === 0 ? 'active' : ''}" data-img="${CONFIG.STORAGE_URL}${img.image_url}" alt="${product.name} view ${index + 1}">
                    `).join('')}
                </div>
            `;
        }

        // Variants HTML
        const variants = product.variants || [];
        const displayPrice = variants.length > 0 ? variants[0].price : product.price;

        let variantsHtml = '';
        if (variants.length > 0) {
            variantsHtml = `
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
            `;
        }

        // Render Detail View
        container.innerHTML = `
            <div class="product-image-section">
                <img src="${mainImgUrl}" class="main-product-image" id="mainProductImage" alt="${product.name}" style="width: 100%; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
                ${thumbnailsHtml}
                ${variantsHtml}
            </div>
            <div class="product-info-section product-detail-info">
                <p class="product-category">${product.category?.name || 'YUVA GLOW'}</p>
                <h1 class="product-detail-title">${product.name}</h1>
                <p class="product-detail-price" id="productPrice">₹${parseFloat(displayPrice).toFixed(2)}</p>

                <div class="product-detail-description">
                    ${product.description || 'No description available.'}
                </div>

                <div class="product-cta">
                    <a href="https://wa.me/917300045513?text=${encodeURIComponent('Hi, I am interested in ' + product.name)}" target="_blank" class="cta-button whatsapp-btn">
                        <svg width="20" height="20" viewBox="0 0 24 24" style="vertical-align: middle; margin-right: 8px;">
                            <path fill="currentColor" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                        </svg>
                        WhatsApp
                    </a>
                    <a href="contact.html?enquiry=${encodeURIComponent(product.name)}" class="cta-button enquiry-btn">
                        <svg width="18" height="18" viewBox="0 0 24 24" style="vertical-align: middle; margin-right: 8px;">
                            <path fill="currentColor" d="M20,8L12,13L4,8V6L12,11L20,6M20,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6C22,4.89 21.1,4 20,4Z"/>
                        </svg>
                        Enquire Now
                    </a>
                </div>
            </div>
        `;

        // Ensure Layout is correct
        container.style.display = 'grid';
        container.style.gridTemplateColumns = window.innerWidth <= 768 ? '1fr' : '1fr 1fr';
        container.style.gap = '50px';
        container.style.alignItems = 'start';

        // Initialize thumbnail clicks
        this.initThumbnailClicks();

        // Initialize variant selector
        this.initVariantSelector();
    },

    initThumbnailClicks() {
        const thumbnails = document.querySelectorAll('.thumbnail');
        const mainImage = document.getElementById('mainProductImage');

        thumbnails.forEach(thumb => {
            thumb.addEventListener('click', () => {
                thumbnails.forEach(t => t.classList.remove('active'));
                thumb.classList.add('active');
                if (mainImage) {
                    mainImage.src = thumb.dataset.img;
                }
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
            });
        });
    }
};

export default ProductsModule;