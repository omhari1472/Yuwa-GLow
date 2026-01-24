const UI = {
    modal: {
        open(id) {
            document.getElementById(id).classList.add('active');
            document.body.style.overflow = 'hidden';
        },
        close(id) {
            document.getElementById(id).classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    },

    loading: {
        _overlay: null,

        init() {
            if (!this._overlay) {
                this._overlay = document.createElement('div');
                this._overlay.className = 'loading-overlay';
                this._overlay.innerHTML = '<div class="loading-spinner"></div>';
                document.body.appendChild(this._overlay);
            }
        },

        show() {
            this.init();
            this._overlay.classList.add('active');
        },

        hide() {
            if (this._overlay) {
                this._overlay.classList.remove('active');
            }
        },

        // Show skeleton loading in a table
        table(containerId, rows = 5, cols = 5) {
            const container = document.getElementById(containerId);
            if (!container) return;
            container.innerHTML = Array(rows).fill(0).map(() => `
                <tr>
                    ${Array(cols).fill(0).map((_, i) => `
                        <td><div class="skeleton skeleton-text ${i === 0 ? 'skeleton-thumb' : ''}" style="height: ${i === 0 ? '44px' : '14px'}; width: ${i === 0 ? '44px' : '100%'}"></div></td>
                    `).join('')}
                </tr>
            `).join('');
        },

        // Show skeleton loading in a grid
        grid(containerId, count = 6) {
            const container = document.getElementById(containerId);
            if (!container) return;
            container.innerHTML = Array(count).fill(0).map(() => `
                <div class="skeleton skeleton-card"></div>
            `).join('');
        },

        // Button loading state
        button(btn, loading = true) {
            if (loading) {
                btn.classList.add('btn-loading');
                btn.disabled = true;
            } else {
                btn.classList.remove('btn-loading');
                btn.disabled = false;
            }
        }
    },

    confirm({ title, message, onConfirm }) {
        const modal = document.getElementById('delete-modal');
        if (!modal) return;
        modal.querySelector('h3').innerText = title || 'Are you sure?';
        modal.querySelector('p').innerText = message || 'This action cannot be undone.';
        const confirmBtn = document.getElementById('confirm-delete-btn');
        const newConfirmBtn = confirmBtn.cloneNode(true);
        confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
        newConfirmBtn.onclick = async () => {
            await onConfirm();
            this.modal.close('delete-modal');
        };
        this.modal.open('delete-modal');
    },

    notify(message, type = 'success') {
        let container = document.querySelector('.toast-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'toast-container';
            document.body.appendChild(container);
        }
        const toast = document.createElement('div');
        toast.className = `toast ${type === 'error' ? 'toast-error' : ''}`;
        toast.innerHTML = `<div style="flex:1">${message}</div><div style="cursor:pointer; opacity:0.5" onclick="this.parentElement.remove()">&times;</div>`;
        container.appendChild(toast);
        setTimeout(() => {
            toast.classList.add('fade-out');
            setTimeout(() => toast.remove(), 500);
        }, 4000);
    },

    /**
     * Premium Dropdown Initializer
     * Transforms a container into a luxury dropdown
     */
    initDropdown(containerId, options, onSelect) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.classList.add('premium-dropdown');
        const selectedValue = options.find(opt => opt.selected)?.value || '';
        const selectedText = options.find(opt => opt.selected)?.text || 'Select Option';

        container.innerHTML = `
            <div class="dropdown-selected">${selectedText}</div>
            <ul class="dropdown-options">
                ${options.map(opt => `
                    <li class="dropdown-option ${opt.selected ? 'selected' : ''}" data-value="${opt.value}">
                        ${opt.text}
                    </li>
                `).join('')}
            </ul>
            <input type="hidden" name="${container.dataset.name || ''}" value="${selectedValue}">
        `;

        const selectedBox = container.querySelector('.dropdown-selected');
        const optionsList = container.querySelector('.dropdown-options');
        const hiddenInput = container.querySelector('input');

        // Toggle Open
        selectedBox.onclick = (e) => {
            e.stopPropagation();
            const isActive = container.classList.contains('active');
            // Close all other dropdowns
            document.querySelectorAll('.premium-dropdown').forEach(d => d.classList.remove('active'));
            if (!isActive) container.classList.add('active');
        };

        // Handle Selection
        container.querySelectorAll('.dropdown-option').forEach(option => {
            option.onclick = (e) => {
                e.stopPropagation();
                const value = option.dataset.value;
                const text = option.innerText;

                selectedBox.innerText = text;
                hiddenInput.value = value;
                
                container.querySelectorAll('.dropdown-option').forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');
                
                container.classList.remove('active');
                
                if (onSelect) onSelect(value, text);
            };
        });

        // Close on outside click
        window.addEventListener('click', () => container.classList.remove('active'));
    },

    renderEmptyState(containerId, { icon, title, message, btnText, btnId }) {
        const container = document.getElementById(containerId);
        if (!container) return;
        const isTable = container.tagName === 'TBODY';
        const content = `<div class="empty-state-container"><div class="empty-state-icon">${icon}</div><h3>${title}</h3><p>${message}</p>${btnText ? `<button class="btn btn-primary" id="${btnId}">${btnText}</button>` : ''}</div>`;
        if (isTable) {
            const colspan = container.closest('table').querySelectorAll('thead th').length;
            container.innerHTML = `<tr><td colspan="${colspan}">${content}</td></tr>`;
        } else {
            container.innerHTML = content;
        }
    }
};

    /**
     * Search/Filter Bar Initializer
     * Creates a reusable search bar with optional filters
     */
    initSearchFilter(containerId, { onSearch, filters = [], placeholder = 'Search...' }) {
        const container = document.getElementById(containerId);
        if (!container) return;

        let filterHtml = filters.map(f => `
            <select class="filter-select" data-filter="${f.key}">
                <option value="">${f.label}</option>
                ${f.options.map(opt => `<option value="${opt.value}">${opt.text}</option>`).join('')}
            </select>
        `).join('');

        container.innerHTML = `
            <div class="search-input-wrapper">
                <svg viewBox="0 0 24 24"><path fill="currentColor" d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z" /></svg>
                <input type="text" class="search-input" id="${containerId}-input" placeholder="${placeholder}">
            </div>
            ${filterHtml}
            <div class="search-count" id="${containerId}-count"></div>
        `;

        const input = document.getElementById(`${containerId}-input`);
        const selects = container.querySelectorAll('.filter-select');

        const triggerSearch = () => {
            const searchTerm = input.value.toLowerCase().trim();
            const activeFilters = {};
            selects.forEach(sel => {
                if (sel.value) activeFilters[sel.dataset.filter] = sel.value;
            });
            onSearch(searchTerm, activeFilters);
        };

        // Debounced search
        let debounceTimer;
        input.addEventListener('input', () => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(triggerSearch, 300);
        });

        selects.forEach(sel => sel.addEventListener('change', triggerSearch));

        return { triggerSearch };
    },

    /**
     * Update search count display
     */
    updateSearchCount(containerId, shown, total) {
        const countEl = document.getElementById(`${containerId}-count`);
        if (countEl) {
            if (shown === total) {
                countEl.innerHTML = `<strong>${total}</strong> items`;
            } else {
                countEl.innerHTML = `Showing <strong>${shown}</strong> of ${total}`;
            }
        }
    },

    /**
     * Generic filter function for arrays
     */
    filterItems(items, searchTerm, filters, searchFields = []) {
        return items.filter(item => {
            // Search term matching
            if (searchTerm) {
                const matchesSearch = searchFields.some(field => {
                    const value = field.split('.').reduce((obj, key) => obj?.[key], item);
                    return String(value || '').toLowerCase().includes(searchTerm);
                });
                if (!matchesSearch) return false;
            }

            // Filter matching
            for (const [key, value] of Object.entries(filters)) {
                const itemValue = key.split('.').reduce((obj, k) => obj?.[k], item);
                if (String(itemValue) !== value) return false;
            }

            return true;
        });
    },

    /**
     * Pagination utility
     */
    pagination: {
        paginate(items, page = 1, perPage = 10) {
            const total = items.length;
            const totalPages = Math.ceil(total / perPage);
            const start = (page - 1) * perPage;
            const end = start + perPage;

            return {
                data: items.slice(start, end),
                meta: {
                    currentPage: page,
                    perPage,
                    total,
                    totalPages,
                    from: total ? start + 1 : 0,
                    to: Math.min(end, total)
                }
            };
        },

        render(containerId, meta, onPageChange) {
            let container = document.getElementById(containerId);
            if (!container) {
                // Create pagination container if not exists
                const parent = document.querySelector('.table-card') || document.querySelector('.admin-section');
                if (parent) {
                    container = document.createElement('div');
                    container.id = containerId;
                    container.className = 'pagination-container';
                    parent.appendChild(container);
                } else {
                    return;
                }
            }

            const { currentPage, perPage, total, totalPages, from, to } = meta;

            if (total === 0) {
                container.innerHTML = '';
                return;
            }

            // Generate page buttons (show max 5 pages)
            let pageButtons = '';
            const startPage = Math.max(1, currentPage - 2);
            const endPage = Math.min(totalPages, startPage + 4);

            for (let i = startPage; i <= endPage; i++) {
                pageButtons += `<button class="pagination-btn ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
            }

            container.innerHTML = `
                <div class="pagination-info">
                    Showing <strong>${from}</strong> to <strong>${to}</strong> of <strong>${total}</strong> entries
                </div>
                <div class="pagination-controls">
                    <button class="pagination-btn" data-page="${currentPage - 1}" ${currentPage === 1 ? 'disabled' : ''}>
                        <svg viewBox="0 0 24 24"><path fill="currentColor" d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z"/></svg>
                        Prev
                    </button>
                    ${pageButtons}
                    <button class="pagination-btn" data-page="${currentPage + 1}" ${currentPage === totalPages ? 'disabled' : ''}>
                        Next
                        <svg viewBox="0 0 24 24"><path fill="currentColor" d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"/></svg>
                    </button>
                </div>
            `;

            // Add click handlers
            container.querySelectorAll('.pagination-btn[data-page]').forEach(btn => {
                btn.onclick = () => {
                    const page = parseInt(btn.dataset.page);
                    if (page >= 1 && page <= totalPages) {
                        onPageChange(page);
                    }
                };
            });
        }
    }
};

window.UI = UI;
export default UI;