<?php

declare(strict_types=1);

namespace App\Events\Category;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;

class CreatedCategory implements ShouldBroadcastNow
{
    use Dispatchable;
    use InteractsWithSockets;

    public function __construct(
        public readonly int $id,
        public readonly string $title,
        public readonly string $description,
        private readonly int $projectId,
    ) {
    }

    /**
     * @return array<string, string|int|array<string, mixed>>
     */
    public function broadcastWith(): array
    {
        return [
            'category' => [
                'id' => $this->id,
                'project_id' => $this->projectId,
                'title' => $this->title,
                'description' => $this->description,
                'tasks' => [],
            ],
        ];
    }

    public function broadcastAs(): string
    {
        return 'Category.CreatedCategory';
    }

    public function broadcastOn(): array
    {
        return [
            new PresenceChannel("Project.{$this->projectId}"),
        ];
    }
}
