document.addEventListener('DOMContentLoaded', async () => {
    const galleryGrid = document.querySelector('.gallery-grid');
    if (!galleryGrid) return;

    try {
        const items = await API.getGallery();
        
        galleryGrid.innerHTML = items.map(item => `
            <div class="gallery-item fade-in">
                ${item.type === 'image' 
                    ? `<img src="/backend/storage/app/public/${item.media_url}" alt="${item.title}">`
                    : `<iframe src="${item.media_url}" title="${item.title}" frameborder="0" allowfullscreen></iframe>`
                }
                <div class="gallery-overlay">
                    <p>${item.title}</p>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading gallery:', error);
    }
});
