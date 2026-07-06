<?php

namespace App\Services;

use App\Models\Tenant;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class TenantService
{
    protected $planoDeContasService;

    public function __construct(PlanoDeContasService $planoDeContasService)
    {
        $this->planoDeContasService = $planoDeContasService;
    }

    public function criarNovoTenant(array $dados)
    {
        return DB::transaction(function () use ($dados) {
            $tenant = Tenant::create([
                "tipo_pessoa" => $dados["tipo_pessoa"],
                "documento" => $dados["documento"],
                "nome" => $dados["nome"],
                "email" => $dados["email"],
                "contato" => $dados["contato"],
                "cep" => $dados["cep"] ?? null,
                "razao_social" => $dados["razao_social"] ?? null,
                "inscricao_estadual" => $dados["inscricao_estadual"] ?? null,
                "inscricao_municipal" => $dados["inscricao_municipal"] ?? null,
                "cnae" => $dados["cnae"] ?? null,
                "regime_tributacao" => $dados["regime_tributacao"],
            ]);

            $admin = User::create([
                "tenant_id" => $tenant->id,
                "name" => $dados["admin_name"],
                "email" => $dados["admin_email"],
                "password" => Hash::make($dados["admin_password"]),
                "role" => "admin",
            ]);

            $this->planoDeContasService->criarPlanoPadrao($tenant->id);

            return [
                "empresa" => $tenant,
                "admin" => $admin,
            ];
        });
    }
}
