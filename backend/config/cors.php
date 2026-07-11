<?php

/*
|--------------------------------------------------------------------------
| Cross-Origin Resource Sharing (CORS) — política restritiva
|--------------------------------------------------------------------------
|
| Sem curingas. Em produção o padrão já são EXATAMENTE as duas origens
| autorizadas. Ambientes locais podem sobrescrever via a variável de ambiente
| CORS_ALLOWED_ORIGINS (lista separada por vírgula), ex.: no backend/.env local:
|   CORS_ALLOWED_ORIGINS=http://localhost:5173
|
*/

$allowedOrigins = array_values(
    array_filter(
        array_map(
            "trim",
            explode(
                ",",
                env(
                    "CORS_ALLOWED_ORIGINS",
                    "http://bridge.solasoftware.com.br,https://teste.getisolucoes.com.br",
                ),
            ),
        ),
    ),
);

return [
    // Apenas as rotas da API passam pelo CORS.
    "paths" => ["api/*"],

    // Somente os métodos essenciais (o preflight OPTIONS é tratado pelo
    // middleware HandleCors, não precisa ser listado aqui).
    "allowed_methods" => ["GET", "POST", "PUT", "PATCH", "DELETE"],

    // Origens explícitas — NUNCA "*".
    "allowed_origins" => $allowedOrigins,
    "allowed_origins_patterns" => [],

    // Apenas os headers necessários para autenticação por token e JSON.
    "allowed_headers" => [
        "Accept",
        "Authorization",
        "Content-Type",
        "X-Requested-With",
    ],

    "exposed_headers" => [],

    "max_age" => 3600,

    // Autenticação é por Bearer token (Sanctum tokens), não por cookies de
    // sessão — portanto não expomos credenciais cross-site.
    "supports_credentials" => false,
];
