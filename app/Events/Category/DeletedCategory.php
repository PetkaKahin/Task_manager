<?php

declare(strict_types=1);

namespace App\Events\Category;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;

class DeletedCategory implements ShouldBroadcastNow
{
    use Dispatchable;
    use InteractsWithSockets;

    public function __construct(
        private readonly int $categoryId,
        private readonly int $projectId,
    ) {
    }

    /**
     * @return array<string, int>
     */
    public function broadcastWith(): array
    {
        return [
            'categoryId' => $this->categoryId,
        ];
    }

    public function broadcastAs(): string
    {
        return 'Category.DeletedCategory';
    }

    public function broadcastOn(): array
    {
        return [
            new PresenceChannel("Project.{$this->projectId}"),
        ];
    }
}
