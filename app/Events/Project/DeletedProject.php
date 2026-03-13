<?php

declare(strict_types=1);

namespace App\Events\Project;

use App\Models\Project;
use App\Models\User;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;

class DeletedProject implements ShouldBroadcastNow
{
    use Dispatchable;
    use InteractsWithSockets;

    /**
     * @param Project $project
     */
    public function __construct(
        private readonly Project $project,
    ) {
        $this->project->loadMissing('users');
    }

    /**
     * @return array<string, mixed>
     */
    public function broadcastWith(): array
    {
        return [
            'project_id' => $this->project->id,
            'initiator_id' => auth()->id(), // фронтенд сам достанет данные, если надо
        ];
    }

    public function broadcastAs(): string
    {
        return 'Project.DeletedProject';
    }

    /**
     * @return PrivateChannel[]
     */
    // TODO не проще ли работать с одним каналом PresenceChannel('project.{id}')?
    public function broadcastOn(): array
    {
        return collect($this->project->users)
            ->map(fn (User $user) => new PrivateChannel("User.{$user->id}"))
            ->all();
    }
}
