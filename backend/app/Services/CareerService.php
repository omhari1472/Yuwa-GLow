<?php

namespace App\Services;

use App\Models\Career;

class CareerService
{
    public function createCareer(array $data)
    {
        return Career::create($data);
    }

    public function updateCareer(Career $career, array $data)
    {
        $career->update($data);
        return $career;
    }

    public function deleteCareer(Career $career)
    {
        return $career->delete();
    }
}
