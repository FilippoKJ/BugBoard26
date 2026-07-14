import { describe, expect, it, vi } from 'vitest';
import { AuthenticationError } from '../../src/errors/AuthenticationError.js';
import { AuthService } from '../../src/services/AuthService.js';

describe('AuthService.login(email, password)', () => {
  it('returns a token and the safe user when both credentials are valid', async () => {
    const safeUser = { id: 7, email: 'user@example.test', role: 'USER' };
    const user = {
      passwordHash: 'stored-hash',
      toSafeObject: vi.fn(() => safeUser)
    };
    const userRepository = {
      findByEmail: vi.fn(() => user)
    };
    const passwordHasher = {
      verify: vi.fn(async () => true)
    };
    const tokenService = {
      issueFor: vi.fn(() => 'signed-token')
    };
    const service = new AuthService(
      userRepository,
      passwordHasher,
      tokenService
    );

    await expect(
      service.login('user@example.test', 'Strong123!')
    ).resolves.toEqual({ token: 'signed-token', user: safeUser });
    expect(passwordHasher.verify).toHaveBeenCalledWith(
      'Strong123!',
      'stored-hash'
    );
    expect(tokenService.issueFor).toHaveBeenCalledWith(user);
  });

  it('rejects the login without issuing a token when the password is wrong', async () => {
    const userRepository = {
      findByEmail: vi.fn(() => ({ passwordHash: 'stored-hash' }))
    };
    const passwordHasher = {
      verify: vi.fn(async () => false)
    };
    const tokenService = {
      issueFor: vi.fn()
    };
    const service = new AuthService(
      userRepository,
      passwordHasher,
      tokenService
    );

    await expect(
      service.login('user@example.test', 'Wrong123!')
    ).rejects.toBeInstanceOf(AuthenticationError);
    expect(tokenService.issueFor).not.toHaveBeenCalled();
  });
});
