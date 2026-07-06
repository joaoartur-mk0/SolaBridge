<?php

namespace App\Services;

use App\Models\Customer;
use Illuminate\Support\Facades\DB;

class CustomerService
{
    public function registrarCustomer(array $dados, int $tenant_id)
    {
        $dados["tenant_id"] = $tenant_id;
        return DB::transaction(function () use ($dados) {
            $customer = Customer::create($dados);
            return ["customer" => $customer];
        });
    }

    public function listarCustomers(
        ?string $search = null,
        ?string $status = null,
    ) {
        $query = Customer::query();

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where("nome", "ilike", "%" . $search . "%")->orWhere(
                    "documento",
                    "ilike",
                    "%" . $search . "%",
                );
            });
        }

        if ($status === "active") {
            $query->where("active", true);
        } elseif ($status === "inactive") {
            $query->where("active", false);
        }

        return $query->orderBy("nome")->paginate(15);
    }

    public function alterarStatus(int $id, bool $active)
    {
        $customer = Customer::findOrFail($id);
        $customer->update(["active" => $active]);
        return $customer;
    }
}
