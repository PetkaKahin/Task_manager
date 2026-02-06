<?php

declare(strict_types=1);

namespace App\Traits\Response;

use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

trait ApiResponse
{
    protected function success(
        mixed  $data = null,
        ?string $message = null,
        int    $statusCode = Response::HTTP_OK
    ): JsonResponse
    {
        $response = $this->normalizeResponse([
            'success' => true,
            'data'    => $data,
            'message' => $message,
        ]);

        return response()->json($response, $statusCode);
    }

    protected function error(
        array|object|null $errors = null,
        ?string $message = null,
        int $statusCode = Response::HTTP_BAD_REQUEST
    ): JsonResponse
    {
        $response = $this->normalizeResponse([
            'success' => false,
            'message' => $message,
            'errors'  => $errors,
        ]);

        return response()->json($response, $statusCode);
    }

    protected function notFound(?string $message = 'Not found'): JsonResponse
    {
        return $this->error(message: $message, statusCode: Response::HTTP_NOT_FOUND);
    }

    protected function unauthorized(?string $message = 'Unauthorized'): JsonResponse
    {
        return $this->error(message: $message, statusCode: Response::HTTP_UNAUTHORIZED);
    }

    protected function validationFailed(?string $message = 'Validation failed', ?array $errors = null): JsonResponse
    {
        return $this->error(errors: $errors, message: $message, statusCode: Response::HTTP_UNPROCESSABLE_ENTITY);
    }

    private function normalizeResponse(array $data): array
    {
        return array_filter($data, function ($value) {
            return $value !== null;
        });
    }
}
