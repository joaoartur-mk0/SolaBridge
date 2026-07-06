<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreUserRequest;
use App\Services\UserService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use OpenApi\Attributes as OA;

class UserController extends Controller
{
    use ApiResponse;

    protected $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    #[
        OA\Post(
            path: "/users",
            summary: "Cadastra um usuário no tenant autenticado",
            tags: ["Usuários"],
            security: [["bearerAuth" => []]],
            requestBody: new OA\RequestBody(
                required: true,
                content: new OA\JsonContent(
                    required: ["name", "email", "password", "role"],
                    properties: [
                        new OA\Property(
                            property: "name",
                            type: "string",
                            example: "Maria Contadora",
                        ),
                        new OA\Property(
                            property: "email",
                            type: "string",
                            example: "maria@empresa.com",
                        ),
                        new OA\Property(
                            property: "password",
                            type: "string",
                            example: "SenhaForte123!",
                        ),
                        new OA\Property(
                            property: "role",
                            type: "string",
                            example: "contador",
                        ),
                    ],
                ),
            ),
            responses: [
                new OA\Response(response: 201, description: "Usuário criado."),
                new OA\Response(
                    response: 422,
                    description: "Erro de validação.",
                ),
            ],
        ),
    ]
    public function store(StoreUserRequest $request): JsonResponse
    {
        $dadosLimpos = $request->validated();
        $tenant_id = auth()->user()->tenant_id;

        $user = $this->userService->registrarUsuario($dadosLimpos, $tenant_id);

        return $this->successResponse(
            "Usuário registrado com sucesso!",
            $user,
            201,
        );
    }
}
