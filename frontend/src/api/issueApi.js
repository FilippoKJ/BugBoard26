function toQueryString(filters) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });
  const query = params.toString();
  return query ? `?${query}` : '';
}

export function createIssueApi(client) {
  return {
    list: (filters = {}) => client.get(`/issues${toQueryString(filters)}`),
    listArchived: (filters = {}) => client.get(`/issues/archived${toQueryString(filters)}`),
    getById: (id) => client.get(`/issues/${id}`),
    getImage: (id) => client.getBlob(`/issues/${id}/image`),
    create: (issue) => client.post('/issues', issue),
    archive: (id) => client.patch(`/issues/${id}/archive`),
    listComments: (id) => client.get(`/issues/${id}/comments`),
    addComment: (id, text) => client.post(`/issues/${id}/comments`, { text })
  };
}
