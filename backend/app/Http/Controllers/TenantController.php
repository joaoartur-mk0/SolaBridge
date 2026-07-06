<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTenantRequest;
use App\Services\TenantService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use OpenApi\Attributes as OA;

class TenantController extends Controller
{
    use ApiResponse; // Nossa padronização global

    protected $tenantService;

    public function __construct(TenantService $tenantService)
    {
        $this->tenantService = $tenantService;
    }

    #[
        OA\Post(
            path: "/tenants",
            summary: "Registra uma nova Empresa (Tenant) e seu Administrador",
            tags: ["Onboarding"],
            requestBody: new OA\RequestBody(
                required: true,
                description: "Payload (JSON) com os dados da empresa e do usuário dono.",
                content: new OA\JsonContent(
                    required: [
                        "tipo_pessoa",
                        "documento",
                        "nome",
                        "admin_name",
                        "admin_email",
                        "admin_password",
                    ],
                    properties: [
                        new OA\Property(
                            property: "tipo_pessoa",
                            type: "string",
                            example: "PJ",
                            description: "PF ou PJ",
                        ),
                        new OA\Property(
                            property: "documento",
                            type: "string",
                            example: "12345678000199",
                        ),
                        new OA\Property(
                            property: "nome",
                            type: "string",
                            example: "Tech Solutions LTDA",
                        ),
                        new OA\Property(
                            property: "email",
                            type: "string",
                            example: "contato@techsolutions.com",
                        ),
                        new OA\Property(
                            property: "admin_name",
                            type: "string",
                            example: "João Silva",
                        ),
                        new OA\Property(
                            property: "admin_email",
                            type: "string",
                            example: "joao@techsolutions.com",
                        ),
                        new OA\Property(
                            property: "admin_password",
                            type: "string",
                            example: "SenhaForte123!",
                        ),
                    ],
                ),
            ),
            responses: [
                new OA\Response(
                    response: 201,
                    description: "Tenant e Usuário criados com sucesso.",
                ),
                new OA\Response(
                    response: 422,
                    description: "Erro de validação (Ex: Documento ou E-mail já existem).",
                ),
            ],
        ),
    ]
    public function store(StoreTenantRequest $request): JsonResponse
    {
        $dadosLimpos = $request->validated();

        $resultado = $this->tenantService->criarNovoTenant($dadosLimpos);

        return $this->successResponse(
            "Bem-vindo ao SolaBridge! Conta e usuário administrador criados com sucesso.",
            $resultado,
            201,
        );
    }
}
