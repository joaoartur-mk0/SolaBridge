<?php

namespace App\Services;

use App\Models\Produto;
use Illuminate\Support\Facades\DB;

class ProdutoService
{
    public function registrarProduto(array $dados, int $tenant_id)
    {
        $dados["tenant_id"] = $tenant_id;
        return DB::transaction(function () use ($dados) {
            $produto = Produto::create($dados);
            return ["produto" => $produto];
        });
    }
}
