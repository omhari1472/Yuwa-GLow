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
    public function submitApplication(array $data, $resumeFile = null, $photoFile = null)
    {
        return DB::transaction(function () use ($data, $resumeFile, $photoFile) {
            // Check availability for partners
            if (in_array($data['application_type'], ['super_stockist', 'distributor'])) {
                $this->checkSlotAvailability($data['application_type'], $data['state'], $data['district'] ?? null);
            }

            if ($resumeFile) {
                $data['resume_url'] = $this->fileUpload->upload($resumeFile, 'resumes');
            }

            if ($photoFile) {
                $data['photo_url'] = $this->fileUpload->upload($photoFile, 'partners');
            }

            return Application::create($data);
        });
    }

    /**
     * Update application status with business logic.
     */
    public function updateStatus(Application $application, string $status)
    {
        if ($status === 'approved' && in_array($application->application_type, ['super_stockist', 'distributor'])) {
            $this->checkSlotAvailability(
                $application->application_type,
                $application->state,
                $application->district
            );
        }

        $application->update(['status' => $status]);
        return $application;
    }

    /**
     * Check if a partner slot is already occupied by an approved application.
     */
    protected function checkSlotAvailability($type, $state, $district = null)
    {
        $query = Application::where('status', 'approved')
            ->where('application_type', $type)
            ->where('state', $state);

        if ($type === 'distributor') {
            $query->where('district', $district);
        }

        if ($query->exists()) {
            $msg = $type === 'super_stockist' 
                ? "The Super Stockist slot for {$state} is already taken."
                : "The Distributor slot for {$district}, {$state} is already taken.";
            throw new \Exception($msg);
        }
    }

    /**
     * Delete application and its files.
     */
    public function deleteApplication(Application $application)
    {
        if ($application->resume_url) {
            $this->fileUpload->delete($application->resume_url);
        }
        if ($application->photo_url) {
            $this->fileUpload->delete($application->photo_url);
        }
        return $application->delete();
    }
}
