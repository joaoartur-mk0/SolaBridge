<?php

namespace App\Http\Controllers;

use App\Services\ProdutoService;
use App\Http\Requests\StoreProdutoRequest;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

class ProdutoController extends Controller
{
    use ApiResponse;

    protected $produtoService;

    public function __construct(ProdutoService $produtoService)
    {
        $this->produtoService = $produtoService;
    }

    #[
        OA\Post(
            path: "/produtos",
            summary: "Cadastra um produto para o tenant",
            tags: ["Produtos"],
            security: [["bearerAuth" => []]],
            requestBody: new OA\RequestBody(
                required: true,
                content: new OA\JsonContent(
                    required: [
                        "descricao",
                        "preco_venda",
                        "custo_medio",
                        "unidade",
                    ],
                    properties: [
                        new OA\Property(
                            property: "descricao",
                            type: "string",
                            example: "Camiseta Branca P",
                        ),
                        new OA\Property(
                            property: "preco_venda",
                            type: "number",
                            example: 49.9,
                        ),
                        new OA\Property(
                            property: "custo_medio",
                            type: "number",
                            example: 20.0,
                        ),
                        new OA\Property(
                            property: "unidade",
                            type: "string",
                            example: "UN",
                        ),
                        new OA\Property(
                            property: "codigo_sku",
                            type: "string",
                            example: "CAM-BR-P",
                        ),
                    ],
                ),
            ),
            responses: [
                new OA\Response(response: 201, description: "Produto criado."),
                new OA\Response(
                    response: 422,
                    description: "Erro de validação.",
                ),
            ],
        ),
    ]
    public function store(StoreProdutoRequest $request): JsonResponse
    {
        $dadosLimpos = $request->validated();
        $tenant_id = auth()->user()->tenant_id;
        $produto = $this->produtoService->registrarProduto(
            $dadosLimpos,
            $tenant_id,
        );
        return $this->successResponse(
            "Produto registrado com sucesso!",
            $produto,
            201,
        );
    }
}
