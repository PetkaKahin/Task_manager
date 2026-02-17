<?php

namespace Database\Factories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;

class TaskFactory extends Factory
{
    public function definition(): array
    {
        return [
            'title'       => fake()->sentence(2),
            'content'     => null,
            'category_id' => Category::factory(),
        ];
    }

    public function first(Category $category): static
    {
        return $this->sequence(
            [
                'title' => 'Задача 1',
                'content' => '<p>Эту задачу можно таскать между категориями</p>',
                'category_id' => $category->id,
            ],
            [
                'title' => 'Задача 2',
                'content' => '<p>А ещё можно менять местами категории и создавать их</p>',
                'category_id' => $category->id,
            ],
        );
    }
}
