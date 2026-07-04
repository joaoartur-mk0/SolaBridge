<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreServicoRequest extends FormRequest
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
            "nome" => "required|string|max:255",
            "descricao" => "required|string|max:500",
            "valor_servico" => "required|numeric|min:0",
            "codigo" => "required|string|max:10",
        ];
    }

    public function messages(): array
    {
        return [
            "nome.required" =>
                "Parâmetro obrigatório nulo | nome é obrigatório para cadastro de serviço",
            "descricao.required" =>
                "Parâmetro obrigatório nulo | descricao é obrigatório para cadastro de serviço",
            "valor_servico.required" =>
                "Parâmetro obrigatório nulo | valor_servico é obrigatório para cadastro de serviço",
            "codigo.required" =>
                "Parâmetro obrigatório nulo | codigo é obrigatório para cadastro de serviço",
            "nome.string" => "Parâmetro inválido | nome deve ser uma string",
            "descricao.string" =>
                "Parâmetro inválido | descricao deve ser uma string",
            "valor_servico.numeric" =>
                "Parâmetro inválido | valor_servico deve ser um número",
            "codigo.string" =>
                "Parâmetro inválido | codigo deve ser uma string",
            "nome.max" =>
                "Parâmetro inválido | nome deve ter no máximo 255 caracteres",
            "descricao.max" =>
                "Parâmetro inválido | descricao deve ter no máximo 500 caracteres",
            "valor_servico.min" =>
                "Parâmetro inválido | valor_servico deve ser maior ou igual a 0",
            "codigo.max" =>
                "Parâmetro inválido | codigo deve ter no máximo 10 caracteres",
        ];
    }
}
