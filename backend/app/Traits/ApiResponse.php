<?php

namespace App\Traits;

use Illuminate\Http\JsonResponse;

trait ApiResponse
{
    protected function sucessResponse(
        string $message,
        mixed $data = null,
        int $code = 200,
    ): JsonResponse {
        return response()->json(
            [
                "success" => true,
                "message" => $message,
                "data" => $data,
            ],
            $code,
        );
    }

    protected function errorResponse(
        string $message,
        mixed $errors = null,
        int $code = 500,
    ): JsonResponse {
        return response()->json(
            [
                "success" => false,
                "message" => $message,
                "errors" => $errors,
            ],
            $code,
        );
    }
}
