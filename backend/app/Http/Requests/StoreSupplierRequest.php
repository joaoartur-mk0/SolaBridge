<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreSupplierRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return false;
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
                "Parâmetro obrigatório | o tipo de pessoa do cliente é obrigatório para o cadastro",
            "nome.required" =>
                "Parâmetro obrigatório | o nome do cliente é obrigatório para o ",
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
        ];
    }
}
