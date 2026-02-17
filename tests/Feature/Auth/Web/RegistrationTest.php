<?php

declare(strict_types=1);

namespace Tests\Feature\Auth\Web;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RegistrationTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Форма регистрации доступна.
     */
    public function test_registration_screen_can_be_rendered(): void
    {
        $response = $this->get('/register');

        $response->assertStatus(200);
    }

    /**
     * Новый пользователь может зарегистрироваться.
     */
    public function test_new_users_can_register(): void
    {
        $response = $this->post('/register', [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'SecureP@ss1',
            'password_confirmation' => 'SecureP@ss1',
        ]);

        // Проверяем, что пользователь авторизован
        $this->assertAuthenticated();

        // Проверяем редирект на dashboard
        $response->assertRedirect(route('dashboard'));
    }

    /**
     * Регистрация с невалидным email отклоняется.
     */
    public function test_registration_fails_with_invalid_email(): void
    {
        $response = $this->post('/register', [
            'name' => 'Test User',
            'email' => 'not-an-email',
            'password' => 'SecureP@ss1',
            'password_confirmation' => 'SecureP@ss1',
        ]);

        // Проверяем, что есть ошибка валидации для email
        $response->assertSessionHasErrors('email');

        // Пользователь НЕ авторизован
        $this->assertGuest();
    }

    /**
     * Регистрация с занятым email отклоняется.
     */
    public function test_registration_fails_with_existing_email(): void
    {
        // Создаём существующего пользователя
        User::factory()->create(['email' => 'existing@example.com']);

        $response = $this->post('/register', [
            'name' => 'Test User',
            'email' => 'existing@example.com',
            'password' => 'SecureP@ss1',
            'password_confirmation' => 'SecureP@ss1',
        ]);

        $response->assertSessionHasErrors('email');
        $this->assertGuest();
    }

    /**
     * Регистрация со слабым паролем отклоняется.
     */
    public function test_registration_fails_with_weak_password(): void
    {
        $response = $this->post('/register', [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => '12345678',  // Нет букв, спецсимволов
            'password_confirmation' => '12345678',
        ]);

        $response->assertSessionHasErrors('password');
        $this->assertGuest();
    }

    /**
     * Регистрация с несовпадающими паролями отклоняется.
     */
    public function test_registration_fails_with_mismatched_passwords(): void
    {
        $response = $this->post('/register', [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'SecureP@ss1',
            'password_confirmation' => 'DifferentP@ss1',
        ]);

        $response->assertSessionHasErrors('password');
        $this->assertGuest();
    }

    /**
     * Авторизованный пользователь редиректится с формы регистрации.
     */
    public function test_authenticated_user_redirected_from_registration(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->get('/register');

        $response->assertRedirect(route('dashboard'));
    }
}
