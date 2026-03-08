<?php

declare(strict_types=1);

namespace App\Events\Task;

use App\Models\Task;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;

class UpdatedTask implements ShouldBroadcastNow
{
    use Dispatchable;
    use InteractsWithSockets;

    public function __construct(
        public readonly Task $task,
        private readonly int $projectId
    ) {
    }

    /**
     * @return array<string, array<string, int|null|array<mixed>>>
     */
    public function broadcastWith(): array
    {
        return [
            'task' => [
                'id' => $this->task->id,
                'content' => $this->task->content,
                'category_id' => $this->task->category_id,
            ],
        ];
    }

    public function broadcastAs(): string
    {
        return 'Task.UpdatedTask';
    }

    /**
     * @return PresenceChannel[]
     */
    public function broadcastOn(): array
    {
        return [
            new PresenceChannel("Project.{$this->projectId}"),
        ];
    }
}
