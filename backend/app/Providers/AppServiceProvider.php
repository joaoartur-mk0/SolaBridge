<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Providers\TelescopeServiceProvider;
use Laravel\Telescope\TelescopeServiceProvider as TelescopeApplicationServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        if (class_exists(TelescopeApplicationServiceProvider::class)) {
            $this->app->register(TelescopeServiceProvider::class);
        }
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
