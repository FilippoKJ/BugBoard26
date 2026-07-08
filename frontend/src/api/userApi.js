export function createUserApi(client) {
  return {
    create: (user) => client.post('/users', user)
  };
}
