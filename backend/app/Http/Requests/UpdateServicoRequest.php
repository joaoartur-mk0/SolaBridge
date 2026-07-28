<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateServicoRequest extends FormRequest
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
     * Atualização parcial (PATCH): todos os campos são opcionais (`sometimes`),
     * mas quando presentes seguem as mesmas regras do cadastro.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            "nome" => "sometimes|string|max:255",
            "descricao" => "sometimes|string|max:2000",
            "valor_servico" => "sometimes|numeric|min:0",
            "codigo" => "sometimes|string|max:10",
            "codigo_tributacao_nacional" => "sometimes|string|max:20",
            "codigo_ibge_municipio" => "sometimes|string|size:7",
            "valor_bruto" => "sometimes|numeric|min:0",
            "deducoes" => "sometimes|numeric|min:0",
            "desconto_condicionado" => "sometimes|numeric|min:0",
            "desconto_incondicionado" => "sometimes|numeric|min:0",
            "base_calculo" => "sometimes|numeric|min:0",
            "aliquota_iss" => "sometimes|numeric|min:0|max:100",
            "retencao_fonte" => "sometimes|boolean",
            "tributos" => "sometimes|array",
        ];
    }

    public function messages(): array
    {
        return [
            "codigo_ibge_municipio.size" =>
                "Parâmetro inválido | codigo_ibge_municipio deve conter 7 dígitos",
            "aliquota_iss.max" =>
                "Parâmetro inválido | aliquota_iss deve ser menor ou igual a 100",
        ];
    }
}
