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
        // Telescope SOMENTE em ambiente local. Além de ser dependência de dev
        // (não existe em produção com `composer install --no-dev`), o guard de
        // ambiente garante que ele não seja registrado fora de local mesmo que
        // as dependências de dev estejam presentes.
        if (
            $this->app->environment("local") &&
            class_exists(TelescopeApplicationServiceProvider::class)
        ) {
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
