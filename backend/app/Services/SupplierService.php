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

    public function listarSuppliers(
        ?string $search = null,
        ?string $status = null,
    ) {
        $query = Supplier::query();

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
        $supplier = Supplier::findOrFail($id);
        $supplier->update(["active" => $active]);
        return $supplier;
    }
}
