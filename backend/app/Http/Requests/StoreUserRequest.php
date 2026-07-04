<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreUserRequest extends FormRequest
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
            "name" => "required|string|max:255",
            "email" => "required|email|unique:users,email|max:255",
            "password" => "required|string|min:8",
            "role" => "required|in:admin,contador,operador",
        ];
    }

    public function messages(): array
    {
        return [
            "email.unique" => "Este e-mail já está cadastrado no sistema",
            "email.required" =>
                "Parâmetro obrigatório nulo | informar o email é obrigatório para regitro de usuário",
            "email.max" =>
                "Parâmetro inválido | email deve conter no máximo 255 carácteres",
            "email.email" =>
                "Formato inválido de parâmetro | o email informado está fora do padrão",
            "name.required" =>
                "Parâmetro obrigatório nulo | informar o nome é obrigatório para registro de usuário",
            "name.string" =>
                "Formato inválido de parâmetro | nome deve ser uma string",
            "name.max" =>
                "Parâmetro inválido | nome deve conter no máximo 255 carácteres",
            "password.required" =>
                "Parâmetro obrigatório nulo | informar a senha é obrigatório para registro de usuário",
            "password.string" =>
                "Formato inválido de parâmetro | senha deve ser uma string",
            "password.min" =>
                "Parâmetro inválido | a senha deve conter no mínimo 8 digitos",
            "role.required" =>
                "Parâmetro obrigatório nulo | informar a role é obrigatório para registro de usuário",
            "role.in" =>
                "Parâmetro inválido | parâmetro não reconhecido, ou fora do padrão",
        ];
    }
}
