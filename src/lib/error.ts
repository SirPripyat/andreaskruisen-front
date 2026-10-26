import { isAxiosError } from 'axios';

export type ApiErrorResponse = {
  message: string;
  error: string;
  statusCode: number;
};

export function getErrorMessage(error: unknown, fallback: string) {
  if (isAxiosError<ApiErrorResponse>(error)) {
    return error.response?.data?.message ?? fallback;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}
