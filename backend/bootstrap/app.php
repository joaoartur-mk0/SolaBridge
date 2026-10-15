<?php

use Illuminate\Auth\AuthenticationException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . "/../routes/web.php",
        api: __DIR__ . "/../routes/api.php",
        commands: __DIR__ . "/../routes/console.php",
        health: "/up",
    )
    ->withMiddleware(function (Middleware $middleware): void {
        // A API só é alcançada via Traefik/Nginx: confia no proxy imediato para
        // obter HTTPS e o IP real do cliente (URLs geradas e rate limit).
        $middleware->trustProxies(at: "*");
    })
    ->withExceptions(function (Exceptions $exceptions) {
        // Rotas da API sempre respondem JSON (inclusive 401 sem redirect).
        $exceptions->shouldRenderJsonWhen(
            fn(Request $request) => $request->is("api/*") ||
                $request->expectsJson(),
        );

        $exceptions->render(function (
            NotFoundHttpException $e,
            Request $request,
        ) {
            if ($request->is("api/*")) {
                return response()->json(
                    [
                        "success" => false,
                        "message" =>
                            "O recurso solicitado não foi encontrado no sistema.",
                    ],
                    404,
                );
            }
        });

        // Demais erros HTTP (403, 405, 409, 429...) mantêm o status original.
        $exceptions->render(function (
            HttpExceptionInterface $e,
            Request $request,
        ) {
            if ($request->is("api/*")) {
                return response()->json(
                    [
                        "success" => false,
                        "message" => $e->getMessage() ?: "Requisição inválida.",
                    ],
                    $e->getStatusCode(),
                    $e->getHeaders(),
                );
            }
        });

        $exceptions->render(function (\Throwable $e, Request $request) {
            if (!$request->is("api/*")) {
                return null;
            }

            // Erros esperados (validação 422, autenticação 401) seguem o fluxo
            // padrão do Laravel com o status correto.
            if (
                $e instanceof ValidationException ||
                $e instanceof AuthenticationException ||
                $e instanceof HttpResponseException
            ) {
                return null;
            }

            Log::error("Erro Fatal na API: " . $e->getMessage(), [
                "url" => $request->fullUrl(),
                "user_id" => auth()->id() ?? "Não Autenticado",
                "file" => $e->getFile(),
                "line" => $e->getLine(),
            ]);

            return response()->json(
                [
                    "success" => false,
                    "message" =>
                        "Ocorreu um erro interno no servidor. Nossa equipe já foi notificada.",
                ],
                500,
            );
        });
    })
    ->create();
