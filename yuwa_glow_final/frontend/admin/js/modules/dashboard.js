import API from '../../../js/api.js';

const DashboardModule = {
    async init() {
        this.checkAuth();
        this.renderLoading();
        await this.loadStats();
    },

    checkAuth() {
        if (!localStorage.getItem('admin_token')) {
            window.location.href = '../index.html';
        }
    },

    renderLoading() {
        const ids = ['total-products', 'total-blogs', 'pending-apps', 'active-partners'];
        ids.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.innerText = '...';
        });
    },

    async loadStats() {
        const res = await API.getDashboardStats();
        console.log('Raw Dashboard Stats:', res);

        if (res.success) {
            // Laravel wrapper is { success: true, data: { total_products: 1, ... } }
            // Or it could be double nested if my previous wrapper change affected it
            const stats = res.data.data || res.data || {};
            console.log('Processed Stats:', stats);
            
            this.renderStats(stats);
            this.renderRecentEnquiries(stats.recent_enquiries || []);
        } else {
            this.renderStats({ total_products: 0, total_blogs: 0, pending_applications: 0, active_distributors: 0, active_stockists: 0 });
        }
    },

    renderStats(data) {
        document.getElementById('total-products').innerText = data.total_products ?? 0;
        document.getElementById('total-blogs').innerText = data.total_blogs ?? 0;
        document.getElementById('pending-apps').innerText = data.pending_applications ?? 0;
        
        const partners = (data.active_distributors ?? 0) + (data.active_stockists ?? 0);
        document.getElementById('active-partners').innerText = partners;
    },

    renderRecentEnquiries(enquiries) {
        const container = document.getElementById('recent-enquiries');
        if (!container) return;

        if (enquiries.length === 0) {
            container.innerHTML = `
                <tr>
                    <td colspan="4">
                        <div class="empty-state-mini">
                            <svg viewBox="0 0 24 24"><path fill="currentColor" d="M20,2H4A2,2 0 0,0 2,4V22L6,18H20A2,2 0 0,0 22,16V4A2,2 0 0,0 20,2M20,16H5.17L4,17.17V4H20V16Z"/></svg>
                            <p>No recent enquiries</p>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }

        container.innerHTML = enquiries.map(eq => `
            <tr>
                <td>
                    <div class="user-info">
                        <strong>${eq.name}</strong>
                        <span>${eq.email}</span>
                    </div>
                </td>
                <td>${new Date(eq.created_at).toLocaleDateString()}</td>
                <td><span class="status pending">New</span></td>
                <td>
                    <a href="enquiries.html" class="btn-icon">
                        <svg style="width:18px;height:18px" viewBox="0 0 24 24"><path fill="currentColor" d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z" /></svg>
                    </a>
                </td>
            </tr>
        `).join('');
    }
};

export default DashboardModule;
