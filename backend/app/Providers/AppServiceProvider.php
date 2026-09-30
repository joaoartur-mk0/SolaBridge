<?php

namespace App\Providers;

use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void {}

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // IDs de rota são sempre numéricos: valores inválidos viram 404 em vez
        // de TypeError (500) nos services que tipam `int $id`.
        Route::pattern("id", "[0-9]+");
        Route::pattern("contaId", "[0-9]+");
    }
}
