<?php

declare(strict_types=1);

use App\Models\Category;
use App\Models\Task;
use App\Models\User;

uses(Illuminate\Foundation\Testing\RefreshDatabase::class);

function taskWithOwner(): array
{
    $user     = User::factory()->withFirstProject()->create();
    $project  = $user->projects()->first();
    $category = $project->categories()->first();
    $task     = Task::factory()->create(['category_id' => $category->id]);

    return [$user, $task];
}

// ─── edit ─────────────────────────────────────────────────────────────────────

test('owner can edit task', function () {
    [$owner, $task] = taskWithOwner();

    expect($owner->can('edit', $task))->toBeTrue();
});

test('non-owner cannot edit task', function () {
    [, $task] = taskWithOwner();
    $other = User::factory()->create();

    expect($other->can('edit', $task))->toBeFalse();
});

// ─── update ───────────────────────────────────────────────────────────────────

test('owner can update task', function () {
    [$owner, $task] = taskWithOwner();

    expect($owner->can('update', $task))->toBeTrue();
});

test('non-owner cannot update task', function () {
    [, $task] = taskWithOwner();
    $other = User::factory()->create();

    expect($other->can('update', $task))->toBeFalse();
});

// ─── delete ───────────────────────────────────────────────────────────────────

test('owner can delete task', function () {
    [$owner, $task] = taskWithOwner();

    expect($owner->can('delete', $task))->toBeTrue();
});

test('non-owner cannot delete task', function () {
    [, $task] = taskWithOwner();
    $other = User::factory()->create();

    expect($other->can('delete', $task))->toBeFalse();
});

// ─── edge cases ───────────────────────────────────────────────────────────────

test('user with own project cannot access task in another project', function () {
    [, $task]  = taskWithOwner();
    $otherUser = User::factory()->withFirstProject()->create();

    expect($otherUser->can('edit', $task))->toBeFalse();
    expect($otherUser->can('update', $task))->toBeFalse();
    expect($otherUser->can('delete', $task))->toBeFalse();
});

test('task in foreign category is not accessible', function () {
    $user     = User::factory()->create();
    $category = Category::factory()->create();
    $task     = Task::factory()->create(['category_id' => $category->id]);

    expect($user->can('edit', $task))->toBeFalse();
    expect($user->can('update', $task))->toBeFalse();
    expect($user->can('delete', $task))->toBeFalse();
});