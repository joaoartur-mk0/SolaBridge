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
                    "tenant_id" => $tenant_id,
                    "conta_id" => $partida["conta_id"],
                    "valor" => $partida["valor"],
                    "natureza" => strtoupper($partida["natureza"]),
                ]);
            }

            return $lancamento;
        });
    }

    public function listarLancamentos(array $filtros = [])
    {
        // Isolamento por tenant garantido pelo TenantScope global do Lancamento.
        $query = Lancamento::with(["partidas.conta"]);

        // Filtro por período (data do lançamento).
        if (!empty($filtros["inicio"]) && !empty($filtros["fim"])) {
            $query->whereBetween("date", [
                $filtros["inicio"],
                $filtros["fim"],
            ]);
        }

        // Filtro por conta contábil (existe partida na conta informada).
        if (!empty($filtros["conta_id"])) {
            $query->whereHas("partidas", function ($q) use ($filtros) {
                $q->where("conta_id", $filtros["conta_id"]);
            });
        }

        return $query->orderByDesc("date")->paginate(15);
    }
}
