import API from '../api.js';
import CONFIG from '../config.js';

const BlogsModule = {
    async init() {
        const blogGrid = document.querySelector('.blog-grid');
        if (!blogGrid) return;

        try {
            const res = await API.getBlogs();
            if (res.success) {
                // Access data from standardized wrapper
                const blogs = res.data.data || res.data || [];
                
                if (blogs.length === 0) {
                    this.renderEmpty(blogGrid);
                } else {
                    this.renderList(blogGrid, blogs);
                }
            }
        } catch (error) {
            console.error('Error loading blogs:', error);
        }
    },

    renderList(container, blogs) {
        container.innerHTML = blogs.map(blog => `
            <article class="blog-card fade-in">
                <div class="blog-image">
                    <img src="${blog.featured_image ? CONFIG.STORAGE_URL + blog.featured_image : 'assets/images/blog-placeholder.jpg'}" alt="${blog.title}" onerror="this.src='assets/images/placeholder.png'">
                </div>
                <div class="blog-content">
                    <p class="blog-date">${new Date(blog.created_at).toLocaleDateString()}</p>
                    <h2 class="blog-title"><a href="blog-details.html?slug=${blog.slug}">${blog.title}</a></h2>
                    <p class="blog-excerpt">${blog.content.substring(0, 120).replace(/<[^>]*>?/gm, '')}...</p>
                    <a href="blog-details.html?slug=${blog.slug}" class="read-more">Read Full Story</a>
                </div>
            </article>
        `).join('');
    },

    renderEmpty(container) {
        container.innerHTML = `
            <div class="container section-padding text-center" style="grid-column: 1 / -1; padding: 100px 0;">
                <h3 style="font-size: 24px; color: var(--dark-text);">The Journal is being updated</h3>
                <p style="color: #6b7280; margin-top: 10px;">Our latest beauty stories and trends are coming soon.</p>
            </div>
        `;
    }
};

export default BlogsModule;