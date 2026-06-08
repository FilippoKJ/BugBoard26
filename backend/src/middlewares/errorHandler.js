import { AppError } from '../errors/AppError.js';

export function notFoundHandler(request, _response, next) {
  next(
    new AppError(
      `Route ${request.method} ${request.originalUrl} not found`,
      404,
      'ROUTE_NOT_FOUND'
    )
  );
}

export function errorHandler(error, _request, response, _next) {
  const isOperational = error instanceof AppError;
  const statusCode = isOperational ? error.statusCode : 500;
  const code = isOperational ? error.code : 'INTERNAL_ERROR';
  const message = isOperational ? error.message : 'An unexpected error occurred';

  if (!isOperational) {
    console.error(error);
  }

  response.status(statusCode).json({
    error: {
      code,
      message
    }
  });
}
