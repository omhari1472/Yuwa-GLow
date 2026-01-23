document.addEventListener('DOMContentLoaded', async () => {
    const blogGrid = document.querySelector('.blog-grid');
    if (!blogGrid) return;

    try {
        const blogs = await API.getBlogs();
        
        blogGrid.innerHTML = blogs.map(blog => `
            <article class="blog-card fade-in">
                <div class="blog-image">
                    <img src="${blog.featured_image ? '/backend/storage/app/public/' + blog.featured_image : 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2670&auto=format&fit=crop'}" alt="${blog.title}">
                </div>
                <div class="blog-content">
                    <p class="blog-date">${new Date(blog.created_at).toLocaleDateString()}</p>
                    <h2 class="blog-title"><a href="blog-details.html?slug=${blog.slug}">${blog.title}</a></h2>
                    <p class="blog-excerpt">${blog.content.substring(0, 150).replace(/<[^>]*>?/gm, '')}...</p>
                    <a href="blog-details.html?slug=${blog.slug}" class="read-more">Read Full Story</a>
                </div>
            </article>
        `).join('');
    } catch (error) {
        console.error('Error loading blogs:', error);
    }
});
