<?php

use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\TaskController;
use Illuminate\Support\Facades\Route;

Route::get('/ping', fn() => 'pong');

Route::middleware('auth:sanctum')->group(function () {
    Route::get('projects/{projectId}/categories/{categoryId}', [CategoryController::class, 'show'])
        ->name('api.categories.show');
    Route::patch('projects/{projectId}/categories/{categoryId}', [CategoryController::class, 'update'])
        ->name('api.categories.update');
    Route::patch('projects/{project}/categories/{category}/reorder', [CategoryController::class, 'reorder'])
        ->name('api.categories.reorder');

    Route::patch('projects/{projectId}/categories/{categoryId}/tasks/{taskId}/reorder', [TaskController::class, 'reorder'])
        ->name('api.tasks.reorder');

    Route::get('projects', [ProjectController::class, 'index'])
        ->name('api.projects.index');
});
