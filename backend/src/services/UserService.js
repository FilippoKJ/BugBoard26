import { ConflictError } from '../errors/ConflictError.js';

export class UserService {
  constructor(userRepository, passwordHasher) {
    this.userRepository = userRepository;
    this.passwordHasher = passwordHasher;
  }

  async createUser(email, password, role) {
    if (this.userRepository.findByEmail(email)) {
      throw new ConflictError('A user with this email already exists');
    }

    const passwordHash = await this.passwordHasher.hash(password);
    return this.userRepository.create({ email, passwordHash, role });
  }
}
