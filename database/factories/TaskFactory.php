<?php

namespace Database\Factories;

use AlexCrawford\LexoRank\Rank;
use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;

class TaskFactory extends Factory
{
    public function definition(): array
    {
        return [
            'content'     => null,
            'category_id' => Category::factory(),
            'position'    => Rank::forEmptySequence()->get(),
        ];
    }

    public function first(Category $category): static
    {
        $first  = Rank::forEmptySequence()->get();
        $second = Rank::after(Rank::fromString($first))->get();

        return $this->sequence(
            [
                'content'     => '<h3>Задача 1</h3><p></p><p>Эту задачу можно таскать между категориями</p>',
                'category_id' => $category->id,
                'position'    => $first,
            ],
            [
                'content'     => '<h3>Задача 2</h3><p></p><p>А ещё можно менять местами категории и создавать их</p>',
                'category_id' => $category->id,
                'position'    => $second,
            ],
        );
    }
}
