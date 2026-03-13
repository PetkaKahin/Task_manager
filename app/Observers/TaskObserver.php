<?php

declare(strict_types=1);

namespace App\Observers;

use App\Events\Task\CreatedTask;
use App\Events\Task\DeletedTask;
use App\Events\Task\UpdatedTask;
use App\Models\Task;

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
        broadcast(new UpdatedTask(
            task: $task,
        ))->toOthers();
    }

    public function deleted(Task $task): void
    {
        broadcast(new DeletedTask(
            task: $task,
        ))->toOthers();
    }
}
