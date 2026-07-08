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

    public function listarServicos(?string $search = null)
    {
        // Isolamento por tenant via TenantScope; soft-deletados ficam ocultos
        // automaticamente pelo trait SoftDeletes.
        $query = Servico::query();

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where("nome", "ilike", "%" . $search . "%")->orWhere(
                    "codigo",
                    "ilike",
                    "%" . $search . "%",
                );
            });
        }

        return $query->orderBy("nome")->paginate(15);
    }

    public function atualizarServico(int $id, array $dados)
    {
        $servico = Servico::findOrFail($id);
        $servico->update($dados);
        return $servico;
    }

    public function removerServico(int $id)
    {
        // Exclusão lógica (soft delete): preenche deleted_at, não apaga a linha.
        $servico = Servico::findOrFail($id);
        $servico->delete();
        return true;
    }
}
