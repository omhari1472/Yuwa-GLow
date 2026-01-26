const CONFIG = {
    API_BASE_URL: 'http://localhost:8000/api'
};

document.addEventListener('DOMContentLoaded', () => {
    // Simple Toast for Login Page
    const showToast = (message, type = 'error') => {
        let container = document.querySelector('.toast-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'toast-container';
            document.body.appendChild(container);
            const style = document.createElement('style');
            style.textContent = `
                .toast-container { position: fixed; bottom: 30px; right: 30px; z-index: 9999; }
                .toast { background: white; color: #333; padding: 16px 24px; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.15); margin-bottom: 12px; display: flex; align-items: center; gap: 12px; border-left: 5px solid #ef4444; animation: toastIn 0.3s ease forwards; min-width: 300px; font-family: sans-serif; font-size: 14px; }
                .toast.success { border-left-color: #166534; }
                .toast.fade-out { animation: toastOut 0.3s ease forwards; }
                @keyframes toastIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
                @keyframes toastOut { from { transform: translateX(0); opacity: 1; } to { transform: translateX(100%); opacity: 0; } }
            `;
            document.head.appendChild(style);
        }
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerText = message;
        container.appendChild(toast);
        setTimeout(() => { toast.classList.add('fade-out'); setTimeout(() => toast.remove(), 500); }, 4000);
    };

    const loginForm = document.querySelector('form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch(`${CONFIG.API_BASE_URL}/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });

                const result = await response.json();

                if (result.success) {
                    localStorage.setItem('admin_token', result.data.access_token);
                    localStorage.setItem('admin_user', JSON.stringify(result.data.user));
                    window.location.href = 'pages/dashboard.html';
                } else {
                    showToast(result.message || 'Login failed', 'error');
                }
            } catch (error) {
                console.error('Fetch Error Detail:', error);
                showToast('Connection error: Check backend server', 'error');
            }
        });
    }
});