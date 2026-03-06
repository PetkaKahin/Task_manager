<?php

namespace App\Events\Category;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;

class DeletedCategory implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets;

    public function __construct(
        private int $categoryId,
        private int $projectId,
    ) {}

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