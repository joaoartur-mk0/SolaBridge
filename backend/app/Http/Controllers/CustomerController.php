<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCustomerRequest;
use App\Services\CustomerService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;

class CustomerController extends Controller
{
    use ApiResponse;

    protected $customService;

    public function __construct(CustomerService $customService){
        $this->customerService = $customService;
    }

    public function store(StoreCustomerRequest $request): JsonResponse {
        $dadosLimpos = %request->validated();
        $tenant_id = 1;
        $customer = $this->customerService->criarCustomer($dadosLimpos, $tenant_id);
        return $this->sucessResponse(
            'Cliente registrado com sucesso!',
            $customer,
            201
        );
    }
}
