document.addEventListener('DOMContentLoaded', async () => {
    const productGridContainer = document.querySelector('main');
    
    try {
        const products = await API.getProducts();
        const categories = await API.getCategories();

        // Clear existing static sections if you want, or just append
        // For this implementation, let's group products by category dynamically
        
        let htmlContent = `
            <section class="page-header fade-in">
                <div class="container">
                    <h1>Our Collection</h1>
                    <p>Experience the science of radiance.</p>
                </div>
            </section>
        `;

        categories.forEach(category => {
            const categoryProducts = products.filter(p => p.category_id === category.id);
            
            if (categoryProducts.length > 0) {
                htmlContent += `
                    <section id="cat-${category.id}" class="container section-padding">
                        <h2 class="section-title fade-in">${category.name}</h2>
                        <div class="product-grid">
                            ${categoryProducts.map(product => `
                                <div class="product-card fade-in">
                                    <a href="product-details.html?id=${product.id}" class="product-image-link">
                                        <img src="${product.images[0] ? '/backend/storage/app/public/' + product.images[0].image_url : 'assets/images/placeholder.png'}" alt="${product.name}">
                                    </a>
                                    <div class="product-info">
                                        <h3 class="product-title"><a href="product-details.html?id=${product.id}">${product.name}</a></h3>
                                        <p class="product-description">${product.description.substring(0, 100)}...</p>
                                        <p class="product-price">$${product.price}</p>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </section>
                `;
            }
        });

        productGridContainer.innerHTML = htmlContent;

    } catch (error) {
        console.error('Error loading products:', error);
    }
});
