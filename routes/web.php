<?php

use App\Http\Controllers\Web\Auth\LoginController;
use App\Http\Controllers\Web\Auth\LogoutController;
use App\Http\Controllers\Web\Auth\RegisterController;
use App\Http\Controllers\Web\User\CategoryController;
use App\Http\Controllers\Web\User\DashboardController;
use App\Http\Controllers\Web\User\ProjectController;
use App\Http\Controllers\Web\User\TaskController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    if (!Auth::check()) return redirect()->route('login');

    $project = auth()->user()->projects()->first();
    return redirect()->route('dashboard.index', $project->id);
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
    Route::patch('projects/{id}/', [ProjectController::class, 'update'])->name('project.update');
    Route::delete('projects/{id}/', [ProjectController::class, 'destroy'])->name('project.destroy');
    Route::get('projects/{id}/edit/', [ProjectController::class, 'edit'])->name('project.edit');

    Route::get('tasks/new/', [TaskController::class, 'create'])->name('task.create');
    Route::post('tasks/new/', [TaskController::class, 'store'])->name('task.store');
    Route::patch('tasks/{id}/', [TaskController::class, 'update'])->name('task.update');
    Route::delete('tasks/{id}/', [TaskController::class, 'destroy'])->name('task.destroy');
    Route::get('tasks/{id}/edit/', [TaskController::class, 'edit'])->name('task.edit');

    Route::get('category/new/', [CategoryController::class, 'create'])->name('category.create');
    Route::post('category/new/', [CategoryController::class, 'store'])->name('category.store');
    Route::patch('category/{id}/', [CategoryController::class, 'update'])->name('category.update');
    Route::delete('category/{id}/', [CategoryController::class, 'destroy'])->name('category.destroy');
    Route::get('category/{id}/edit/', [CategoryController::class, 'edit'])->name('category.edit');

    Route::get('dashboard/{projectId}/', [DashboardController::class, 'index'])->name('dashboard.index');

    Route::post('logout', [LogoutController::class, 'destroy'])
        ->name('logout');
});
