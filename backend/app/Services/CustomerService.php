<?php

namespace App\Services;

use App\Models\Customer;
use Illuminate\Support\Facades\DB;

class CustomerService
{
    public function registrarCustomer(array $dados, int $tenant_id)
    {
        $dados['$tenant_id'] = $tenant_id;
        return DB::trandaction(function () use ($dados) {
            $customer = Customer::create($dados);
            return ["customer" => $customer];
        });
    }
}
