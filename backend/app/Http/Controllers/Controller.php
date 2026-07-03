<?php

namespace App\Http\Controllers;

use OpenApi\Attributes as OA;

#[
    OA\Info(
        version: "1.0.0",
        description: "Documentação oficial da API do SolaBridge ERP (Motor Contábil).",
        title: "SolaBridge API",
    ),
]
#[
    OA\Server(
        url: "http://127.0.0.1:8000/api/v1",
        description: "Local Development Server",
    ),
]
abstract class Controller
{
    //
}
