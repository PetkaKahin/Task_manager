<?php

declare(strict_types=1);

use App\Events\Category\CreatedCategory;
use App\Events\Category\DeletedCategory;
use App\Events\Category\UpdatedCategory;
use App\Models\Category;
use App\Models\Project;
use App\Models\User;
use Illuminate\Support\Facades\Event;

uses(Illuminate\Foundation\Testing\RefreshDatabase::class);

// Хелпер: пользователь с проектом и категорией
function webCategorySetup(): array
{
    $user     = User::factory()->create();
    $project  = Project::factory()->create();
    $user->projects()->attach($project->id);
    $category = Category::factory()->create(['project_id' => $project->id, 'position' => null]);

    return [$user, $project, $category];
}

// ─── create ──────────────────────────────────────────────────────────────────

test('create page is accessible for authenticated user', function () {
    [$user] = webCategorySetup();

    $this->actingAs($user)
        ->get(route('categories.create'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('User/Category/NewCategory'));
});

test('create returns 401 for guest', function () {
    $this->get(route('categories.create'))
        ->assertRedirect(route('login'));
});

// ─── store ───────────────────────────────────────────────────────────────────

test('owner can create a category', function () {
    [$user, $project] = webCategorySetup();

    $this->actingAs($user)
        ->post(route('categories.store'), [
            'title'      => 'Новая категория',
            'project_id' => $project->id,
        ])
        ->assertRedirect(route('projects.show', $project->id));

    $this->assertDatabaseHas('categories', [
        'title'      => 'Новая категория',
        'project_id' => $project->id,
    ]);
});

test('store broadcasts CreatedCategory event', function () {
    [$user, $project] = webCategorySetup();

    Event::fake([CreatedCategory::class]);

    $this->actingAs($user)
        ->post(route('categories.store'), [
            'title'      => 'Новая категория',
            'project_id' => $project->id,
        ]);

    Event::assertDispatched(CreatedCategory::class, function ($event) use ($project) {
        $channels = array_map(fn ($ch) => $ch->name, $event->broadcastOn());

        return in_array("presence-Project.{$project->id}", $channels);
    });
});

test('store returns 401 for guest', function () {
    [, $project] = webCategorySetup();

    $this->post(route('categories.store'), [
        'title'      => 'Новая категория',
        'project_id' => $project->id,
    ])->assertRedirect(route('login'));
});

test('store returns 422 when title is missing', function () {
    [$user, $project] = webCategorySetup();

    $this->actingAs($user)
        ->post(route('categories.store'), ['project_id' => $project->id])
        ->assertSessionHasErrors('title');
});

test('store returns 422 when title exceeds 255 characters', function () {
    [$user, $project] = webCategorySetup();

    $this->actingAs($user)
        ->post(route('categories.store'), [
            'title'      => str_repeat('a', 256),
            'project_id' => $project->id,
        ])
        ->assertSessionHasErrors('title');
});

test('store returns 422 when project_id is missing', function () {
    [$user] = webCategorySetup();

    $this->actingAs($user)
        ->post(route('categories.store'), ['title' => 'Test'])
        ->assertSessionHasErrors('project_id');
});

test('store returns 422 when project_id belongs to another user', function () {
    [$user] = webCategorySetup();
    $foreignProject = Project::factory()->create();

    $this->actingAs($user)
        ->post(route('categories.store'), [
            'title'      => 'Test',
            'project_id' => $foreignProject->id,
        ])
        ->assertSessionHasErrors('project_id');
});

// ─── edit ────────────────────────────────────────────────────────────────────

test('owner can access edit page', function () {
    [$user, , $category] = webCategorySetup();

    $this->actingAs($user)
        ->get(route('categories.edit', $category))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('User/Category/EditCategory')
            ->has('category')
        );
});

test('edit returns 401 for guest', function () {
    [, , $category] = webCategorySetup();

    $this->get(route('categories.edit', $category))
        ->assertRedirect(route('login'));
});

test('edit returns 403 for non-owner', function () {
    [, , $category] = webCategorySetup();
    $other = User::factory()->create();

    $this->actingAs($other)
        ->get(route('categories.edit', $category))
        ->assertForbidden();
});

// ─── update ──────────────────────────────────────────────────────────────────

test('owner can update category title', function () {
    [$user, $project, $category] = webCategorySetup();

    $this->actingAs($user)
        ->patch(route('categories.update', $category), ['title' => 'Обновлённое название'])
        ->assertRedirect(route('projects.show', $project->id));

    expect($category->fresh()->title)->toBe('Обновлённое название');
});

test('update broadcasts UpdatedCategory event', function () {
    [$user, $project, $category] = webCategorySetup();

    Event::fake([UpdatedCategory::class]);

    $this->actingAs($user)
        ->patch(route('categories.update', $category), ['title' => 'Обновлённое название']);

    Event::assertDispatched(UpdatedCategory::class, function ($event) use ($project) {
        $channels = array_map(fn ($ch) => $ch->name, $event->broadcastOn());

        return in_array("presence-Project.{$project->id}", $channels);
    });
});

test('update returns 401 for guest', function () {
    [, , $category] = webCategorySetup();

    $this->patch(route('categories.update', $category), ['title' => 'Hack'])
        ->assertRedirect(route('login'));
});

test('update returns 403 for non-owner', function () {
    [, , $category] = webCategorySetup();
    $other = User::factory()->create();

    $this->actingAs($other)
        ->patch(route('categories.update', $category), ['title' => 'Hack'])
        ->assertForbidden();
});

test('update returns 422 when title is missing', function () {
    [$user, , $category] = webCategorySetup();

    $this->actingAs($user)
        ->patch(route('categories.update', $category), [])
        ->assertSessionHasErrors('title');
});

test('update returns 422 when title exceeds 255 characters', function () {
    [$user, , $category] = webCategorySetup();

    $this->actingAs($user)
        ->patch(route('categories.update', $category), ['title' => str_repeat('a', 256)])
        ->assertSessionHasErrors('title');
});

// ─── destroy ─────────────────────────────────────────────────────────────────

test('owner can delete category', function () {
    [$user, , $category] = webCategorySetup();

    $this->actingAs($user)
        ->delete(route('categories.destroy', $category))
        ->assertNoContent();

    $this->assertSoftDeleted($category);
});

test('destroy broadcasts DeletedCategory event', function () {
    [$user, $project, $category] = webCategorySetup();

    Event::fake([DeletedCategory::class]);

    $this->actingAs($user)
        ->delete(route('categories.destroy', $category));

    Event::assertDispatched(DeletedCategory::class, function ($event) use ($project) {
        $channels = array_map(fn ($ch) => $ch->name, $event->broadcastOn());

        return in_array("presence-Project.{$project->id}", $channels);
    });
});

test('destroy returns 401 for guest', function () {
    [, , $category] = webCategorySetup();

    $this->delete(route('categories.destroy', $category))
        ->assertRedirect(route('login'));
});

test('destroy returns 403 for non-owner', function () {
    [, , $category] = webCategorySetup();
    $other = User::factory()->create();

    $this->actingAs($other)
        ->delete(route('categories.destroy', $category))
        ->assertForbidden();
});