<?php

declare(strict_types=1);

namespace App\Events\Category;

use App\Models\Category;
use App\Models\Project;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;

class ReorderedCategory implements ShouldBroadcastNow
{
    use Dispatchable;
    use InteractsWithSockets;

    /**
     * @param Project $project
     */
    public function __construct(
        private readonly Project $project,
    ) {
    }

    /**
     * @return array<string, array<int>|int|string|null>
     */
    public function broadcastWith(): array
    {
        return [
            'category_ids' => $this->getSortedCategoryIds(),
            'initiator_id' => auth()->id(), // фронтенд сам достанет данные, если надо
        ];
    }

    public function broadcastAs(): string
    {
        return 'Category.ReorderedCategory';
    }

    public function broadcastOn(): array
    {
        return [
            new PresenceChannel("Project.{$this->project->id}"),
        ];
    }

    /**
     * @return array<int>
     */
    public function getSortedCategoryIds(): array
    {
        /** @var array<int> */
        return Category::query()
            ->sorted()
            ->where('project_id', $this->project->id)
            ->pluck('id')
            ->all();
    }
}
