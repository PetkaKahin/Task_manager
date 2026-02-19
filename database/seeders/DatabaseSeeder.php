<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::factory()->withFirstProject()->create([
            'name'     => 'admin',
            'email'    => 'admin@example.com',
            'password' => '12345',
        ]);
    }
}
