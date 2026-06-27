<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Lancamento;
use App\Models\Partida;
use Illuminate\Support\Facades\DB;

class LancamentoController extends Controller
{
    protected $lancamentoService;

    public function __construct(LancamentoService $lancamentoService){

    }

    public function store(StoreLancamentoRequest $request): JsonResponse {
        $dadosLimpos = $request->validated();

        $dadosLimpos['teant_id'] = 1;

        try {
            $this->lancamentoService->registrarLancamentoContavil($dadosLimpos);
            return response()->json(
                ["mensagem" => "Lançamento registrado com sucesso!"],
                201
            );
        } catch (\Exception $e) {
            return response()->json(
                [
                    "error" => "Falha ao registrar transação no banco de dados.",
                    "detalhe" => $e->getMessage()
                ],
                500
            )
        }
    }
}
