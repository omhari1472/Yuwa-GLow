import API from './api.js';

document.addEventListener('DOMContentLoaded', async () => {
    const careerGrid = document.querySelector('.career-grid');
    if (!careerGrid) return;

    try {
        const res = await API.getCareers();
        
        if (res.success) {
            const careers = res.data.data || res.data || [];
            
            if (careers.length === 0) {
                careerGrid.innerHTML = `
                    <div style="grid-column: 1 / -1; text-align: center; padding: 100px 0;">
                        <h3 style="font-size: 24px; color: var(--dark-text);">No Open Positions</h3>
                        <p style="color: #6b7280; margin-top: 10px;">We aren't hiring right now, but we're always looking for talent. Check back soon!</p>
                    </div>
                `;
                return;
            }

            careerGrid.innerHTML = careers.map(job => `
                <div class="career-card fade-in">
                    <h2 class="job-title">${job.title}</h2>
                    <p class="job-meta">${job.department} | ${job.location}</p>
                    <p class="job-description">${job.description}</p>
                    <a href="#apply" class="apply-btn" onclick="document.getElementById('career_id').value='${job.id}'; document.getElementById('job_title_display').innerText='${job.title}';">Apply Now</a>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Error loading careers:', error);
    }
});