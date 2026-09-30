<?php

namespace App\Http\Requests\Concerns;

use Illuminate\Validation\Rules\Exists;
use Illuminate\Validation\Rule;

trait ValidaDoTenant
{
    /**
     * Regra `exists` restrita ao tenant do usuário autenticado.
     *
     * A regra `exists:tabela,id` consulta o banco diretamente e ignora o
     * TenantScope, aceitando IDs de outros tenants.
     */
    protected function existeNoTenant(string $tabela): Exists
    {
        return Rule::exists($tabela, "id")->where(
            "tenant_id",
            $this->user()->tenant_id,
        );
    }
}
