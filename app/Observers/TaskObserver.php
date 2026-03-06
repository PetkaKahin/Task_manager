<?php

namespace App\Observers;

use App\Events\Task\CreatedTask;
use App\Events\Task\DeletedTask;
use App\Events\Task\UpdatedTask;
use App\Models\Task;

class TaskObserver
{
    private function getProjectId(Task $task): int
    {
        $task->loadMissing('category');
        return $task->category->project_id;
    }

    public function created(Task $task): void
    {
        broadcast(new CreatedTask($task, $this->getProjectId($task)))->toOthers();
    }

    public function updated(Task $task): void
    {
        broadcast(new UpdatedTask($task, $this->getProjectId($task)))->toOthers();
    }

    public function deleted(Task $task): void
    {
        broadcast(new DeletedTask(
            $task->id,
            $task->category_id,
            $this->getProjectId($task),
        ))->toOthers();
    }
}
