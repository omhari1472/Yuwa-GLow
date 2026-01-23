<?php

namespace App\Services;

use App\Models\Application;
use Illuminate\Support\Facades\DB;

class ApplicationService
{
    protected $fileUpload;

    public function __construct(FileUploadService $fileUpload)
    {
        $this->fileUpload = $fileUpload;
    }

    /**
     * Submit a new application.
     */
    public function submitApplication(array $data, $resumeFile = null)
    {
        return DB::transaction(function () use ($data, $resumeFile) {
            if ($resumeFile) {
                $data['resume_url'] = $this->fileUpload->upload($resumeFile, 'resumes');
            }

            return Application::create($data);
        });
    }

    /**
     * Update application status with business logic.
     */
    public function updateStatus(Application $application, string $status)
    {
        // Add any business rules for status changes here
        $application->update(['status' => $status]);
        return $application;
    }

    /**
     * Delete application and its files.
     */
    public function deleteApplication(Application $application)
    {
        if ($application->resume_url) {
            $this->fileUpload->delete($application->resume_url);
        }
        return $application->delete();
    }
}
