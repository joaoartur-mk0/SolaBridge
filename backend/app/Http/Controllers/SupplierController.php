<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSupplierRequest;
use App\Services\SupplierService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;

class SupplierController extends Controller
{
    use ApiResponse;

    protected $supplierService;

    public function __construct(SupplierService $supplierService)
    {
        $this->supplierService = $supplierService;
    }

    public function store(StoreSupplierRequest $request): JsonResponse
    {
        $dadosLimpos = $request->validated();
        $tenant_id = auth()->user()->tenant_id;
        $supplier = $this->supplierService->registrarSupplier(
            $dadosLimpos,
            $tenant_id,
        );
        return $this->successResponse(
            "Fornecedor registrado com sucesso!",
            $supplier,
            201,
        );
    }
}
