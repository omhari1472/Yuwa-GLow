const SidebarModule = {
    render() {
        const sidebarContainer = document.getElementById('sidebar-container');
        if (!sidebarContainer) return;

        // More robust path detection (removes query strings and trailing slashes)
        const currentFileName = window.location.pathname.split('/').pop() || 'dashboard.html';

        sidebarContainer.innerHTML = `
            <aside class="sidebar">
                <header class="sidebar-header">
                    <a href="dashboard.html" class="sidebar-logo">
                        <img src="../../assets/icons/logo.svg" alt="YUWA GLOW Logo">
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
                        <li><a href="applications.html" class="${currentFileName === 'applications.html' ? 'active' : ''}">
                            <svg class="nav-icon" viewBox="0 0 24 24"><path fill="currentColor" d="M18 11c1.49 0 2.87.54 3.94 1.5C23.01 13.57 23.5 15 23.5 16.5A3.5 3.5 0 0120 20H4a3.5 3.5 0 01-3.5-3.5C.5 15 .99 13.57 2.06 12.5S5.51 11 7 11h11M7 9a5 5 0 015-5 5 5 0 015 5v1.28C16.39 10.1 15.74 10 15 10c-2.3 0-4.32 1.05-5.69 2.69C8.36 12.04 7.69 11.55 7 11.28V9z" /></svg>
                            <span class="nav-label">Applications</span>
                        </a></li>
                        <li><a href="enquiries.html" class="${currentFileName === 'enquiries.html' ? 'active' : ''}">
                            <svg class="nav-icon" viewBox="0 0 24 24"><path fill="currentColor" d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6zm-2 0l-8 5-8-5h16zm0 12H4V8l8 5 8-5v10z"/></svg>
                            <span class="nav-label">Enquiries</span>
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
                window.location.href = '../login.html';
            };
        }
    }
};

export default SidebarModule;