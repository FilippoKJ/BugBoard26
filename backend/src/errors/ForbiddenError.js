import { AppError } from './AppError.js';

export class ForbiddenError extends AppError {
  constructor() {
    super(
      'You are not authorized to perform this action',
      403,
      'FORBIDDEN'
    );
  }
}
