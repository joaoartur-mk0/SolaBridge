<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCustomerRequest;
use App\Services\CustomerService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;

class CustomerController extends Controller
{
    use ApiResponse;

    protected $customerService;

    public function __construct(CustomerService $customerService)
    {
        $this->customerService = $customerService;
    }

    public function store(StoreCustomerRequest $request): JsonResponse
    {
        $dadosLimpos = $request->validated();
        $tenant_id = auth()->user()->tenant_id;
        $customer = $this->customerService->registrarCustomer(
            $dadosLimpos,
            $tenant_id,
        );
        return $this->successResponse(
            "Cliente registrado com sucesso!",
            $customer,
            201,
        );
    }
}
