import { describe, expect, it, vi } from 'vitest';
import { ConflictError } from '../../src/errors/ConflictError.js';
import { UserService } from '../../src/services/UserService.js';

describe('UserService.createUser(email, password, role)', () => {
  it('hashes the password and persists a new user', async () => {
    const createdUser = { id: 12, email: 'new@example.test', role: 'USER' };
    const userRepository = {
      findByEmail: vi.fn(() => null),
      create: vi.fn(() => createdUser)
    };
    const passwordHasher = {
      hash: vi.fn(async () => 'secure-hash')
    };
    const service = new UserService(userRepository, passwordHasher);

    await expect(
      service.createUser('new@example.test', 'Strong123!', 'USER')
    ).resolves.toBe(createdUser);
    expect(userRepository.create).toHaveBeenCalledWith({
      email: 'new@example.test',
      passwordHash: 'secure-hash',
      role: 'USER'
    });
  });

  it('rejects a duplicate email before hashing or persisting the password', async () => {
    const userRepository = {
      findByEmail: vi.fn(() => ({ id: 1 })),
      create: vi.fn()
    };
    const passwordHasher = {
      hash: vi.fn()
    };
    const service = new UserService(userRepository, passwordHasher);

    await expect(
      service.createUser('existing@example.test', 'Strong123!', 'ADMIN')
    ).rejects.toBeInstanceOf(ConflictError);
    expect(passwordHasher.hash).not.toHaveBeenCalled();
    expect(userRepository.create).not.toHaveBeenCalled();
  });
});
