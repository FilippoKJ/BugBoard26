import { ValidationError } from '../errors/ValidationError.js';

export function parsePositiveId(value) {
  const id = Number(value);
  if (!Number.isInteger(id) || id < 1) {
    throw new ValidationError('Resource id must be a positive integer');
  }
  return id;
}
