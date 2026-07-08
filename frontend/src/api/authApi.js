export function createAuthApi(client) {
  return {
    login: (email, password) => client.post('/auth/login', { email, password })
  };
}
