import { ApiError } from './ApiError.js';

const baseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api';

export class ApiClient {
  constructor(getToken = () => null) {
    this.getToken = getToken;
  }

  async request(path, options = {}) {
    const token = this.getToken();
    const response = await fetch(`${baseUrl}${path}`, {
      ...options,
      headers: {
        Accept: 'application/json',
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers
      }
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new ApiError(
        payload.error?.message ?? 'The server could not complete the request',
        response.status,
        payload.error?.code
      );
    }
    return payload;
  }

  get(path) { return this.request(path); }
  async getBlob(path) {
    const token = this.getToken();
    const response = await fetch(`${baseUrl}${path}`, {
      headers: {
        Accept: 'image/*',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    });
    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      throw new ApiError(
        payload.error?.message ?? 'The server could not load the image',
        response.status,
        payload.error?.code
      );
    }
    return response.blob();
  }
  post(path, body) { return this.request(path, { method: 'POST', body: JSON.stringify(body) }); }
  patch(path, body = {}) { return this.request(path, { method: 'PATCH', body: JSON.stringify(body) }); }
}
