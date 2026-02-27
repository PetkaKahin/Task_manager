<?php

namespace Database\Factories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;

class TaskFactory extends Factory
{
    public function definition(): array
    {
        return [
            'content'     => null,
            'category_id' => Category::factory(),
        ];
    }

    public function first(Category $category): static
    {
        return $this->sequence(
            [
                'content' => '<h3>Задача 1</h3><p></p><p>Эту задачу можно таскать между категориями</p>',
                'category_id' => $category->id,
            ],
            [
                'content' => '<h3>Задача 2</h3><p></p><p>А ещё можно менять местами категории и создавать их</p>',
                'category_id' => $category->id,
            ],
        );
    }
}
