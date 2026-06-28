<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTenantRequest;
use App\Services\TenantService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;

class TenantController extends Controller
{
    use ApiResponse; // Nossa padronização global

    protected $tenantService;

    public function __construct(TenantService $tenantService)
    {
        $this->tenantService = $tenantService;
    }

    public function store(StoreTenantRequest $request): JsonResponse
    {
        $dadosLimpos = $request->validated();

        $resultado = $this->tenantService->criarNovoTenant($dadosLimpos);

        return $this->successResponse(
            "Bem-vindo ao SolaBridge! Conta e usuário administrador criados com sucesso.",
            $resultado,
            201,
        );
    }
}
