<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreVendaRequest;
use App\Services\VendaService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

class VendaController extends Controller
{
    use ApiResponse;

    protected $vendaService;

    public function __construct(VendaService $vendaService)
    {
        $this->vendaService = $vendaService;
    }

    #[
        OA\Get(
            path: "/vendas",
            summary: "Lista (paginada) as vendas do tenant (títulos a receber)",
            tags: ["Vendas"],
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
                    description: "Lista paginada de vendas.",
                ),
            ],
        ),
    ]
    public function index(Request $request): JsonResponse
    {
        $vendas = $this->vendaService->listarVendas($request->query("status"));
        return $this->successResponse("Vendas listadas com sucesso!", $vendas);
    }

    #[
        OA\Get(
            path: "/vendas/{id}",
            summary: "Detalha uma venda (título, lançamentos, partidas e movimentações)",
            tags: ["Vendas"],
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
                new OA\Response(response: 200, description: "Venda."),
                new OA\Response(
                    response: 404,
                    description: "Venda não encontrada.",
                ),
            ],
        ),
    ]
    public function show($id): JsonResponse
    {
        $venda = $this->vendaService->buscarVenda($id);
        return $this->successResponse("Venda encontrada com sucesso!", $venda);
    }

    #[
        OA\Post(
            path: "/vendas",
            summary: "Registra uma venda (baixa estoque, gera financeiro e contabilidade)",
            tags: ["Vendas"],
            security: [["bearerAuth" => []]],
            requestBody: new OA\RequestBody(
                required: true,
                content: new OA\JsonContent(
                    required: [
                        "produto_id",
                        "customer_id",
                        "quantidade",
                        "valor_total",
                        "forma_pagamento",
                        "data_venda",
                    ],
                    properties: [
                        new OA\Property(
                            property: "produto_id",
                            type: "integer",
                            example: 1,
                        ),
                        new OA\Property(
                            property: "customer_id",
                            type: "integer",
                            example: 1,
                        ),
                        new OA\Property(
                            property: "quantidade",
                            type: "number",
                            example: 3,
                        ),
                        new OA\Property(
                            property: "valor_total",
                            type: "number",
                            example: 150.0,
                        ),
                        new OA\Property(
                            property: "forma_pagamento",
                            type: "string",
                            example: "A_VISTA",
                        ),
                        new OA\Property(
                            property: "data_venda",
                            type: "string",
                            format: "date",
                            example: "2026-07-01",
                        ),
                    ],
                ),
            ),
            responses: [
                new OA\Response(response: 201, description: "Venda criada."),
                new OA\Response(
                    response: 422,
                    description: "Erro de validação.",
                ),
            ],
        ),
    ]
    public function store(StoreVendaRequest $request): JsonResponse
    {
        $dadosLimpos = $request->validated();
        $tenant_id = auth()->user()->tenant_id;

        $resultado = $this->vendaService->processarVenda(
            $dadosLimpos,
            $tenant_id,
        );

        return $this->successResponse(
            "Venda processada com sucesso!",
            $resultado,
            201,
        );
    }

    #[
        OA\Post(
            path: "/vendas/{id}/cancelar",
            summary: "Cancela uma venda gerando estorno contábil e de estoque (mantém histórico)",
            tags: ["Vendas"],
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
                    description: "Venda cancelada/estornada.",
                ),
            ],
        ),
    ]
    public function cancel($id): JsonResponse
    {
        $tenant_id = auth()->user()->tenant_id;
        $venda = $this->vendaService->cancelarVenda($id, $tenant_id);
        return $this->successResponse(
            "Venda cancelada com sucesso! Estoque e financeiro estornados.",
            $venda,
        );
    }

    #[
        OA\Delete(
            path: "/vendas/{id}",
            summary: "Apaga definitivamente uma venda e seus lançamentos/movimentações",
            tags: ["Vendas"],
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
                new OA\Response(response: 200, description: "Venda apagada."),
            ],
        ),
    ]
    public function destroy($id): JsonResponse
    {
        $this->vendaService->apagarVenda($id);
        return $this->successResponse("Venda apagada com sucesso!");
    }
}
