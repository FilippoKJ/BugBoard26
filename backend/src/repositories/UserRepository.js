import { User } from '../entities/User.js';

const userProjection = `
  SELECT
    id,
    email,
    password_hash AS "passwordHash",
    role,
    created_at AS "createdAt"
  FROM users
`;

export class UserRepository {
  constructor(database) {
    database.ensureConnected();
    this.database = database;
  }

  async create({ email, passwordHash, role }) {
    const user = new User({ email, passwordHash, role });
    const row = await this.database.queryOne(
      `INSERT INTO users (email, password_hash, role)
       VALUES ($1, $2, $3)
       RETURNING id`,
      [user.email, user.passwordHash, user.role]
    );

    return this.findById(Number(row.id));
  }

  async findById(id) {
    const row = await this.database.queryOne(
      `${userProjection} WHERE id = $1`,
      [id]
    );

    return UserRepository.toEntity(row);
  }

  async findByEmail(email) {
    const normalizedEmail = User.normalizeEmail(email);
    const row = await this.database.queryOne(
      `${userProjection} WHERE email = $1`,
      [normalizedEmail]
    );

    return UserRepository.toEntity(row);
  }

  async count() {
    const row = await this.database.queryOne(
      'SELECT COUNT(*) AS count FROM users'
    );
    return Number(row.count);
  }

  static toEntity(row) {
    return row ? new User({ ...row, id: Number(row.id) }) : null;
  }
}
