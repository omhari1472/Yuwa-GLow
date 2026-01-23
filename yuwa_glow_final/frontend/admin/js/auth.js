const CONFIG = {
    API_BASE_URL: 'http://localhost:8000/api'
};

document.addEventListener('DOMContentLoaded', () => {
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
                    alert(result.message || 'Login failed');
                }
            } catch (error) {
                console.error('Fetch Error Detail:', error);
                alert('Connection error: Make sure the backend server is running on http://localhost:8000');
            }
        });
    }
});