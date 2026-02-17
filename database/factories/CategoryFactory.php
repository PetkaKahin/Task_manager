<?php

namespace Database\Factories;

use App\Models\Project;
use Illuminate\Database\Eloquent\Factories\Factory;

class CategoryFactory extends Factory
{
    public function definition(): array
    {
        return [
            'title'      => fake()->sentence(2),
            'project_id' => Project::factory(),
        ];
    }

    public function defaultForProject(Project $project): static
    {
        return $this->sequence(
            [
                'title'      => 'В планах',
                'project_id' => $project->id,
            ],
            [
                'title'      => 'В работе',
                'project_id' => $project->id,
            ],
            [
                'title'      => 'Завершено',
                'project_id' => $project->id,
            ],
        );
    }
}
