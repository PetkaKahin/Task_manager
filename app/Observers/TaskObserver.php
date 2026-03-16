<?php

declare(strict_types=1);

namespace App\Observers;

use App\Events\Task\CreatedTask;
use App\Events\Task\DeletedTask;
use App\Events\Task\UpdatedTask;
use App\Models\Task;
use Illuminate\Support\Facades\Cache;

class TaskObserver
{
    public function created(Task $task): void
    {
        broadcast(new CreatedTask(
            task: $task,
        ))->toOthers();
    }

    public function updated(Task $task): void
    {
        Cache::tags(["task:{$task->id}"])->flush();

        // Don't broadcast when only position changed (e.g. during reorder)
        $changed = array_keys($task->getChanges());
        $meaningful = array_diff($changed, ['position', 'updated_at']);
        if (empty($meaningful)) {
            return;
        }

        broadcast(new UpdatedTask(
            task: $task,
        ))->toOthers();
    }

    public function deleted(Task $task): void
    {
        Cache::tags(["task:{$task->id}"])->flush();

        broadcast(new DeletedTask(
            task: $task,
        ))->toOthers();
    }
}
