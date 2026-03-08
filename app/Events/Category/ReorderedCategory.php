<?php

declare(strict_types=1);

namespace App\Events\Category;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;

class ReorderedCategory implements ShouldBroadcastNow
{
    use Dispatchable;
    use InteractsWithSockets;

    /**
     * @param int $projectId
     * @param int[] $categoryIds Отсортированные ID категорий
     */
    public function __construct(
        private readonly int $projectId,
        public readonly array $categoryIds,
    ) {
    }

    /**
     * @return array<string, array<int>>
     */
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
