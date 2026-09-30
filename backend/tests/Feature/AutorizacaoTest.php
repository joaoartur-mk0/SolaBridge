<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\Concerns\CriaTenants;
use Tests\TestCase;

class AutorizacaoTest extends TestCase
{
    use CriaTenants, RefreshDatabase;

    private function novoUsuario(string $role): array
    {
        return [
            "name" => "Novo",
            "email" => "novo-" . $role . "@teste.com",
            "password" => "12345678",
            "role" => $role,
        ];
    }

    public function test_operador_nao_pode_criar_usuarios(): void
    {
        $this->autenticar($this->criarUsuario($this->criarTenant(), "operador"));

        $this->postJson("/api/v1/users", $this->novoUsuario("admin"))
            ->assertStatus(403)
            ->assertJson(["success" => false]);
    }

    public function test_contador_nao_pode_criar_usuarios(): void
    {
        $this->autenticar($this->criarUsuario($this->criarTenant(), "contador"));

        $this->postJson(
            "/api/v1/users",
            $this->novoUsuario("operador"),
        )->assertStatus(403);
    }

    public function test_admin_pode_criar_usuarios(): void
    {
        $this->autenticar($this->criarTenant());

        $this->postJson(
            "/api/v1/users",
            $this->novoUsuario("operador"),
        )->assertStatus(201);
    }

    public function test_operador_nao_pode_apagar_compras_nem_vendas(): void
    {
        $this->autenticar($this->criarUsuario($this->criarTenant(), "operador"));

        $this->deleteJson("/api/v1/compras/1")->assertStatus(403);
        $this->deleteJson("/api/v1/vendas/1")->assertStatus(403);
    }

    public function test_login_e_limitado_apos_varias_tentativas(): void
    {
        $credenciais = ["email" => "x@teste.com", "password" => "errada"];

        for ($i = 0; $i < 5; $i++) {
            $this->postJson("/api/v1/login", $credenciais)->assertStatus(401);
        }

        $this->postJson("/api/v1/login", $credenciais)->assertStatus(429);
    }

    public function test_cadastro_de_tenant_rejeita_email_de_admin_ja_usado(): void
    {
        $this->criarTenant("a");

        $this->postJson("/api/v1/tenants", [
            "tipo_pessoa" => "PJ",
            "documento" => "novo-doc",
            "nome" => "Outra",
            "email" => "outra@teste.com",
            "contato" => "1199",
            "regime_tributacao" => "ME",
            "admin_name" => "Outro",
            "admin_email" => "admin-a@teste.com",
            "admin_password" => "12345678",
        ])
            ->assertStatus(422)
            ->assertJsonValidationErrors(["admin_email"]);
    }
}
