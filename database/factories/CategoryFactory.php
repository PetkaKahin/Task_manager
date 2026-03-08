<?php

namespace Database\Factories;

use AlexCrawford\LexoRank\Rank;
use App\Models\Project;
use Illuminate\Database\Eloquent\Factories\Factory;

class CategoryFactory extends Factory
{
    public function definition(): array
    {
        return [
            'title'      => fake()->sentence(2),
            'project_id' => Project::factory(),
            'position'   => Rank::forEmptySequence()->get(),
        ];
    }

    public function defaultForProject(Project $project): static
    {
        $first  = Rank::forEmptySequence()->get();
        $second = Rank::after(Rank::fromString($first))->get();
        $third  = Rank::after(Rank::fromString($second))->get();

        return $this->sequence(
            [
                'title'      => 'В планах',
                'project_id' => $project->id,
                'position'   => $first,
            ],
            [
                'title'      => 'В работе',
                'project_id' => $project->id,
                'position'   => $second,
            ],
            [
                'title'      => 'Завершено',
                'project_id' => $project->id,
                'position'   => $third,
            ],
        );
    }
}
