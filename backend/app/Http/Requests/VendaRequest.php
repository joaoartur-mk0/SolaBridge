<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class VendaRequest extends FormRequest
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
            "customer_id" => "required|exists:customers,id",
            "produto_id" => "required|exists:produtos,id",
            "quantidade" => "required|numeric|min:0.001",
            "valor_total" => "required|numeric|min:0.01",
            "forma_pagamento" => "required|in:A_VISTA,PRAZO",
            "data_venda" => "required|date",
        ];
    }

    public function messages(): array
    {
        return [
            "produto_id.exists" =>
                "O produto selecionado não está cadastrado no sistema!",
            "valor_total.min" => "O valor da venda deve ser maior que zero!",
            "customer_id.exists" =>
                "O cliente selecionado não está cadastrado no sustema!",
            "quantidade.min" =>
                "A quantidade do produto deve ser maior que zero!",
            "forma_pagamento.in" => "Forma de pagamento inválida!",
        ];
    }
}
