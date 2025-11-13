<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::middleware('auth:sanctum')->group(function () {
    Route::get('me', [App\Http\Controllers\AuthController::class, 'me']);
});

Route::patch('point_update', [App\Http\Controllers\AuthController::class, 'point_update']);