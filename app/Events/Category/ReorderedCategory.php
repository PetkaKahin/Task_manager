<?php

namespace App\Events\Category;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;

class ReorderedCategory implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets;

    /**
     * @param int $projectId
     * @param int[] $categoryIds Отсортированные ID категорий
     */
    public function __construct(
        private int $projectId,
        public readonly array $categoryIds,
    ) {}

    public function broadcastWith(): array
    {
        return [
            'categoryIds' => $this->categoryIds,
        ];
    }

    public function broadcastAs(): string
    {
        return 'Category.ReorderedCategory';
    }

    public function broadcastOn(): array
    {
        return [
            new PresenceChannel("Project.{$this->projectId}"),
        ];
    }
}