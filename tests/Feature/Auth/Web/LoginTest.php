<?php

declare(strict_types=1);

use App\Models\User;

uses(Illuminate\Foundation\Testing\RefreshDatabase::class);

test('login page is accessible for guests', function () {
    $this->get(route('login'))->assertOk();
});

test('authenticated user is redirected away from login page', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('login'))
        ->assertRedirect();
});

test('user can login with email', function () {
    $user = User::factory()->withFirstProject()->create();

    $this->post(route('login'), [
        'login'    => $user->email,
        'password' => 'password',
    ])->assertRedirect();

    $this->assertAuthenticatedAs($user);
});

test('user can login with name', function () {
    $user = User::factory()->withFirstProject()->create();

    $this->post(route('login'), [
        'login'    => $user->name,
        'password' => 'password',
    ])->assertRedirect();

    $this->assertAuthenticatedAs($user);
});

test('user is redirected to first project sorted by position after login', function () {
    $user = User::factory()->withFirstProject()->create();

    $firstProject = $user->projects()->orderBy('project_user.position')->first();

    $this->post(route('login'), [
        'login'    => $user->email,
        'password' => 'password',
    ])->assertRedirect(route('projects.show', $firstProject->id));
});

test('login fails with wrong password', function () {
    $user = User::factory()->create();

    $this->post(route('login'), [
        'login'    => $user->email,
        'password' => 'wrong-password',
    ])->assertSessionHasErrors('error');

    $this->assertGuest();
});

test('login fails with non-existent email', function () {
    $this->post(route('login'), [
        'login'    => 'nobody@example.com',
        'password' => 'password',
    ])->assertSessionHasErrors('error');

    $this->assertGuest();
});

test('login fails with non-existent name', function () {
    $this->post(route('login'), [
        'login'    => 'nobody',
        'password' => 'password',
    ])->assertSessionHasErrors('error');

    $this->assertGuest();
});

test('login fails when login field is missing', function () {
    $this->post(route('login'), [
        'password' => 'password',
    ])->assertSessionHasErrors('login');

    $this->assertGuest();
});

test('login fails when password is missing', function () {
    $user = User::factory()->create();

    $this->post(route('login'), [
        'login' => $user->email,
    ])->assertSessionHasErrors('password');

    $this->assertGuest();
});