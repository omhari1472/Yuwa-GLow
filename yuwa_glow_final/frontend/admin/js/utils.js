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

window.UI = UI;
export default UI;