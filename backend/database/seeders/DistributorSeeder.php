<?php

namespace Database\Seeders;

use App\Models\Application;
use Illuminate\Database\Seeder;

class DistributorSeeder extends Seeder
{
    /**
     * Seed distributors for Jharkhand districts.
     */
    public function run(): void
    {
        $distributors = [
            [
                'name' => 'Yuva Glow Distributor - Ranchi',
                'email' => 'distributor.ranchi@yuvaglow.com',
                'phone' => '9000000001',
                'company_name' => 'Yuva Glow Ranchi',
                'state' => 'Jharkhand',
                'district' => 'Ranchi',
                'address' => 'Ranchi, Jharkhand',
            ],
            [
                'name' => 'Yuva Glow Distributor - Tata',
                'email' => 'distributor.tata@yuvaglow.com',
                'phone' => '9000000002',
                'company_name' => 'Yuva Glow Tata',
                'state' => 'Jharkhand',
                'district' => 'East Singhbhum',
                'address' => 'Tata (Jamshedpur), East Singhbhum, Jharkhand',
            ],
            [
                'name' => 'Yuva Glow Distributor - Bokaro',
                'email' => 'distributor.bokaro@yuvaglow.com',
                'phone' => '9000000003',
                'company_name' => 'Yuva Glow Bokaro',
                'state' => 'Jharkhand',
                'district' => 'Bokaro',
                'address' => 'Bokaro, Jharkhand',
            ],
            [
                'name' => 'Yuva Glow Distributor - Dhanbad',
                'email' => 'distributor.dhanbad@yuvaglow.com',
                'phone' => '9000000004',
                'company_name' => 'Yuva Glow Dhanbad',
                'state' => 'Jharkhand',
                'district' => 'Dhanbad',
                'address' => 'Dhanbad, Jharkhand',
            ],
            [
                'name' => 'Yuva Glow Distributor - Ramgarh',
                'email' => 'distributor.ramgarh@yuvaglow.com',
                'phone' => '9000000005',
                'company_name' => 'Yuva Glow Ramgarh',
                'state' => 'Jharkhand',
                'district' => 'Ramgarh',
                'address' => 'Ramgarh, Jharkhand',
            ],
        ];

        foreach ($distributors as $distributor) {
            Application::updateOrCreate(
                [
                    'application_type' => 'distributor',
                    'state' => $distributor['state'],
                    'district' => $distributor['district'],
                ],
                array_merge($distributor, [
                    'application_type' => 'distributor',
                    'status' => 'approved',
                ])
            );
        }
    }
}
