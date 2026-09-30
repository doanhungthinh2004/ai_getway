export class AppError extends Error {
  statusCode: number;
  code: string;

  constructor(message: string, code: string, statusCode: number) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
  }
}

export function buildErrorResponse(requestId: string, code: string, message: string) {
  return {
    success: false,
    error: {
      code,
      message,
      requestId,
    },
  };
}
