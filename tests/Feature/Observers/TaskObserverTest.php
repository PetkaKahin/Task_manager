<?php

declare(strict_types=1);

use App\Events\Task\CreatedTask;
use App\Events\Task\DeletedTask;
use App\Events\Task\UpdatedTask;
use App\Models\Category;
use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use App\Observers\TaskObserver;

uses(Illuminate\Foundation\Testing\RefreshDatabase::class);

// Тесты вызывают observer напрямую — без Event::fake().
// Broadcast уходит в null-драйвер (дефолт для тестов).
//
// Смысл: если тип поля модели не совпадает с типом в конструкторе события
// (например, category_id — string вместо int), declare(strict_types=1)
// в observer'е бросит TypeError → тест упадёт с понятным сообщением.

function makeTaskForObserver(): Task
{
    $user    = User::factory()->create();
    $project = Project::factory()->create();
    $user->projects()->attach($project->id);

    $category = Category::factory()->create([
        'project_id' => $project->id,
        'position'   => null,
    ]);

    return Task::factory()->create([
        'category_id' => $category->id,
        'position'    => null,
    ]);
}

// ─── created ─────────────────────────────────────────────────────────────────

test('created observer does not throw type errors', function () {
    $task = makeTaskForObserver();

    // Бросит TypeError если category->project_id — string, а конструктор ждёт int
    (new TaskObserver())->created($task);

    expect(true)->toBeTrue();
});

test('CreatedTask event has correct channel for project', function () {
    $task    = makeTaskForObserver();
    $project = $task->category->project;

    $event    = new CreatedTask($task);
    $channels = array_map(fn ($ch) => $ch->name, $event->broadcastOn());

    expect($channels)->toContain("presence-Project.{$project->id}");
});

test('CreatedTask event payload contains correct task data', function () {
    $task    = makeTaskForObserver();

    $event   = new CreatedTask($task);
    $payload = $event->broadcastWith()['task'];

    expect($payload['id'])->toBe($task->id)
        ->and($payload['category_id'])->toBe($task->category_id);
});

// ─── updated ─────────────────────────────────────────────────────────────────

test('updated observer does not throw type errors', function () {
    $task = makeTaskForObserver();

    (new TaskObserver())->updated($task);

    expect(true)->toBeTrue();
});

test('UpdatedTask event has correct channel for project', function () {
    $task    = makeTaskForObserver();
    $project = $task->category->project;

    $event    = new UpdatedTask($task);
    $channels = array_map(fn ($ch) => $ch->name, $event->broadcastOn());

    expect($channels)->toContain("presence-Project.{$project->id}");
});

// ─── deleted ─────────────────────────────────────────────────────────────────

test('deleted observer does not throw type errors', function () {
    $task = makeTaskForObserver();

    // Бросит TypeError если category_id или project_id — string
    (new TaskObserver())->deleted($task);

    expect(true)->toBeTrue();
});

test('DeletedTask event has correct channel for project', function () {
    $task    = makeTaskForObserver();
    $project = $task->category->project;

    $event    = new DeletedTask($task);
    $channels = array_map(fn ($ch) => $ch->name, $event->broadcastOn());

    expect($channels)->toContain("presence-Project.{$project->id}");
});

test('DeletedTask event payload has correct task id', function () {
    $task = makeTaskForObserver();

    $event = new DeletedTask($task);

    expect($event->broadcastWith()['task_id'])->toBe($task->id);
});
