import API from '../api.js';
import CONFIG from '../config.js';

const BlogsModule = {
    async init() {
        const blogGrid = document.querySelector('.blog-grid');
        if (!blogGrid) return;

        const res = await API.getBlogs();
        if (res.success) {
            this.renderList(blogGrid, res.data);
        }
    },

    renderList(container, blogs) {
        container.innerHTML = blogs.map(blog => `
            <article class="blog-card fade-in">
                <div class="blog-image">
                    <img src="${blog.featured_image ? CONFIG.STORAGE_URL + blog.featured_image : 'assets/images/blog-placeholder.jpg'}" alt="${blog.title}">
                </div>
                <div class="blog-content">
                    <p class="blog-date">${new Date(blog.created_at).toLocaleDateString()}</p>
                    <h2 class="blog-title"><a href="blog-details.html?slug=${blog.slug}">${blog.title}</a></h2>
                    <p class="blog-excerpt">${blog.content.substring(0, 120).replace(/<[^>]*>?/gm, '')}...</p>
                    <a href="blog-details.html?slug=${blog.slug}" class="read-more">Read Full Story</a>
                </div>
            </article>
        `).join('');
    }
};

export default BlogsModule;
