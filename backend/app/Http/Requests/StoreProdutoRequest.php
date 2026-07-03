<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreProdutoRequest extends FormRequest
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
            "descricao" => "required|string|max:255",
            "preco" => "required|numeric|min:0",
            "custo_medio" => "required|numeric|min:0",
            "unidade" => "required|in:KG,UN,LT,ML,G,CX",
            "codigo_sku" => "string|max:10",
            "cfop" => "string|max:4",
            "ncm" => "string|max:8",
            "cest" => "string|max:8",
        ];
    }

    public function messages(): array
    {
        return [
            "descricao.required" =>
                "Parâmetro obrigatório nulo | descricao é obrigatório para o cadastro de um produto",
            "preco.required" =>
                "Parâmetro obrigatório nulo | preco é obrigatório para o cadastro de um produto",
            "custo_medio.required" =>
                "Parâmetro obrigatório nulo | custo_medio é obrigatório para o cadastro de um produto",
            "unidade.required" =>
                "Parâmetro obrigatório nulo | unidade é obrigatório para o cadastro de um produto",
            "codigo_sku.string" =>
                "Parâmetro inválido | codigo_sku deve ser uma string para o cadastro de um produto",
            "cfop.string" =>
                "Parâmetro inválido | cfop deve ser uma string para o cadastro de um produto",
            "ncm.string" =>
                "Parâmetro inválido | ncm deve ser uma string para o cadastro de um produto",
            "cest.string" =>
                "Parâmetro inválido | cest deve ser uma string para o cadastro de um produto",
            "preco.min" =>
                "Parâmetro inválido | preco deve ser maior ou igual a 0 para o cadastro de um produto",
            "custo_medio.min" =>
                "Parâmetro inválido | custo_medio deve ser maior ou igual a 0 para o cadastro de um produto",
        ];
    }
}
