import API from '../api.js';
import CONFIG from '../config.js';

const BlogDetailsModule = {
    blog: null,

    async init() {
        const container = document.querySelector('.blog-post-container');
        if (!container) return;

        const urlParams = new URLSearchParams(window.location.search);
        const slug = urlParams.get('slug');

        if (!slug) {
            this.renderError(container, 'No blog post specified');
            return;
        }

        this.renderLoading(container);

        try {
            const res = await API.getBlog(slug);
            if (res.success && res.data?.data) {
                this.blog = res.data.data;
                this.render(container);
                this.updatePageMeta();
            } else {
                this.renderError(container, 'Blog post not found');
            }
        } catch (error) {
            console.error('Blog Details Error:', error);
            this.renderError(container, 'Failed to load blog post');
        }
    },

    render(container) {
        const blog = this.blog;
        const placeholder = 'assets/images/placeholder.png';
        const featuredImg = blog.featured_image
            ? `${CONFIG.STORAGE_URL}${blog.featured_image}`
            : placeholder;

        const publishedDate = new Date(blog.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        const isoDate = new Date(blog.created_at).toISOString().split('T')[0];

        container.innerHTML = `
            <header class="post-header">
                <p class="blog-category">${blog.category || 'YUVA GLOW'}</p>
                <h1 class="post-title">${blog.title}</h1>
                <p class="post-meta">Published on <time datetime="${isoDate}">${publishedDate}</time></p>
            </header>

            <div class="featured-image">
                <img src="${featuredImg}" alt="${blog.title}" onerror="this.src='${placeholder}'">
            </div>

            <div class="post-content">
                ${this.formatContent(blog.content)}
            </div>

            <div class="post-footer" style="margin-top: 50px; padding-top: 30px; border-top: 1px solid #eee;">
                <a href="blog.html" class="back-link" style="color: var(--primary-gold); font-weight: 600;">
                    &larr; Back to Journal
                </a>
            </div>
        `;
    },

    formatContent(content) {
        // If content already has HTML tags, return as-is
        if (/<[a-z][\s\S]*>/i.test(content)) {
            return content;
        }

        // Otherwise, convert plain text to paragraphs
        return content
            .split('\n\n')
            .filter(p => p.trim())
            .map(p => `<p>${p.trim()}</p>`)
            .join('');
    },

    updatePageMeta() {
        if (this.blog) {
            document.title = `${this.blog.title} | YUVA GLOW Blog`;
            const metaDesc = document.querySelector('meta[name="description"]');
            if (metaDesc) {
                // Strip HTML and limit to 160 characters
                const plainText = this.blog.content.replace(/<[^>]*>/g, '');
                metaDesc.content = plainText.substring(0, 160);
            }
        }
    },

    renderLoading(container) {
        container.innerHTML = `
            <div class="loading-state" style="text-align: center; padding: 100px 0;">
                <div class="loader">Loading article...</div>
            </div>
        `;
    },

    renderError(container, message) {
        container.innerHTML = `
            <div class="error-state" style="text-align: center; padding: 100px 0;">
                <h2>Oops!</h2>
                <p>${message}</p>
                <a href="blog.html" class="cta-button" style="margin-top: 20px;">Browse Journal</a>
            </div>
        `;
    }
};

export default BlogDetailsModule;
