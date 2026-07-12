import {
  IssuePriority,
  isIssuePriority,
  isIssueType
} from '../entities/IssueValues.js';
import { ValidationError } from '../errors/ValidationError.js';

const MAX_IMAGE_SIZE = 3 * 1024 * 1024;
const supportedImageSignatures = {
  'image/png': (data) => data.subarray(0, 8).equals(
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
  ),
  'image/jpeg': (data) => data[0] === 0xff && data[1] === 0xd8 && data[2] === 0xff,
  'image/webp': (data) => data.subarray(0, 4).toString('ascii') === 'RIFF'
    && data.subarray(8, 12).toString('ascii') === 'WEBP',
  'image/gif': (data) => ['GIF87a', 'GIF89a'].includes(
    data.subarray(0, 6).toString('ascii')
  )
};

function isBase64Symbol(character) {
  const code = character.codePointAt(0);
  return (code >= 0x41 && code <= 0x5a)
    || (code >= 0x61 && code <= 0x7a)
    || (code >= 0x30 && code <= 0x39)
    || character === '+'
    || character === '/';
}

function isValidBase64(value) {
  if (!value || value.length % 4 === 1) {
    return false;
  }

  const firstPadding = value.indexOf('=');
  const contentEnd = firstPadding === -1 ? value.length : firstPadding;
  const paddingLength = value.length - contentEnd;

  if (paddingLength > 2 || (paddingLength > 0 && value.length % 4 !== 0)) {
    return false;
  }

  for (let index = 0; index < contentEnd; index += 1) {
    if (!isBase64Symbol(value[index])) {
      return false;
    }
  }

  for (let index = contentEnd; index < value.length; index += 1) {
    if (value[index] !== '=') {
      return false;
    }
  }

  return true;
}

function removeBase64Padding(value) {
  let end = value.length;
  while (end > 0 && value[end - 1] === '=') {
    end -= 1;
  }
  return value.slice(0, end);
}

export class CreateIssueRequest {
  constructor(title, description, type, priority, image) {
    this.title = title;
    this.description = description;
    this.type = type;
    this.priority = priority;
    this.image = image;
  }

  static from(body) {
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      throw new ValidationError('A JSON request body is required');
    }

    const title = typeof body.title === 'string' ? body.title.trim() : '';
    const description = typeof body.description === 'string'
      ? body.description.trim()
      : '';
    const type = typeof body.type === 'string' ? body.type.toUpperCase() : '';
    let priority = IssuePriority.MEDIUM;
    if (body.priority !== undefined) {
      priority = typeof body.priority === 'string'
        ? body.priority.toUpperCase()
        : '';
    }

    if (!title || title.length > 150) {
      throw new ValidationError(
        'Title must contain between 1 and 150 characters'
      );
    }

    if (!description || description.length > 5_000) {
      throw new ValidationError(
        'Description must contain between 1 and 5000 characters'
      );
    }

    if (!isIssueType(type)) {
      throw new ValidationError(
        'Type must be QUESTION, BUG, DOCUMENTATION or FEATURE'
      );
    }

    if (!isIssuePriority(priority)) {
      throw new ValidationError(
        'Priority must be LOW, MEDIUM, HIGH or CRITICAL'
      );
    }

    return new CreateIssueRequest(
      title,
      description,
      type,
      priority,
      CreateIssueRequest.parseImage(body.image)
    );
  }

  static parseImage(image) {
    if (image === undefined || image === null) {
      return null;
    }
    if (typeof image !== 'object' || Array.isArray(image)) {
      throw new ValidationError('Image must be an object');
    }

    const fileName = typeof image.fileName === 'string'
      ? image.fileName.trim()
      : '';
    const mimeType = typeof image.mimeType === 'string'
      ? image.mimeType.toLowerCase()
      : '';
    const encodedData = typeof image.data === 'string'
      ? image.data.replace(/\s/g, '')
      : '';

    if (!fileName || fileName.length > 255) {
      throw new ValidationError('Image file name must contain 1 to 255 characters');
    }
    if (!Object.hasOwn(supportedImageSignatures, mimeType)) {
      throw new ValidationError('Image must be PNG, JPEG, WebP or GIF');
    }
    if (!isValidBase64(encodedData)) {
      throw new ValidationError('Image data must be valid Base64');
    }

    const data = Buffer.from(encodedData, 'base64');
    const canonicalData = removeBase64Padding(data.toString('base64'));
    if (canonicalData !== removeBase64Padding(encodedData)) {
      throw new ValidationError('Image data must be valid Base64');
    }
    if (!data.length || data.length > MAX_IMAGE_SIZE) {
      throw new ValidationError('Image must not exceed 3 MB');
    }
    if (!supportedImageSignatures[mimeType](data)) {
      throw new ValidationError('Image content does not match its declared format');
    }

    return { fileName, mimeType, data };
  }
}
