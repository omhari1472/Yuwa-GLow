<?php

namespace Tests\Feature\Api;

use App\Models\Blog;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BlogApiTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;

    protected function setUp(): void
    {
        parent::setUp();
        $this->admin = User::factory()->create();
    }

    public function test_can_list_all_blogs_as_admin(): void
    {
        Blog::factory()->count(3)->create();

        $response = $this->actingAs($this->admin, 'sanctum')
            ->getJson('/api/blogs');

        $response->assertOk()
            ->assertJsonStructure([
                'success',
                'data' => [
                    '*' => ['id', 'title', 'slug', 'status']
                ]
            ]);
    }

    public function test_can_get_published_blogs_only(): void
    {
        Blog::factory()->count(2)->published()->create();
        Blog::factory()->count(1)->draft()->create();

        $response = $this->getJson('/api/blogs/published');

        $response->assertOk();
        $this->assertCount(2, $response->json('data'));
    }

    public function test_can_create_blog_with_valid_data(): void
    {
        $blogData = [
            'title' => 'Test Blog Post',
            'content' => 'This is the blog content.',
            'status' => 'draft',
        ];

        $response = $this->actingAs($this->admin, 'sanctum')
            ->postJson('/api/blogs', $blogData);

        $response->assertCreated()
            ->assertJsonFragment(['title' => 'Test Blog Post']);

        $this->assertDatabaseHas('blogs', ['title' => 'Test Blog Post']);
    }

    public function test_cannot_create_blog_without_required_fields(): void
    {
        $response = $this->actingAs($this->admin, 'sanctum')
            ->postJson('/api/blogs', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['title', 'content', 'status']);
    }

    public function test_can_show_blog_by_slug(): void
    {
        $blog = Blog::factory()->create(['slug' => 'test-blog-slug']);

        $response = $this->getJson('/api/blogs/test-blog-slug');

        $response->assertOk()
            ->assertJsonFragment(['slug' => 'test-blog-slug']);
    }

    public function test_can_update_blog(): void
    {
        $blog = Blog::factory()->create();

        $response = $this->actingAs($this->admin, 'sanctum')
            ->patchJson("/api/blogs/{$blog->id}", [
                'title' => 'Updated Blog Title',
                'content' => 'Updated content',
                'status' => 'published',
            ]);

        $response->assertOk();
        $this->assertDatabaseHas('blogs', ['id' => $blog->id, 'title' => 'Updated Blog Title']);
    }

    public function test_can_delete_blog(): void
    {
        $blog = Blog::factory()->create();

        $response = $this->actingAs($this->admin, 'sanctum')
            ->deleteJson("/api/blogs/{$blog->id}");

        $response->assertOk();
        $this->assertDatabaseMissing('blogs', ['id' => $blog->id]);
    }
}
