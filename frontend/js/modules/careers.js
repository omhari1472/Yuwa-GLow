import API from '../api.js';

const CareersModule = {
    careers: [],
    selectedCareer: null,

    async init() {
        const container = document.querySelector('.career-listings');
        if (!container) return;

        this.renderLoading(container);

        try {
            const res = await API.getCareers();
            if (res.success) {
                this.careers = res.data?.data || res.data || [];

                if (this.careers.length === 0) {
                    this.renderEmpty(container);
                } else {
                    this.render(container);
                }
            }
        } catch (error) {
            console.error('Careers Module Error:', error);
            this.renderError(container, 'Failed to load job listings');
        }
    },

    render(container) {
        container.innerHTML = this.careers.map(career => `
            <div class="job-card fade-in" data-career-id="${career.id}">
                <div class="job-info">
                    <h3 class="job-title">${career.title}</h3>
                    <p class="job-location">${career.location} | ${career.department}</p>
                    <p class="job-description">${career.description.substring(0, 200)}${career.description.length > 200 ? '...' : ''}</p>
                </div>
                <div class="job-apply">
                    <a href="career-details?id=${career.id}" class="cta-button view-details-btn">
                        View Details
                    </a>
                </div>
            </div>
        `).join('');
    },

    addApplicationModal() {
        if (document.getElementById('applicationModal')) return;

        const modalHtml = `
            <div id="applicationModal" class="modal" style="display: none;">
                <div class="modal-overlay"></div>
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>Apply for <span id="modalJobTitle" style="color: var(--primary-gold);"></span></h2>
                        <button class="modal-close">&times;</button>
                    </div>
                    <form id="careerApplicationForm" enctype="multipart/form-data">
                        <input type="hidden" name="application_type" value="career">
                        <input type="hidden" name="career_id" id="careerIdInput">

                        <div class="modal-body">
                            <div class="form-row">
                                <div class="form-group">
                                    <input type="text" id="applicantName" name="name" required placeholder=" ">
                                    <label for="applicantName">Full Name *</label>
                                </div>
                                <div class="form-group">
                                    <input type="tel" id="applicantPhone" name="phone" required placeholder=" ">
                                    <label for="applicantPhone">Phone Number *</label>
                                </div>
                            </div>

                            <div class="form-group">
                                <input type="email" id="applicantEmail" name="email" required placeholder=" ">
                                <label for="applicantEmail">Email Address *</label>
                            </div>

                            <div class="form-group">
                                <label for="applicantResume" style="position:static; margin-bottom:8px; pointer-events:auto;">Resume (PDF, DOC, DOCX) *</label>
                                <div class="file-input-wrapper">
                                    <div class="file-icon">📄</div>
                                    <input type="file" id="applicantResume" name="resume" accept=".pdf,.doc,.docx" required onchange="this.nextElementSibling.textContent = this.files[0] ? this.files[0].name : 'Click to upload your resume'">
                                    <span class="file-name">Click to upload your resume</span>
                                </div>
                            </div>
                        </div>

                        <div class="modal-footer">
                            <button type="button" class="btn-secondary" id="cancelApplication">Cancel</button>
                            <button type="submit" class="cta-button" id="submitApplication">Submit Application</button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHtml);

        const styleEl = document.createElement('style');
        styleEl.textContent = `
            .modal { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 2000; display: flex; align-items: center; justify-content: center; opacity: 0; visibility: hidden; transition: 0.3s; }
            .modal.active { opacity: 1; visibility: visible; }
            .modal-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.6); backdrop-filter: blur(4px); }
            .modal-content { position: relative; background: white; width: 100%; max-width: 600px; border-radius: 16px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); transform: translateY(20px); transition: 0.3s; overflow: hidden; display: flex; flex-direction: column; max-height: 90vh; }
            .modal.active .modal-content { transform: translateY(0); }
            
            .modal-header { padding: 20px 30px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center; background: #fff; flex-shrink: 0; }
            .modal-header h2 { font-size: 1.5rem; margin: 0; color: #333; font-family: var(--font-primary); }
            .modal-close { background: none; border: none; font-size: 24px; cursor: pointer; color: #999; transition: 0.2s; line-height: 1; }
            .modal-close:hover { color: #333; }

            .modal-body { padding: 30px; overflow-y: auto; flex: 1; }
            .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
            .form-group { margin-bottom: 20px; }
            .form-group label { display: block; font-size: 0.9rem; font-weight: 600; color: #555; margin-bottom: 8px; }
            .form-group input, .form-group textarea { width: 100%; padding: 12px 16px; border: 1.5px solid #e5e7eb; border-radius: 8px; font-size: 1rem; transition: 0.2s; outline: none; }
            .form-group input:focus, .form-group textarea:focus { border-color: var(--primary-gold); box-shadow: 0 0 0 4px var(--warm-cream); }

            .file-input-wrapper { position: relative; border: 2px dashed #e5e7eb; padding: 20px; border-radius: 10px; text-align: center; cursor: pointer; transition: 0.2s; background: #f9fafb; display: flex; flex-direction: column; align-items: center; justify-content: center; }
            .file-input-wrapper:hover { border-color: var(--primary-gold); background: var(--warm-cream); }
            .file-input-wrapper input[type="file"] { position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0; cursor: pointer; }
            .file-icon { font-size: 2rem; margin-bottom: 5px; }
            .file-name { font-size: 0.9rem; color: #666; }

            .modal-footer { padding: 20px 30px; border-top: 1px solid #eee; display: flex; justify-content: flex-end; gap: 15px; background: #f9fafb; flex-shrink: 0; }
            .btn-secondary { padding: 12px 24px; background: white; border: 1.5px solid #e5e7eb; border-radius: 50px; cursor: pointer; font-weight: 600; transition: 0.2s; }
            .btn-secondary:hover { border-color: #999; }
            
            @media (max-width: 600px) { .form-row { grid-template-columns: 1fr; } .modal-content { width: 95%; } }
        `;
        document.head.appendChild(styleEl);
    },

    showApplicationModal() {
        const modal = document.getElementById('applicationModal');
        const titleSpan = document.getElementById('modalJobTitle');
        const careerIdInput = document.getElementById('careerIdInput');

        if (this.selectedCareer) {
            titleSpan.textContent = this.selectedCareer.title;
            careerIdInput.value = this.selectedCareer.id;
        }

        modal.classList.add('active');
        modal.style.display = 'flex'; // Ensure flex is set for layout
        document.body.style.overflow = 'hidden';
    },

    hideApplicationModal() {
        const modal = document.getElementById('applicationModal');
        modal.classList.remove('active');
        setTimeout(() => {
            modal.style.display = 'none'; // Hide after transition
        }, 300);
        document.body.style.overflow = '';
        document.getElementById('careerApplicationForm').reset();
    },

    initApplicationModal() {
        // Wait for modal to be added
        setTimeout(() => {
            const modal = document.getElementById('applicationModal');
            if (!modal) return;

            const overlay = modal.querySelector('.modal-overlay');
            const closeBtn = modal.querySelector('.modal-close');
            const cancelBtn = document.getElementById('cancelApplication');
            const form = document.getElementById('careerApplicationForm');

            overlay.addEventListener('click', () => this.hideApplicationModal());
            closeBtn.addEventListener('click', () => this.hideApplicationModal());
            cancelBtn.addEventListener('click', () => this.hideApplicationModal());

            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.submitApplication(form);
            });
        }, 100);
    },

    async submitApplication(form) {
        const submitBtn = document.getElementById('submitApplication');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Submitting...';
        submitBtn.disabled = true;

        try {
            const formData = new FormData(form);
            const res = await API.submitApplication(formData);

            if (res.success) {
                this.hideApplicationModal();
                if (window.notify) {
                    window.notify('Application submitted successfully! We will review it and get back to you soon.');
                }
            } else {
                throw new Error(res.message || 'Submission failed');
            }
        } catch (error) {
            console.error('Application submission error:', error);
            if (window.notify) {
                window.notify(error.message || 'Failed to submit application. Please try again.', 'error');
            }
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    },

    renderEmpty(container) {
        container.innerHTML = `
            <div class="empty-state" style="text-align: center; padding: 80px 20px;">
                <h3>No Open Positions</h3>
                <p style="color: #666; margin-top: 10px;">We don't have any open positions right now, but check back soon!</p>
                <p style="margin-top: 20px;">You can also send us your resume at <a href="mailto:careers@YUVAglow.com" style="color: var(--primary-gold);">careers@YUVAglow.com</a></p>
            </div>
        `;
    },

    renderLoading(container) {
        container.innerHTML = `
            <div class="loading-state" style="text-align: center; padding: 80px 20px;">
                <div class="loader">Loading opportunities...</div>
            </div>
        `;
    },

    renderError(container, message) {
        container.innerHTML = `
            <div class="error-state" style="text-align: center; padding: 80px 20px;">
                <h3>Oops!</h3>
                <p>${message}</p>
            </div>
        `;
    }
};

export default CareersModule;
