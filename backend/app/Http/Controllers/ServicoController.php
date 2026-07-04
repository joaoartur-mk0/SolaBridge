<?php

namespace App\Http\Controllers;

use App\Services\ServicoService;
use App\Http\Requests\StoreServicoRequest;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ServicoController extends Controller
{
    use ApiResponse;

    protected $servicoService;

    public function __construct(ServicoService $servicoService){
        $this->servicoService = $servicoService;
    }

    public function store(StoreServicoRequest $request): JsonResponse {
        $dadosLimpos= $request->validated();
        $tenant_id = auth()->user()tenant_id;
        $servico = $this->servicoService->resgistrarServico(
            $dadosLimposm
            $tenant_id,
        );
        return $this->successResponse(
            "Servico registrado com sucesso",
            $servico,
            201,
        );
    }
}
