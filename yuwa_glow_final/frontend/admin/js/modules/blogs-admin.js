import API from '../../../js/api.js';
import CONFIG from '../../../js/config.js';
import UI from '../utils.js';

const BlogsAdminModule = {
    blogs: [],
    async init() {
        this.checkAuth();
        this.initEventListeners();
        await this.loadBlogs();
    },
    checkAuth() { if (!localStorage.getItem('admin_token')) window.location.href = '../login.html'; },
    async loadBlogs() {
        const res = await API.admin.blogs.list();
        if (res.success) { this.blogs = res.data.data; this.render(); }
    },
    render() {
        const container = document.getElementById('blogs-list');
        if (!container) return;

        if (this.blogs.length === 0) {
            UI.renderEmptyState('blogs-list', {
                icon: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M4,5v14h16V5H4M4,3h16c1.1,0 2,0.9 2,2v14c0,1.1-0.9,2-2,2H4c-1.1,0-2-0.9-2-2V5C2,3.9 2.9,3 4,3z M9,7h6v2H9V7z M9,11h6v2H9V11z M7,15h10v2H7V15z" /></svg>',
                title: 'No Blog Posts',
                message: 'Share beauty tips and stories by creating your first blog post.',
                btnText: 'Write New Post',
                btnId: 'empty-blog-btn'
            });
            document.getElementById('empty-blog-btn')?.addEventListener('click', () => this.openAddModal());
            return;
        }

        container.innerHTML = this.blogs.map(blog => `
            <tr>
                <td><img src="${blog.featured_image ? CONFIG.STORAGE_URL + blog.featured_image : '../../assets/images/placeholder.png'}" class="table-thumb"></td>
                <td><strong>${blog.title}</strong></td>
                <td><span class="status ${blog.status}">${blog.status}</span></td>
                <td>${new Date(blog.created_at).toLocaleDateString()}</td>
                <td>
                    <button class="btn-icon" onclick="window.BlogAdmin.openEditModal(${blog.id})">
                        <svg style="width:18px;height:18px" viewBox="0 0 24 24"><path fill="currentColor" d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" /></svg>
                    </button>
                    <button class="btn-icon btn-delete" onclick="window.BlogAdmin.delete(${blog.id})">
                        <svg style="width:18px;height:18px" viewBox="0 0 24 24"><path fill="currentColor" d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19V4M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" /></svg>
                    </button>
                </td>
            </tr>
        `).join('');
    },
    initEventListeners() {
        document.getElementById('open-add-modal')?.addEventListener('click', () => this.openAddModal());
        
        const imageInput = document.getElementById('blog-image-upload');
        if (imageInput) {
            imageInput.onchange = () => {
                const preview = document.getElementById('blog-image-preview');
                preview.innerHTML = '';
                if (imageInput.files[0]) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        const img = document.createElement('img');
                        img.src = e.target.result;
                        img.className = 'preview-item';
                        preview.appendChild(img);
                    };
                    reader.readAsDataURL(imageInput.files[0]);
                }
            };
        }

        document.getElementById('blog-form').onsubmit = async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const id = document.getElementById('blog-id').value;
            
            let res;
            if (id) {
                formData.append('_method', 'PATCH');
                res = await API.admin.blogs.update(id, formData);
            } else {
                res = await API.admin.blogs.create(formData);
            }
            if (res.success) { UI.modal.close('blog-modal'); this.loadBlogs(); }
        };
    },
    openAddModal() { 
        document.getElementById('blog-form').reset(); 
        document.getElementById('blog-id').value = ''; 
        document.getElementById('blog-image-preview').innerHTML = '';
        UI.modal.open('blog-modal'); 
    },
    openEditModal(id) {
        const b = this.blogs.find(x => x.id === id);
        if (!b) return;
        document.getElementById('blog-id').value = b.id;
        document.getElementById('b-title').value = b.title;
        document.getElementById('b-content').value = b.content;
        document.getElementById('b-status').value = b.status;
        UI.modal.open('blog-modal');
    },
    async delete(id) {
        UI.confirm({
            title: 'Delete Blog Post',
            message: 'Are you sure you want to remove this story from your editorial list?',
            onConfirm: async () => {
                await API.admin.blogs.delete(id);
                this.loadBlogs();
            }
        });
    }
};
window.BlogAdmin = BlogsAdminModule;
export default BlogsAdminModule;
