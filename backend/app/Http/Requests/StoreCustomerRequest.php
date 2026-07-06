<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreCustomerRequest extends FormRequest
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
            "documento" => "required|string|max:20",
            "nome" => "required|string|max:255",
            "email" => "nullable|email|max:255",
            "telefone" => "nullable|string|max:20",

            "inscricao_estadual" => "nullable|string|max:20",
            "inscricao_municipal" => "nullable|string|max:20",

            "nif" => "nullable|string|max:40|required_with:codigo_pais",
            "codigo_pais" => "nullable|string|max:4",

            "codigo_ibge" =>
                "nullable|string|size:7|required_without:codigo_pais",
        ];
    }

    public function messages(): array
    {
        return [
            "tipo_pessoa.in" =>
                "Parâmetro não reconhecido | o tipo de pessoa dever ser PF ou PJ",
            "documento.required" =>
                "Parâmetro obrigatório nulo | o documento do cliente é obrigatório para cadastro",
            "tipo_pessoa.required" =>
                "Parâmetro obrigatório nulo| o tipo de pessoa do cliente é obrigatório para o cadastro",
            "nome.required" =>
                "Parâmetro obrigatório nulo| o nome do cliente é obrigatório para o ",
            "documento.max" =>
                "Parâmetro inválido | o documento deve conter no máximo 20 caractéres",
            "nome.max" =>
                "Parâmtro inválido | o nome deve conter no máximo 255 caractéres",
            "email.max" =>
                "Parâmetro inválido | o email deve conter no máximo 255 caractéres",
            "email.email" =>
                "Parâmetro inválido | formato de email está incorreto",
            "telefone.max" =>
                "Parâmetro inválido | o telefone deve conter no máximo 20 caractéres",
            "codigo_ibge.size" =>
                "Parâmetro inválido | o código IBGE do município deve conter 7 dígitos",
            "codigo_ibge.required_without" =>
                "Parâmetro obrigatório nulo | o código IBGE do município é obrigatório para clientes nacionais",
            "nif.required_with" =>
                "Parâmetro obrigatório nulo | o NIF é obrigatório para clientes estrangeiros",
        ];
    }
}
