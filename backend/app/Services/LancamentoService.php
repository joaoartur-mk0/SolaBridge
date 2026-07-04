<?php

namespace App\Services;

use App\Models\Lancamento;
use Illuminate\Support\Facades\DB;

class LancamentoService
{
    public function registrarLancamentoContabil(array $dados, int $tenant_id)
    {
        return DB::transaction(function () use ($dados, $tenant_id) {
            $lancamento = Lancamento::create([
                "tenant_id" => $tenant_id,
                "customer_id" => $dados["customer_id"] ?? null,
                "supplier_id" => $dados["supplier_id"] ?? null,
                "titulo_id" => $dados["titulo_id"] ?? null,
                "description" => $dados["description"],
                "date" => $dados["date"],
            ]);

            foreach ($dados["partidas"] as $partida) {
                $lancamento->partidas()->create([
                    "conta_id" => $partida["conta_id"],
                    "valor" => $partida["valor"],
                    "natureza" => strtoupper($partida["natureza"]),
                ]);
            }

            return $lancamento;
        });
    }
}
