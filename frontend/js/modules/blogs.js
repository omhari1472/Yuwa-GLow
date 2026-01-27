import API from '../api.js';
import CONFIG from '../config.js';

const BlogsModule = {
    async init() {
        const blogGrid = document.querySelector('.blog-grid');
        if (!blogGrid) return;

        this.renderLoading(blogGrid);

        try {
            const res = await API.getBlogs();
            if (res.success) {
                const blogs = res.data?.data || res.data || [];
                
                if (blogs.length === 0) {
                    this.renderEmpty(blogGrid);
                } else {
                    this.renderList(blogGrid, blogs);
                }
            }
        } catch (error) {
            console.error('Blogs Module Error:', error);
        }
    },

    renderList(container, blogs) {
        container.innerHTML = blogs.map(blog => `
            <article class="blog-card fade-in">
                <div class="blog-image" style="height: 250px; overflow: hidden; background: #f5f5f5;">
                    <img src="${blog.featured_image ? CONFIG.STORAGE_URL + blog.featured_image : 'assets/images/placeholder.png'}" alt="${blog.title}" loading="lazy" style="width: 100%; height: 100%; object-fit: cover;">
                </div>
                <div class="blog-content" style="padding: 25px;">
                    <p class="blog-date" style="color: var(--primary-gold); font-size: 13px; font-weight: 600;">${new Date(blog.created_at).toLocaleDateString()}</p>
                    <h2 class="blog-title" style="margin: 10px 0;"><a href="blog-details?slug=${blog.slug}" style="color: #3a3a3a; text-decoration: none;">${blog.title}</a></h2>
                    <p class="blog-excerpt" style="color: #6b7280; font-size: 14px;">${blog.content.substring(0, 120).replace(/<[^>]*>?/gm, '')}...</p>
                    <a href="blog-details?slug=${blog.slug}" class="read-more" style="display: inline-block; margin-top: 15px; color: var(--primary-gold); font-weight: 600;">Read Full Story</a>
                </div>
            </article>
        `).join('');
    },

    renderEmpty(container) {
        container.innerHTML = `<div style="grid-column: 1 / -1; text-align: center; padding: 100px 0;"><h3>The Journal is coming soon</h3></div>`;
    },

    renderLoading(container) {
        // Show skeleton loaders
        const skeletons = Array(3).fill(`
            <article class="blog-card skeleton-card" style="background: white; border-radius: 16px; overflow: hidden;">
                <div class="skeleton" style="height: 250px; border-radius: 0;"></div>
                <div style="padding: 25px;">
                    <div class="skeleton skeleton-text short" style="margin-bottom: 15px;"></div>
                    <div class="skeleton skeleton-text long" style="margin-bottom: 10px;"></div>
                    <div class="skeleton skeleton-text medium" style="margin-bottom: 15px;"></div>
                    <div class="skeleton skeleton-text short"></div>
                </div>
            </article>
        `).join('');
        container.innerHTML = skeletons;
    }
};

export default BlogsModule;