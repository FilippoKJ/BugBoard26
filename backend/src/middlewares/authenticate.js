import { isUserRole } from '../entities/UserRole.js';
import { AuthenticationRequiredError } from '../errors/AuthenticationRequiredError.js';

export function createAuthenticationMiddleware(tokenService) {
  return (request, _response, next) => {
    try {
      const authorization = request.get('authorization');
      const [scheme, token, extraPart] = authorization?.split(/\s+/) ?? [];

      if (scheme?.toLowerCase() !== 'bearer' || !token || extraPart) {
        throw new AuthenticationRequiredError();
      }

      const payload = tokenService.verify(token);
      const userId = Number(payload.sub);

      if (!Number.isInteger(userId) || userId < 1 || !isUserRole(payload.role)) {
        throw new AuthenticationRequiredError();
      }

      request.user = {
        id: userId,
        role: payload.role
      };
      next();
    } catch {
      next(new AuthenticationRequiredError());
    }
  };
}
