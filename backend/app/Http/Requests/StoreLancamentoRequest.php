<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreLancamentoRequest extends FormRequest
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
            "description" => "required|string|max:500",
            "date" => "required|date",
            "customer_id" => "nullable|exists:customers,id",
            "supplier_id" => "nullable|exists:suppliers,id",
            "titulo_id" => "nullable|exists:titulos_financeiros,id",

            "partidas" => "required|array|min:2",

            "partidas.*.conta_id" => "required|exists:contas,id",
            "partidas.*.valor" => "required|numeric|min:0.01",
            "partidas.*.natureza" => "required|in:D,C",
        ];
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            $partidas = $this->input("partidas", []);

            if (is_array($partidas)) {
                $totalDebitos = 0;
                $totalCreditos = 0;

                foreach ($partidas as $partida) {
                    if (($partida["natureza"] ?? "") === "D") {
                        $totalDebitos += $partida["valor"] ?? 0;
                    } elseif (($partida["natureza"] ?? "") === "C") {
                        $totalCreditos += $partida["valor"] ?? 0;
                    }
                }

                if (round($totalDebitos, 2) !== round($totalCreditos, 2)) {
                    $validator
                        ->errors()
                        ->add(
                            "partidas",
                            "O total de débitos deve ser igual ao total de créditos (Princípio das Partidas Dobradas).",
                        );
                }
            }
        });
    }

    public function messages(): array
    {
        return [
            "partidas.min" =>
                "Um lançamento precisa ter pelo menos duas partidas.",
            "partidas.*.conta_id.exists" =>
                "Uma das contas informadas não existe no plano de contas.",
            "partidas.*.natureza.in" =>
                "A natureza da partida deve ser apenas D (Débito) ou C (Crédito).",
        ];
    }
}
