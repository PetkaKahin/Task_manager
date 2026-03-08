<?php

declare(strict_types=1);

namespace App\Events\Category;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;

class UpdatedCategory implements ShouldBroadcastNow
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
     * @return array<array<string, int|string>>
     */
    public function broadcastWith(): array
    {
        return [
            'category' => [
                'id' => $this->id,
                'project_id' => $this->projectId,
                'title' => $this->title,
                'description' => $this->description,
            ],
        ];
    }

    public function broadcastAs(): string
    {
        return 'Category.UpdatedCategory';
    }

    public function broadcastOn(): array
    {
        return [
            new PresenceChannel("Project.{$this->projectId}"),
        ];
    }
}
