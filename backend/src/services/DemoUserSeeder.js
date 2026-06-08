export class DemoUserSeeder {
  constructor(userRepository, passwordHasher) {
    this.userRepository = userRepository;
    this.passwordHasher = passwordHasher;
  }

  async seed(accounts) {
    let createdUsers = 0;

    for (const account of accounts) {
      const existingUser = this.userRepository.findByEmail(account.email);

      if (existingUser) {
        continue;
      }

      const passwordHash = await this.passwordHasher.hash(account.password);
      this.userRepository.create({
        email: account.email,
        passwordHash,
        role: account.role
      });
      createdUsers += 1;
    }

    return createdUsers;
  }
}
