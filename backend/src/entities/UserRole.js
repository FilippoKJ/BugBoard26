export const UserRole = Object.freeze({
  ADMIN: 'ADMIN',
  USER: 'USER'
});

export function isUserRole(value) {
  return Object.values(UserRole).includes(value);
}
