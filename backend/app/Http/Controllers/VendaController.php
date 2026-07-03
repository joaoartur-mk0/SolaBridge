<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreVendaRequest;
use App\Services\VendaService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;

class VendaController extends Controller
{
    use ApiResponse;

    protected $vendaService;

    public function __construct(VendaService $vendaService)
    {
        $this->vendaService = $vendaService;
    }

    public function store(StoreVendaRequest $request): JsonResponse
    {
        $dadosLimpos = $request->validated();
        $tenant_id = auth()->user()->tenant_id;

        $resultado = $this->vendaService->processarVenda(
            $dadosLimpos,
            $tenant_id,
        );

        return $this->succesResponse(
            "Venda processada com sucesso!",
            $resultado,
            201,
        );
    }
}
