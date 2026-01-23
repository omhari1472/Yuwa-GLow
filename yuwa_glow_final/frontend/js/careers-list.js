document.addEventListener('DOMContentLoaded', async () => {
    const careerGrid = document.querySelector('.career-grid');
    const jobSelect = document.getElementById('job');

    try {
        const careers = await API.getCareers();
        
        if (careerGrid) {
            careerGrid.innerHTML = careers.map(job => `
                <div class="career-card fade-in">
                    <h2 class="job-title">${job.title}</h2>
                    <p class="job-meta">${job.department} | ${job.location}</p>
                    <p class="job-description">${job.description}</p>
                    <a href="#apply" class="apply-btn" onclick="document.getElementById('career_id').value='${job.id}'; document.getElementById('job_title_display').innerText='${job.title}';">Apply Now</a>
                </div>
            `).join('');
        }

        if (jobSelect) {
            // Optional: If you still want the select dropdown
            jobSelect.innerHTML += careers.map(job => `<option value="${job.id}">${job.title}</option>`).join('');
        }
    } catch (error) {
        console.error('Error loading careers:', error);
    }
});
