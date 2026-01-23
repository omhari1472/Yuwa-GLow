document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch('http://localhost:8000/api/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (response.ok) {
                    localStorage.setItem('admin_token', data.access_token);
                    localStorage.setItem('admin_user', JSON.stringify(data.user));
                    window.location.href = 'pages/dashboard.html';
                } else {
                    alert(data.message || 'Login failed');
                }
            } catch (error) {
                alert('Connection error: ' + error.message);
            }
        });
    }
});

function logout() {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    window.location.href = '../login.html';
}

function checkAuth() {
    if (!localStorage.getItem('admin_token')) {
        window.location.href = '../login.html';
    }
}
