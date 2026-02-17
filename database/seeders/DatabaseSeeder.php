<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{

    public function run(): void
    {
        // TODO минимум сделать фабрику под стартовые категории проекта (В планах, В работе, Завершено)
        // TODO фабрика под стартовые задачи: содержит описание как можно взаимодействовать с проектом

        User::factory()->withFirstProject()->create([
            'name'     => 'admin',
            'email'    => 'admin@example.com',
            'password' => '12345',
        ]);
    }
}
