import API from '../../../js/api.js';
import CONFIG from '../../../js/config.js';
import UI from '../utils.js';

const ApplicationsAdminModule = {
    apps: [],
    filteredApps: [],
    currentPage: 1,
    perPage: 10,
    currentType: null,

    async init(initialType = null) {
        this.currentType = initialType;
        this.checkAuth();
        await this.loadApplications();
        this.initSearchFilter();
    },

    initSearchFilter() {
        const typeFilter = {
            key: 'application_type',
            label: 'All Types',
            options: [
                { value: 'career', text: 'Career' },
                { value: 'distributor', text: 'Distributor' },
                { value: 'super_stockist', text: 'Super Stockist' }
            ]
        };

        const filters = [
            {
                key: 'status',
                label: 'All Status',
                options: [
                    { value: 'pending', text: 'Pending' },
                    { value: 'approved', text: 'Approved' },
                    { value: 'rejected', text: 'Rejected' }
                ]
            }
        ];

        // Only add type filter if we are on the main 'All Applications' view
        if (!this.currentType) {
            filters.unshift(typeFilter);
        }

        UI.initSearchFilter('application-search', {
            placeholder: 'Search by name, email, location...',
            filters: filters,
            onSearch: (term, filters) => {
                this.filteredApps = UI.filterItems(this.apps, term, filters, ['name', 'email', 'phone', 'state', 'district']);
                this.currentPage = 1;
                this.renderApplications();
                UI.updateSearchCount('application-search', this.filteredApps.length, this.apps.length);
            }
        });
        UI.updateSearchCount('application-search', this.apps.length, this.apps.length);
    },

    checkAuth() {
        if (!localStorage.getItem('admin_token')) {
            window.location.href = '../index.html';
        }
    },

    async loadApplications() {
        UI.loading.table('applications-list', 5, 6);
        const res = await API.admin.applications.list();
        if (res.success) {
            let allApps = res.data.data || [];
            
            // Filter based on page context
            if (this.currentType === 'career') {
                allApps = allApps.filter(a => a.application_type === 'career');
            } else if (this.currentType === 'partner') {
                allApps = allApps.filter(a => ['distributor', 'super_stockist'].includes(a.application_type));
            }

            this.apps = allApps;
            this.filteredApps = [...this.apps];
            this.renderApplications();
        }
    },

    renderApplications() {
        const container = document.getElementById('applications-list');
        if (!container) return;

        if (this.filteredApps.length === 0) {
            UI.renderEmptyState('applications-list', {
                icon: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12,3L1 9l11 6 9-4.5V12h-2V10l-7 3.5-9-4.5 9-5 9 4.5V9H23V9l-11-6z"/></svg>',
                title: this.apps.length === 0 ? 'No Pending Applications' : 'No Matching Applications',
                message: this.apps.length === 0 ? 'All quiet on the partner front. When new candidates or business partners apply, they will appear here for review.' : 'Try adjusting your search or filters.'
            });
            const paginationEl = document.getElementById('application-pagination');
            if (paginationEl) paginationEl.innerHTML = '';
            return;
        }

        const { data: items, meta } = UI.pagination.paginate(this.filteredApps, this.currentPage, this.perPage);

        container.innerHTML = items.map(app => {
            const isPartner = ['distributor', 'super_stockist'].includes(app.application_type);
            const photoThumb = isPartner && app.photo_url
                ? `<img src="${CONFIG.STORAGE_URL}${app.photo_url}" class="table-thumb-round" alt="${app.name}">`
                : `<div class="table-avatar-placeholder">${app.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}</div>`;

            return `
                <tr>
                    <td><span class="badge badge-${app.application_type}">${app.application_type.replace('_', ' ').toUpperCase()}</span></td>
                    <td>
                        <div class="user-info-with-photo">
                            ${photoThumb}
                            <div class="user-info">
                                <strong>${app.company_name || app.name}</strong>
                                <span>${app.email}</span>
                            </div>
                        </div>
                    </td>
                    <td>${app.phone}</td>
                    <td>${app.application_type === 'career' ? (app.career?.title || 'Job Posting') : `${app.state}, ${app.district || 'N/A'}`}</td>
                    <td><span class="status ${app.status}">${app.status}</span></td>
                    <td>
                        <button class="btn-icon" onclick="window.AppsAdmin.viewDetails(${app.id})" title="View Details">
                            <svg style="width:18px;height:18px" viewBox="0 0 24 24"><path fill="currentColor" d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z" /></svg>
                        </button>
                    </td>
                </tr>
            `;
        }).join('');

        UI.pagination.render('application-pagination', meta, (page) => {
            this.currentPage = page;
            this.renderApplications();
        });
    },

    viewDetails(id) {
        const app = this.apps.find(a => a.id === id);
        if (!app) return;

        const content = document.getElementById('app-modal-content');
        const footer = document.getElementById('app-modal-footer');
        const isPartner = ['distributor', 'super_stockist'].includes(app.application_type);

        // Build photo section for partners
        const photoSection = isPartner && app.photo_url ? `
            <div class="detail-photo">
                <img src="${CONFIG.STORAGE_URL}${app.photo_url}" alt="${app.name}" class="partner-detail-photo">
            </div>
        ` : '';

        content.innerHTML = `
            ${photoSection}
            <div class="detail-grid">
                <div class="detail-item"><strong>Applicant Name</strong>${app.name}</div>
                <div class="detail-item"><strong>Email Address</strong>${app.email}</div>
                <div class="detail-item"><strong>Phone Number</strong>${app.phone}</div>
                <div class="detail-item"><strong>Application Type</strong>${app.application_type.replace('_', ' ').toUpperCase()}</div>
                ${app.application_type === 'career' ? `
                    <div class="detail-item"><strong>Job Position</strong>${app.career?.title || 'N/A'}</div>
                    <div class="detail-item"><strong>Documents</strong><br><a href="${CONFIG.STORAGE_URL}${app.resume_url}" target="_blank" class="btn-text">View Resume PDF</a></div>
                ` : `
                    ${app.company_name ? `<div class="detail-item"><strong>Firm Name</strong>${app.company_name}</div>` : ''}
                    <div class="detail-item"><strong>State</strong>${app.state}</div>
                    <div class="detail-item"><strong>District</strong>${app.district || 'N/A'}</div>
                    ${app.address ? `<div class="detail-item full-width"><strong>Address</strong>${app.address}</div>` : ''}
                `}
                <div class="detail-item"><strong>Current Status</strong><span class="status ${app.status}">${app.status}</span></div>
                <div class="detail-item"><strong>Submission Date</strong>${new Date(app.created_at).toLocaleString()}</div>
            </div>
        `;

        // Build footer buttons based on status
        let footerButtons = `<button class="btn btn-secondary" onclick="window.AppsAdmin.closeModal()">Close</button>`;

        if (app.status === 'pending') {
            footerButtons += `
                <button class="btn btn-danger" onclick="window.AppsAdmin.updateStatus(${app.id}, 'rejected')">Reject</button>
                <button class="btn btn-primary" onclick="window.AppsAdmin.updateStatus(${app.id}, 'approved')">${app.application_type === 'career' ? 'Approve Candidate' : 'Approve Partner'}</button>
            `;
        } else if (app.status === 'approved' && isPartner) {
            footerButtons += `
                <button class="btn btn-warning" onclick="window.AppsAdmin.revokePartner(${app.id})">Revoke Partnership</button>
            `;
        } else if (app.status === 'rejected') {
            footerButtons += `
                <button class="btn btn-primary" onclick="window.AppsAdmin.updateStatus(${app.id}, 'approved')">Re-Approve</button>
            `;
        }

        footer.innerHTML = footerButtons;

        UI.modal.open('app-modal');
    },

    async revokePartner(id) {
        UI.confirm({
            title: 'Revoke Partnership',
            message: 'Are you sure you want to revoke this partnership? The slot will become available for new applications.',
            onConfirm: async () => {
                try {
                    const res = await API.admin.applications.updateStatus(id, 'rejected');
                    if (res.success) {
                        this.closeModal();
                        this.loadApplications();
                        UI.notify('Partnership revoked successfully');
                    } else {
                        UI.notify(res.message || 'Failed to revoke partnership', 'error');
                    }
                } catch (error) {
                    UI.notify(error.message || 'A system error occurred', 'error');
                }
            }
        });
    },

    async updateStatus(id, status) {
        try {
            const res = await API.admin.applications.updateStatus(id, status);
            if (res.success) {
                this.closeModal();
                this.loadApplications();
                UI.notify('Status updated successfully');
            } else {
                UI.notify(res.message || 'Failed to update status', 'error');
            }
        } catch (error) {
            UI.notify(error.message || 'A system error occurred', 'error');
        }
    },

    closeModal() {
        UI.modal.close('app-modal');
    }
};

window.AppsAdmin = ApplicationsAdminModule;
export default ApplicationsAdminModule;
