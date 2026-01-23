import API from '../../../js/api.js';
import UI from '../utils.js';

const CareersAdminModule = {
    careers: [],
    async init() {
        this.checkAuth();
        this.initEventListeners();
        await this.loadCareers();
    },
    checkAuth() { if (!localStorage.getItem('admin_token')) window.location.href = '../login.html'; },
    async loadCareers() {
        const res = await API.admin.careers.list();
        if (res.success) { this.careers = res.data.data || []; this.render(); }
    },
    render() {
        const container = document.getElementById('careers-list');
        if (!container) return;

        if (this.careers.length === 0) {
            UI.renderEmptyState('careers-list', {
                icon: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 3L1 9l11 6 9-4.5V12h-2V10l-7 3.5-9-4.5 9-5 9 4.5V9H23V9l-11-6z"/></svg>',
                title: 'No Job Openings',
                message: 'Grow your team. Post your first job opening here.',
                btnText: 'Add Opening',
                btnId: 'empty-career-btn'
            });
            document.getElementById('empty-career-btn')?.addEventListener('click', () => this.openAddModal());
            return;
        }

        container.innerHTML = this.careers.map(c => `
            <tr>
                <td><strong>${c.title}</strong></td>
                <td>${c.department}</td>
                <td>${c.location}</td>
                <td><span class="status ${c.status}">${c.status}</span></td>
                <td>
                    <button class="btn-icon" onclick="window.CareerAdmin.openEditModal(${c.id})">
                        <svg style="width:18px;height:18px" viewBox="0 0 24 24"><path fill="currentColor" d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" /></svg>
                    </button>
                    <button class="btn-icon btn-delete" onclick="window.CareerAdmin.delete(${c.id})">
                        <svg style="width:18px;height:18px" viewBox="0 0 24 24"><path fill="currentColor" d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19V4M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" /></svg>
                    </button>
                </td>
            </tr>
        `).join('');
    },
    initEventListeners() {
        const addBtn = document.getElementById('open-add-modal');
        if (addBtn) addBtn.addEventListener('click', () => this.openAddModal());

        const form = document.getElementById('career-form');
        if (form) {
            form.onsubmit = async (e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const data = Object.fromEntries(formData.entries());
                const id = document.getElementById('career-id').value;
                
                let res = id ? await API.admin.careers.update(id, data) : await API.admin.careers.create(data);
                
                if (res.success) {
                    UI.modal.close('career-modal');
                    await this.loadCareers();
                    UI.notify(`Specification ${id ? 'updated' : 'published'} successfully!`);
                } else {
                    UI.notify(res.message || 'Action failed', 'error');
                }
            };
        }
    },
    openAddModal() {
        const form = document.getElementById('career-form');
        if (form) form.reset();
        document.getElementById('career-id').value = '';
        document.getElementById('modal-title').innerText = 'New Job Specification';
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
        document.getElementById('c-status').value = c.status;
        document.getElementById('modal-title').innerText = 'Edit Specification';
        UI.modal.open('career-modal');
    },
    closeModal() { UI.modal.close('career-modal'); },
    async delete(id) {
        UI.confirm({
            title: 'Delete Opening',
            message: 'Are you sure you want to remove this job specification?',
            onConfirm: async () => {
                const res = await API.admin.careers.delete(id);
                if (res.success) {
                    await this.loadCareers();
                    UI.notify('Job opening deleted successfully');
                } else {
                    UI.notify('Failed to delete opening', 'error');
                }
            }
        });
    }
};
window.CareerAdmin = CareersAdminModule;
export default CareersAdminModule;