<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        //
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        if ($request->is('api/*')) {
            Log::error('Erro Fatal na API: ' . $e->getMessage(), [
                'url' => $request->fullUrl(),
                'user_id' => auth()->id ?? 'Nao Autenticado',
                'file' => $e->getFile(),
                'line' => $->getLine()
            ]);

            return response()->json([
                'sucess' => false,
                'message' => 'Ocorreu um erro interno no servidor. Nossa equipe já foi notificada',
            ], 500);
        }
    })->create();
