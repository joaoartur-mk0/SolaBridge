<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCompraRequest;
use App\Services\CompraService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

class CompraController extends Controller
{
    use ApiResponse;

    protected $compraService;

    public function __construct(CompraService $compraService)
    {
        $this->compraService = $compraService;
    }

    #[
        OA\Get(
            path: "/compras",
            summary: "Lista (paginada) as compras do tenant (títulos a pagar)",
            tags: ["Compras"],
            security: [["bearerAuth" => []]],
            parameters: [
                new OA\Parameter(
                    name: "status",
                    in: "query",
                    required: false,
                    schema: new OA\Schema(
                        type: "string",
                        enum: [
                            "PENDENTE",
                            "PAGO",
                            "ATRASADO",
                            "CANCELADO",
                        ],
                    ),
                ),
            ],
            responses: [
                new OA\Response(
                    response: 200,
                    description: "Lista paginada de compras.",
                ),
            ],
        ),
    ]
    public function index(Request $request): JsonResponse
    {
        $compras = $this->compraService->listarCompras(
            $request->query("status"),
        );
        return $this->successResponse(
            "Compras listadas com sucesso!",
            $compras,
        );
    }

    #[
        OA\Get(
            path: "/compras/{id}",
            summary: "Detalha uma compra (título, lançamentos, partidas e movimentações)",
            tags: ["Compras"],
            security: [["bearerAuth" => []]],
            parameters: [
                new OA\Parameter(
                    name: "id",
                    in: "path",
                    required: true,
                    schema: new OA\Schema(type: "integer"),
                ),
            ],
            responses: [
                new OA\Response(response: 200, description: "Compra."),
                new OA\Response(
                    response: 404,
                    description: "Compra não encontrada.",
                ),
            ],
        ),
    ]
    public function show($id): JsonResponse
    {
        $compra = $this->compraService->buscarCompra($id);
        return $this->successResponse(
            "Compra encontrada com sucesso!",
            $compra,
        );
    }

    #[
        OA\Post(
            path: "/compras",
            summary: "Registra uma compra (atualiza estoque, financeiro e contabilidade)",
            tags: ["Compras"],
            security: [["bearerAuth" => []]],
            requestBody: new OA\RequestBody(
                required: true,
                content: new OA\JsonContent(
                    required: [
                        "supplier_id",
                        "produto_id",
                        "quantidade",
                        "custo_unitario",
                        "forma_pagamento",
                        "data_compra",
                    ],
                    properties: [
                        new OA\Property(
                            property: "supplier_id",
                            type: "integer",
                            example: 1,
                        ),
                        new OA\Property(
                            property: "produto_id",
                            type: "integer",
                            example: 1,
                        ),
                        new OA\Property(
                            property: "quantidade",
                            type: "number",
                            example: 10,
                        ),
                        new OA\Property(
                            property: "custo_unitario",
                            type: "number",
                            example: 5.5,
                        ),
                        new OA\Property(
                            property: "forma_pagamento",
                            type: "string",
                            example: "PRAZO",
                        ),
                        new OA\Property(
                            property: "data_compra",
                            type: "string",
                            format: "date",
                            example: "2026-07-01",
                        ),
                    ],
                ),
            ),
            responses: [
                new OA\Response(response: 201, description: "Compra criada."),
                new OA\Response(
                    response: 422,
                    description: "Erro de validação.",
                ),
            ],
        ),
    ]
    public function store(StoreCompraRequest $request): JsonResponse
    {
        $dadosLimpos = $request->validated();

        $tenant_id = auth()->user()->tenant_id;

        $resultado = $this->compraService->processarCompra(
            $dadosLimpos,
            $tenant_id,
        );

        return $this->successResponse(
            "Compra registrada com sucesso! Estoque e financeiro atualizados",
            $resultado,
            201,
        );
    }

    #[
        OA\Post(
            path: "/compras/{id}/cancelar",
            summary: "Cancela uma compra gerando estorno contábil e de estoque (mantém histórico)",
            tags: ["Compras"],
            security: [["bearerAuth" => []]],
            parameters: [
                new OA\Parameter(
                    name: "id",
                    in: "path",
                    required: true,
                    schema: new OA\Schema(type: "integer"),
                ),
            ],
            responses: [
                new OA\Response(
                    response: 200,
                    description: "Compra cancelada/estornada.",
                ),
            ],
        ),
    ]
    public function cancel($id): JsonResponse
    {
        $tenant_id = auth()->user()->tenant_id;
        $compra = $this->compraService->cancelarCompra($id, $tenant_id);
        return $this->successResponse(
            "Compra cancelada com sucesso! Estoque e financeiro estornados.",
            $compra,
        );
    }

    #[
        OA\Delete(
            path: "/compras/{id}",
            summary: "Apaga definitivamente uma compra e seus lançamentos/movimentações",
            tags: ["Compras"],
            security: [["bearerAuth" => []]],
            parameters: [
                new OA\Parameter(
                    name: "id",
                    in: "path",
                    required: true,
                    schema: new OA\Schema(type: "integer"),
                ),
            ],
            responses: [
                new OA\Response(response: 200, description: "Compra apagada."),
            ],
        ),
    ]
    public function destroy($id): JsonResponse
    {
        $this->compraService->apagarCompra($id);
        return $this->successResponse("Compra apagada com sucesso!");
    }
}
