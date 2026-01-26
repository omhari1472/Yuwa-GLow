<?php

namespace Tests\Feature\Api;

use App\Models\ContactEnquiry;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ContactEnquiryApiTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;

    protected function setUp(): void
    {
        parent::setUp();
        $this->admin = User::factory()->create();
    }

    public function test_can_list_all_enquiries_as_admin(): void
    {
        ContactEnquiry::factory()->count(3)->create();

        $response = $this->actingAs($this->admin, 'sanctum')
            ->getJson('/api/enquiries');

        $response->assertOk();
        $this->assertCount(3, $response->json('data'));
    }

    public function test_can_submit_contact_enquiry(): void
    {
        $enquiryData = [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'phone' => '1234567890',
            'message' => 'I have a question about your products.',
        ];

        $response = $this->postJson('/api/enquiries', $enquiryData);

        $response->assertCreated()
            ->assertJsonFragment(['name' => 'John Doe']);

        $this->assertDatabaseHas('contact_enquiries', ['email' => 'john@example.com']);
    }

    public function test_cannot_submit_enquiry_without_required_fields(): void
    {
        $response = $this->postJson('/api/enquiries', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name', 'email', 'message']);
    }

    public function test_can_reply_to_enquiry(): void
    {
        $enquiry = ContactEnquiry::factory()->create();

        $response = $this->actingAs($this->admin, 'sanctum')
            ->postJson("/api/enquiries/{$enquiry->id}/reply", [
                'reply' => 'Thank you for reaching out!',
            ]);

        $response->assertOk();
        $this->assertDatabaseHas('contact_enquiries', [
            'id' => $enquiry->id,
            'status' => 'replied',
        ]);
    }

    public function test_can_update_enquiry_status(): void
    {
        $enquiry = ContactEnquiry::factory()->create();

        $response = $this->actingAs($this->admin, 'sanctum')
            ->patchJson("/api/enquiries/{$enquiry->id}/status", [
                'status' => 'closed',
            ]);

        $response->assertOk();
        $this->assertDatabaseHas('contact_enquiries', [
            'id' => $enquiry->id,
            'status' => 'closed',
        ]);
    }

    public function test_can_delete_enquiry(): void
    {
        $enquiry = ContactEnquiry::factory()->create();

        $response = $this->actingAs($this->admin, 'sanctum')
            ->deleteJson("/api/enquiries/{$enquiry->id}");

        $response->assertOk();
        $this->assertDatabaseMissing('contact_enquiries', ['id' => $enquiry->id]);
    }
}
