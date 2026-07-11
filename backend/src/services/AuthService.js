import { AuthenticationError } from '../errors/AuthenticationError.js';

const NONEXISTENT_USER_HASH =
  '$2b$12$htrT6FxNF7lSxZOY5j5u7uSPNovAWjWAvsOyZLCSpyZRaI6vHiyRu';

export class AuthService {
  constructor(userRepository, passwordHasher, tokenService) {
    this.userRepository = userRepository;
    this.passwordHasher = passwordHasher;
    this.tokenService = tokenService;
  }

  async login(email, password) {
    const user = this.userRepository.findByEmail(email);
    const passwordMatches = await this.passwordHasher.verify(
      password,
      user?.passwordHash ?? NONEXISTENT_USER_HASH
    );

    if (!user || !passwordMatches) {
      throw new AuthenticationError();
    }

    return {
      token: this.tokenService.issueFor(user),
      user: user.toSafeObject()
    };
  }
}
