<?php

use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\TaskController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:web')->group(function () {
    Route::get('categories/{category}', [CategoryController::class, 'show'])
        ->name('api.categories.show');
    Route::patch('categories/{category}', [CategoryController::class, 'update'])
        ->name('api.categories.update');
    Route::delete('categories/{category}', [CategoryController::class, 'destroy'])
        ->name('api.categories.destroy');
    Route::patch('categories/{category}/reorder', [CategoryController::class, 'reorder'])
        ->name('api.categories.reorder');

    Route::patch('tasks/{task}', [TaskController::class, 'update'])
        ->name('api.tasks.update');
    Route::patch('tasks/{task}/reorder', [TaskController::class, 'reorder'])
        ->name('api.tasks.reorder');

    Route::get('projects', [ProjectController::class, 'index'])
        ->name('api.projects.index');
});
