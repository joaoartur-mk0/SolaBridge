<?php

namespace Tests\Concerns;

use App\Models\Conta;
use App\Models\User;
use App\Services\TenantService;
use Laravel\Sanctum\Sanctum;

trait CriaTenants
{
    /**
     * Cria um tenant pelo fluxo oficial de onboarding e retorna o admin.
     */
    protected function criarTenant(string $sufixo = "a"): User
    {
        $resultado = app(TenantService::class)->criarNovoTenant([
            "tipo_pessoa" => "PJ",
            "documento" => "doc-" . $sufixo,
            "nome" => "Empresa " . $sufixo,
            "email" => "contato-" . $sufixo . "@teste.com",
            "contato" => "11999999999",
            "regime_tributacao" => "SIMPLES_NACIONAL",
            "admin_name" => "Admin " . $sufixo,
            "admin_email" => "admin-" . $sufixo . "@teste.com",
            "admin_password" => "12345678",
        ]);

        return $resultado["admin"];
    }

    protected function criarUsuario(User $admin, string $role): User
    {
        return User::create([
            "tenant_id" => $admin->tenant_id,
            "name" => $role,
            "email" => $role . "-" . $admin->tenant_id . "@teste.com",
            "password" => "12345678",
            "role" => $role,
        ]);
    }

    protected function autenticar(User $user): void
    {
        Sanctum::actingAs($user);
    }

    protected function contaDoTenant(User $user, string $codigo): Conta
    {
        return Conta::withoutGlobalScopes()
            ->where("tenant_id", $user->tenant_id)
            ->where("codigo", $codigo)
            ->firstOrFail();
    }
}
