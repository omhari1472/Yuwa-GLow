import API from '../../../js/api.js';
import UI from '../utils.js';

const SettingsAdminModule = {
    init() {
        const passwordForm = document.getElementById('password-form');
        if (passwordForm) {
            passwordForm.addEventListener('submit', this.handlePasswordChange.bind(this));
        }
    },

    async handlePasswordChange(e) {
        e.preventDefault();
        
        const currentPassword = document.getElementById('current_password').value;
        const newPassword = document.getElementById('new_password').value;
        const confirmPassword = document.getElementById('new_password_confirmation').value;

        if (newPassword !== confirmPassword) {
            UI.notify('New passwords do not match', 'error');
            return;
        }

        const btn = e.target.querySelector('button[type="submit"]');
        const originalText = btn.textContent;
        UI.loading.button(btn, true);
        btn.textContent = 'Updating...';

        try {
            const res = await API.changePassword({
                current_password: currentPassword,
                new_password: newPassword,
                new_password_confirmation: confirmPassword
            });

            if (res.success) {
                // Reset form
                e.target.reset();
                UI.notify('Password updated successfully', 'success');
            } else {
                UI.notify(res.message || 'Failed to update password', 'error');
            }
        } catch (error) {
            console.error('Password Update Error:', error);
            UI.notify(error.message || 'An error occurred. Please try again.', 'error');
        } finally {
            UI.loading.button(btn, false);
            btn.textContent = originalText;
        }
    }
};

export default SettingsAdminModule;