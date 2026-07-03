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
        $this->lancamentoService = $lancamentoService
    }

    public function store(StoreLancamentoRequest $request): JsonResponse {
        $dadosLimpos = $request->validated();
        $dadosLimpos['teant_id'] = 1;

        $lancamento = $this->lancamentoService->registrarLancamentoContabil($dadosLimpos);

        return $this->succesResponse('Lançamento registrado com sucesso!', $lancamento, 201);
    }
}
