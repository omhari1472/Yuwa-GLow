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

    renderEmptyState(containerId, { icon, title, message, btnText, btnId }) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const isTable = container.tagName === 'TBODY';
        const content = `
            <div class="empty-state-container">
                <div class="empty-state-icon">
                    ${icon}
                </div>
                <h3>${title}</h3>
                <p>${message}</p>
                ${btnText ? `<button class="btn btn-primary" id="${btnId}">${btnText}</button>` : ''}
            </div>
        `;

        if (isTable) {
            // Find how many columns to span
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
