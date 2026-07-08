const base = process.env.API_BASE_URL ?? 'http://127.0.0.1:3000/api';
async function request(path, options = {}) {
  const response = await fetch(base + path, { ...options, headers: { 'content-type': 'application/json', ...options.headers } });
  const body = await response.json();
  if (!response.ok) throw new Error(`${response.status}: ${body.error?.message}`);
  return body;
}
const session = await request('/auth/login', { method: 'POST', body: JSON.stringify({ email: 'user@softengunina.it', password: 'User123!' }) });
const headers = { authorization: `Bearer ${session.token}` };
const issue = await request('/issues', { method: 'POST', headers, body: JSON.stringify({ title: 'Smoke test', description: 'Automated API verification', type: 'BUG', priority: 'LOW' }) });
await request(`/issues/${issue.issue.id}/comments`, { method: 'POST', headers, body: JSON.stringify({ text: 'Smoke test comment' }) });
console.log(`Smoke test passed for issue ${issue.issue.id}`);
