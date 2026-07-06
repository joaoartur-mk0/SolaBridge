<?php

namespace App\Http\Controllers;

use App\Services\ServicoService;
use App\Http\Requests\StoreServicoRequest;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use OpenApi\Attributes as OA;

class ServicoController extends Controller
{
    use ApiResponse;

    protected $servicoService;

    public function __construct(ServicoService $servicoService)
    {
        $this->servicoService = $servicoService;
    }

    #[
        OA\Post(
            path: "/servicos",
            summary: "Cadastra um serviço para o tenant",
            tags: ["Serviços"],
            security: [["bearerAuth" => []]],
            requestBody: new OA\RequestBody(
                required: true,
                content: new OA\JsonContent(
                    required: [
                        "nome",
                        "descricao",
                        "valor_servico",
                        "codigo",
                        "codigo_tributacao_nacional",
                        "codigo_ibge_municipio",
                    ],
                    properties: [
                        new OA\Property(
                            property: "nome",
                            type: "string",
                            example: "Consultoria Contábil",
                        ),
                        new OA\Property(
                            property: "descricao",
                            type: "string",
                            example: "Consultoria contábil mensal",
                        ),
                        new OA\Property(
                            property: "valor_servico",
                            type: "number",
                            example: 500.0,
                        ),
                        new OA\Property(
                            property: "codigo",
                            type: "string",
                            example: "SRV-001",
                        ),
                        new OA\Property(
                            property: "codigo_tributacao_nacional",
                            type: "string",
                            example: "010701",
                        ),
                        new OA\Property(
                            property: "codigo_ibge_municipio",
                            type: "string",
                            example: "3550308",
                        ),
                    ],
                ),
            ),
            responses: [
                new OA\Response(response: 201, description: "Serviço criado."),
                new OA\Response(
                    response: 422,
                    description: "Erro de validação.",
                ),
            ],
        ),
    ]
    public function store(StoreServicoRequest $request): JsonResponse
    {
        $dadosLimpos = $request->validated();
        $tenant_id = auth()->user()->tenant_id;
        $servico = $this->servicoService->registrarServico(
            $dadosLimpos,
            $tenant_id,
        );
        return $this->successResponse(
            "Servico registrado com sucesso",
            $servico,
            201,
        );
    }
}
