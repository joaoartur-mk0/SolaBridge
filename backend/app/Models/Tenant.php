<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tenant extends Model
{
    protected $fillable = [
        "tipo_pessoa",
        "documento",
        "nome",
        "email",
        "contato",
        "cep",
        "razao_social",
        "inscricao_estadual",
        "cnae",
    ];

    public function users()
    {
        return $this->hasMany(User::class);
    }
    public function contas()
    {
        return $this->hasMany(Conta::class);
    }
    public function lancamentos()
    {
        return $this->hasMany(Lancamento::class);
    }
    public function customer()
    {
        return $this->hasMany(Customer::class);
    }
    public function supplier()
    {
        return $this->hasMany(Supplier::class);
    }
    public function titulos()
    {
        return $this->hasMany(TituloFinanceiro::class);
    }
    public function produtos()
    {
        return $this->hasMany(Produto::class);
    }
    public function servicos()
    {
        return $this->hasMany(Servico::class);
    }
    public function estoque()
    {
        return $this->hasMany(MovimentacaoEstoque::class);
    }
}
