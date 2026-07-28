<?php

namespace App\Http\Controllers;

use App\Services\ServicoService;
use App\Http\Requests\StoreServicoRequest;
use App\Http\Requests\UpdateServicoRequest;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
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
        OA\Get(
            path: "/servicos",
            summary: "Lista (paginada) os serviços do tenant, com busca por nome/código",
            tags: ["Serviços"],
            security: [["bearerAuth" => []]],
            parameters: [
                new OA\Parameter(
                    name: "search",
                    in: "query",
                    required: false,
                    description: "Busca por nome ou código",
                    schema: new OA\Schema(type: "string"),
                ),
            ],
            responses: [
                new OA\Response(
                    response: 200,
                    description: "Lista paginada de serviços.",
                ),
            ],
        ),
    ]
    public function index(Request $request): JsonResponse
    {
        $servicos = $this->servicoService->listarServicos(
            $request->query("search"),
        );
        return $this->successResponse(
            "Serviços listados com sucesso!",
            $servicos,
        );
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

    #[
        OA\Patch(
            path: "/servicos/{id}",
            summary: "Atualização parcial de um serviço",
            tags: ["Serviços"],
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
                    properties: [
                        new OA\Property(
                            property: "nome",
                            type: "string",
                            example: "Consultoria Contábil Premium",
                        ),
                        new OA\Property(
                            property: "valor_servico",
                            type: "number",
                            example: 750.0,
                        ),
                        new OA\Property(
                            property: "aliquota_iss",
                            type: "number",
                            example: 5.0,
                        ),
                    ],
                ),
            ),
            responses: [
                new OA\Response(
                    response: 200,
                    description: "Serviço atualizado.",
                ),
                new OA\Response(
                    response: 404,
                    description: "Serviço não encontrado.",
                ),
            ],
        ),
    ]
    public function update(UpdateServicoRequest $request, $id): JsonResponse
    {
        $dadosLimpos = $request->validated();
        $servico = $this->servicoService->atualizarServico($id, $dadosLimpos);
        return $this->successResponse(
            "Servico atualizado com sucesso!",
            $servico,
        );
    }

    #[
        OA\Delete(
            path: "/servicos/{id}",
            summary: "Exclusão lógica (soft delete) de um serviço",
            tags: ["Serviços"],
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
                    description: "Serviço inativado (soft delete).",
                ),
                new OA\Response(
                    response: 404,
                    description: "Serviço não encontrado.",
                ),
            ],
        ),
    ]
    public function destroy($id): JsonResponse
    {
        $this->servicoService->removerServico($id);
        return $this->successResponse("Servico removido com sucesso!");
    }
}
