<?php

declare(strict_types=1);

use App\Events\Category\ReorderedCategory;
use App\Models\Category;
use App\Models\User;
use Illuminate\Support\Facades\Event;

uses(Illuminate\Foundation\Testing\RefreshDatabase::class);

// Хелпер: пользователь с проектом, у которого 3 категории (В планах, В работе, Завершено)
function userWithCategory(): array
{
    $user     = User::factory()->withFirstProject()->create();
    $project  = $user->projects()->first();
    $category = $project->categories()->sorted()->first();

    return [$user, $project, $category];
}

// ─── show ────────────────────────────────────────────────────────────────────

test('owner can show category', function () {
    [$user, $project, $category] = userWithCategory();

    $this->actingAs($user)
        ->getJson(route('api.categories.show', $category))
        ->assertOk()
        ->assertJson([
            'id'         => $category->id,
            'title'      => $category->title,
            'project_id' => $project->id,
        ]);
});

test('show returns 403 for non-owner', function () {
    [, , $category] = userWithCategory();
    $other = User::factory()->create();

    $this->actingAs($other)
        ->getJson(route('api.categories.show', $category))
        ->assertForbidden();
});

test('show returns 401 for guest', function () {
    [, , $category] = userWithCategory();

    $this->getJson(route('api.categories.show', $category))
        ->assertUnauthorized();
});

// ─── update ──────────────────────────────────────────────────────────────────

test('owner can update category title', function () {
    [$user, , $category] = userWithCategory();

    $this->actingAs($user)
        ->patchJson(route('api.categories.update', $category), ['title' => 'Новое название'])
        ->assertOk()
        ->assertJson(['title' => 'Новое название']);

    expect($category->fresh()->title)->toBe('Новое название');
});

test('update returns 403 for non-owner', function () {
    [, , $category] = userWithCategory();
    $other = User::factory()->create();

    $this->actingAs($other)
        ->patchJson(route('api.categories.update', $category), ['title' => 'Hack'])
        ->assertForbidden();
});

test('update returns 401 for guest', function () {
    [, , $category] = userWithCategory();

    $this->patchJson(route('api.categories.update', $category), ['title' => 'Hack'])
        ->assertUnauthorized();
});

test('update returns 422 when title is missing', function () {
    [$user, , $category] = userWithCategory();

    $this->actingAs($user)
        ->patchJson(route('api.categories.update', $category), [])
        ->assertUnprocessable()
        ->assertJsonValidationErrors('title');
});

test('update returns 422 when title exceeds 255 characters', function () {
    [$user, , $category] = userWithCategory();

    $this->actingAs($user)
        ->patchJson(route('api.categories.update', $category), ['title' => str_repeat('a', 256)])
        ->assertUnprocessable()
        ->assertJsonValidationErrors('title');
});

// ─── destroy ─────────────────────────────────────────────────────────────────

test('owner can delete category', function () {
    [$user, , $category] = userWithCategory();

    $this->actingAs($user)
        ->deleteJson(route('api.categories.destroy', $category))
        ->assertNoContent();

    $this->assertSoftDeleted($category);
});

test('destroy returns 403 for non-owner', function () {
    [, , $category] = userWithCategory();
    $other = User::factory()->create();

    $this->actingAs($other)
        ->deleteJson(route('api.categories.destroy', $category))
        ->assertForbidden();
});

test('destroy returns 401 for guest', function () {
    [, , $category] = userWithCategory();

    $this->deleteJson(route('api.categories.destroy', $category))
        ->assertUnauthorized();
});

// ─── reorder ─────────────────────────────────────────────────────────────────

test('owner can move category to first position', function () {
    Event::fake();

    [$user, $project, ] = userWithCategory();
    $categories = $project->categories()->sorted()->get();
    $last       = $categories->last();

    $this->actingAs($user)
        ->patchJson(route('api.categories.reorder', $last), ['move_after_id' => null])
        ->assertOk();

    $first = $project->categories()->sorted()->first();
    expect($first->id)->toBe($last->id);
});

test('owner can move category after another', function () {
    Event::fake();

    [$user, $project, ] = userWithCategory();
    $categories = $project->categories()->sorted()->get();
    $first      = $categories->first();
    $second     = $categories->get(1);
    $third      = $categories->last();

    $this->actingAs($user)
        ->patchJson(route('api.categories.reorder', $first), ['move_after_id' => $third->id])
        ->assertOk();

    $sorted = $project->categories()->sorted()->pluck('id')->all();
    expect($sorted)->toBe([$second->id, $third->id, $first->id]);
});

test('reorder broadcasts ReorderedCategory event', function () {
    Event::fake();

    [$user, $project, ] = userWithCategory();
    $categories = $project->categories()->sorted()->get();
    $last       = $categories->last();

    $this->actingAs($user)
        ->patchJson(route('api.categories.reorder', $last), ['move_after_id' => null]);

    Event::assertDispatched(ReorderedCategory::class, function ($event) use ($project) {
        $channels = array_map(fn($ch) => $ch->name, $event->broadcastOn());

        return in_array("presence-Project.{$project->id}", $channels);
    });
});

test('reorder returns 422 when move_after_id does not exist', function () {
    [$user, , $category] = userWithCategory();

    $this->actingAs($user)
        ->patchJson(route('api.categories.reorder', $category), ['move_after_id' => 99999])
        ->assertUnprocessable()
        ->assertJsonValidationErrors('move_after_id');
});

test('reorder returns 403 for non-owner', function () {
    [, , $category] = userWithCategory();
    $other = User::factory()->create();

    $this->actingAs($other)
        ->patchJson(route('api.categories.reorder', $category), ['move_after_id' => null])
        ->assertForbidden();
});

test('reorder returns 401 for guest', function () {
    [, , $category] = userWithCategory();

    $this->patchJson(route('api.categories.reorder', $category), ['move_after_id' => null])
        ->assertUnauthorized();
});