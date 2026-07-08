const port = process.env.PORT ?? '3000';
const response = await fetch(`http://127.0.0.1:${port}/api/health`);
const body = await response.json();
if (!response.ok || body.status !== 'ok') process.exit(1);
console.log('BugBoard26 backend is healthy');
