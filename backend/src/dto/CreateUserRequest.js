import { Buffer } from 'node:buffer';
import { isUserRole } from '../entities/UserRole.js';
import { ValidationError } from '../errors/ValidationError.js';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const strongPasswordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).+$/;

export class CreateUserRequest {
  constructor(email, password, role) {
    this.email = email;
    this.password = password;
    this.role = role;
  }

  static from(body) {
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      throw new ValidationError('A JSON request body is required');
    }

    const email = typeof body.email === 'string'
      ? body.email.trim().toLowerCase()
      : '';
    const password = typeof body.password === 'string' ? body.password : '';
    const role = typeof body.role === 'string' ? body.role.toUpperCase() : '';

    if (!emailPattern.test(email)) {
      throw new ValidationError('A valid email is required');
    }

    if (
      password.length < 8
      || Buffer.byteLength(password, 'utf8') > 72
      || !strongPasswordPattern.test(password)
    ) {
      throw new ValidationError(
        'Password must be 8-72 bytes and include uppercase, lowercase, number and symbol'
      );
    }

    if (!isUserRole(role)) {
      throw new ValidationError('Role must be ADMIN or USER');
    }

    return new CreateUserRequest(email, password, role);
  }
}
