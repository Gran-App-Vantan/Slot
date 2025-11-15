<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;


Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/login/{id}', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('me', [AuthController::class, 'me']);
    Route::post('enter', [AuthController::class, 'enter']);
    Route::get('latch_return', [AuthController::class, 'latch_return']);
    Route::patch('latch_update', [AuthController::class, 'latch_update']);
    Route::patch('point_update', [AuthController::class, 'point_update']);
    Route::post('/create-url', [AuthController::class, 'createUrl']);
});

