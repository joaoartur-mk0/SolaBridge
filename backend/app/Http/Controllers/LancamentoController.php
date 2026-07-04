<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreLancamentoRequest;
use App\Services\LancamentoService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;

class LancamentoController extends Controller
{
    use ApiResponse;

    protected $lancamentoService;

    public function __construct(LancamentoService $lancamentoService)
    {
        $this->lancamentoService = $lancamentoService;
    }

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
