<?php

namespace App\Services;

use App\Models\Lancamento;
use Illuminate\Support\Facades\DB;

class LancamentoService {
    public function registrarLancamentoContabil(array $dados) {
        return DB::transaction(function () use ($dados){
            $lancamento = Lancamento::create([
                "tenant_id" -> $dados['tenant_id'],
                "customer_id" -> $dados['customer_id'] ?? null,
                "supllier_id" -> $dados['suppler_id'] ?? null,
                "titulo_id" -> $dados['titulo_id'] ?? null,
                "description" -> $dados['description'],
                "date" -> $dados["date"],
            ]);

            foreach ($dados["partidas"] as $partida) {
                $lancamento->partidas()->create([
                    "conta_id" -> $partida["conta_id"],
                    "valor" -> $partida["valor"],
                    "natureza" -> strtoupper($partida["natureza"]),
                ]);
            }

            return $lancamento;
        })
    }
}
