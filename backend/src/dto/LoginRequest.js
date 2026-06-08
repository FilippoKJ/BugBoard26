import { ValidationError } from '../errors/ValidationError.js';

export class LoginRequest {
  constructor(email, password) {
    this.email = email;
    this.password = password;
  }

  static from(body) {
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      throw new ValidationError('A JSON request body is required');
    }

    const email = typeof body.email === 'string' ? body.email.trim() : '';
    const password = typeof body.password === 'string' ? body.password : '';

    if (!email || !password) {
      throw new ValidationError('Email and password are required');
    }

    return new LoginRequest(email, password);
  }
}
