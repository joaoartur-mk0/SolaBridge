<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\RelatorioService;
use Illuminate\Support\Facades\Log;
use OpenApi\Attributes as OA;

class RelatorioController extends Controller
{
    protected $relatorioService;

    public function __construct(RelatorioService $relatorioService)
    {
        $this->relatorioService = $relatorioService;
    }

    #[
        OA\Get(
            path: "/relatorios/dre",
            summary: "Demonstração de Resultado do Exercício (DRE)",
            tags: ["Relatórios"],
            security: [["bearerAuth" => []]],
            parameters: [
                new OA\Parameter(
                    name: "inicio",
                    in: "query",
                    required: false,
                    schema: new OA\Schema(type: "string", format: "date"),
                ),
                new OA\Parameter(
                    name: "fim",
                    in: "query",
                    required: false,
                    schema: new OA\Schema(type: "string", format: "date"),
                ),
            ],
            responses: [
                new OA\Response(response: 200, description: "DRE do tenant."),
            ],
        ),
    ]
    public function dre(Request $request)
    {
        try {
            $dataInicio = $request->query("inicio");
            $dataFim = $request->query("fim");

            $dre = $this->relatorioService->gerarDRE($dataInicio, $dataFim);

            return response()->json($dre, 200);
        } catch (\Exception $e) {
            Log::error("Erro ao gerar DRE: " . $e->getMessage());
            return response()->json(
                [
                    "erro" =>
                        "Ocorreu um problema ao processar a Demonstração de Resultado.",
                    "detalhe" => $e->getMessage(),
                ],
                500,
            );
        }
    }

    #[
        OA\Get(
            path: "/relatorios/balanco",
            summary: "Balanço Patrimonial (Ativo, Passivo e PL)",
            tags: ["Relatórios"],
            security: [["bearerAuth" => []]],
            responses: [
                new OA\Response(
                    response: 200,
                    description: "Balanço patrimonial do tenant.",
                ),
            ],
        ),
    ]
    public function balanco()
    {
        try {
            $balanco = $this->relatorioService->gerarBalancoPatrimonial();
            return response()->json($balanco, 200);
        } catch (\Exception $e) {
            Log::error(
                "Erro ao gerar Balanço Patrimonial: " . $e->getMessage(),
            );
            return response()->json(
                [
                    "error" =>
                        "Ocorreu um problema ao processar o balanco patrimonial.",
                ],
                500,
            );
        }
    }

    #[
        OA\Get(
            path: "/relatorios/razao/{contaId}",
            summary: "Extrato do razão (Livro Razão) de uma conta contábil",
            tags: ["Relatórios"],
            security: [["bearerAuth" => []]],
            parameters: [
                new OA\Parameter(
                    name: "contaId",
                    in: "path",
                    required: true,
                    schema: new OA\Schema(type: "integer"),
                ),
                new OA\Parameter(
                    name: "inicio",
                    in: "query",
                    required: false,
                    schema: new OA\Schema(type: "string", format: "date"),
                ),
                new OA\Parameter(
                    name: "fim",
                    in: "query",
                    required: false,
                    schema: new OA\Schema(type: "string", format: "date"),
                ),
            ],
            responses: [
                new OA\Response(
                    response: 200,
                    description: "Movimentações e saldo acumulado da conta.",
                ),
            ],
        ),
    ]
    public function razao(Request $request, $contaId)
    {
        try {
            $dataInicio = $request->query("inicio");
            $dataFim = $request->query("fim");

            $extrato = $this->relatorioService->gerarExtratoRazao(
                $contaId,
                $dataInicio,
                $dataFim,
            );

            return response()->json($extrato, 200);
        } catch (\Exception $e) {
            Log::error("Erro ao gerar extrato de razao: " . $e->getMessage());
            return response()->json(
                [
                    "erro" =>
                        "Ocorreu um problema ao processar extrato da razao",
                ],
                500,
            );
        }
    }

    #[
        OA\Get(
            path: "/relatorios/liquidez",
            summary: "Índice de Liquidez Corrente",
            tags: ["Relatórios"],
            security: [["bearerAuth" => []]],
            responses: [
                new OA\Response(
                    response: 200,
                    description: "Índice de liquidez corrente do tenant.",
                ),
            ],
        ),
    ]
    public function liquidezCorrente()
    {
        try {
            $liquidez = $this->relatorioService->calcularLiquidezCorrente();
            return response()->json($liquidez, 200);
        } catch (\Exception $e) {
            Log::error(
                "Erro ao calcular Liquidez Corrente: " . $e->getMessage(),
            );

            return response()->json(
                [
                    "erro" =>
                        "Ocorreu um problema ao processar o Índice de Liquidez Corrente.",
                ],
                500,
            );
        }
    }

    #[
        OA\Get(
            path: "/relatorios/caixa-bancos",
            summary: "Saldo consolidado de Caixa e Bancos",
            tags: ["Relatórios"],
            security: [["bearerAuth" => []]],
            responses: [
                new OA\Response(
                    response: 200,
                    description: "Saldo consolidado de Caixa e Bancos.",
                ),
            ],
        ),
    ]
    public function saldoCaixaBancos()
    {
        try {
            $saldo = $this->relatorioService->obterSaldoCaixaBancos();
            return response()->json($saldo, 200);
        } catch (\Exception $e) {
            Log::error(
                "Erro ao calcular saldo de Caixa e Bancos: " . $e->getMessage(),
            );

            return response()->json(
                [
                    "erro" =>
                        "Ocorreu um problema ao processar o saldo consolidado",
                ],
                500,
            );
        }
    }
}
