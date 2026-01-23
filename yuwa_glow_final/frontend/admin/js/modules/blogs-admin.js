import API from '../../../js/api.js';
import CONFIG from '../../../js/config.js';
import UI from '../utils.js';

const BlogsAdminModule = {
    blogs: [],

    async init() {
        this.checkAuth();
        await this.loadBlogs();
        this.initEventListeners();
    },

    checkAuth() {
        if (!localStorage.getItem('admin_token')) {
            window.location.href = '../login.html';
        }
    },

    async loadBlogs() {
        const res = await API.admin.blogs.list(); // Need to add to api.js
        if (res.success) {
            this.blogs = res.data.data;
            this.render();
        }
    },

    render() {
        const container = document.getElementById('blogs-list');
        if (!container) return;

        container.innerHTML = this.blogs.map(blog => `
            <tr>
                <td><img src="${blog.featured_image ? CONFIG.STORAGE_URL + blog.featured_image : '../../assets/images/placeholder.png'}" class="table-thumb"></td>
                <td><strong>${blog.title}</strong></td>
                <td><span class="status ${blog.status}">${blog.status}</span></td>
                <td>${new Date(blog.created_at).toLocaleDateString()}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-icon" onclick="window.BlogAdmin.openEditModal(${blog.id})">
                            <svg style="width:18px;height:18px" viewBox="0 0 24 24"><path fill="currentColor" d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" /></svg>
                        </button>
                        <button class="btn-icon btn-delete" onclick="window.BlogAdmin.delete(${blog.id})">
                            <svg style="width:18px;height:18px" viewBox="0 0 24 24"><path fill="currentColor" d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19V4M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" /></svg>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    },

    initEventListeners() {
        const addBtn = document.getElementById('open-add-modal');
        if (addBtn) addBtn.onclick = () => this.openAddModal();

        const form = document.getElementById('blog-form');
        if (form) {
            form.onsubmit = async (e) => {
                e.preventDefault();
                const formData = new FormData(form);
                const id = document.getElementById('blog-id').value;

                let res;
                if (id) {
                    formData.append('_method', 'PATCH');
                    res = await API.admin.blogs.update(id, formData);
                } else {
                    res = await API.admin.blogs.create(formData);
                }

                if (res.success) {
                    this.closeModal();
                    this.loadBlogs();
                    alert('Blog post saved!');
                }
            };
        }
    },

    openAddModal() {
        document.getElementById('blog-form').reset();
        document.getElementById('blog-id').value = '';
        document.getElementById('modal-title').innerText = 'Write New Blog';
        UI.modal.open('blog-modal');
    },

    openEditModal(id) {
        const blog = this.blogs.find(b => b.id === id);
        if (!blog) return;

        document.getElementById('blog-id').value = blog.id;
        document.getElementById('b-title').value = blog.title;
        document.getElementById('b-content').value = blog.content;
        document.getElementById('b-status').value = blog.status;
        
        document.getElementById('modal-title').innerText = 'Edit Blog Post';
        UI.modal.open('blog-modal');
    },

    async delete(id) {
        if (confirm('Delete this blog post?')) {
            const res = await API.admin.blogs.delete(id);
            if (res.success) this.loadBlogs();
        }
    },

    closeModal() {
        UI.modal.close('blog-modal');
    }
};

window.BlogAdmin = BlogsAdminModule;
export default BlogsAdminModule;
