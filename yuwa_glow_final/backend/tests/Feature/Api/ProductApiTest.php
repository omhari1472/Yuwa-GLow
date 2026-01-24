<?php

namespace Tests\Feature\Api;

use App\Models\Product;
use App\Models\ProductCategory;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProductApiTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;

    protected function setUp(): void
    {
        parent::setUp();
        $this->admin = User::factory()->create();
    }

    public function test_can_list_all_products(): void
    {
        $category = ProductCategory::factory()->create();
        Product::factory()->count(3)->create(['category_id' => $category->id]);

        $response = $this->actingAs($this->admin, 'sanctum')
            ->getJson('/api/products');

        $response->assertOk()
            ->assertJsonStructure([
                'success',
                'data' => [
                    '*' => ['id', 'name', 'price', 'status']
                ]
            ]);
    }

    public function test_can_get_active_products(): void
    {
        $category = ProductCategory::factory()->create();
        Product::factory()->count(2)->create(['category_id' => $category->id, 'status' => 'active']);
        Product::factory()->count(1)->create(['category_id' => $category->id, 'status' => 'inactive']);

        $response = $this->getJson('/api/products/active');

        $response->assertOk();
        $this->assertCount(2, $response->json('data'));
    }

    public function test_can_create_product_with_valid_data(): void
    {
        $category = ProductCategory::factory()->create();

        $productData = [
            'category_id' => $category->id,
            'name' => 'Test Product',
            'description' => 'A test product description',
            'price' => 99.99,
            'status' => 'active',
        ];

        $response = $this->actingAs($this->admin, 'sanctum')
            ->postJson('/api/products', $productData);

        $response->assertCreated()
            ->assertJsonFragment(['name' => 'Test Product']);

        $this->assertDatabaseHas('products', ['name' => 'Test Product']);
    }

    public function test_cannot_create_product_without_required_fields(): void
    {
        $response = $this->actingAs($this->admin, 'sanctum')
            ->postJson('/api/products', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['category_id', 'name', 'description', 'price']);
    }

    public function test_can_show_single_product(): void
    {
        $category = ProductCategory::factory()->create();
        $product = Product::factory()->create(['category_id' => $category->id]);

        $response = $this->getJson("/api/products/{$product->id}");

        $response->assertOk()
            ->assertJsonFragment(['id' => $product->id]);
    }

    public function test_can_update_product(): void
    {
        $category = ProductCategory::factory()->create();
        $product = Product::factory()->create(['category_id' => $category->id]);

        $response = $this->actingAs($this->admin, 'sanctum')
            ->patchJson("/api/products/{$product->id}", [
                'name' => 'Updated Product Name',
            ]);

        $response->assertOk();
        $this->assertDatabaseHas('products', ['id' => $product->id, 'name' => 'Updated Product Name']);
    }

    public function test_can_delete_product(): void
    {
        $category = ProductCategory::factory()->create();
        $product = Product::factory()->create(['category_id' => $category->id]);

        $response = $this->actingAs($this->admin, 'sanctum')
            ->deleteJson("/api/products/{$product->id}");

        $response->assertOk();
        $this->assertDatabaseMissing('products', ['id' => $product->id]);
    }
}
