import jwt from 'jsonwebtoken';

export class JwtTokenService {
  constructor(secret, expiresIn = '1h') {
    if (typeof secret !== 'string' || secret.length < 32) {
      throw new TypeError('JWT secret must contain at least 32 characters');
    }

    this.secret = secret;
    this.expiresIn = expiresIn;
  }

  issueFor(user) {
    if (!user?.id || !user?.role) {
      throw new TypeError('A persisted user is required to issue a token');
    }

    return jwt.sign(
      { role: user.role },
      this.secret,
      {
        algorithm: 'HS256',
        subject: String(user.id),
        issuer: 'bugboard26-backend',
        audience: 'bugboard26-frontend',
        expiresIn: this.expiresIn
      }
    );
  }

  verify(token) {
    return jwt.verify(token, this.secret, {
      algorithms: ['HS256'],
      issuer: 'bugboard26-backend',
      audience: 'bugboard26-frontend'
    });
  }
}
