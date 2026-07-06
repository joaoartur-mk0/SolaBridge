<?php

namespace App\Services;

use App\Models\Servico;
use Illuminate\Support\Facades\DB;

class ServicoService
{
    public function registrarServico(array $dados, int $tenant_id)
    {
        $dados["tenant_id"] = $tenant_id;
        return DB::transaction(function () use ($dados) {
            $servico = Servico::create($dados);
            return ["servico" => $servico];
        });
    }
}
