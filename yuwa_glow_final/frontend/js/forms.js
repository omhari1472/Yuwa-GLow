import API from './api.js';

document.addEventListener('DOMContentLoaded', () => {
    // Inject Modal Structure
    const injectModal = () => {
        if (document.getElementById('formModal')) return;
        const modalHtml = `
            <div id="formModal" class="public-modal" style="display:none;">
                <div class="public-modal-overlay"></div>
                <div class="public-modal-content">
                    <div class="modal-icon"></div>
                    <h2 id="modalTitle">Success!</h2>
                    <p id="modalMessage"></p>
                    <button class="cta-button" onclick="document.getElementById('formModal').style.display='none'">Close</button>
                </div>
            </div>
            <style>
                .public-modal { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 2000; display: flex; align-items: center; justify-content: center; }
                .public-modal-overlay { position: absolute; width: 100%; height: 100%; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px); }
                .public-modal-content { position: relative; background: white; padding: 40px; border-radius: 20px; text-align: center; max-width: 400px; width: 90%; box-shadow: 0 20px 50px rgba(0,0,0,0.2); animation: modalPop 0.3s ease-out; }
                @keyframes modalPop { from { transform: scale(0.8); opacity: 0; } to { transform: scale(1); opacity: 1; } }
                .modal-icon { width: 60px; height: 60px; margin: 0 auto 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
                .success-icon { background: #dcfce7; color: #166534; }
                .error-icon { background: #fee2e2; color: #991b1b; }
                #formModal h2 { margin-bottom: 10px; font-family: var(--font-primary); }
                #formModal p { color: #666; margin-bottom: 25px; }
            </style>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    };

    const showModal = (title, message, isSuccess = true) => {
        injectModal();
        const modal = document.getElementById('formModal');
        const iconContainer = modal.querySelector('.modal-icon');
        
        modal.querySelector('#modalTitle').innerText = title;
        modal.querySelector('#modalMessage').innerText = message;
        
        iconContainer.className = 'modal-icon ' + (isSuccess ? 'success-icon' : 'error-icon');
        iconContainer.innerHTML = isSuccess 
            ? '<svg width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>'
            : '<svg width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/></svg>';
        
        modal.style.display = 'flex';
    };

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
                    showModal('Message Sent', 'Thank you for your enquiry. We will get back to you soon.');
                    contactForm.reset();
                } else {
                    throw new Error(res.message || 'Submission failed');
                }
            } catch (error) {
                showModal('Oops!', error.message || 'Something went wrong. Please try again.', false);
            } finally {
                submitBtn.innerText = originalText;
                submitBtn.disabled = false;
            }
        });
    }

    // Career Application Form
    const applicationForm = document.getElementById('applicationForm');
    if (applicationForm) {
        applicationForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(applicationForm);

            try {
                const response = await API.submitApplication(formData);
                if (response.id) {
                    alert('Application submitted successfully!');
                    applicationForm.reset();
                } else {
                    throw new Error(response.message || 'Submission failed');
                }
            } catch (error) {
                alert('Error: ' + error.message);
            }
        });
    }
});
