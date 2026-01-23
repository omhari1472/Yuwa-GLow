import API from '../../../js/api.js';
import CONFIG from '../../../js/config.js';
import UI from '../utils.js';

const ApplicationsAdminModule = {
    apps: [],

    async init() {
        this.checkAuth();
        await this.loadApplications();
    },

    checkAuth() {
        if (!localStorage.getItem('admin_token')) {
            window.location.href = '../login.html';
        }
    },

    async loadApplications() {
        const res = await API.admin.applications.list();
        if (res.success) {
            this.apps = res.data.data;
            this.renderApplications();
        }
    },

    renderApplications() {
        const container = document.getElementById('applications-list');
        if (!container) return;

        if (this.apps.length === 0) {
            container.innerHTML = '<tr><td colspan="6" class="text-center">No applications found</td></tr>';
            return;
        }

        container.innerHTML = this.apps.map(app => `
            <tr>
                <td><span class="badge badge-${app.application_type}">${app.application_type.toUpperCase()}</span></td>
                <td><strong>${app.name}</strong><br><small>${app.email}</small></td>
                <td>${app.phone}</td>
                <td>${app.application_type === 'career' ? (app.career?.title || 'Job Posting') : app.state}</td>
                <td><span class="status ${app.status}">${app.status}</span></td>
                <td>
                    <button class="btn-icon" onclick="window.AppsAdmin.viewDetails(${app.id})" title="View Details">
                        <svg style="width:18px;height:18px" viewBox="0 0 24 24"><path fill="currentColor" d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z" /></svg>
                    </button>
                </td>
            </tr>
        `).join('');
    },

    viewDetails(id) {
        const app = this.apps.find(a => a.id === id);
        if (!app) return;

        const content = document.getElementById('app-modal-content');
        const footer = document.getElementById('app-modal-footer');

        content.innerHTML = `
            <div class="detail-grid">
                <div class="detail-item"><strong>Applicant:</strong> ${app.name}</div>
                <div class="detail-item"><strong>Email:</strong> ${app.email}</div>
                <div class="detail-item"><strong>Phone:</strong> ${app.phone}</div>
                <div class="detail-item"><strong>Type:</strong> ${app.application_type.toUpperCase()}</div>
                ${app.application_type === 'career' ? `
                    <div class="detail-item"><strong>Job Position:</strong> ${app.career?.title || 'N/A'}</div>
                    <div class="detail-item"><strong>Resume:</strong> <a href="${CONFIG.STORAGE_URL}${app.resume_url}" target="_blank" class="btn btn-text">Download Resume</a></div>
                ` : `
                    <div class="detail-item"><strong>State:</strong> ${app.state}</div>
                    <div class="detail-item"><strong>District/Address:</strong> ${app.district || app.address}</div>
                `}
                <div class="detail-item"><strong>Submitted:</strong> ${new Date(app.created_at).toLocaleString()}</div>
            </div>
        `;

        footer.innerHTML = `
            <button class="btn btn-secondary" onclick="window.AppsAdmin.closeModal()">Close</button>
            ${app.status === 'pending' ? `
                <button class="btn btn-primary" style="background:#ef4444" onclick="window.AppsAdmin.updateStatus(${app.id}, 'rejected')">Reject</button>
                <button class="btn btn-primary" onclick="window.AppsAdmin.updateStatus(${app.id}, 'approved')">Approve</button>
            ` : ''}
        `;

        UI.modal.open('app-modal');
    },

    async updateStatus(id, status) {
        const res = await API.admin.applications.updateStatus(id, status);
        if (res.success) {
            this.closeModal();
            this.loadApplications();
            alert(`Application ${status} successfully.`);
        }
    },

    closeModal() {
        UI.modal.close('app-modal');
    }
};

window.AppsAdmin = ApplicationsAdminModule;
export default ApplicationsAdminModule;