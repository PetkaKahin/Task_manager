<?php

declare(strict_types=1);

use App\Models\Category;
use App\Models\User;
use App\Rules\CategoryBelongsToUser;
use Illuminate\Support\Facades\Auth;

uses(Illuminate\Foundation\Testing\RefreshDatabase::class);

function failMessage(): string
{
    return trans('messages.category_not_found');
}

function runRule(mixed $value): ?string
{
    $rule   = new CategoryBelongsToUser();
    $failed = null;

    $rule->validate('category_id', $value, function (string $msg) use (&$failed) {
        $failed = $msg;
    });

    return $failed;
}

// ─── passes ───────────────────────────────────────────────────────────────────

test('passes when category belongs to authenticated user', function () {
    $user     = User::factory()->withFirstProject()->create();
    $category = $user->projects()->first()->categories()->first();

    Auth::login($user);

    expect(runRule($category->id))->toBeNull();
});

test('passes when value is null', function () {
    $user = User::factory()->create();
    Auth::login($user);

    expect(runRule(null))->toBeNull();
});

// ─── fails ────────────────────────────────────────────────────────────────────

test('fails when category does not belong to authenticated user', function () {
    $user     = User::factory()->withFirstProject()->create();
    $category = $user->projects()->first()->categories()->first();

    $other = User::factory()->create();
    Auth::login($other);

    expect(runRule($category->id))->toBe(failMessage());
});

test('fails when category id does not exist', function () {
    $user = User::factory()->create();
    Auth::login($user);

    expect(runRule(99999))->toBe(failMessage());
});

test('fails when category belongs to soft-deleted project', function () {
    $user    = User::factory()->withFirstProject()->create();
    $project = $user->projects()->first();
    $category = $project->categories()->first();

    $project->delete();
    Auth::login($user);

    expect(runRule($category->id))->toBe(failMessage());
});