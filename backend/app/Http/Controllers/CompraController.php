<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCompraRequest;
use App\Services\CompraService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;

class CompraController extends Controller
{
    use ApiResponse;

    protected $compraService;

    public function __construct(CompraService $compraService)
    {
        $this->compraService = $compraService;
    }

    public function store(StoreCompraRequest $request): JsonResponse
    {
        $dadosLimpos = $request->validated();

        $tenant_id = auth()->user()->tenant_id;

        $resultado = $this->compraService->processarCompra(
            $dadosLimpos,
            $tenant_id,
        );

        return $this->successResponse(
            "Compra registrada com sucesso! Estoque e financeiro atualizados",
            $resultado,
            201,
        );
    }
}
