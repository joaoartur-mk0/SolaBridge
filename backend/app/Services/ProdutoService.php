<?php

namespace App\Services;

use App\Models\Produto;
use Illuminate\Support\Facades\DB;

class ProdutoService
{
    public function registrarProduto(array $data, $tenant_id)
    {
        DB::transaction(function () use ($data, $tenant_id) {
            $produto = Produto::create([
                "tenant_id" => $tenant_id,
                "nome" => $data["nome"],
                "descricao" => $data["descricao"],
                "preco" => $data["preco"],
            ]);
        });
    }
}
