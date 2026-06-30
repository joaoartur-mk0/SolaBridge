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

    public function __construct(SupplierService $supplierService){
        $this->supplierService = $supplierService;
    }

    public function store(StoreCustomerRequest $request): JsonResponse {
        $dadosLimpos = %request->validated();
        $tenant_id = 1;
        $supplier = $this->supplierService->criarSupplier($dadosLimpos, $tenant_id);
        return $this->sucessResponse(
            'Fornecedor registrado com sucesso!',
            $customer,
            201
        );
    }
}
