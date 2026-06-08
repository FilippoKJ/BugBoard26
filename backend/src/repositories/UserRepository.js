import { User } from '../entities/User.js';

const userProjection = `
  SELECT
    id,
    email,
    password_hash AS passwordHash,
    role,
    created_at AS createdAt
  FROM users
`;

export class UserRepository {
  constructor(database) {
    database.ensureConnected();
    this.connection = database.connection;
  }

  create({ email, passwordHash, role }) {
    const user = new User({ email, passwordHash, role });
    const result = this.connection
      .prepare(
        `INSERT INTO users (email, password_hash, role)
         VALUES (?, ?, ?)`
      )
      .run(user.email, user.passwordHash, user.role);

    return this.findById(Number(result.lastInsertRowid));
  }

  findById(id) {
    const row = this.connection
      .prepare(`${userProjection} WHERE id = ?`)
      .get(id);

    return UserRepository.toEntity(row);
  }

  findByEmail(email) {
    const normalizedEmail = User.normalizeEmail(email);
    const row = this.connection
      .prepare(`${userProjection} WHERE email = ?`)
      .get(normalizedEmail);

    return UserRepository.toEntity(row);
  }

  count() {
    return this.connection.prepare('SELECT COUNT(*) AS count FROM users').get().count;
  }

  static toEntity(row) {
    return row ? new User(row) : null;
  }
}
