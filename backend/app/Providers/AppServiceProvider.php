<?php

namespace App\Providers;

use App\Models\User;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\RateLimiter;
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

        // Operações restritas a administradores do tenant.
        Gate::define(
            "admin",
            fn(User $user) => in_array($user->role, ["admin", "superadmin"]),
        );

        // Limita tentativas de login (força bruta) e cadastros públicos.
        RateLimiter::for(
            "login",
            fn(Request $request) => Limit::perMinute(5)->by(
                mb_strtolower((string) $request->input("email")) .
                    "|" .
                    $request->ip(),
            ),
        );
        RateLimiter::for(
            "cadastro-tenant",
            fn(Request $request) => Limit::perHour(10)->by($request->ip()),
        );
    }
}
