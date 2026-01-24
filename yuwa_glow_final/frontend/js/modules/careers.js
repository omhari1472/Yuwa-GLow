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
                    this.initApplicationModal();
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
                    <button class="cta-button apply-btn" data-career-id="${career.id}" data-career-title="${career.title}">
                        Apply Now
                    </button>
                </div>
            </div>
        `).join('');

        // Add application modal to the page
        this.addApplicationModal();

        // Bind apply button events
        container.querySelectorAll('.apply-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.selectedCareer = {
                    id: btn.dataset.careerId,
                    title: btn.dataset.careerTitle
                };
                this.showApplicationModal();
            });
        });
    },

    addApplicationModal() {
        // Check if modal already exists
        if (document.getElementById('applicationModal')) return;

        const modalHtml = `
            <div id="applicationModal" class="modal" style="display: none;">
                <div class="modal-overlay"></div>
                <div class="modal-content">
                    <button class="modal-close">&times;</button>
                    <h2>Apply for <span id="modalJobTitle"></span></h2>
                    <form id="careerApplicationForm" enctype="multipart/form-data">
                        <input type="hidden" name="application_type" value="career">
                        <input type="hidden" name="career_id" id="careerIdInput">

                        <div class="form-group">
                            <label for="applicantName">Full Name *</label>
                            <input type="text" id="applicantName" name="name" required>
                        </div>

                        <div class="form-group">
                            <label for="applicantEmail">Email Address *</label>
                            <input type="email" id="applicantEmail" name="email" required>
                        </div>

                        <div class="form-group">
                            <label for="applicantPhone">Phone Number *</label>
                            <input type="tel" id="applicantPhone" name="phone" required>
                        </div>

                        <div class="form-group">
                            <label for="applicantResume">Resume (PDF, DOC, DOCX) *</label>
                            <input type="file" id="applicantResume" name="resume" accept=".pdf,.doc,.docx" required>
                        </div>

                        <div class="form-group">
                            <label for="applicantCover">Cover Letter (Optional)</label>
                            <textarea id="applicantCover" name="cover_letter" rows="4"></textarea>
                        </div>

                        <div class="form-actions">
                            <button type="button" class="btn-secondary" id="cancelApplication">Cancel</button>
                            <button type="submit" class="cta-button" id="submitApplication">Submit Application</button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHtml);

        // Add modal styles
        const styleEl = document.createElement('style');
        styleEl.textContent = `
            .modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 1000;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .modal-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.6);
            }
            .modal-content {
                position: relative;
                background: white;
                padding: 40px;
                border-radius: 15px;
                max-width: 500px;
                width: 90%;
                max-height: 90vh;
                overflow-y: auto;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            }
            .modal-close {
                position: absolute;
                top: 15px;
                right: 20px;
                background: none;
                border: none;
                font-size: 28px;
                cursor: pointer;
                color: #666;
            }
            .modal-close:hover {
                color: #333;
            }
            .modal h2 {
                margin-bottom: 25px;
                color: #333;
            }
            .form-group {
                margin-bottom: 20px;
            }
            .form-group label {
                display: block;
                margin-bottom: 8px;
                font-weight: 600;
                color: #333;
            }
            .form-group input,
            .form-group textarea {
                width: 100%;
                padding: 12px;
                border: 1px solid #ddd;
                border-radius: 8px;
                font-size: 14px;
                transition: border-color 0.3s;
            }
            .form-group input:focus,
            .form-group textarea:focus {
                border-color: var(--primary-gold);
                outline: none;
            }
            .form-actions {
                display: flex;
                gap: 15px;
                margin-top: 25px;
            }
            .btn-secondary {
                padding: 12px 25px;
                background: #f5f5f5;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-size: 14px;
            }
            .btn-secondary:hover {
                background: #e5e5e5;
            }
            .form-actions .cta-button {
                flex: 1;
            }
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

        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    },

    hideApplicationModal() {
        const modal = document.getElementById('applicationModal');
        modal.style.display = 'none';
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
                alert('Your application has been submitted successfully! We will review it and get back to you soon.');
                this.hideApplicationModal();
            } else {
                throw new Error(res.message || 'Submission failed');
            }
        } catch (error) {
            console.error('Application submission error:', error);
            alert('Error: ' + (error.message || 'Failed to submit application. Please try again.'));
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
                <p style="margin-top: 20px;">You can also send us your resume at <a href="mailto:careers@yuwaglow.com" style="color: var(--primary-gold);">careers@yuwaglow.com</a></p>
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
