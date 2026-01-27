import API from '../api.js';
import CONFIG from '../config.js';
import LOCATIONS from '../data/locations.js';

const PartnersModule = {
    stockists: [],
    distributors: [],
    allStates: [],
    occupiedSlots: { super_stockists: [], distributors: [] },

    async init() {
        const stockistGrid = document.querySelector('#stockistGrid');
        const distributorGrid = document.querySelector('#distributorGrid');

        if (!stockistGrid && !distributorGrid) return;

        this.renderLoading(stockistGrid);
        this.renderLoading(distributorGrid);

        try {
            const [stockistsRes, distributorsRes, availabilityRes] = await Promise.all([
                API.getStockists(),
                API.getDistributors(),
                API.getPartnerAvailability()
            ]);

            this.stockists = stockistsRes.data?.data || stockistsRes.data || [];
            this.distributors = distributorsRes.data?.data || distributorsRes.data || [];
            
            // Process availability data
            const availabilityData = availabilityRes.data?.data || availabilityRes.data || [];
            this.occupiedSlots.super_stockists = availabilityData
                .filter(a => a.application_type === 'super_stockist')
                .map(a => a.state);
            
            this.occupiedSlots.distributors = availabilityData
                .filter(a => a.application_type === 'distributor')
                .map(a => `${a.state}|${a.district}`);

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

        container.innerHTML = this.stockists.map(partner => this.renderPartnerCard(partner, 'stockist')).join('');
    },

    renderPartnerCard(partner, type) {
        const photoUrl = partner.photo_url
            ? `${CONFIG.STORAGE_URL}${partner.photo_url}`
            : null;

        const initials = partner.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

        return `
            <div class="partner-card fade-in" data-state="${partner.state || ''}" data-district="${partner.district || ''}">
                <div class="partner-card-header">
                    <div class="partner-avatar ${photoUrl ? 'has-photo' : ''}">
                        ${photoUrl
                            ? `<img src="${photoUrl}" alt="${partner.name}" loading="lazy">`
                            : `<span class="avatar-initials">${initials}</span>`
                        }
                    </div>
                    <div class="partner-badge ${type}">${type === 'stockist' ? 'Super Stockist' : 'Distributor'}</div>
                </div>
                <div class="partner-card-body">
                    <h3>${partner.company_name || partner.name}</h3>
                    <div class="partner-info">
                        <div class="partner-info-item">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                                <circle cx="12" cy="7" r="4"/>
                            </svg>
                            <span>${partner.name}</span>
                        </div>
                        <div class="partner-info-item">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                                <circle cx="12" cy="10" r="3"/>
                            </svg>
                            <span>${type === 'stockist' ? partner.state : `${partner.district}, ${partner.state}`}</span>
                        </div>
                        ${partner.phone ? `
                        <div class="partner-info-item">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                            </svg>
                            <span>${partner.phone}</span>
                        </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
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

        container.innerHTML = this.distributors.map(partner => this.renderPartnerCard(partner, 'distributor')).join('');
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
                    <div class="modal-header">
                        <h2 id="partnerModalTitle">Become a Partner</h2>
                        <button class="modal-close">&times;</button>
                    </div>
                    <form id="partnerApplicationForm">
                        <input type="hidden" name="application_type" id="partnerTypeInput">

                        <div class="modal-body">
                            <div class="form-row">
                                <div class="form-group">
                                    <input type="text" id="partnerName" name="name" required placeholder=" ">
                                    <label for="partnerName">Full Name *</label>
                                </div>
                                <div class="form-group">
                                    <input type="text" id="partnerCompany" name="company_name" placeholder=" ">
                                    <label for="partnerCompany">Firm Name</label>
                                </div>
                            </div>

                            <div class="form-row">
                                <div class="form-group">
                                    <input type="email" id="partnerEmail" name="email" required placeholder=" ">
                                    <label for="partnerEmail">Email Address *</label>
                                </div>
                                <div class="form-group">
                                    <input type="tel" id="partnerPhone" name="phone" required placeholder=" ">
                                    <label for="partnerPhone">Phone Number *</label>
                                </div>
                            </div>

                            <div class="form-row">
                                <div class="form-group">
                                    <div id="partnerState" data-name="state"></div>
                                    <label for="partnerState" style="position:static; pointer-events:auto; margin-bottom:8px">State *</label>
                                </div>
                                <div class="form-group">
                                    <div id="partnerDistrict" data-name="district"></div>
                                    <label for="partnerDistrict" style="position:static; pointer-events:auto; margin-bottom:8px">District *</label>
                                </div>
                            </div>

                            <div class="form-group">
                                <textarea id="partnerAddress" name="address" rows="2" placeholder=" "></textarea>
                                <label for="partnerAddress">Business Address</label>
                            </div>

                            <div class="form-group photo-upload-group">
                                <label style="position:static; pointer-events:auto; margin-bottom:6px; font-size:0.9rem">Your Photo (Optional)</label>
                                <div class="photo-upload-wrapper">
                                    <div class="photo-preview" id="partnerPhotoPreview">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                                            <circle cx="12" cy="7" r="4"/>
                                        </svg>
                                    </div>
                                    <div class="photo-upload-content">
                                        <input type="file" id="partnerPhoto" name="photo" accept="image/jpeg,image/png,image/webp" style="display:none">
                                        <button type="button" class="btn-upload" onclick="document.getElementById('partnerPhoto').click()">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                                <polyline points="17 8 12 3 7 8"/>
                                                <line x1="12" y1="3" x2="12" y2="15"/>
                                            </svg>
                                            Upload Photo
                                        </button>
                                        <span class="photo-hint">JPG, PNG or WebP. Max 2MB.</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="modal-footer">
                            <button type="button" class="btn-secondary" id="cancelPartnerApplication">Cancel</button>
                            <button type="submit" class="cta-button" id="submitPartnerApplication">Submit Application</button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHtml);

        if (!document.querySelector('#partnerModalStyles')) {
            const styleEl = document.createElement('style');
            styleEl.id = 'partnerModalStyles';
            styleEl.textContent = `
                .modal { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 2000; display: flex; align-items: center; justify-content: center; opacity: 0; visibility: hidden; transition: 0.3s; padding: 20px; box-sizing: border-box; }
                .modal.active { opacity: 1; visibility: visible; }
                .modal-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.6); backdrop-filter: blur(4px); }
                .modal-content { position: relative; background: white; width: 100%; max-width: 650px; border-radius: 16px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); transform: translateY(20px); transition: 0.3s; overflow: hidden; display: flex; flex-direction: column; max-height: calc(100vh - 40px); }
                .modal.active .modal-content { transform: translateY(0); }

                .modal-header { padding: 15px 25px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center; background: #fff; flex-shrink: 0; }
                .modal-header h2 { font-size: 1.3rem; margin: 0; color: #333; font-family: var(--font-primary); }
                .modal-close { background: none; border: none; font-size: 24px; cursor: pointer; color: #999; transition: 0.2s; line-height: 1; }
                .modal-close:hover { color: #333; }

                .modal-body { padding: 20px 25px; overflow-y: auto; flex: 1; min-height: 0; overscroll-behavior: contain; }
                .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
                .form-group { margin-bottom: 18px; position: relative; }
                .form-group label { position: absolute; top: 12px; left: 14px; font-size: 0.9rem; color: #999; pointer-events: none; transition: all 0.3s; background: white; padding: 0 5px; }
                .form-group input, .form-group textarea, .form-group select { width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 0.95rem; transition: 0.2s; outline: none; background: white; }
                
                .form-group input:focus, .form-group textarea:focus, .form-group select:focus { border-color: var(--primary-gold); }
                .form-group input:focus + label, .form-group input:not(:placeholder-shown) + label,
                .form-group textarea:focus + label, .form-group textarea:not(:placeholder-shown) + label {
                    top: -10px; left: 12px; font-size: 0.8rem; color: var(--primary-gold); font-weight: 700;
                }

                /* Premium Dropdown Styles */
                .premium-dropdown { position: relative; width: 100%; cursor: pointer; user-select: none; }
                .dropdown-selected {
                    width: 100%; padding: 12px 16px; border: 1.5px solid #e5e7eb; border-radius: 10px;
                    background: white; display: flex; justify-content: space-between; align-items: center;
                    font-size: 1rem; color: #333; transition: 0.2s; min-height: 48px;
                }
                .premium-dropdown:hover .dropdown-selected { border-color: var(--primary-gold); }
                .premium-dropdown.active .dropdown-selected { border-color: var(--primary-gold); box-shadow: 0 0 0 4px var(--warm-cream); }
                .dropdown-selected::after { content: ''; width: 8px; height: 8px; border-right: 2px solid var(--primary-gold); border-bottom: 2px solid var(--primary-gold); transform: rotate(45deg); transition: 0.3s; margin-bottom: 4px; }
                .premium-dropdown.active .dropdown-selected::after { transform: rotate(-135deg); margin-bottom: -4px; }
                .dropdown-options {
                    position: absolute; top: calc(100% + 8px); left: 0; width: 100%; background: white; border-radius: 12px;
                    box-shadow: 0 10px 25px rgba(0,0,0,0.1); border: 1px solid #e5e7eb; z-index: 1100;
                    max-height: 250px; overflow-y: auto; opacity: 0; visibility: hidden; transform: translateY(10px); transition: 0.2s; list-style: none; padding: 0;
                }
                .premium-dropdown.active .dropdown-options { opacity: 1; visibility: visible; transform: translateY(0); }
                .dropdown-option { padding: 12px 16px; font-size: 14px; transition: 0.2s; cursor: pointer; color: #333; }
                .dropdown-option:hover { background: var(--warm-cream); color: var(--primary-gold); }
                .dropdown-option.selected { background: #f9fafb; font-weight: 600; color: var(--primary-gold); }

                .modal-footer { padding: 15px 25px; border-top: 1px solid #eee; display: flex; justify-content: flex-end; gap: 12px; background: #f9fafb; flex-shrink: 0; }
                .btn-secondary { padding: 10px 20px; background: white; border: 1.5px solid #e5e7eb; border-radius: 50px; cursor: pointer; font-weight: 600; transition: 0.2s; font-size: 0.9rem; }
                .btn-secondary:hover { border-color: #999; }
                .modal-footer .cta-button { padding: 10px 20px; font-size: 0.9rem; }
                
                /* Photo Upload */
                .photo-upload-group { margin-top: 5px; margin-bottom: 0 !important; }
                .photo-upload-wrapper { display: flex; align-items: center; gap: 15px; padding: 12px; background: #f9fafb; border-radius: 10px; border: 1.5px dashed #e5e7eb; }
                .photo-preview { width: 60px; height: 60px; border-radius: 50%; background: #e5e7eb; display: flex; align-items: center; justify-content: center; overflow: hidden; flex-shrink: 0; }
                .photo-preview svg { color: #9ca3af; width: 28px; height: 28px; }
                .photo-preview img { width: 100%; height: 100%; object-fit: cover; }
                .photo-upload-content { display: flex; flex-direction: column; gap: 6px; }
                .btn-upload { display: inline-flex; align-items: center; gap: 6px; padding: 8px 14px; background: white; border: 1.5px solid var(--primary-gold); color: var(--primary-gold); border-radius: 8px; font-weight: 600; font-size: 13px; cursor: pointer; transition: 0.2s; }
                .btn-upload:hover { background: var(--primary-gold); color: white; }
                .photo-hint { font-size: 11px; color: #9ca3af; }

                @media (max-width: 768px) {
                    .modal { padding: 0 10px; align-items: flex-end; }
                    .modal-content {
                        width: calc(100% - 20px);
                        max-width: calc(100% - 20px);
                        max-height: 85vh;
                        border-radius: 20px 20px 0 0;
                        margin: 0 auto 0 auto;
                    }
                    .modal-header { padding: 16px 20px; }
                    .modal-header h2 { font-size: 1.1rem; }
                    .modal-body {
                        padding: 16px 20px;
                        max-height: calc(90vh - 130px);
                        overflow-y: auto;
                        -webkit-overflow-scrolling: touch;
                    }
                    .modal-footer {
                        padding: 12px 20px;
                        position: sticky;
                        bottom: 0;
                        background: #f9fafb;
                    }
                    .form-row { grid-template-columns: 1fr; gap: 0; }
                    .form-group { margin-bottom: 14px; }
                    .form-group input, .form-group textarea { padding: 12px 14px; font-size: 16px; }
                    .photo-upload-wrapper { flex-direction: row; padding: 10px; }
                    .photo-preview { width: 50px; height: 50px; }
                    .btn-secondary, .modal-footer .cta-button { padding: 12px 16px; font-size: 14px; flex: 1; text-align: center; }
                    .dropdown-selected { min-height: 44px; padding: 10px 14px; }
                }
            `;
            document.head.appendChild(styleEl);
        }

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

        // Photo preview handler
        const photoInput = document.getElementById('partnerPhoto');
        const photoPreview = document.getElementById('partnerPhotoPreview');
        photoInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                if (file.size > 2 * 1024 * 1024) {
                    if (window.notify) window.notify('Photo must be less than 2MB', 'error');
                    e.target.value = '';
                    return;
                }
                const reader = new FileReader();
                reader.onload = (event) => {
                    photoPreview.innerHTML = `<img src="${event.target.result}" alt="Preview">`;
                };
                reader.readAsDataURL(file);
            }
        });
    },

    initDropdown(containerId, options, onSelect) {
        const container = document.getElementById(containerId);
        if (!container) return;

        // If container already has structure, just update options
        if (!container.querySelector('.dropdown-selected')) {
            container.classList.add('premium-dropdown');
            container.innerHTML = `
                <div class="dropdown-selected">Select Option</div>
                <ul class="dropdown-options"></ul>
                <input type="hidden" name="${container.dataset.name || ''}" id="${containerId}-input">
            `;

            const selectedBox = container.querySelector('.dropdown-selected');
            
            // Toggle Open
            selectedBox.onclick = (e) => {
                e.stopPropagation();
                const isActive = container.classList.contains('active');
                document.querySelectorAll('.premium-dropdown').forEach(d => d.classList.remove('active'));
                if (!isActive) container.classList.add('active');
            };

            // Close on outside click
            window.addEventListener('click', () => container.classList.remove('active'));
        }

        const optionsList = container.querySelector('.dropdown-options');
        const hiddenInput = container.querySelector('input');
        const selectedBox = container.querySelector('.dropdown-selected');

        // Update options
        optionsList.innerHTML = options.map(opt => `
            <li class="dropdown-option ${opt.selected ? 'selected' : ''}" data-value="${opt.value}">
                ${opt.text}
            </li>
        `).join('');

        // Set initial selected value
        const initialSelected = options.find(opt => opt.selected);
        if (initialSelected) {
            selectedBox.innerText = initialSelected.text;
            hiddenInput.value = initialSelected.value;
        } else {
            selectedBox.innerText = 'Select Option';
            hiddenInput.value = '';
        }

        // Bind click events for new options
        optionsList.querySelectorAll('.dropdown-option').forEach(option => {
            option.onclick = (e) => {
                e.stopPropagation();
                const value = option.dataset.value;
                const text = option.innerText;

                selectedBox.innerText = text;
                hiddenInput.value = value;
                
                optionsList.querySelectorAll('.dropdown-option').forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');
                
                container.classList.remove('active');
                
                if (onSelect) onSelect(value, text);
            };
        });
    },

    updateLocationDropdowns(type) {
        const allStates = Object.keys(LOCATIONS).sort();
        const stateOptions = allStates
            .filter(state => !(type === 'super_stockist' && this.occupiedSlots.super_stockists.includes(state)))
            .map(state => ({ value: state, text: state }));

        // Initialize State Dropdown
        this.initDropdown('partnerState', stateOptions, (selectedState) => {
            this.updateDistrictDropdown(selectedState);
        });

        // Reset District Dropdown
        this.initDropdown('partnerDistrict', [{ value: '', text: 'Select State First', selected: true }]);
    },

    updateDistrictDropdown(selectedState) {
        const typeInput = document.getElementById('partnerTypeInput');
        const type = typeInput.value;

        if (!selectedState || !LOCATIONS[selectedState]) {
            this.initDropdown('partnerDistrict', [{ value: '', text: 'Select State First', selected: true }]);
            return;
        }

        const districts = LOCATIONS[selectedState].sort();
        const districtOptions = districts
            .filter(district => {
                if (type === 'distributor') {
                    const key = `${selectedState}|${district}`;
                    return !this.occupiedSlots.distributors.includes(key);
                }
                return true;
            })
            .map(d => ({ value: d, text: d }));

        if (districtOptions.length === 0) {
             this.initDropdown('partnerDistrict', [{ value: '', text: 'No Available Districts', selected: true }]);
        } else {
             this.initDropdown('partnerDistrict', districtOptions);
        }
    },

    showPartnerApplicationModal(type) {
        const modal = document.getElementById('partnerApplicationModal');
        const title = document.getElementById('partnerModalTitle');
        const typeInput = document.getElementById('partnerTypeInput');
        const districtGroup = document.getElementById('partnerDistrict').closest('.form-group');

        typeInput.value = type;
        title.textContent = type === 'super_stockist'
            ? 'Become a Super Stockist'
            : 'Become a Distributor';

        // Toggle district field visibility
        if (type === 'super_stockist') {
            districtGroup.style.display = 'none';
            document.getElementById('partnerDistrict').disabled = true;
            document.getElementById('partnerDistrict').required = false;
        } else {
            districtGroup.style.display = 'block';
            document.getElementById('partnerDistrict').required = true;
        }

        // Update dropdowns based on type and availability
        this.updateLocationDropdowns(type);

        modal.style.display = 'flex';
        setTimeout(() => modal.classList.add('active'), 10);
        document.body.style.overflow = 'hidden';
    },

    hidePartnerApplicationModal() {
        const modal = document.getElementById('partnerApplicationModal');
        modal.classList.remove('active');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
        document.body.style.overflow = '';
        document.getElementById('partnerApplicationForm').reset();

        // Reset photo preview
        const photoPreview = document.getElementById('partnerPhotoPreview');
        if (photoPreview) {
            photoPreview.innerHTML = `
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                </svg>
            `;
        }
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
                if (window.notify) window.notify('Application submitted successfully! We will contact you soon.');
                this.hidePartnerApplicationModal();
            } else {
                throw new Error(res.message || 'Submission failed');
            }
        } catch (error) {
            console.error('Partner application error:', error);
            if (window.notify) window.notify(error.message || 'Failed to submit application.', 'error');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    },

    renderLoading(container) {
        if (!container) return;
        // Show skeleton loaders
        const skeletons = Array(3).fill(`
            <div class="partner-card skeleton-card" style="background: white; border-radius: 20px; overflow: hidden;">
                <div style="padding: 25px 25px 15px; display: flex; justify-content: space-between; align-items: flex-start;">
                    <div class="skeleton" style="width: 70px; height: 70px; border-radius: 50%;"></div>
                    <div class="skeleton" style="width: 100px; height: 28px; border-radius: 20px;"></div>
                </div>
                <div style="padding: 20px 25px 25px;">
                    <div class="skeleton skeleton-text medium" style="margin-bottom: 15px;"></div>
                    <div class="skeleton skeleton-text long" style="margin-bottom: 10px;"></div>
                    <div class="skeleton skeleton-text short"></div>
                </div>
            </div>
        `).join('');
        container.innerHTML = skeletons;
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
