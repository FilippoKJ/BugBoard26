import { isUserRole } from './UserRole.js';

export class User {
  constructor({ id = null, email, passwordHash, role, createdAt = null }) {
    this.id = id;
    this.email = User.normalizeEmail(email);
    this.passwordHash = passwordHash;
    this.role = role;
    this.createdAt = createdAt;

    this.validate();
  }

  static normalizeEmail(email) {
    if (typeof email !== 'string') {
      throw new TypeError('User email must be a string');
    }

    return email.trim().toLowerCase();
  }

  validate() {
    if (!this.email) {
      throw new TypeError('User email cannot be empty');
    }

    if (typeof this.passwordHash !== 'string' || !this.passwordHash) {
      throw new TypeError('User password hash cannot be empty');
    }

    if (!isUserRole(this.role)) {
      throw new TypeError(`Unsupported user role: ${this.role}`);
    }
  }

  toSafeObject() {
    return {
      id: this.id,
      email: this.email,
      role: this.role,
      createdAt: this.createdAt
    };
  }
}
