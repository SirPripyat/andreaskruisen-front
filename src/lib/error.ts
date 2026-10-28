import { isAxiosError } from 'axios';

export type ApiErrorResponse = {
  message: string | string[];
  error: string;
  statusCode: number;
};

export function getErrorMessage(error: unknown, fallback: string) {
  if (isAxiosError<ApiErrorResponse>(error)) {
    const message = error.response?.data?.message;
    if (Array.isArray(message)) {
      return message.join(', ');
    }
    return message ?? fallback;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}
