<?php

namespace App\Services;

use App\Models\Supplier;
use Illuminate\Support\Facades\DB;

class SupplierService
{
    public function registrarSupplier(array $dados, int $tenant_id)
    {
        $dados["tenant_id"] = $tenant_id;
        return DB::transaction(function () use ($dados) {
            $supplier = Supplier::create($dados);
            return ["supplier" => $supplier];
        });
    }
}
