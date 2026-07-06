<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreCompraRequest extends FormRequest
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
            "supplier_id" => "required|exists:suppliers,id",
            "produto_id" => "required|exists:produtos,id",
            "quantidade" => "required|numeric|min:0.001",
            "custo_unitario" => "required|numeric|min:0.01",
            "forma_pagamento" => "required|in:A_VISTA,PRAZO",
            "data_compra" => "required|date",
        ];
    }

    public function messages(): array
    {
        return [
            "supplier_id.exists" =>
                "O fornecedor selecionado não está registrado no banco dados da empresa",
            "produto_id.exists" =>
                "O produto selecionado não está registrado no banco de dados",
            "quantidade.required" =>
                "Parâmetro obrigatório nulo | a quantidade do produto é obrigatória para o registro de compra",
            "quantidade.min" =>
                "Parâmetro inválido | quantidade de produto deve ser maior que 0",
            "quantidade.numeric" =>
                "Parâmetro inválido | quantidade informada em formato inválido",
            "supplier_id.required" =>
                "Parâmetro obrigatório nulo | informar um fornecedor é obrigatório para o registro de compra",
            "produto_id.required" =>
                "Parâmetro obrigatório nulo | informar um produto é obrigatório para o registro de compra",
            "custo_unitario.required" =>
                "Parâmetro obrigatório nulo | informar o custo do produto é obrigatório para o registro de compra",
            "custo_unitario.min" =>
                "Parâmetro inválido | o custo do preoduto deve ser maior que 0",
            "custo_unitario.numeric" =>
                "Parâmetro inválido | valor unitário informado em formato inválido",
            "forma_pagamento.required" =>
                "Parâmetro obrigatório nulo | informar uma forma de pagamento é obrigatório para o registro de compra",
            "forma_pagamento.in" =>
                "Parâmetro inválido | parâmetro informado não é reconhecido, a forma de pagamento deve ser A_VISTA ou PRAZO",
            "data_compra.required" =>
                "Parâmetro obrigatório nulo | informar a data da compra é obrigatório para o registro de compra",
            "data_compra.date" =>
                "Parâmetro inválido | data informada está inválida",
        ];
    }
}
