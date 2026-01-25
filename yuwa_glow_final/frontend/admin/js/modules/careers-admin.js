import API from '../../../js/api.js';
import UI from '../utils.js';

const CareersAdminModule = {
    careers: [],
    filteredCareers: [],
    quillEditor: null,
    currentPage: 1,
    perPage: 10,
    async init() {
        this.checkAuth();
        this.initQuillEditor();
        this.initEventListeners();
        await this.loadCareers();
        this.initStatusDropdown();
        this.initSearchFilter();
    },

    initQuillEditor() {
        this.quillEditor = new Quill('#editor-container', {
            theme: 'snow',
            placeholder: 'Outline responsibilities...',
            modules: {
                toolbar: [
                    [{ 'header': [1, 2, false] }],
                    ['bold', 'italic', 'underline'],
                    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                    ['clean']
                ]
            }
        });
    },

    initSearchFilter() {
        UI.initSearchFilter('career-search', {
            placeholder: 'Search by title, department, location...',
            filters: [
                {
                    key: 'status',
                    label: 'All Status',
                    options: [
                        { value: 'open', text: 'Open' },
                        { value: 'closed', text: 'Closed' }
                    ]
                }
            ],
            onSearch: (term, filters) => {
                this.filteredCareers = UI.filterItems(this.careers, term, filters, ['title', 'department', 'location']);
                this.currentPage = 1;
                this.render();
                UI.updateSearchCount('career-search', this.filteredCareers.length, this.careers.length);
            }
        });
        UI.updateSearchCount('career-search', this.careers.length, this.careers.length);
    },
    checkAuth() { if (!localStorage.getItem('admin_token')) window.location.href = '../login.html'; },
    async loadCareers() {
        UI.loading.table('careers-list', 5, 5);
        const res = await API.admin.careers.list();
        if (res.success) {
            this.careers = res.data.data || [];
            this.filteredCareers = [...this.careers];
            this.render();
        }
    },

    initStatusDropdown(selectedValue = 'open') {
        UI.initDropdown('career-status-dropdown', [
            { value: 'open', text: 'Open (Active)', selected: selectedValue === 'open' },
            { value: 'closed', text: 'Closed (Archive)', selected: selectedValue === 'closed' }
        ]);
    },

    render() {
        const container = document.getElementById('careers-list');
        if (!container) return;

        if (this.filteredCareers.length === 0) {
            UI.renderEmptyState('careers-list', {
                icon: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 3L1 9l11 6 9-4.5V12h-2V10l-7 3.5-9-4.5 9-5 9 4.5V9H23V9l-11-6z"/></svg>',
                title: this.careers.length === 0 ? 'No Job Openings' : 'No Matching Openings',
                message: this.careers.length === 0 ? 'Grow your team. Post your first opening.' : 'Try adjusting your search or filters.',
                btnText: this.careers.length === 0 ? 'Add Opening' : null,
                btnId: 'empty-career-btn'
            });
            if (this.careers.length === 0) {
                document.getElementById('empty-career-btn')?.addEventListener('click', () => this.openAddModal());
            }
            const paginationEl = document.getElementById('career-pagination');
            if (paginationEl) paginationEl.innerHTML = '';
            return;
        }

        const { data: items, meta } = UI.pagination.paginate(this.filteredCareers, this.currentPage, this.perPage);

        container.innerHTML = items.map(c => `
            <tr>
                <td><strong>${c.title}</strong></td>
                <td>${c.department}</td>
                <td>${c.location}</td>
                <td><span class="status ${c.status}">${c.status}</span></td>
                <td>
                    <button class="btn-icon" onclick="window.CareerAdmin.openEditModal(${c.id})"><svg style="width:18px;height:18px" viewBox="0 0 24 24"><path fill="currentColor" d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" /></svg></button>
                    <button class="btn-icon btn-delete" onclick="window.CareerAdmin.delete(${c.id})"><svg style="width:18px;height:18px" viewBox="0 0 24 24"><path fill="currentColor" d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19V4M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" /></svg></button>
                </td>
            </tr>
        `).join('');

        UI.pagination.render('career-pagination', meta, (page) => {
            this.currentPage = page;
            this.render();
        });
    },
    initEventListeners() {
        document.getElementById('open-add-modal')?.addEventListener('click', () => this.openAddModal());
        document.getElementById('career-form').onsubmit = async (e) => {
            e.preventDefault();
            
            // Get content from Quill editor
            const content = this.quillEditor.root.innerHTML;
            if (!content || content === '<p><br></p>') {
                UI.notify('Please add a description', 'error');
                return;
            }
            document.getElementById('c-desc').value = content;

            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());
            const id = document.getElementById('career-id').value;
            let res = id ? await API.admin.careers.update(id, data) : await API.admin.careers.create(data);
            if (res.success) { UI.modal.close('career-modal'); await this.loadCareers(); UI.notify('Saved!'); }
            else { UI.notify(res.message, 'error'); }
        };
    },
    openAddModal() {
        document.getElementById('career-form').reset();
        document.getElementById('career-id').value = '';
        this.quillEditor.setContents([]);
        this.initStatusDropdown('open');
        UI.modal.open('career-modal');
    },
    openEditModal(id) {
        const c = this.careers.find(x => x.id === id);
        if (!c) return;
        document.getElementById('career-id').value = c.id;
        document.getElementById('c-title').value = c.title;
        document.getElementById('c-dept').value = c.department;
        document.getElementById('c-loc').value = c.location;
        document.getElementById('c-desc').value = c.description;
        this.quillEditor.root.innerHTML = c.description || '';
        this.initStatusDropdown(c.status);
        UI.modal.open('career-modal');
    },
    closeModal() { UI.modal.close('career-modal'); },
    async delete(id) {
        UI.confirm({
            title: 'Delete Opening',
            message: 'Are you sure?',
            onConfirm: async () => {
                const res = await API.admin.careers.delete(id);
                if (res.success) { await this.loadCareers(); UI.notify('Deleted'); }
            }
        });
    }
};
window.CareerAdmin = CareersAdminModule;
export default CareersAdminModule;
