<?php

namespace App\Repositories;

use App\Models\Project;
use App\Models\User;
use App\Repositories\Contracts\ProjectRepositoryInterface;
use Illuminate\Database\Eloquent\Relations\Pivot;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;

class ProjectRepository implements ProjectRepositoryInterface
{
    public function getByUser(User $user): Collection
    {
        $raw = Cache::tags(["user:{$user->id}:projects"])
            ->remember(
                "user:{$user->id}:projects:v2",
                now()->addHour(),
                fn () => $user->projects()->get()->map(fn (Project $project) => [
                    'attrs' => $project->getAttributes(),
                    'pivot' => $project->pivot?->getAttributes() ?? [],
                ])->toArray()
            );

        return (new Project)->newCollection(
            array_map(function (array $item): Project {
                $project = (new Project)->newFromBuilder($item['attrs']);

                if (!empty($item['pivot'])) {
                    $project->setRelation('pivot', (new Pivot)->newFromBuilder($item['pivot']));
                }

                return $project;
            }, $raw)
        );
    }

    public function find(int $id): Project | null
    {
        $raw = Cache::tags(["project:{$id}"])
            ->remember(
                "project:{$id}",
                now()->addHour(),
                fn () => Project::query()->find($id)?->getAttributes()
            );

        return $raw ? (new Project)->newFromBuilder($raw) : null;
    }

    public function create(array $data): Project
    {
        $project = Project::query()->create($data);
        $this->clearUserListCaches($project);

        return $project;
    }

    public function createWithFactory(User $user, string $title): Project
    {
        $project = Project::factory()->default($user, $title)->create();

        $projectWithPivot = $user->projects()->findOrFail($project->id);
        $first = $this->getFirstByUser($user, $project->id);

        if ($first) {
            $user->projects()->moveBefore($projectWithPivot, $first);
        }

        $this->clearUserListCaches($project);

        return $project;
    }

    public function update(Project $project, array $data): Project
    {
        $project->update($data);
        $this->clearProjectCache($project);

        return $project;
    }

    public function delete(Project $project): void
    {
        $project->delete();
        $this->clearProjectCache($project);
    }

    public function getFirstByUser(User $user, int $excludeId): Project | null
    {
        /** @var Project|null $project */
        $project = $user->projects()
            ->where('projects.id', '!=', $excludeId)
            ->first();

        return $project;
    }

    public function findByUserOrFail(User $user, int $id): Project
    {
        /** @var Project $project */
        $project = $user->projects()->findOrFail($id);

        return $project;
    }

    public function clearUserCache(User $user): void
    {
        Cache::tags(["user:{$user->id}:projects"])->flush();
    }

    private function clearProjectCache(Project $project): void
    {
        Cache::tags(["project:{$project->id}"])->flush();
        $this->clearUserListCaches($project);
    }

    private function clearUserListCaches(Project $project): void
    {
        $project->load('users');

        $project->users->each(function (User $user) {
            $this->clearUserCache($user);
        });
    }
}
