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

    /**
     * Premium Confirm Modal Handler
     * @param {Object} options { title, message, onConfirm }
     */
    confirm({ title, message, onConfirm }) {
        const modal = document.getElementById('delete-modal');
        if (!modal) return;

        // Update text
        modal.querySelector('h3').innerText = title || 'Are you sure?';
        modal.querySelector('p').innerText = message || 'This action cannot be undone.';

        // Set up button
        const confirmBtn = document.getElementById('confirm-delete-btn');
        // Clear previous listeners
        const newConfirmBtn = confirmBtn.cloneNode(true);
        confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);

        newConfirmBtn.onclick = async () => {
            await onConfirm();
            this.modal.close('delete-modal');
        };

        this.modal.open('delete-modal');
    },

    renderEmptyState(containerId, { icon, title, message, btnText, btnId }) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const isTable = container.tagName === 'TBODY';
        const content = `
            <div class="empty-state-container">
                <div class="empty-state-icon">${icon}</div>
                <h3>${title}</h3>
                <p>${message}</p>
                ${btnText ? `<button class="btn btn-primary" id="${btnId}">${btnText}</button>` : ''}
            </div>
        `;

        if (isTable) {
            const table = container.closest('table');
            const colspan = table ? table.querySelectorAll('thead th').length : 5;
            container.innerHTML = `<tr><td colspan="${colspan}">${content}</td></tr>`;
        } else {
            container.innerHTML = content;
        }
    },

    notify(message, type = 'success') {
        alert(message);
    }
};

window.UI = UI;
export default UI;