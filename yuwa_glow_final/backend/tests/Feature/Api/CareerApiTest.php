<?php

namespace Tests\Feature\Api;

use App\Models\Career;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CareerApiTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;

    protected function setUp(): void
    {
        parent::setUp();
        $this->admin = User::factory()->create();
    }

    public function test_can_list_all_careers_as_admin(): void
    {
        Career::factory()->count(3)->create();

        $response = $this->actingAs($this->admin, 'sanctum')
            ->getJson('/api/careers');

        $response->assertOk()
            ->assertJsonStructure([
                'success',
                'data' => [
                    '*' => ['id', 'title', 'department', 'location', 'status']
                ]
            ]);
    }

    public function test_can_get_open_careers_only(): void
    {
        Career::factory()->count(2)->open()->create();
        Career::factory()->count(1)->create(['status' => 'closed']);

        $response = $this->getJson('/api/careers/open');

        $response->assertOk();
        $this->assertCount(2, $response->json('data'));
    }

    public function test_can_create_career_with_valid_data(): void
    {
        $careerData = [
            'title' => 'Software Engineer',
            'department' => 'Engineering',
            'location' => 'Remote',
            'description' => 'We are looking for a talented engineer.',
            'status' => 'open',
        ];

        $response = $this->actingAs($this->admin, 'sanctum')
            ->postJson('/api/careers', $careerData);

        $response->assertCreated()
            ->assertJsonFragment(['title' => 'Software Engineer']);

        $this->assertDatabaseHas('careers', ['title' => 'Software Engineer']);
    }

    public function test_cannot_create_career_without_required_fields(): void
    {
        $response = $this->actingAs($this->admin, 'sanctum')
            ->postJson('/api/careers', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['title', 'department', 'location', 'description', 'status']);
    }

    public function test_can_show_single_career(): void
    {
        $career = Career::factory()->create();

        $response = $this->getJson("/api/careers/{$career->id}");

        $response->assertOk()
            ->assertJsonFragment(['id' => $career->id]);
    }

    public function test_can_update_career(): void
    {
        $career = Career::factory()->create();

        $response = $this->actingAs($this->admin, 'sanctum')
            ->patchJson("/api/careers/{$career->id}", [
                'title' => 'Senior Engineer',
            ]);

        $response->assertOk();
        $this->assertDatabaseHas('careers', ['id' => $career->id, 'title' => 'Senior Engineer']);
    }

    public function test_can_delete_career(): void
    {
        $career = Career::factory()->create();

        $response = $this->actingAs($this->admin, 'sanctum')
            ->deleteJson("/api/careers/{$career->id}");

        $response->assertOk();
        $this->assertDatabaseMissing('careers', ['id' => $career->id]);
    }
}
