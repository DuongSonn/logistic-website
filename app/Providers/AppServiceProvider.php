<?php

namespace App\Providers;

use App\Http\Interfaces\MessageRepositoryInterface;
use App\Http\Interfaces\MessageServiceInterface;
use App\Http\Interfaces\OrderDetailRepositoryInterface;
use App\Http\Interfaces\OrderRepositoryInterface;
use App\Http\Interfaces\OrderServiceInterface;
use App\Http\Interfaces\ProductRepositoryInterface;
use App\Http\Interfaces\ProductServiceInterface;
use App\Http\Interfaces\ReviewRepositoryInterface;
use App\Http\Interfaces\ReviewServiceInterface;
use App\Http\Interfaces\UserRepositoryInterface;

use App\Http\Interfaces\UserServiceInterface;
use App\Http\Repository\MessageRepository;
use App\Http\Repository\OrderDetailRepository;
use App\Http\Repository\OrderRepository;
use App\Http\Repository\ProductRepository;
use App\Http\Repository\ReviewRepository;
use App\Http\Repository\UserRepository;
use App\Http\Services\MessageService;
use App\Http\Services\OrderService;
use App\Http\Services\ProductService;
use App\Http\Services\ReviewService;
use App\Http\Services\UserService;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
        $this->app->bind(UserServiceInterface::class, UserService::class);
        $this->app->bind(ProductServiceInterface::class, ProductService::class);
        $this->app->bind(OrderServiceInterface::class, OrderService::class);
        $this->app->bind(MessageServiceInterface::class, MessageService::class);
        $this->app->bind(ReviewServiceInterface::class, ReviewService::class);

        // 
        $this->app->bind(UserRepositoryInterface::class, UserRepository::class);
        $this->app->bind(OrderRepositoryInterface::class, OrderRepository::class);
        $this->app->bind(ProductRepositoryInterface::class, ProductRepository::class);
        $this->app->bind(OrderDetailRepositoryInterface::class, OrderDetailRepository::class);
        $this->app->bind(MessageRepositoryInterface::class, MessageRepository::class);
        $this->app->bind(ReviewRepositoryInterface::class, ReviewRepository::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
