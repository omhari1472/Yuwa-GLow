import API from '../../../js/api.js';
import CONFIG from '../../../js/config.js';
import UI from '../utils.js';

const BlogsAdminModule = {
    blogs: [],
    filteredBlogs: [],
    quillEditor: null,
    currentPage: 1,
    perPage: 10,

    async init() {
        this.checkAuth();
        this.initQuillEditor();
        this.initEventListeners();
        await this.loadBlogs();
        this.initStatusDropdown();
        this.initSearchFilter();
    },

    initSearchFilter() {
        UI.initSearchFilter('blog-search', {
            placeholder: 'Search blogs by title...',
            filters: [
                {
                    key: 'status',
                    label: 'All Status',
                    options: [
                        { value: 'draft', text: 'Draft' },
                        { value: 'published', text: 'Published' }
                    ]
                }
            ],
            onSearch: (term, filters) => {
                this.filteredBlogs = UI.filterItems(this.blogs, term, filters, ['title', 'content']);
                this.currentPage = 1;
                this.render();
                UI.updateSearchCount('blog-search', this.filteredBlogs.length, this.blogs.length);
            }
        });
        UI.updateSearchCount('blog-search', this.blogs.length, this.blogs.length);
    },

    checkAuth() { if (!localStorage.getItem('admin_token')) window.location.href = '../login.html'; },

    initQuillEditor() {
        // Initialize Quill rich text editor
        this.quillEditor = new Quill('#editor-container', {
            theme: 'snow',
            placeholder: 'Write your story here...',
            modules: {
                toolbar: [
                    [{ 'header': [1, 2, 3, false] }],
                    ['bold', 'italic', 'underline', 'strike'],
                    [{ 'color': [] }, { 'background': [] }],
                    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                    [{ 'align': [] }],
                    ['blockquote', 'code-block'],
                    ['link', 'image'],
                    ['clean']
                ]
            }
        });
    },

    async loadBlogs() {
        UI.loading.table('blogs-list', 5, 5);
        const res = await API.admin.blogs.list();
        if (res.success) {
            this.blogs = res.data.data || [];
            this.filteredBlogs = [...this.blogs];
            this.render();
        }
    },

    initStatusDropdown(selectedValue = 'draft') {
        UI.initDropdown('blog-status-dropdown', [
            { value: 'draft', text: 'Draft (Private)', selected: selectedValue === 'draft' },
            { value: 'published', text: 'Published (Live)', selected: selectedValue === 'published' }
        ]);
    },

    render() {
        const container = document.getElementById('blogs-list');
        if (!container) return;

        if (this.filteredBlogs.length === 0) {
            UI.renderEmptyState('blogs-list', {
                icon: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M4,5v14h16V5H4M4,3h16c1.1,0 2,0.9 2,2v14c0,1.1-0.9,2-2,2H4c-1.1,0-2-0.9-2-2V5C2,3.9 2.9,3 4,3z M9,7h6v2H9V7z M9,11h6v2H9V11z M7,15h10v2H7V15z" /></svg>',
                title: this.blogs.length === 0 ? 'No Blog Posts' : 'No Matching Posts',
                message: this.blogs.length === 0 ? 'Share beauty tips and stories.' : 'Try adjusting your search or filters.',
                btnText: this.blogs.length === 0 ? 'Write New Post' : null,
                btnId: 'empty-blog-btn'
            });
            if (this.blogs.length === 0) {
                document.getElementById('empty-blog-btn')?.addEventListener('click', () => this.openAddModal());
            }
            const paginationEl = document.getElementById('blog-pagination');
            if (paginationEl) paginationEl.innerHTML = '';
            return;
        }

        const { data: items, meta } = UI.pagination.paginate(this.filteredBlogs, this.currentPage, this.perPage);

        container.innerHTML = items.map(blog => `
            <tr>
                <td><img src="${blog.featured_image ? CONFIG.STORAGE_URL + blog.featured_image : '../../assets/images/placeholder.png'}" class="table-thumb"></td>
                <td><strong>${blog.title}</strong></td>
                <td><span class="status ${blog.status}">${blog.status}</span></td>
                <td>${new Date(blog.created_at).toLocaleDateString()}</td>
                <td>
                    <button class="btn-icon" onclick="window.BlogAdmin.openEditModal(${blog.id})"><svg style="width:18px;height:18px" viewBox="0 0 24 24"><path fill="currentColor" d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" /></svg></button>
                    <button class="btn-icon btn-delete" onclick="window.BlogAdmin.delete(${blog.id})"><svg style="width:18px;height:18px" viewBox="0 0 24 24"><path fill="currentColor" d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19V4M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" /></svg></button>
                </td>
            </tr>
        `).join('');

        UI.pagination.render('blog-pagination', meta, (page) => {
            this.currentPage = page;
            this.render();
        });
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

            // Get content from Quill editor
            const content = this.quillEditor.root.innerHTML;
            if (!content || content === '<p><br></p>') {
                UI.notify('Please add some content to your post', 'error');
                return;
            }

            // Set content to hidden input
            document.getElementById('b-content').value = content;

            const formData = new FormData(e.target);
            const id = document.getElementById('blog-id').value;
            if (id) formData.append('_method', 'PATCH');

            let res = id ? await API.admin.blogs.update(id, formData) : await API.admin.blogs.create(formData);
            if (res.success) {
                UI.modal.close('blog-modal');
                this.loadBlogs();
                UI.notify('Saved!');
            } else {
                UI.notify(res.message, 'error');
            }
        };
    },

    openAddModal() {
        document.getElementById('blog-form').reset();
        document.getElementById('blog-id').value = '';
        document.getElementById('blog-image-preview').innerHTML = '';
        document.getElementById('modal-title').textContent = 'Create Editorial';
        this.quillEditor.setContents([]);
        this.initStatusDropdown('draft');
        UI.modal.open('blog-modal');
    },

    openEditModal(id) {
        const b = this.blogs.find(x => x.id === id);
        if (!b) return;
        document.getElementById('blog-id').value = b.id;
        document.getElementById('b-title').value = b.title;
        document.getElementById('modal-title').textContent = 'Edit Editorial';

        // Set content in Quill editor
        this.quillEditor.root.innerHTML = b.content || '';

        // Show existing image if present
        const preview = document.getElementById('blog-image-preview');
        if (b.featured_image) {
            preview.innerHTML = `
                <p class="text-muted" style="font-size: 11px; margin-bottom: 5px;">Current image:</p>
                <img src="${CONFIG.STORAGE_URL}${b.featured_image}" class="preview-item" style="max-width: 150px;">
            `;
        } else {
            preview.innerHTML = '';
        }

        this.initStatusDropdown(b.status);
        UI.modal.open('blog-modal');
    },

    async delete(id) {
        UI.confirm({
            title: 'Delete post',
            message: 'Are you sure?',
            onConfirm: async () => {
                const res = await API.admin.blogs.delete(id);
                if (res.success) { this.loadBlogs(); UI.notify('Deleted'); }
            }
        });
    },

    closeModal() { UI.modal.close('blog-modal'); }
};

window.BlogAdmin = BlogsAdminModule;
export default BlogsAdminModule;
