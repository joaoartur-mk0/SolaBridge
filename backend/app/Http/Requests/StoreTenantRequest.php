<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreTenantRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            "tipo_pessoa" => "required|in:PF,PJ",
            "documento" => "required|string|unique:tenants,documento|max:20",
            "nome" => "required|string|max:255",
            "email" => "required|email|unique:tenants,email|max:255",
            "contato" => "required|string|max:20",
            "cep" => "nullable|string|max:10",

            "razao_social" => "nullable|string|max:255",
            "inscricao_estadual" =>
                "nullable|string|unique:tenants,inscricao_estadual|max:50",
            "inscricao_municipal" => "nullable|string|max:50",
            "cnae" => "nullable|string|max:20",
            "regime_tributacao" =>
                "required|in:MEI,ME,SIMPLES_NACIONAL,LUCRO_PRESUMIDO,LUCRO_REAL",

            // dados para cadastrar usuario admin padrao
            "admin_name" => "required|string|max:255",
            "admin_email" => "required|email|max:255",
            "admin_password" => "required|string|min:8",
        ];
    }

    public function messages(): array
    {
        return [
            "documento.unique" => "Entidade já cadastrada no sistema",
            "admin_password.min" => "Senha deve ter no mínimo 8 digitos",
            "contato.max" => "Parâmetro invalido| Contato em formato invalido",
            "tipo_pessoa.in" =>
                "Parâmetro desconhecido | parâmetro deve ser PF ou PJ",
            "documento.max" =>
                "Parâmtro invalido | documento está em formato não reconhecido",
            "regime_tributacao.required" =>
                "Parâmetro obrigatório nulo | o regime de tributação é obrigatório para o cadastro do prestador",
            "regime_tributacao.in" =>
                "Parâmetro desconhecido | regime de tributação deve ser MEI, ME, SIMPLES_NACIONAL, LUCRO_PRESUMIDO ou LUCRO_REAL",
        ];
    }
}
