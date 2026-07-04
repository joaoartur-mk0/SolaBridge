<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\RelatorioService;
use Illuminate\Support\Facades\Log;

class RelatorioController extends Controller
{
    protected $relatorioService;

    public function __construct(RelatorioService $relatorioService)
    {
        $this->relatorioService = $relatorioService;
    }

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
