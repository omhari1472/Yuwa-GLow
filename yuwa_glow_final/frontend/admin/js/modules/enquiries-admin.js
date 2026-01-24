import API from '../../../js/api.js';
import UI from '../utils.js';

const EnquiriesAdminModule = {
    enquiries: [],
    filteredEnquiries: [],
    currentEnquiryId: null,
    currentPage: 1,
    perPage: 10,

    async init() {
        this.checkAuth();
        this.renderLoading();
        await this.loadEnquiries();
        this.initSearchFilter();
    },

    initSearchFilter() {
        UI.initSearchFilter('enquiry-search', {
            placeholder: 'Search by name or email...',
            filters: [
                {
                    key: 'status',
                    label: 'All Status',
                    options: [
                        { value: 'new', text: 'New' },
                        { value: 'replied', text: 'Replied' },
                        { value: 'closed', text: 'Closed' }
                    ]
                }
            ],
            onSearch: (term, filters) => {
                this.filteredEnquiries = UI.filterItems(this.enquiries, term, filters, ['name', 'email', 'message']);
                this.currentPage = 1;
                this.render();
                UI.updateSearchCount('enquiry-search', this.filteredEnquiries.length, this.enquiries.length);
            }
        });
        UI.updateSearchCount('enquiry-search', this.enquiries.length, this.enquiries.length);
    },

    checkAuth() {
        if (!localStorage.getItem('admin_token')) {
            window.location.href = '../login.html';
        }
    },

    renderLoading() {
        UI.loading.table('enquiries-list', 5, 5);
    },

    async loadEnquiries() {
        const res = await API.admin.enquiries.list();
        if (res.success) {
            this.enquiries = res.data.data || res.data || [];
        } else {
            this.enquiries = [];
        }
        this.filteredEnquiries = [...this.enquiries];
        this.render();
    },

    render() {
        const container = document.getElementById('enquiries-list');
        if (!container) return;

        if (this.filteredEnquiries.length === 0) {
            UI.renderEmptyState('enquiries-list', {
                icon: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M20,2H4A2,2 0 0,0 2,4V22L6,18H20A2,2 0 0,0 22,16V4A2,2 0 0,0 20,2M20,16H5.17L4,17.17V4H20V16Z"/></svg>',
                title: this.enquiries.length === 0 ? 'No Enquiries Found' : 'No Matching Enquiries',
                message: this.enquiries.length === 0 ? 'Your inbox is clear. When customers reach out via the contact form, their messages will appear here.' : 'Try adjusting your search or filters.'
            });
            const paginationEl = document.getElementById('enquiry-pagination');
            if (paginationEl) paginationEl.innerHTML = '';
            return;
        }

        const { data: items, meta } = UI.pagination.paginate(this.filteredEnquiries, this.currentPage, this.perPage);

        container.innerHTML = items.map(enq => {
            const status = enq.status || 'new';
            const statusClass = status === 'new' ? 'pending' : status === 'replied' ? 'active' : 'inactive';

            return `
                <tr>
                    <td>
                        <div class="user-info">
                            <strong>${enq.name}</strong>
                            <span>${enq.email}</span>
                        </div>
                    </td>
                    <td>${enq.phone || '<span class="text-muted">N/A</span>'}</td>
                    <td><span class="status ${statusClass}">${status}</span></td>
                    <td>${new Date(enq.created_at).toLocaleDateString()}</td>
                    <td>
                        <button class="btn-icon" onclick="window.EnqAdmin.view(${enq.id})" title="View & Reply">
                            <svg style="width:18px;height:18px" viewBox="0 0 24 24"><path fill="currentColor" d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z" /></svg>
                        </button>
                        <button class="btn-icon btn-delete" onclick="window.EnqAdmin.delete(${enq.id})" title="Delete">
                            <svg style="width:18px;height:18px" viewBox="0 0 24 24"><path fill="currentColor" d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19V4M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" /></svg>
                        </button>
                    </td>
                </tr>
            `;
        }).join('');

        UI.pagination.render('enquiry-pagination', meta, (page) => {
            this.currentPage = page;
            this.render();
        });
    },

    view(id) {
        const enq = this.enquiries.find(e => e.id === id);
        if (!enq) return;

        this.currentEnquiryId = id;
        const status = enq.status || 'new';

        const content = document.getElementById('enq-modal-content');
        content.innerHTML = `
            <div class="detail-grid">
                <div class="detail-item"><strong>Sender</strong>${enq.name}</div>
                <div class="detail-item"><strong>Email</strong><a href="mailto:${enq.email}">${enq.email}</a></div>
                <div class="detail-item"><strong>Phone</strong>${enq.phone || 'N/A'}</div>
                <div class="detail-item"><strong>Date Received</strong>${new Date(enq.created_at).toLocaleString()}</div>
            </div>
            <div class="detail-item" style="margin-top:20px;">
                <strong>Message Content</strong>
                <p style="white-space: pre-wrap; margin-top:10px; color: var(--dark-text); line-height: 1.6; padding: 15px; background: #f9fafb; border-radius: 8px;">${enq.message}</p>
            </div>

            ${enq.reply ? `
                <div class="detail-item" style="margin-top:20px;">
                    <strong>Your Reply</strong>
                    <p style="white-space: pre-wrap; margin-top:10px; color: var(--primary-gold); line-height: 1.6; padding: 15px; background: var(--warm-cream); border-radius: 8px;">${enq.reply}</p>
                    <p class="text-muted" style="font-size: 11px; margin-top: 5px;">Replied on ${enq.replied_at ? new Date(enq.replied_at).toLocaleString() : 'N/A'}</p>
                </div>
            ` : ''}

            <div class="detail-item" style="margin-top:25px;">
                <strong>${enq.reply ? 'Update Reply' : 'Write a Reply'}</strong>
                <textarea id="reply-text" rows="4" placeholder="Type your response to the customer..." style="width: 100%; margin-top: 10px; padding: 12px; border: 1px solid var(--gray-border); border-radius: 8px; font-size: 14px; resize: vertical;">${enq.reply || ''}</textarea>
            </div>

            <div style="margin-top: 15px; display: flex; gap: 10px; align-items: center;">
                <label style="font-size: 13px; font-weight: 600;">Status:</label>
                <select id="enq-status" style="padding: 8px 12px; border: 1px solid var(--gray-border); border-radius: 6px;">
                    <option value="new" ${status === 'new' ? 'selected' : ''}>New</option>
                    <option value="replied" ${status === 'replied' ? 'selected' : ''}>Replied</option>
                    <option value="closed" ${status === 'closed' ? 'selected' : ''}>Closed</option>
                </select>
            </div>
        `;

        // Update modal footer
        const footer = document.querySelector('#enq-modal .modal-footer');
        footer.innerHTML = `
            <button class="btn btn-secondary" onclick="window.EnqAdmin.closeModal()">Close</button>
            <button class="btn btn-primary" onclick="window.EnqAdmin.saveReply()">Save Reply</button>
        `;

        UI.modal.open('enq-modal');
    },

    async saveReply() {
        if (!this.currentEnquiryId) return;

        const replyText = document.getElementById('reply-text').value.trim();
        const status = document.getElementById('enq-status').value;

        try {
            // Save reply if provided
            if (replyText) {
                const replyRes = await API.admin.enquiries.reply(this.currentEnquiryId, replyText);
                if (!replyRes.success) {
                    throw new Error(replyRes.message || 'Failed to save reply');
                }
            }

            // Update status if different
            const currentEnq = this.enquiries.find(e => e.id === this.currentEnquiryId);
            if (currentEnq && (currentEnq.status || 'new') !== status && !replyText) {
                const statusRes = await API.admin.enquiries.updateStatus(this.currentEnquiryId, status);
                if (!statusRes.success) {
                    throw new Error(statusRes.message || 'Failed to update status');
                }
            }

            UI.notify('Enquiry updated successfully!');
            this.closeModal();
            this.loadEnquiries();
        } catch (error) {
            UI.notify(error.message || 'Failed to save', 'error');
        }
    },

    async delete(id) {
        UI.confirm({
            title: 'Delete Message',
            message: 'Are you sure you want to remove this customer enquiry permanently?',
            onConfirm: async () => {
                await API.admin.enquiries.delete(id);
                this.loadEnquiries();
                UI.notify('Enquiry deleted');
            }
        });
    },

    closeModal() {
        this.currentEnquiryId = null;
        UI.modal.close('enq-modal');
    }
};

window.EnqAdmin = EnquiriesAdminModule;
export default EnquiriesAdminModule;
