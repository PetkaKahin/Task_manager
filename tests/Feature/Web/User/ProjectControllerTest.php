<?php

declare(strict_types=1);

use App\Events\Project\CreatedProject;
use App\Events\Project\DeletedProject;
use App\Events\Project\UpdatedProject;
use App\Models\Project;
use App\Models\User;
use Illuminate\Support\Facades\Event;

uses(Illuminate\Foundation\Testing\RefreshDatabase::class);

// Хелпер: пользователь с проектом
function webProjectSetup(): array
{
    $user    = User::factory()->create();
    $project = Project::factory()->create();
    $user->projects()->attach($project->id);

    return [$user, $project];
}

// ─── create ──────────────────────────────────────────────────────────────────

test('create page is accessible for authenticated user', function () {
    [$user] = webProjectSetup();

    $this->actingAs($user)
        ->get(route('projects.create'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('User/Project/NewProject'));
});

test('create returns 401 for guest', function () {
    $this->get(route('projects.create'))
        ->assertRedirect(route('login'));
});

// ─── store ───────────────────────────────────────────────────────────────────

test('owner can create a project', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post(route('projects.store'), ['title' => 'Новый проект'])
        ->assertRedirect();

    $this->assertDatabaseHas('projects', ['title' => 'Новый проект']);
});

test('store creates default categories for new project', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post(route('projects.store'), ['title' => 'Новый проект']);

    $project = $user->projects()->first();
    expect($project->categories()->count())->toBe(3);
});

test('store redirects to the new project', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post(route('projects.store'), ['title' => 'Новый проект'])
        ->assertRedirect(route('projects.show', $user->projects()->first()->id));
});

test('store broadcasts CreatedProject with correct channels and payload', function () {
    $user = User::factory()->create();

    Event::fake([CreatedProject::class]);

    $this->actingAs($user)
        ->post(route('projects.store'), ['title' => 'Новый проект']);

    Event::assertDispatched(CreatedProject::class, function ($event) use ($user) {
        $channels = array_map(fn ($ch) => $ch->name, $event->broadcastOn());
        $payload = $event->broadcastWith();

        // Канал только создателя (при создании проект принадлежит одному юзеру)
        expect($channels)->toHaveCount(1)
            ->toContain("private-User.{$user->id}");

        // Payload содержит данные проекта
        expect($payload)->toHaveKey('project')
            ->and($payload['project'])->toHaveKeys(['id', 'title'])
            ->and($payload['project']['title'])->toBe('Новый проект');

        // Имя события
        expect($event->broadcastAs())->toBe('Project.CreatedProject');

        return true;
    });
});

test('store returns 401 for guest', function () {
    $this->post(route('projects.store'), ['title' => 'Новый проект'])
        ->assertRedirect(route('login'));
});

test('store returns 422 when title is missing', function () {
    [$user] = webProjectSetup();

    $this->actingAs($user)
        ->post(route('projects.store'), [])
        ->assertSessionHasErrors('title');
});

test('store returns 422 when title exceeds 255 characters', function () {
    [$user] = webProjectSetup();

    $this->actingAs($user)
        ->post(route('projects.store'), ['title' => str_repeat('a', 256)])
        ->assertSessionHasErrors('title');
});

// ─── show ─────────────────────────────────────────────────────────────────────

test('owner can view project', function () {
    [$user, $project] = webProjectSetup();

    $this->actingAs($user)
        ->get(route('projects.show', $project))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('User/Dashboard')
            ->has('project')
            ->has('categories')
        );
});

test('show returns 401 for guest', function () {
    [, $project] = webProjectSetup();

    $this->get(route('projects.show', $project))
        ->assertRedirect(route('login'));
});

test('show returns 403 for non-owner', function () {
    [, $project] = webProjectSetup();
    $other = User::factory()->create();

    $this->actingAs($other)
        ->get(route('projects.show', $project))
        ->assertForbidden();
});

// ─── edit ────────────────────────────────────────────────────────────────────

test('owner can access edit page', function () {
    [$user, $project] = webProjectSetup();

    $this->actingAs($user)
        ->get(route('projects.edit', $project))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('User/Project/EditProject')
            ->has('project')
        );
});

test('edit returns 401 for guest', function () {
    [, $project] = webProjectSetup();

    $this->get(route('projects.edit', $project))
        ->assertRedirect(route('login'));
});

test('edit returns 403 for non-owner', function () {
    [, $project] = webProjectSetup();
    $other = User::factory()->create();

    $this->actingAs($other)
        ->get(route('projects.edit', $project))
        ->assertForbidden();
});

// ─── update ──────────────────────────────────────────────────────────────────

test('owner can update project title', function () {
    [$user, $project] = webProjectSetup();

    $this->actingAs($user)
        ->patch(route('projects.update', $project), ['title' => 'Обновлённый проект'])
        ->assertRedirect(route('projects.show', $project->id));

    expect($project->fresh()->title)->toBe('Обновлённый проект');
});

test('update broadcasts UpdatedProject to all project members with correct payload', function () {
    [$user, $project] = webProjectSetup();
    $member = User::factory()->create();
    $member->projects()->attach($project->id);

    Event::fake([UpdatedProject::class]);

    $this->actingAs($user)
        ->patch(route('projects.update', $project), ['title' => 'Обновлённый проект']);

    Event::assertDispatched(UpdatedProject::class, function ($event) use ($user, $member, $project) {
        $channels = array_map(fn ($ch) => $ch->name, $event->broadcastOn());
        $payload = $event->broadcastWith();

        // Оба участника получают уведомление
        expect($channels)->toHaveCount(2)
            ->toContain("private-User.{$user->id}")
            ->toContain("private-User.{$member->id}");

        // Payload содержит обновлённые данные
        expect($payload['project']['id'])->toBe($project->id)
            ->and($payload['project']['title'])->toBe('Обновлённый проект');

        expect($event->broadcastAs())->toBe('Project.UpdatedProject');

        return true;
    });
});

test('update returns 401 for guest', function () {
    [, $project] = webProjectSetup();

    $this->patch(route('projects.update', $project), ['title' => 'Hack'])
        ->assertRedirect(route('login'));
});

test('update returns 403 for non-owner', function () {
    [, $project] = webProjectSetup();
    $other = User::factory()->create();

    $this->actingAs($other)
        ->patch(route('projects.update', $project), ['title' => 'Hack'])
        ->assertForbidden();
});

test('update returns 422 when title is missing', function () {
    [$user, $project] = webProjectSetup();

    $this->actingAs($user)
        ->patch(route('projects.update', $project), [])
        ->assertSessionHasErrors('title');
});

test('update returns 422 when title exceeds 255 characters', function () {
    [$user, $project] = webProjectSetup();

    $this->actingAs($user)
        ->patch(route('projects.update', $project), ['title' => str_repeat('a', 256)])
        ->assertSessionHasErrors('title');
});

// ─── destroy ─────────────────────────────────────────────────────────────────

test('owner can delete project', function () {
    [$user, $project] = webProjectSetup();

    $this->actingAs($user)
        ->delete(route('projects.destroy', $project))
        ->assertNoContent();

    $this->assertSoftDeleted($project);
});

test('destroy broadcasts DeletedProject to all project members with correct payload', function () {
    [$user, $project] = webProjectSetup();
    $member = User::factory()->create();
    $member->projects()->attach($project->id);

    Event::fake([DeletedProject::class]);

    $this->actingAs($user)
        ->delete(route('projects.destroy', $project));

    Event::assertDispatched(DeletedProject::class, function ($event) use ($user, $member, $project) {
        $channels = array_map(fn ($ch) => $ch->name, $event->broadcastOn());
        $payload = $event->broadcastWith();

        // Оба участника получают уведомление
        expect($channels)->toHaveCount(2)
            ->toContain("private-User.{$user->id}")
            ->toContain("private-User.{$member->id}");

        // Payload содержит id удалённого проекта
        expect($payload['projectId'])->toBe($project->id);

        expect($event->broadcastAs())->toBe('Project.DeletedProject');

        return true;
    });
});

test('destroy fetches project members before soft-delete', function () {
    [$user, $project] = webProjectSetup();
    $member = User::factory()->create();
    $member->projects()->attach($project->id);

    Event::fake([DeletedProject::class]);

    $this->actingAs($user)
        ->delete(route('projects.destroy', $project));

    // Проект soft-deleted
    $this->assertSoftDeleted($project);

    // Но бродкаст всё равно ушёл обоим участникам
    Event::assertDispatched(DeletedProject::class, function ($event) use ($user, $member) {
        $channels = array_map(fn ($ch) => $ch->name, $event->broadcastOn());

        return count($channels) === 2
            && in_array("private-User.{$user->id}", $channels)
            && in_array("private-User.{$member->id}", $channels);
    });
});

test('destroy returns 401 for guest', function () {
    [, $project] = webProjectSetup();

    $this->delete(route('projects.destroy', $project))
        ->assertRedirect(route('login'));
});

test('destroy returns 403 for non-owner', function () {
    [, $project] = webProjectSetup();
    $other = User::factory()->create();

    $this->actingAs($other)
        ->delete(route('projects.destroy', $project))
        ->assertForbidden();
});