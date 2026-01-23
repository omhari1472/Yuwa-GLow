import API from '../../../js/api.js';

const DashboardModule = {
    async init() {
        this.checkAuth();
        await this.loadStats();
    },

    checkAuth() {
        if (!localStorage.getItem('admin_token')) {
            window.location.href = '../login.html';
        }
    },

    async loadStats() {
        const res = await API.getDashboardStats(); // I need to add this to api.js
        if (res.success) {
            this.renderStats(res.data);
            this.renderRecentEnquiries(res.data.recent_enquiries);
        }
    },

    renderStats(data) {
        document.getElementById('total-products').innerText = data.total_products;
        document.getElementById('total-blogs').innerText = data.total_blogs;
        document.getElementById('pending-apps').innerText = data.pending_applications;
        document.getElementById('active-partners').innerText = data.active_distributors + data.active_stockists;
    },

    renderRecentEnquiries(enquiries) {
        const container = document.getElementById('recent-enquiries');
        if (!container) return;

        if (enquiries.length === 0) {
            container.innerHTML = '<tr><td colspan="4" class="text-center">No recent enquiries</td></tr>';
            return;
        }

        container.innerHTML = enquiries.map(eq => `
            <tr>
                <td>${eq.name}</td>
                <td>${eq.email}</td>
                <td>${new Date(eq.created_at).toLocaleDateString()}</td>
                <td><span class="status pending">New</span></td>
            </tr>
        `).join('');
    }
};

// Add to API object in api.js if not already there
// This is a bit of a hack since I can't easily edit api.js and import it here without export
export default DashboardModule;
