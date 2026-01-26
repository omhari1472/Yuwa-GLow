<?php

namespace Database\Factories;

use App\Models\Career;
use Illuminate\Database\Eloquent\Factories\Factory;

class CareerFactory extends Factory
{
    protected $model = Career::class;

    public function definition(): array
    {
        return [
            'title' => fake()->jobTitle(),
            'department' => fake()->randomElement(['Sales', 'Marketing', 'Operations', 'HR', 'R&D']),
            'location' => fake()->city(),
            'description' => fake()->paragraphs(2, true),
            'status' => fake()->randomElement(['open', 'closed']),
        ];
    }

    public function open(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'open',
        ]);
    }
}
