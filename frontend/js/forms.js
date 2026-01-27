import API from './api.js';

document.addEventListener('DOMContentLoaded', () => {
    const notify = (message, type = 'success') => {
        let container = document.querySelector('.toast-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'toast-container';
            document.body.appendChild(container);

            // Add Styles if not exists
            if (!document.getElementById('toast-styles')) {
                const style = document.createElement('style');
                style.id = 'toast-styles';
                style.textContent = `
                    .toast-container { position: fixed; bottom: 30px; right: 30px; z-index: 9999; }
                    .toast { background: white; color: #333; padding: 16px 24px; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.15); margin-bottom: 12px; display: flex; align-items: center; gap: 12px; border-left: 5px solid var(--primary-gold); animation: toastIn 0.3s ease forwards; min-width: 300px; font-family: sans-serif; font-size: 14px; }
                    .toast-error { border-left-color: #ef4444; }
                    .toast.fade-out { animation: toastOut 0.3s ease forwards; }
                    @keyframes toastIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
                    @keyframes toastOut { from { transform: translateX(0); opacity: 1; } to { transform: translateX(100%); opacity: 0; } }
                `;
                document.head.appendChild(style);
            }
        }

        const toast = document.createElement('div');
        toast.className = `toast ${type === 'error' ? 'toast-error' : ''}`;
        toast.innerHTML = `<div style="flex:1">${message}</div><div style="cursor:pointer; opacity:0.5" onclick="this.parentElement.remove()">&times;</div>`;
        container.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('fade-out');
            setTimeout(() => toast.remove(), 500);
        }, 4000);
    };

    // Expose to global scope for other modules
    window.notify = notify;

    // Contact Form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerText;

            submitBtn.innerText = 'Sending...';
            submitBtn.disabled = true;

            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData.entries());

            try {
                const res = await API.submitEnquiry(data);
                if (res.success) {
                    notify('Message sent! Thank you for your enquiry. We will get back to you soon.');
                    contactForm.reset();
                } else {
                    throw new Error(res.message || 'Submission failed');
                }
            } catch (error) {
                notify(error.message || 'Something went wrong. Please try again.', 'error');
            } finally {
                submitBtn.innerText = originalText;
                submitBtn.disabled = false;
            }
        });
    }
});
