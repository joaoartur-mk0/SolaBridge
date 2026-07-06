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
            "descricao" => "required|string|max:2000",
            "valor_servico" => "required|numeric|min:0",
            "codigo" => "required|string|max:10",

            "codigo_tributacao_nacional" => "required|string|max:20",
            "codigo_ibge_municipio" => "required|string|size:7",

            "valor_bruto" => "nullable|numeric|min:0",
            "deducoes" => "nullable|numeric|min:0",
            "desconto_condicionado" => "nullable|numeric|min:0",
            "desconto_incondicionado" => "nullable|numeric|min:0",
            "base_calculo" => "nullable|numeric|min:0",
            "aliquota_iss" => "nullable|numeric|min:0|max:100",
            "retencao_fonte" => "boolean",
            "tributos" => "nullable|array",
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
                "Parâmetro inválido | descricao deve ter no máximo 2000 caracteres",
            "valor_servico.min" =>
                "Parâmetro inválido | valor_servico deve ser maior ou igual a 0",
            "codigo.max" =>
                "Parâmetro inválido | codigo deve ter no máximo 10 caracteres",
            "codigo_tributacao_nacional.required" =>
                "Parâmetro obrigatório nulo | codigo_tributacao_nacional é obrigatório para cadastro de serviço",
            "codigo_ibge_municipio.required" =>
                "Parâmetro obrigatório nulo | codigo_ibge_municipio é obrigatório para cadastro de serviço",
            "codigo_ibge_municipio.size" =>
                "Parâmetro inválido | codigo_ibge_municipio deve conter 7 dígitos",
            "aliquota_iss.max" =>
                "Parâmetro inválido | aliquota_iss deve ser menor ou igual a 100",
        ];
    }
}
