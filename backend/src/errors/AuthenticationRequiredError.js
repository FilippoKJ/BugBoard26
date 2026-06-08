import { AppError } from './AppError.js';

export class AuthenticationRequiredError extends AppError {
  constructor() {
    super(
      'Authentication is required',
      401,
      'AUTHENTICATION_REQUIRED'
    );
  }
}
