<?php

use App\Broadcasting\ProjectChannel;
use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('Project.{id}', ProjectChannel::class);

Broadcast::channel('User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});
