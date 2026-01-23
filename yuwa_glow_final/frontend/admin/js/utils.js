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
        toast.innerHTML = `
            <div style="flex:1">${message}</div>
            <div style="cursor:pointer; opacity:0.5" onclick="this.parentElement.remove()">&times;</div>
        `;
        
        container.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('fade-out');
            setTimeout(() => toast.remove(), 500);
        }, 4000);
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
    }
};

window.UI = UI;
export default UI;
