<?php

namespace Database\Seeders;

use App\Models\User;
use App\Services\TenantService;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     *
     * Cria um tenant de teste padrão para o ambiente local. É idempotente:
     * se o usuário admin já existir, não faz nada — assim o seed pode rodar a
     * cada boot do container sem estourar as unique constraints.
     */
    public function run(): void
    {
        if (User::where("email", "admin@admin.com")->exists()) {
            return;
        }

        // Reaproveita o fluxo oficial de onboarding: cria o tenant, o usuário
        // admin e o plano de contas padrão dentro da mesma transação.
        app(TenantService::class)->criarNovoTenant([
            "tipo_pessoa" => "PJ",
            "documento" => "00000000000191",
            "nome" => "Empresa Teste",
            "email" => "contato@empresateste.com",
            "contato" => "11999999999",
            "regime_tributacao" => "SIMPLES_NACIONAL",
            "admin_name" => "Administrador Teste",
            "admin_email" => "admin@admin.com",
            "admin_password" => "12345678",
        ]);
    }
}
