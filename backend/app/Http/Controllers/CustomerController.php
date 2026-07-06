<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCustomerRequest;
use App\Services\CustomerService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

class CustomerController extends Controller
{
    use ApiResponse;

    protected $customerService;

    public function __construct(CustomerService $customerService)
    {
        $this->customerService = $customerService;
    }

    #[
        OA\Get(
            path: "/customers",
            summary: "Lista (paginada) os clientes do tenant, com busca e filtro de status",
            tags: ["Customers"],
            security: [["bearerAuth" => []]],
            parameters: [
                new OA\Parameter(
                    name: "search",
                    in: "query",
                    required: false,
                    description: "Busca por nome ou documento",
                    schema: new OA\Schema(type: "string"),
                ),
                new OA\Parameter(
                    name: "status",
                    in: "query",
                    required: false,
                    schema: new OA\Schema(
                        type: "string",
                        enum: ["active", "inactive"],
                    ),
                ),
            ],
            responses: [
                new OA\Response(
                    response: 200,
                    description: "Lista paginada de clientes.",
                ),
            ],
        ),
    ]
    public function index(Request $request): JsonResponse
    {
        $customers = $this->customerService->listarCustomers(
            $request->query("search"),
            $request->query("status"),
        );
        return $this->successResponse(
            "Clientes listados com sucesso!",
            $customers,
        );
    }

    #[
        OA\Post(
            path: "/customers",
            summary: "Cadastra um novo cliente (tomador) para o tenant",
            tags: ["Customers"],
            security: [["bearerAuth" => []]],
            requestBody: new OA\RequestBody(
                required: true,
                content: new OA\JsonContent(
                    required: ["tipo_pessoa", "documento", "nome"],
                    properties: [
                        new OA\Property(
                            property: "tipo_pessoa",
                            type: "string",
                            example: "PJ",
                        ),
                        new OA\Property(
                            property: "documento",
                            type: "string",
                            example: "12345678000199",
                        ),
                        new OA\Property(
                            property: "nome",
                            type: "string",
                            example: "Cliente Exemplo LTDA",
                        ),
                        new OA\Property(
                            property: "codigo_ibge",
                            type: "string",
                            example: "3550308",
                        ),
                    ],
                ),
            ),
            responses: [
                new OA\Response(response: 201, description: "Cliente criado."),
                new OA\Response(
                    response: 422,
                    description: "Erro de validação.",
                ),
            ],
        ),
    ]
    public function store(StoreCustomerRequest $request): JsonResponse
    {
        $dadosLimpos = $request->validated();
        $tenant_id = auth()->user()->tenant_id;
        $customer = $this->customerService->registrarCustomer(
            $dadosLimpos,
            $tenant_id,
        );
        return $this->successResponse(
            "Cliente registrado com sucesso!",
            $customer,
            201,
        );
    }

    #[
        OA\Patch(
            path: "/customers/{id}/status",
            summary: "Ativa ou inativa um cliente (não é removido por vínculo financeiro)",
            tags: ["Customers"],
            security: [["bearerAuth" => []]],
            parameters: [
                new OA\Parameter(
                    name: "id",
                    in: "path",
                    required: true,
                    schema: new OA\Schema(type: "integer"),
                ),
            ],
            requestBody: new OA\RequestBody(
                required: true,
                content: new OA\JsonContent(
                    required: ["active"],
                    properties: [
                        new OA\Property(
                            property: "active",
                            type: "boolean",
                            example: false,
                        ),
                    ],
                ),
            ),
            responses: [
                new OA\Response(
                    response: 200,
                    description: "Status atualizado.",
                ),
            ],
        ),
    ]
    public function updateStatus(Request $request, $id): JsonResponse
    {
        $dados = $request->validate([
            "active" => "required|boolean",
        ]);
        $customer = $this->customerService->alterarStatus(
            $id,
            $dados["active"],
        );
        return $this->successResponse(
            "Status do cliente atualizado com sucesso!",
            $customer,
        );
    }
}
