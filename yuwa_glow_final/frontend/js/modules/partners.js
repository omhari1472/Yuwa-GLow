import API from '../api.js';

const PartnersModule = {
    stockists: [],
    distributors: [],
    allStates: [],

    async init() {
        const stockistGrid = document.querySelector('#stockistGrid');
        const distributorGrid = document.querySelector('#distributorGrid');

        if (!stockistGrid && !distributorGrid) return;

        this.renderLoading(stockistGrid);
        this.renderLoading(distributorGrid);

        try {
            const [stockistsRes, distributorsRes] = await Promise.all([
                API.getStockists(),
                API.getDistributors()
            ]);

            this.stockists = stockistsRes.data?.data || stockistsRes.data || [];
            this.distributors = distributorsRes.data?.data || distributorsRes.data || [];

            // Collect all unique states
            this.allStates = [...new Set([
                ...this.stockists.map(s => s.state),
                ...this.distributors.map(d => d.state)
            ])].filter(Boolean).sort();

            this.renderStockists(stockistGrid);
            this.renderDistributors(distributorGrid);
            this.initFilters();
            this.initApplicationForms();
        } catch (error) {
            console.error('Partners Module Error:', error);
            this.renderError(stockistGrid, 'Failed to load partners');
            this.renderError(distributorGrid, 'Failed to load partners');
        }
    },

    renderStockists(container) {
        if (!container) return;

        if (this.stockists.length === 0) {
            container.innerHTML = `
                <div class="empty-state" style="grid-column: 1 / -1; text-align: center; padding: 40px;">
                    <p>No super stockists in your area yet.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = this.stockists.map(partner => `
            <div class="partner-card fade-in" data-state="${partner.state || ''}" data-district="${partner.district || ''}">
                <h3>${partner.company_name || partner.name}</h3>
                <p><strong>Contact:</strong> ${partner.name}</p>
                <p><strong>Area:</strong> ${partner.state || 'State Level'}</p>
                ${partner.phone ? `<p><strong>Phone:</strong> ${partner.phone}</p>` : ''}
            </div>
        `).join('');
    },

    renderDistributors(container) {
        if (!container) return;

        if (this.distributors.length === 0) {
            container.innerHTML = `
                <div class="empty-state" style="grid-column: 1 / -1; text-align: center; padding: 40px;">
                    <p>No distributors in your area yet.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = this.distributors.map(partner => `
            <div class="partner-card fade-in" data-state="${partner.state || ''}" data-district="${partner.district || ''}">
                <h3>${partner.company_name || partner.name}</h3>
                <p><strong>Contact:</strong> ${partner.name}</p>
                <p><strong>Area:</strong> ${partner.district || 'District Level'}, ${partner.state || ''}</p>
                ${partner.phone ? `<p><strong>Phone:</strong> ${partner.phone}</p>` : ''}
            </div>
        `).join('');
    },

    initFilters() {
        const stateFilter = document.getElementById('stateFilter');
        const districtFilter = document.getElementById('districtFilter');

        if (stateFilter) {
            // Populate state options
            stateFilter.innerHTML = `<option value="all">All States</option>` +
                this.allStates.map(state => `<option value="${state}">${state}</option>`).join('');

            stateFilter.addEventListener('change', () => this.applyFilters());
        }

        if (districtFilter) {
            districtFilter.addEventListener('input', () => this.applyFilters());
        }
    },

    applyFilters() {
        const stateFilter = document.getElementById('stateFilter');
        const districtFilter = document.getElementById('districtFilter');

        const selectedState = stateFilter?.value || 'all';
        const districtSearch = (districtFilter?.value || '').toLowerCase();

        document.querySelectorAll('.partner-card').forEach(card => {
            const cardState = card.dataset.state || '';
            const cardDistrict = card.dataset.district || '';

            const stateMatch = selectedState === 'all' || cardState === selectedState;
            const districtMatch = !districtSearch || cardDistrict.toLowerCase().includes(districtSearch);

            card.style.display = stateMatch && districtMatch ? '' : 'none';
        });
    },

    initApplicationForms() {
        // Add partner application modal
        this.addPartnerApplicationModal();

        // Bind apply buttons
        document.querySelectorAll('.become-stockist-btn').forEach(btn => {
            btn.addEventListener('click', () => this.showPartnerApplicationModal('super_stockist'));
        });

        document.querySelectorAll('.become-distributor-btn').forEach(btn => {
            btn.addEventListener('click', () => this.showPartnerApplicationModal('distributor'));
        });
    },

    addPartnerApplicationModal() {
        if (document.getElementById('partnerApplicationModal')) return;

        const modalHtml = `
            <div id="partnerApplicationModal" class="modal" style="display: none;">
                <div class="modal-overlay"></div>
                <div class="modal-content">
                    <button class="modal-close">&times;</button>
                    <h2 id="partnerModalTitle">Become a Partner</h2>
                    <form id="partnerApplicationForm">
                        <input type="hidden" name="application_type" id="partnerTypeInput">

                        <div class="form-group">
                            <label for="partnerName">Full Name *</label>
                            <input type="text" id="partnerName" name="name" required>
                        </div>

                        <div class="form-group">
                            <label for="partnerCompany">Company/Business Name</label>
                            <input type="text" id="partnerCompany" name="company_name">
                        </div>

                        <div class="form-group">
                            <label for="partnerEmail">Email Address *</label>
                            <input type="email" id="partnerEmail" name="email" required>
                        </div>

                        <div class="form-group">
                            <label for="partnerPhone">Phone Number *</label>
                            <input type="tel" id="partnerPhone" name="phone" required>
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label for="partnerState">State *</label>
                                <input type="text" id="partnerState" name="state" required>
                            </div>
                            <div class="form-group">
                                <label for="partnerDistrict">District *</label>
                                <input type="text" id="partnerDistrict" name="district" required>
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="partnerAddress">Business Address</label>
                            <textarea id="partnerAddress" name="address" rows="3"></textarea>
                        </div>

                        <div class="form-group">
                            <label for="partnerMessage">Why do you want to partner with YUWA GLOW?</label>
                            <textarea id="partnerMessage" name="message" rows="3"></textarea>
                        </div>

                        <div class="form-actions">
                            <button type="button" class="btn-secondary" id="cancelPartnerApplication">Cancel</button>
                            <button type="submit" class="cta-button" id="submitPartnerApplication">Submit Application</button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHtml);

        // Add modal styles if not already present
        if (!document.querySelector('#partnerModalStyles')) {
            const styleEl = document.createElement('style');
            styleEl.id = 'partnerModalStyles';
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
                    max-width: 550px;
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
                .form-group textarea,
                .form-group select {
                    width: 100%;
                    padding: 12px;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    font-size: 14px;
                }
                .form-group input:focus,
                .form-group textarea:focus {
                    border-color: var(--primary-gold);
                    outline: none;
                }
                .form-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 15px;
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
                }
                @media (max-width: 480px) {
                    .form-row {
                        grid-template-columns: 1fr;
                    }
                }
            `;
            document.head.appendChild(styleEl);
        }

        // Bind modal events
        const modal = document.getElementById('partnerApplicationModal');
        const overlay = modal.querySelector('.modal-overlay');
        const closeBtn = modal.querySelector('.modal-close');
        const cancelBtn = document.getElementById('cancelPartnerApplication');
        const form = document.getElementById('partnerApplicationForm');

        overlay.addEventListener('click', () => this.hidePartnerApplicationModal());
        closeBtn.addEventListener('click', () => this.hidePartnerApplicationModal());
        cancelBtn.addEventListener('click', () => this.hidePartnerApplicationModal());

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.submitPartnerApplication(form);
        });
    },

    showPartnerApplicationModal(type) {
        const modal = document.getElementById('partnerApplicationModal');
        const title = document.getElementById('partnerModalTitle');
        const typeInput = document.getElementById('partnerTypeInput');

        typeInput.value = type;
        title.textContent = type === 'super_stockist'
            ? 'Become a Super Stockist'
            : 'Become a Distributor';

        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    },

    hidePartnerApplicationModal() {
        const modal = document.getElementById('partnerApplicationModal');
        modal.style.display = 'none';
        document.body.style.overflow = '';
        document.getElementById('partnerApplicationForm').reset();
    },

    async submitPartnerApplication(form) {
        const submitBtn = document.getElementById('submitPartnerApplication');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Submitting...';
        submitBtn.disabled = true;

        try {
            const formData = new FormData(form);
            const res = await API.submitApplication(formData);

            if (res.success) {
                alert('Your application has been submitted successfully! Our team will review it and contact you soon.');
                this.hidePartnerApplicationModal();
            } else {
                throw new Error(res.message || 'Submission failed');
            }
        } catch (error) {
            console.error('Partner application error:', error);
            alert('Error: ' + (error.message || 'Failed to submit application. Please try again.'));
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    },

    renderLoading(container) {
        if (!container) return;
        container.innerHTML = `
            <div class="loading-state" style="grid-column: 1 / -1; text-align: center; padding: 40px;">
                <div class="loader">Loading partners...</div>
            </div>
        `;
    },

    renderError(container, message) {
        if (!container) return;
        container.innerHTML = `
            <div class="error-state" style="grid-column: 1 / -1; text-align: center; padding: 40px;">
                <p>${message}</p>
            </div>
        `;
    }
};

export default PartnersModule;
