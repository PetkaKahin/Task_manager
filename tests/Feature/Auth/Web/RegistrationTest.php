<?php

declare(strict_types=1);

use App\Models\User;

uses(Illuminate\Foundation\Testing\RefreshDatabase::class);

test('registration page is accessible for guests', function () {
    $this->get(route('register'))->assertOk();
});

test('authenticated user is redirected away from registration page', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('register'))
        ->assertRedirect();
});

test('user can register with valid data', function () {
    $this->post(route('register'), [
        'name'                  => 'TestUser',
        'email'                 => 'test@example.com',
        'password'              => 'Password1!',
        'password_confirmation' => 'Password1!',
    ])->assertRedirect();

    $this->assertDatabaseHas('users', [
        'name'  => 'TestUser',
        'email' => 'test@example.com',
    ]);
});

test('user is authenticated after registration', function () {
    $this->post(route('register'), [
        'name'                  => 'TestUser',
        'email'                 => 'test@example.com',
        'password'              => 'Password1!',
        'password_confirmation' => 'Password1!',
    ]);

    $this->assertAuthenticated();
});

test('user is redirected to first project after registration', function () {
    $response = $this->post(route('register'), [
        'name'                  => 'TestUser',
        'email'                 => 'test@example.com',
        'password'              => 'Password1!',
        'password_confirmation' => 'Password1!',
    ]);

    $user = User::where('email', 'test@example.com')->first();
    $project = $user->projects()->orderBy('position')->first();

    $response->assertRedirect(route('projects.show', $project->id));
});

test('user is created as unverified', function () {
    $this->post(route('register'), [
        'name'                  => 'TestUser',
        'email'                 => 'test@example.com',
        'password'              => 'Password1!',
        'password_confirmation' => 'Password1!',
    ]);

    $this->assertDatabaseHas('users', [
        'email'             => 'test@example.com',
        'email_verified_at' => null,
    ]);
});

test('registration fails when name is missing', function () {
    $this->post(route('register'), [
        'email'                 => 'test@example.com',
        'password'              => 'Password1!',
        'password_confirmation' => 'Password1!',
    ])->assertSessionHasErrors('name');

    $this->assertGuest();
});

test('registration fails when email is missing', function () {
    $this->post(route('register'), [
        'name'                  => 'TestUser',
        'password'              => 'Password1!',
        'password_confirmation' => 'Password1!',
    ])->assertSessionHasErrors('email');

    $this->assertGuest();
});

test('registration fails when email is invalid', function () {
    $this->post(route('register'), [
        'name'                  => 'TestUser',
        'email'                 => 'not-an-email',
        'password'              => 'Password1!',
        'password_confirmation' => 'Password1!',
    ])->assertSessionHasErrors('email');

    $this->assertGuest();
});

test('registration fails when email is already taken', function () {
    User::factory()->create(['email' => 'test@example.com']);

    $this->post(route('register'), [
        'name'                  => 'AnotherUser',
        'email'                 => 'test@example.com',
        'password'              => 'Password1!',
        'password_confirmation' => 'Password1!',
    ])->assertSessionHasErrors('email');

    $this->assertGuest();
});

test('registration fails when name is already taken', function () {
    User::factory()->create(['name' => 'TestUser']);

    $this->post(route('register'), [
        'name'                  => 'TestUser',
        'email'                 => 'another@example.com',
        'password'              => 'Password1!',
        'password_confirmation' => 'Password1!',
    ])->assertSessionHasErrors('name');

    $this->assertGuest();
});

test('registration fails when password is missing', function () {
    $this->post(route('register'), [
        'name'  => 'TestUser',
        'email' => 'test@example.com',
    ])->assertSessionHasErrors('password');

    $this->assertGuest();
});

test('registration fails when password confirmation does not match', function () {
    $this->post(route('register'), [
        'name'                  => 'TestUser',
        'email'                 => 'test@example.com',
        'password'              => 'Password1!',
        'password_confirmation' => 'WrongPassword1!',
    ])->assertSessionHasErrors('password');

    $this->assertGuest();
});

test('registration fails when password is too short', function () {
    $this->post(route('register'), [
        'name'                  => 'TestUser',
        'email'                 => 'test@example.com',
        'password'              => 'Pw1!',
        'password_confirmation' => 'Pw1!',
    ])->assertSessionHasErrors('password');

    $this->assertGuest();
});

test('registration fails when password has no uppercase letter', function () {
    $this->post(route('register'), [
        'name'                  => 'TestUser',
        'email'                 => 'test@example.com',
        'password'              => 'password1!',
        'password_confirmation' => 'password1!',
    ])->assertSessionHasErrors('password');

    $this->assertGuest();
});

test('registration fails when password has no number', function () {
    $this->post(route('register'), [
        'name'                  => 'TestUser',
        'email'                 => 'test@example.com',
        'password'              => 'Password!',
        'password_confirmation' => 'Password!',
    ])->assertSessionHasErrors('password');

    $this->assertGuest();
});

test('registration fails when password has no symbol', function () {
    $this->post(route('register'), [
        'name'                  => 'TestUser',
        'email'                 => 'test@example.com',
        'password'              => 'Password1',
        'password_confirmation' => 'Password1',
    ])->assertSessionHasErrors('password');

    $this->assertGuest();
});