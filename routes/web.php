<?php

use App\Http\Controllers\Web\Auth\LoginController;
use App\Http\Controllers\Web\Auth\LogoutController;
use App\Http\Controllers\Web\Auth\RegisterController;
use App\Http\Controllers\Web\User\DashboardController;
use App\Http\Controllers\Web\User\ProjectController;
use App\Http\Controllers\Web\User\TaskController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Home');
})->name('home');

Route::get('/ping', fn() => 'pong');

Route::middleware(['guest', 'throttle:60,1'])->group(function () {
    Route::get('register', [RegisterController::class, 'create'])
        ->name('register');
    Route::post('register', [RegisterController::class, 'store']);

    Route::get('login', [LoginController::class, 'create'])
        ->name('login');
    Route::post('login', [LoginController::class, 'store']);
});

Route::middleware('auth:web')->group(function () {
    Route::get('projects/new/', [ProjectController::class, 'create'])->name('project.create');
    Route::post('projects/new/', [ProjectController::class, 'store'])->name('project.store');

    Route::get('tasks/new/', [TaskController::class, 'create'])->name('task.create');
    Route::get('tasks/{id}/edit/', [TaskController::class, 'edit'])->name('task.edit');
    Route::post('tasks/new/', [TaskController::class, 'store'])->name('task.store');
    Route::delete('tasks/{id}/', [TaskController::class, 'destroy'])->name('task.destroy');
    Route::patch('tasks/{id}/', [TaskController::class, 'update'])->name('task.update');

    Route::get('dashboard/{projectId}/', [DashboardController::class, 'index'])->name('dashboard.index');

    Route::post('logout', [LogoutController::class, 'destroy'])
        ->name('logout');
});
