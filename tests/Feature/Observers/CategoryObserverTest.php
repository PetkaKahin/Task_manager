<?php

declare(strict_types=1);

use App\Events\Category\CreatedCategory;
use App\Events\Category\DeletedCategory;
use App\Events\Category\UpdatedCategory;
use App\Models\Category;
use App\Models\Project;
use App\Models\User;
use App\Observers\CategoryObserver;

uses(Illuminate\Foundation\Testing\RefreshDatabase::class);

// Тесты вызывают observer напрямую — без Event::fake().
// Broadcast уходит в null-драйвер (дефолт для тестов).
//
// Смысл: если тип поля модели не совпадает с типом в конструкторе события
// (например, project_id — string вместо int), declare(strict_types=1)
// в observer'е бросит TypeError → тест упадёт с понятным сообщением.

function makeCategoryForObserver(): Category
{
    $user    = User::factory()->create();
    $project = Project::factory()->create();
    $user->projects()->attach($project->id);

    return Category::factory()->create([
        'project_id' => $project->id,
        'position'   => null,
    ]);
}

// ─── created ─────────────────────────────────────────────────────────────────

test('created observer does not throw type errors', function () {
    $category = makeCategoryForObserver();

    // Бросит TypeError если $category->project_id — string, а конструктор ждёт int
    (new CategoryObserver())->created($category);

    expect(true)->toBeTrue();
});

test('CreatedCategory event has correct channel for project', function () {
    $category = makeCategoryForObserver();

    $event    = new CreatedCategory($category);
    $channels = array_map(fn ($ch) => $ch->name, $event->broadcastOn());

    expect($channels)->toContain("presence-Project.{$category->project_id}");
});

test('CreatedCategory event payload contains correct category data', function () {
    $category = makeCategoryForObserver();

    $event   = new CreatedCategory($category);
    $payload = $event->broadcastWith()['category'];

    expect($payload['id'])->toBe($category->id)
        ->and($payload['project_id'])->toBe($category->project_id)
        ->and($payload['title'])->toBe($category->title);
});

// ─── updated ─────────────────────────────────────────────────────────────────

test('updated observer does not throw type errors', function () {
    $category = makeCategoryForObserver();

    (new CategoryObserver())->updated($category);

    expect(true)->toBeTrue();
});

test('UpdatedCategory event has correct channel for project', function () {
    $category = makeCategoryForObserver();

    $event    = new UpdatedCategory($category);
    $channels = array_map(fn ($ch) => $ch->name, $event->broadcastOn());

    expect($channels)->toContain("presence-Project.{$category->project_id}");
});

test('UpdatedCategory event payload contains correct category data', function () {
    $category = makeCategoryForObserver();

    $event   = new UpdatedCategory($category);
    $payload = $event->broadcastWith()['category'];

    expect($payload['id'])->toBe($category->id)
        ->and($payload['project_id'])->toBe($category->project_id)
        ->and($payload['title'])->toBe($category->title);
});

// ─── deleted ─────────────────────────────────────────────────────────────────

test('deleted observer does not throw type errors', function () {
    $category = makeCategoryForObserver();

    (new CategoryObserver())->deleted($category);

    expect(true)->toBeTrue();
});

test('DeletedCategory event has correct channel for project', function () {
    $category = makeCategoryForObserver();

    $event    = new DeletedCategory($category);
    $channels = array_map(fn ($ch) => $ch->name, $event->broadcastOn());

    expect($channels)->toContain("presence-Project.{$category->project_id}");
});

test('DeletedCategory event payload contains correct category id', function () {
    $category = makeCategoryForObserver();

    $event = new DeletedCategory($category);

    expect($event->broadcastWith()['category_id'])->toBe($category->id);
});
