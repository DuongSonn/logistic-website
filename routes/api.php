<?php

use App\Http\Controllers\MessageController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/
Route::group([
    'middleware' => 'api',
    'prefix' => 'auth'
], function ($router) {
    Route::post('login', [UserController::class, 'login']);
    Route::post('refresh', [UserController::class, 'refresh']);
    Route::get('/list', [UserController::class, 'getUsers']);
});

Route::group([
    'middleware' => 'api',
    'prefix' => 'products'
], function ($router) {
    Route::get('/list', [ProductController::class, 'getProducts']);
});

Route::group([
    'middleware' => 'api',
    'prefix' => 'orders'
], function ($router) {
    Route::get('/list', [OrderController::class, 'getOrders']);
    Route::post('/create', [OrderController::class, 'create']);
    Route::put('/update', [OrderController::class, 'update']);
    Route::get('/info', [OrderController::class, 'getOrderDetail']);
});

Route::group([
    'middleware' => 'api',
    'prefix' => 'users'
], function ($router) {
    Route::get('/list', [UserController::class, 'getUsers']);
});

Route::group([
    'middleware' => 'api',
    'prefix' => 'messages'
], function ($router) {
    Route::get('/list', [MessageController::class, 'getUserMessages']);
    Route::post('/create', [MessageController::class, 'createMessage']);
});