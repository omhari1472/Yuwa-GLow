import API from '../../../js/api.js';
import UI from '../utils.js';

const EnquiriesAdminModule = {
    enquiries: [],

    async init() {
        this.checkAuth();
        this.renderLoading();
        await this.loadEnquiries();
    },

    checkAuth() {
        if (!localStorage.getItem('admin_token')) {
            window.location.href = '../login.html';
        }
    },

    renderLoading() {
        const container = document.getElementById('enquiries-list');
        if (container) container.innerHTML = '<tr><td colspan="5" class="text-center">Loading enquiries...</td></tr>';
    },

    async loadEnquiries() {
        const res = await API.admin.enquiries.list();
        if (res.success) {
            // Laravel returns { success: true, data: [...] }
            this.enquiries = res.data.data || [];
        } else {
            this.enquiries = [];
        }
        this.render();
    },

    render() {
        const container = document.getElementById('enquiries-list');
        if (!container) return;

        if (this.enquiries.length === 0) {
            UI.renderEmptyState('enquiries-list', {
                icon: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M20,2H4A2,2 0 0,0 2,4V22L6,18H20A2,2 0 0,0 22,16V4A2,2 0 0,0 20,2M20,16H5.17L4,17.17V4H20V16Z"/></svg>',
                title: 'No Enquiries Found',
                message: 'Your inbox is clear. When customers reach out via the contact form, their messages will appear here.'
            });
            return;
        }

        container.innerHTML = this.enquiries.map(enq => `
            <tr>
                <td>
                    <div class="user-info">
                        <strong>${enq.name}</strong>
                        <span>${enq.email}</span>
                    </div>
                </td>
                <td>${enq.phone || '<span class="text-muted">N/A</span>'}</td>
                <td>${new Date(enq.created_at).toLocaleDateString()}</td>
                <td>
                    <button class="btn-icon" onclick="window.EnqAdmin.view(${enq.id})" title="View Message">
                        <svg style="width:18px;height:18px" viewBox="0 0 24 24"><path fill="currentColor" d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z" /></svg>
                    </button>
                    <button class="btn-icon btn-delete" onclick="window.EnqAdmin.delete(${enq.id})" title="Delete">
                        <svg style="width:18px;height:18px" viewBox="0 0 24 24"><path fill="currentColor" d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19V4M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" /></svg>
                    </button>
                </td>
            </tr>
        `).join('');
    },

    view(id) {
        const enq = this.enquiries.find(e => e.id === id);
        if (!enq) return;

        const content = document.getElementById('enq-modal-content');
        content.innerHTML = `
            <div class="detail-grid">
                <div class="detail-item"><strong>Sender</strong>${enq.name}</div>
                <div class="detail-item"><strong>Email</strong>${enq.email}</div>
                <div class="detail-item"><strong>Phone</strong>${enq.phone || 'N/A'}</div>
                <div class="detail-item"><strong>Date Received</strong>${new Date(enq.created_at).toLocaleString()}</div>
            </div>
            <div class="detail-item" style="margin-top:20px; grid-column: span 2;">
                <strong>Message Content</strong>
                <p style="white-space: pre-wrap; margin-top:10px; color: var(--dark-text); line-height: 1.6;">${enq.message}</p>
            </div>
        `;
        UI.modal.open('enq-modal');
    },

    async delete(id) {
        if (confirm('Delete this enquiry?')) {
            const res = await API.admin.enquiries.delete(id);
            if (res.success) {
                this.loadEnquiries();
            }
        }
    },

    closeModal() {
        UI.modal.close('enq-modal');
    }
};

window.EnqAdmin = EnquiriesAdminModule;
export default EnquiriesAdminModule;
