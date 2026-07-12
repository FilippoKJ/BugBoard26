export function isValidEmail(value) {
  if (typeof value !== 'string' || !value || value.length > 254) {
    return false;
  }

  const separator = value.indexOf('@');
  if (
    separator <= 0
    || separator !== value.lastIndexOf('@')
    || separator === value.length - 1
  ) {
    return false;
  }

  const domain = value.slice(separator + 1);
  const dot = domain.indexOf('.');
  if (dot <= 0 || dot === domain.length - 1) {
    return false;
  }

  for (const character of value) {
    if (character.trim() === '') {
      return false;
    }
  }

  return true;
}

export function normalizeEmail(value) {
  return typeof value === 'string' ? value.trim().toLowerCase() : '';
}
