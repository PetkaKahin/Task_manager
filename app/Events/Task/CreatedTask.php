<?php

namespace App\Events\Task;

use App\Models\Task;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;

class CreatedTask implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets;

    public readonly Task $task;
    private int $projectId;

    public function __construct(Task $task, int $projectId)
    {
        $this->task = $task;
        $this->projectId = $projectId;
    }

    public function broadcastWith(): array
    {
        return [
            'task' => [
                'id' => $this->task->id,
                'content' => $this->task->content,
                'category_id' => (int) $this->task->category_id,
            ],
        ];
    }

    public function broadcastAs(): string
    {
        return 'Task.CreatedTask';
    }

    public function broadcastOn(): array
    {
        return [
            new PresenceChannel("Project.{$this->projectId}"),
        ];
    }
}
