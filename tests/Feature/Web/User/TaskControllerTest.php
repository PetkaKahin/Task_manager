<?php

declare(strict_types=1);

use App\Events\Task\CreatedTask;
use App\Events\Task\DeletedTask;
use App\Events\Task\UpdatedTask;
use App\Models\Category;
use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use Illuminate\Support\Facades\Event;

uses(Illuminate\Foundation\Testing\RefreshDatabase::class);

// Хелпер: пользователь с проектом, категорией и таской
function webTaskSetup(): array
{
    $user     = User::factory()->create();
    $project  = Project::factory()->create();
    $user->projects()->attach($project->id);
    $category = Category::factory()->create(['project_id' => $project->id, 'position' => null]);
    $task     = Task::factory()->create(['category_id' => $category->id, 'position' => null]);

    return [$user, $project, $category, $task];
}

// ─── create ──────────────────────────────────────────────────────────────────

test('create page is accessible for authenticated user', function () {
    [$user] = webTaskSetup();

    $this->actingAs($user)
        ->get(route('tasks.create'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('User/Task/NewTask'));
});

test('create returns 401 for guest', function () {
    $this->get(route('tasks.create'))
        ->assertRedirect(route('login'));
});

// ─── store ───────────────────────────────────────────────────────────────────

test('owner can create a task', function () {
    [$user, $project, $category] = webTaskSetup();

    $this->actingAs($user)
        ->post(route('tasks.store'), ['category_id' => $category->id])
        ->assertRedirect(route('projects.show', $project->id));

    $this->assertDatabaseHas('tasks', ['category_id' => $category->id]);
});

test('owner can create a task with content', function () {
    [$user, , $category] = webTaskSetup();

    $content = [['type' => 'paragraph', 'content' => [['type' => 'text', 'text' => 'Hello']]]];

    $this->actingAs($user)
        ->post(route('tasks.store'), ['category_id' => $category->id, 'content' => $content]);

    $this->assertDatabaseHas('tasks', ['category_id' => $category->id]);
});

test('store broadcasts CreatedTask event', function () {
    [$user, $project, $category] = webTaskSetup();

    Event::fake([CreatedTask::class]);

    $this->actingAs($user)
        ->post(route('tasks.store'), ['category_id' => $category->id]);

    Event::assertDispatched(CreatedTask::class, function ($event) use ($project) {
        $channels = array_map(fn ($ch) => $ch->name, $event->broadcastOn());

        return in_array("presence-Project.{$project->id}", $channels);
    });
});

test('store returns 401 for guest', function () {
    [, , $category] = webTaskSetup();

    $this->post(route('tasks.store'), ['category_id' => $category->id])
        ->assertRedirect(route('login'));
});

test('store returns 422 when category_id is missing', function () {
    [$user] = webTaskSetup();

    $this->actingAs($user)
        ->post(route('tasks.store'), [])
        ->assertSessionHasErrors('category_id');
});

test('store returns 422 when category_id belongs to another user', function () {
    [$user] = webTaskSetup();
    $foreignCategory = Category::factory()->create();

    $this->actingAs($user)
        ->post(route('tasks.store'), ['category_id' => $foreignCategory->id])
        ->assertSessionHasErrors('category_id');
});

// ─── edit ────────────────────────────────────────────────────────────────────

test('owner can access edit page', function () {
    [$user, , , $task] = webTaskSetup();

    $this->actingAs($user)
        ->get(route('tasks.edit', $task))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('User/Task/EditTask')
            ->has('task')
        );
});

test('edit returns 401 for guest', function () {
    [, , , $task] = webTaskSetup();

    $this->get(route('tasks.edit', $task))
        ->assertRedirect(route('login'));
});

test('edit returns 403 for non-owner', function () {
    [, , , $task] = webTaskSetup();
    $other = User::factory()->create();

    $this->actingAs($other)
        ->get(route('tasks.edit', $task))
        ->assertForbidden();
});

// ─── update ──────────────────────────────────────────────────────────────────

test('owner can update task content', function () {
    [$user, $project, , $task] = webTaskSetup();

    $content = [['type' => 'paragraph', 'content' => [['type' => 'text', 'text' => 'Updated']]]];

    $this->actingAs($user)
        ->patch(route('tasks.update', $task), ['content' => $content])
        ->assertRedirect(route('projects.show', $project->id));

    expect($task->fresh()->content)->toBe($content);
});

test('owner can move task to another category via update', function () {
    [$user, $project, , $task] = webTaskSetup();
    $otherCategory = Category::factory()->create(['project_id' => $project->id, 'position' => null]);

    $this->actingAs($user)
        ->patch(route('tasks.update', $task), ['category_id' => $otherCategory->id])
        ->assertRedirect(route('projects.show', $project->id));

    expect($task->fresh()->category_id)->toBe($otherCategory->id);
});

test('update broadcasts UpdatedTask event', function () {
    [$user, $project, , $task] = webTaskSetup();

    Event::fake([UpdatedTask::class]);

    $this->actingAs($user)
        ->patch(route('tasks.update', $task), [
            'content' => [['type' => 'paragraph']],
        ]);

    Event::assertDispatched(UpdatedTask::class, function ($event) use ($project) {
        $channels = array_map(fn ($ch) => $ch->name, $event->broadcastOn());

        return in_array("presence-Project.{$project->id}", $channels);
    });
});

test('update returns 401 for guest', function () {
    [, , , $task] = webTaskSetup();

    $this->patch(route('tasks.update', $task), ['content' => null])
        ->assertRedirect(route('login'));
});

test('update returns 403 for non-owner', function () {
    [, , , $task] = webTaskSetup();
    $other = User::factory()->create();

    $this->actingAs($other)
        ->patch(route('tasks.update', $task), ['content' => null])
        ->assertForbidden();
});

test('update returns 422 when category_id belongs to another user', function () {
    [$user, , , $task] = webTaskSetup();
    $foreignCategory = Category::factory()->create();

    $this->actingAs($user)
        ->patch(route('tasks.update', $task), ['category_id' => $foreignCategory->id])
        ->assertSessionHasErrors('category_id');
});

// ─── destroy ─────────────────────────────────────────────────────────────────

test('owner can delete task', function () {
    [$user, , , $task] = webTaskSetup();

    $this->actingAs($user)
        ->delete(route('tasks.destroy', $task))
        ->assertNoContent();

    $this->assertSoftDeleted($task);
});

test('destroy broadcasts DeletedTask event', function () {
    [$user, $project, , $task] = webTaskSetup();

    Event::fake([DeletedTask::class]);

    $this->actingAs($user)
        ->delete(route('tasks.destroy', $task));

    Event::assertDispatched(DeletedTask::class, function ($event) use ($project) {
        $channels = array_map(fn ($ch) => $ch->name, $event->broadcastOn());

        return in_array("presence-Project.{$project->id}", $channels);
    });
});

test('destroy returns 401 for guest', function () {
    [, , , $task] = webTaskSetup();

    $this->delete(route('tasks.destroy', $task))
        ->assertRedirect(route('login'));
});

test('destroy returns 403 for non-owner', function () {
    [, , , $task] = webTaskSetup();
    $other = User::factory()->create();

    $this->actingAs($other)
        ->delete(route('tasks.destroy', $task))
        ->assertForbidden();
});