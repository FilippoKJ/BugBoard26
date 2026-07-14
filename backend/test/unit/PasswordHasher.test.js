import { describe, expect, it } from 'vitest';
import { PasswordHasher } from '../../src/services/PasswordHasher.js';

describe('PasswordHasher.verify(password, passwordHash)', () => {
  it('accepts the original password and rejects a different password', async () => {
    const hasher = new PasswordHasher();
    const passwordHash = await hasher.hash('Strong123!');

    await expect(
      hasher.verify('Strong123!', passwordHash)
    ).resolves.toBe(true);
    await expect(
      hasher.verify('Wrong123!', passwordHash)
    ).resolves.toBe(false);
    expect(passwordHash).not.toContain('Strong123!');
  });
});
