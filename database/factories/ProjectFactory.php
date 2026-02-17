<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Task;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProjectFactory extends Factory
{
    public function definition(): array
    {
        return [
            'title' => fake()->sentence(2),
        ];
    }

    public function default(User $user, string $title): static
    {
        return $this->state(fn()
            => [
            'title' => $title,
        ])->afterCreating(function ($project) use ($user) {
            Category::factory()->count(3)->defaultForProject($project)->create();
            $user->projects()->attach($project->id);
        });
    }

    public function first(): static
    {
        return $this->state(fn()
            => [
            'title' => 'Мой первый проект',
        ])->afterCreating(function ($project) {
            $categories = Category::factory()
                ->defaultForProject($project)
                ->count(3)
                ->create();

            $firstCategory = $categories->first();

            Task::factory()
                ->first($firstCategory)
                ->count(2)
                ->create();
        });
    }
}
