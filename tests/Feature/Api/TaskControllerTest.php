<?php

declare(strict_types=1);

use App\Events\Task\CreatedTask;
use App\Events\Task\ReorderedTask;
use App\Events\Task\UpdatedTask;
use App\Models\Category;
use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use Illuminate\Support\Facades\Event;

uses(Illuminate\Foundation\Testing\RefreshDatabase::class);

// Хелпер: пользователь с проектом, категорией и одной таской
function userWithTask(): array
{
    $user     = User::factory()->create();
    $project  = Project::factory()->create();
    $user->projects()->attach($project->id);
    $category = Category::factory()->create(['project_id' => $project->id, 'position' => null]);
    $task     = Task::factory()->create(['category_id' => $category->id, 'position' => null]);

    return [$user, $project, $category, $task];
}

// Хелпер: пользователь с проектом, категорией и N тасками (отсортированы по position)
function userWithTasks(int $count = 3): array
{
    $user     = User::factory()->create();
    $project  = Project::factory()->create();
    $user->projects()->attach($project->id);
    $category = Category::factory()->create(['project_id' => $project->id, 'position' => null]);

    for ($i = 0; $i < $count; $i++) {
        Task::factory()->create(['category_id' => $category->id, 'position' => null]);
    }

    return [$user, $project, $category, Task::sorted()->where('category_id', $category->id)->get()];
}

// ─── store ───────────────────────────────────────────────────────────────────

test('owner can create a task', function () {
    [$user, , $category] = userWithTask();

    $this->actingAs($user)
        ->postJson(route('api.tasks.store'), ['category_id' => $category->id])
        ->assertCreated()
        ->assertJsonStructure(['id', 'category_id', 'content'])
        ->assertJson(['category_id' => $category->id, 'content' => null]);
});

test('owner can create a task with content', function () {
    [$user, , $category] = userWithTask();

    $content = [['type' => 'paragraph', 'content' => [['type' => 'text', 'text' => 'Hello']]]];

    $this->actingAs($user)
        ->postJson(route('api.tasks.store'), ['category_id' => $category->id, 'content' => $content])
        ->assertCreated()
        ->assertJson(['content' => $content]);
});

test('store persists task to database', function () {
    [$user, , $category] = userWithTask();

    $this->actingAs($user)
        ->postJson(route('api.tasks.store'), ['category_id' => $category->id]);

    $this->assertDatabaseHas('tasks', ['category_id' => $category->id]);
});

test('store broadcasts CreatedTask event', function () {
    [$user, $project, $category] = userWithTask();

    Event::fake([CreatedTask::class]);

    $this->actingAs($user)
        ->postJson(route('api.tasks.store'), ['category_id' => $category->id]);

    Event::assertDispatched(CreatedTask::class, function ($event) use ($project) {
        $channels = array_map(fn ($ch) => $ch->name, $event->broadcastOn());

        return in_array("presence-Project.{$project->id}", $channels);
    });
});

test('store returns 401 for guest', function () {
    [, , $category] = userWithTask();

    $this->postJson(route('api.tasks.store'), ['category_id' => $category->id])
        ->assertUnauthorized();
});

test('store returns 422 when category_id is missing', function () {
    [$user] = userWithTask();

    $this->actingAs($user)
        ->postJson(route('api.tasks.store'), [])
        ->assertUnprocessable()
        ->assertJsonValidationErrors('category_id');
});

test('store returns 422 when category_id belongs to another user', function () {
    [$user] = userWithTask();
    $foreignCategory = Category::factory()->create();

    $this->actingAs($user)
        ->postJson(route('api.tasks.store'), ['category_id' => $foreignCategory->id])
        ->assertUnprocessable()
        ->assertJsonValidationErrors('category_id');
});

// ─── update ──────────────────────────────────────────────────────────────────

test('owner can update task content', function () {
    [$user, , , $task] = userWithTask();

    $content = [['type' => 'paragraph', 'content' => [['type' => 'text', 'text' => 'Updated']]]];

    $this->actingAs($user)
        ->patchJson(route('api.tasks.update', $task), ['content' => $content])
        ->assertOk()
        ->assertJson(['id' => $task->id, 'content' => $content]);

    expect($task->fresh()->content)->toBe($content);
});

test('owner can clear task content', function () {
    [$user, , , $task] = userWithTask();

    $this->actingAs($user)
        ->patchJson(route('api.tasks.update', $task), ['content' => null])
        ->assertOk()
        ->assertJson(['content' => null]);
});

test('owner can move task to another category via update', function () {
    [$user, $project, , $task] = userWithTask();
    $otherCategory = Category::factory()->create(['project_id' => $project->id, 'position' => null]);

    $this->actingAs($user)
        ->patchJson(route('api.tasks.update', $task), ['category_id' => $otherCategory->id])
        ->assertOk()
        ->assertJson(['category_id' => $otherCategory->id]);

    expect($task->fresh()->category_id)->toBe($otherCategory->id);
});

test('update broadcasts UpdatedTask event', function () {
    [$user, $project, , $task] = userWithTask();

    Event::fake([UpdatedTask::class]);

    $this->actingAs($user)
        ->patchJson(route('api.tasks.update', $task), ['content' => [['type' => 'paragraph']]]);

    Event::assertDispatched(UpdatedTask::class, function ($event) use ($project) {
        $channels = array_map(fn ($ch) => $ch->name, $event->broadcastOn());

        return in_array("presence-Project.{$project->id}", $channels);
    });
});

test('update returns 401 for guest', function () {
    [, , , $task] = userWithTask();

    $this->patchJson(route('api.tasks.update', $task), ['content' => null])
        ->assertUnauthorized();
});

test('update returns 403 for non-owner', function () {
    [, , , $task] = userWithTask();
    $other = User::factory()->create();

    $this->actingAs($other)
        ->patchJson(route('api.tasks.update', $task), ['content' => null])
        ->assertForbidden();
});

test('update returns 422 when category_id belongs to another user', function () {
    [$user, , , $task] = userWithTask();
    $foreignCategory = Category::factory()->create();

    $this->actingAs($user)
        ->patchJson(route('api.tasks.update', $task), ['category_id' => $foreignCategory->id])
        ->assertUnprocessable()
        ->assertJsonValidationErrors('category_id');
});

// ─── reorder ─────────────────────────────────────────────────────────────────

test('owner can move task to first position', function () {
    [$user, , $category, $tasks] = userWithTasks(3);
    $last = $tasks->last();

    $this->actingAs($user)
        ->patchJson(route('api.tasks.reorder', $last), ['move_after_id' => null])
        ->assertOk();

    $first = Task::sorted()->where('category_id', $category->id)->first();
    expect($first->id)->toBe($last->id);
});

test('owner can move task after another', function () {
    [$user, , $category, $tasks] = userWithTasks(3);
    $first  = $tasks->first();
    $second = $tasks->get(1);
    $third  = $tasks->last();

    $this->actingAs($user)
        ->patchJson(route('api.tasks.reorder', $first), ['move_after_id' => $third->id])
        ->assertOk();

    $sorted = Task::sorted()->where('category_id', $category->id)->pluck('id')->all();
    expect($sorted)->toBe([$second->id, $third->id, $first->id]);
});

test('owner can move task to first position in another category', function () {
    [$user, $project, , $tasks] = userWithTasks(2);
    $otherCategory = Category::factory()->create(['project_id' => $project->id, 'position' => null]);
    $task = $tasks->first();

    $this->actingAs($user)
        ->patchJson(route('api.tasks.reorder', $task), [
            'move_after_id' => null,
            'category_id'   => $otherCategory->id,
        ])
        ->assertOk()
        ->assertJson(['category_id' => $otherCategory->id]);

    expect($task->fresh()->category_id)->toBe($otherCategory->id);
});

test('owner can move task after another in a different category', function () {
    [$user, $project, , $tasks] = userWithTasks(2);
    $otherCategory = Category::factory()->create(['project_id' => $project->id, 'position' => null]);
    $anchor = Task::factory()->create(['category_id' => $otherCategory->id, 'position' => null]);
    $task   = $tasks->last(); // last — позиция after(forEmptySequence), отличается от anchor

    $this->actingAs($user)
        ->patchJson(route('api.tasks.reorder', $task), [
            'move_after_id' => $anchor->id,
            'category_id'   => $otherCategory->id,
        ])
        ->assertOk()
        ->assertJson(['category_id' => $otherCategory->id]);

    $sorted = Task::sorted()->where('category_id', $otherCategory->id)->pluck('id')->all();
    expect($sorted)->toBe([$anchor->id, $task->id]);
});

test('reorder broadcasts ReorderedTask event', function () {
    [$user, $project, , $tasks] = userWithTasks(2);
    $last = $tasks->last();

    Event::fake();

    $this->actingAs($user)
        ->patchJson(route('api.tasks.reorder', $last), ['move_after_id' => null]);

    Event::assertDispatched(ReorderedTask::class, function ($event) use ($project) {
        $channels = array_map(fn ($ch) => $ch->name, $event->broadcastOn());

        return in_array("presence-Project.{$project->id}", $channels);
    });
});

test('reorder broadcasts two ReorderedTask events when moving between categories', function () {
    [$user, $project, , $tasks] = userWithTasks(2);
    $otherCategory = Category::factory()->create(['project_id' => $project->id, 'position' => null]);
    $task = $tasks->first();

    Event::fake();

    $this->actingAs($user)
        ->patchJson(route('api.tasks.reorder', $task), [
            'move_after_id' => null,
            'category_id'   => $otherCategory->id,
        ]);

    Event::assertDispatchedTimes(ReorderedTask::class, 2);
});

test('reorder returns 401 for guest', function () {
    [, , , $task] = userWithTask();

    $this->patchJson(route('api.tasks.reorder', $task), ['move_after_id' => null])
        ->assertUnauthorized();
});

test('reorder returns 403 for non-owner', function () {
    [, , , $task] = userWithTask();
    $other = User::factory()->create();

    $this->actingAs($other)
        ->patchJson(route('api.tasks.reorder', $task), ['move_after_id' => null])
        ->assertForbidden();
});

test('reorder returns 422 when move_after_id does not exist', function () {
    [$user, , , $task] = userWithTask();

    $this->actingAs($user)
        ->patchJson(route('api.tasks.reorder', $task), ['move_after_id' => 99999])
        ->assertUnprocessable()
        ->assertJsonValidationErrors('move_after_id');
});

test('reorder returns 422 when category_id belongs to another user', function () {
    [$user, , , $task] = userWithTask();
    $foreignCategory = Category::factory()->create();

    $this->actingAs($user)
        ->patchJson(route('api.tasks.reorder', $task), [
            'move_after_id' => null,
            'category_id'   => $foreignCategory->id,
        ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors('category_id');
});