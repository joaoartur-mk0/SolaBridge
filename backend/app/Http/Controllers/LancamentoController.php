<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreLancamentoRequest;
use App\Services\LancamentoService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use OpenApi\Attributes as OA;

class LancamentoController extends Controller
{
    use ApiResponse;

    protected $lancamentoService;

    public function __construct(LancamentoService $lancamentoService)
    {
        $this->lancamentoService = $lancamentoService;
    }

    #[
        OA\Post(
            path: "/lancamentos",
            summary: "Registra um lançamento contábil manual (partidas dobradas)",
            tags: ["Lançamentos"],
            security: [["bearerAuth" => []]],
            requestBody: new OA\RequestBody(
                required: true,
                content: new OA\JsonContent(
                    required: ["description", "date", "partidas"],
                    properties: [
                        new OA\Property(
                            property: "description",
                            type: "string",
                            example: "Integralização de capital",
                        ),
                        new OA\Property(
                            property: "date",
                            type: "string",
                            format: "date",
                            example: "2026-07-01",
                        ),
                        new OA\Property(
                            property: "partidas",
                            type: "array",
                            items: new OA\Items(
                                required: ["conta_id", "valor", "natureza"],
                                properties: [
                                    new OA\Property(
                                        property: "conta_id",
                                        type: "integer",
                                        example: 1,
                                    ),
                                    new OA\Property(
                                        property: "valor",
                                        type: "number",
                                        example: 1000.0,
                                    ),
                                    new OA\Property(
                                        property: "natureza",
                                        type: "string",
                                        example: "D",
                                    ),
                                ],
                            ),
                        ),
                    ],
                ),
            ),
            responses: [
                new OA\Response(
                    response: 201,
                    description: "Lançamento criado.",
                ),
                new OA\Response(
                    response: 422,
                    description: "Débitos e créditos não batem / erro de validação.",
                ),
            ],
        ),
    ]
    public function store(StoreLancamentoRequest $request): JsonResponse
    {
        $dadosLimpos = $request->validated();
        $tenant_id = auth()->user()->tenant_id;

        $lancamento = $this->lancamentoService->registrarLancamentoContabil(
            $dadosLimpos,
            $tenant_id,
        );

        return $this->successResponse(
            "Lancamento registrado com sucesso!",
            $lancamento,
            201,
        );
    }
}
