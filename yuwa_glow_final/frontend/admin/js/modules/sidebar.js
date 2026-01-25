const SidebarModule = {
    render() {
        const sidebarContainer = document.getElementById('sidebar-container');
        if (!sidebarContainer) return;

        const currentFileName = window.location.pathname.split('/').pop() || 'dashboard.html';

        sidebarContainer.innerHTML = `
            <aside class="sidebar">
                <header class="sidebar-header">
                    <a href="dashboard.html" class="sidebar-logo">
                        <img src="../../assets/icons/logo.svg" alt="YUVA GLOW Logo">
                    </a>
                </header>
                <nav class="sidebar-nav">
                    <ul>
                        <li><a href="dashboard.html" class="${currentFileName === 'dashboard.html' ? 'active' : ''}">
                            <svg class="nav-icon" viewBox="0 0 24 24"><path fill="currentColor" d="M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z" /></svg>
                            <span class="nav-label">Dashboard</span>
                        </a></li>
                        <li><a href="products.html" class="${currentFileName === 'products.html' ? 'active' : ''}">
                            <svg class="nav-icon" viewBox="0 0 24 24"><path fill="currentColor" d="M12,2L2,7V17L12,22L22,17V7L12,2M10.1,16.5L6.6,14.6L12,11.5L17.4,14.6L13.9,16.5L12,17.5L10.1,16.5M12,4.5L19,8.2L12,11.8L5,8.2L12,4.5Z" /></svg>
                            <span class="nav-label">Products</span>
                        </a></li>
                        <li><a href="gallery.html" class="${currentFileName === 'gallery.html' ? 'active' : ''}">
                            <svg class="nav-icon" viewBox="0 0 24 24"><path fill="currentColor" d="M21,19V5C21,3.89 20.1,3 19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19M8.5,13.5L11,16.5L14.5,12L19,18H5L8.5,13.5Z" /></svg>
                            <span class="nav-label">Gallery</span>
                        </a></li>
                        <li><a href="blogs.html" class="${currentFileName === 'blogs.html' ? 'active' : ''}">
                            <svg class="nav-icon" viewBox="0 0 24 24"><path fill="currentColor" d="M4,5v14h16V5H4M4,3h16c1.1,0 2,0.9 2,2v14c0,1.1-0.9,2-2,2H4c-1.1,0-2-0.9-2-2V5C2,3.9 2.9,3 4,3z M9,7h6v2H9V7z M9,11h6v2H9V11z M7,15h10v2H7V15z" /></svg>
                            <span class="nav-label">Blogs</span>
                        </a></li>
                        <li><a href="careers.html" class="${currentFileName === 'careers.html' ? 'active' : ''}">
                             <svg class="nav-icon" viewBox="0 0 24 24"><path fill="currentColor" d="M12 3L1 9l11 6 9-4.5V12h-2V10l-7 3.5-9-4.5 9-5 9 4.5V9H23V9l-11-6z"/></svg>
                            <span class="nav-label">Careers</span>
                        </a></li>
                        <li><a href="applications-career.html" class="${currentFileName === 'applications-career.html' ? 'active' : ''}">
                             <svg class="nav-icon" viewBox="0 0 24 24"><path fill="currentColor" d="M12 3L1 9l11 6 9-4.5V12h-2V10l-7 3.5-9-4.5 9-5 9 4.5V9H23V9l-11-6z"/></svg>
                            <span class="nav-label">Career Apps</span>
                        </a></li>
                        <li><a href="applications-partner.html" class="${currentFileName === 'applications-partner.html' ? 'active' : ''}">
                            <svg class="nav-icon" viewBox="0 0 24 24"><path fill="currentColor" d="M18 11c1.49 0 2.87.54 3.94 1.5C23.01 13.57 23.5 15 23.5 16.5A3.5 3.5 0 0120 20H4a3.5 3.5 0 01-3.5-3.5C.5 15 .99 13.57 2.06 12.5S5.51 11 7 11h11M7 9a5 5 0 015-5 5 5 0 015 5v1.28C16.39 10.1 15.74 10 15 10c-2.3 0-4.32 1.05-5.69 2.69C8.36 12.04 7.69 11.55 7 11.28V9z" /></svg>
                            <span class="nav-label">Partner Apps</span>
                        </a></li>
                        <li><a href="enquiries.html" class="${currentFileName === 'enquiries.html' ? 'active' : ''}">
                            <svg class="nav-icon" viewBox="0 0 24 24"><path fill="currentColor" d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6zm-2 0l-8 5-8-5h16zm0 12H4V8l8 5 8-5v10z"/></svg>
                            <span class="nav-label">Enquiries</span>
                        </a></li>
                        <li><a href="settings.html" class="${currentFileName === 'settings.html' ? 'active' : ''}">
                            <svg class="nav-icon" viewBox="0 0 24 24"><path fill="currentColor" d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11.03L21.54,9.37C21.73,9.22 21.78,8.97 21.68,8.76L19.68,5.3C19.58,5.09 19.33,5.01 19.12,5.09L16.64,5.94C16.12,5.57 15.56,5.27 14.96,5.03L14.58,2.38C14.54,2.16 14.35,2 14.12,2H10.12C13.89,2 13.7,2.16 13.66,2.38L13.28,5.03C12.68,5.27 12.12,5.57 11.6,5.94L9.12,5.09C8.91,5.01 8.66,5.09 8.56,5.3L6.56,8.76C6.46,8.97 6.51,9.22 6.7,9.37L8.81,11.03C8.77,11.34 8.75,11.67 8.75,12C8.75,12.33 8.77,12.65 8.81,12.97L6.7,14.63C6.51,14.78 6.46,15.03 6.56,15.24L8.56,18.7C8.66,18.91 8.91,18.99 9.12,18.91L11.6,18.06C12.12,18.43 12.68,18.73 13.28,18.97L13.66,21.62C13.7,21.84 13.89,22 14.12,22H18.12C18.35,22 18.54,21.84 18.58,21.62L18.96,18.97C19.56,18.73 20.12,18.43 20.64,18.06L23.12,18.91C23.33,18.99 23.58,18.91 23.68,18.7L25.68,15.24C25.78,15.03 25.73,14.78 25.54,14.63L23.43,12.97Z" /></svg>
                            <span class="nav-label">Settings</span>
                        </a></li>
                    </ul>
                </nav>
                <footer class="sidebar-footer">
                    <button class="logout-btn" id="admin-logout">
                        <svg class="nav-icon" viewBox="0 0 24 24"><path fill="currentColor" d="M16,17V14H9V10H16V7L21,12L16,17M14,2a2,2 0 0,1 2,2V6H14V4H5V20H14V18H16V20a2,2 0 0,1-2,2H5a2,2 0 0,1-2-2V4A2,2 0 0,1 5,2H14Z" /></svg>
                        <span class="nav-label">Logout</span>
                    </button>
                </footer>
            </aside>
        `;

        this.initEvents();
    },

    initEvents() {
        const logoutBtn = document.getElementById('admin-logout');
        if (logoutBtn) {
            logoutBtn.onclick = () => {
                localStorage.removeItem('admin_token');
                localStorage.removeItem('admin_user');
                window.location.href = '../index.html';
            };
        }
    }
};

export default SidebarModule;
