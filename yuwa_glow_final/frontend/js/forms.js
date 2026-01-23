document.addEventListener('DOMContentLoaded', () => {
    // Contact Form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData.entries());

            try {
                await API.submitEnquiry(data);
                alert('Thank you for your enquiry. We will get back to you soon.');
                contactForm.reset();
            } catch (error) {
                alert('Error: ' + error.message);
            }
        });
    }

    // Career Application Form
    const applicationForm = document.getElementById('applicationForm');
    if (applicationForm) {
        applicationForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(applicationForm);

            try {
                const response = await API.submitApplication(formData);
                if (response.id) {
                    alert('Application submitted successfully!');
                    applicationForm.reset();
                } else {
                    throw new Error(response.message || 'Submission failed');
                }
            } catch (error) {
                alert('Error: ' + error.message);
            }
        });
    }
});
