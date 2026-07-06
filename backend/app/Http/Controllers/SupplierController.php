<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSupplierRequest;
use App\Services\SupplierService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

class SupplierController extends Controller
{
    use ApiResponse;

    protected $supplierService;

    public function __construct(SupplierService $supplierService)
    {
        $this->supplierService = $supplierService;
    }

    #[
        OA\Get(
            path: "/suppliers",
            summary: "Lista (paginada) os fornecedores do tenant, com busca e filtro de status",
            tags: ["Suppliers"],
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
                    description: "Lista paginada de fornecedores.",
                ),
            ],
        ),
    ]
    public function index(Request $request): JsonResponse
    {
        $suppliers = $this->supplierService->listarSuppliers(
            $request->query("search"),
            $request->query("status"),
        );
        return $this->successResponse(
            "Fornecedores listados com sucesso!",
            $suppliers,
        );
    }

    #[
        OA\Post(
            path: "/suppliers",
            summary: "Cadastra um novo fornecedor para o tenant",
            tags: ["Suppliers"],
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
                            example: "98765432000155",
                        ),
                        new OA\Property(
                            property: "nome",
                            type: "string",
                            example: "Fornecedor Exemplo LTDA",
                        ),
                    ],
                ),
            ),
            responses: [
                new OA\Response(
                    response: 201,
                    description: "Fornecedor criado.",
                ),
                new OA\Response(
                    response: 422,
                    description: "Erro de validação.",
                ),
            ],
        ),
    ]
    public function store(StoreSupplierRequest $request): JsonResponse
    {
        $dadosLimpos = $request->validated();
        $tenant_id = auth()->user()->tenant_id;
        $supplier = $this->supplierService->registrarSupplier(
            $dadosLimpos,
            $tenant_id,
        );
        return $this->successResponse(
            "Fornecedor registrado com sucesso!",
            $supplier,
            201,
        );
    }

    #[
        OA\Patch(
            path: "/suppliers/{id}/status",
            summary: "Ativa ou inativa um fornecedor (não é removido por vínculo financeiro)",
            tags: ["Suppliers"],
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
        $supplier = $this->supplierService->alterarStatus(
            $id,
            $dados["active"],
        );
        return $this->successResponse(
            "Status do fornecedor atualizado com sucesso!",
            $supplier,
        );
    }
}
