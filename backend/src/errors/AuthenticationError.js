import { AppError } from './AppError.js';

export class AuthenticationError extends AppError {
  constructor() {
    super(
      'Email or password is incorrect',
      401,
      'INVALID_CREDENTIALS'
    );
  }
}
