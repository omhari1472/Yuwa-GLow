document.addEventListener('DOMContentLoaded', function() {

    // --- Sidebar Toggle ---
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    const adminGridContainer = document.querySelector('.admin-grid-container');
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => adminGridContainer.classList.toggle('sidebar-collapsed'));
    }

    // --- Profile Dropdown ---
    const profileTrigger = document.querySelector('.admin-profile-trigger');
    const profileDropdown = document.querySelector('.profile-dropdown');
    if (profileTrigger) {
        profileTrigger.addEventListener('click', (e) => {
            e.stopPropagation();
            profileDropdown.classList.toggle('active');
        });
        document.addEventListener('click', () => profileDropdown.classList.remove('active'));
    }

    // --- Reusable Components Logic ---
    const formModal = document.getElementById('formModal');
    const confirmDialog = document.getElementById('confirmDialog');
    
    // --- Modal Control ---
    function openModal() { if(formModal) formModal.classList.add('active'); }
    function closeModal() { if(formModal) formModal.classList.remove('active'); }

    const modalCloseBtns = document.querySelectorAll('.modal-close, .modal-cancel');
    modalCloseBtns.forEach(btn => btn.addEventListener('click', () => {
        closeModal();
        closeConfirm();
    }));

    // --- Confirmation Dialog ---
    function openConfirm() { if(confirmDialog) confirmDialog.classList.add('active'); }
    function closeConfirm() { if(confirmDialog) confirmDialog.classList.remove('active'); }
    
    const deleteBtns = document.querySelectorAll('.btn-delete');
    deleteBtns.forEach(btn => btn.addEventListener('click', openConfirm));
    
    // --- Toast Notifications ---
    const toastContainer = document.getElementById('toast-container');
    function showToast(message, type = 'success') {
        if (!toastContainer) return;
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        toastContainer.appendChild(toast);
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }
    
    // --- Page-Specific Logic ---
    
    // Product Page
    const createProductBtn = document.getElementById('createProductBtn');
    if(createProductBtn) createProductBtn.addEventListener('click', openModal);

    // Gallery Page
    const addImageBtn = document.getElementById('addImageBtn');
    const addVideoBtn = document.getElementById('addVideoBtn');
    const modalTitle = document.getElementById('modalTitle');
    const imageUploadField = document.getElementById('image-upload-field');
    const videoUrlField = document.getElementById('video-url-field');

    if(addImageBtn) {
        addImageBtn.addEventListener('click', () => {
            if(modalTitle) modalTitle.textContent = 'Add Image';
            if(imageUploadField) imageUploadField.style.display = 'block';
            if(videoUrlField) videoUrlField.style.display = 'none';
            openModal();
        });
    }
    if(addVideoBtn) {
        addVideoBtn.addEventListener('click', () => {
            if(modalTitle) modalTitle.textContent = 'Add Video';
            if(imageUploadField) imageUploadField.style.display = 'none';
            if(videoUrlField) videoUrlField.style.display = 'block';
            openModal();
        });
    }

    // Settings Page - Save Changes
    const settingsForms = document.querySelectorAll('.settings-form');
    settingsForms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevent actual form submission
            showToast('Settings saved successfully!', 'success');
        });
    });


    // --- Mock Actions ---
    const modalSaveBtn = document.getElementById('modalSave');
    if(modalSaveBtn) {
        modalSaveBtn.addEventListener('click', () => {
            closeModal();
            showToast('Item saved successfully!', 'success');
        });
    }

    const confirmDeleteBtn = document.getElementById('confirmDelete');
    if(confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', () => {
            closeConfirm();
            showToast('Item deleted successfully!', 'success');
        });
    }
});