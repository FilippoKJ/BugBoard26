import { compare, hash } from 'bcryptjs';

export class PasswordHasher {
  constructor(cost = 12) {
    if (!Number.isInteger(cost) || cost < 10 || cost > 15) {
      throw new RangeError('Bcrypt cost must be an integer between 10 and 15');
    }

    this.cost = cost;
  }

  async hash(plainTextPassword) {
    if (typeof plainTextPassword !== 'string' || !plainTextPassword) {
      throw new TypeError('Password cannot be empty');
    }

    return hash(plainTextPassword, this.cost);
  }

  async verify(plainTextPassword, passwordHash) {
    if (typeof plainTextPassword !== 'string' || !plainTextPassword) {
      return false;
    }

    if (typeof passwordHash !== 'string' || !passwordHash) {
      return false;
    }

    return compare(plainTextPassword, passwordHash);
  }
}
