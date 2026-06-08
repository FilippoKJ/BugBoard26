import { isUserRole } from '../entities/UserRole.js';
import { AuthenticationRequiredError } from '../errors/AuthenticationRequiredError.js';
import { ForbiddenError } from '../errors/ForbiddenError.js';

export function requireRole(...allowedRoles) {
  if (!allowedRoles.length || allowedRoles.some((role) => !isUserRole(role))) {
    throw new TypeError('At least one valid role is required');
  }

  return (request, _response, next) => {
    if (!request.user) {
      next(new AuthenticationRequiredError());
      return;
    }

    if (!allowedRoles.includes(request.user.role)) {
      next(new ForbiddenError());
      return;
    }

    next();
  };
}
