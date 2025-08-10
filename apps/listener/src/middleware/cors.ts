import { defineEventHandler } from 'h3';

export default defineEventHandler(({ req, res }) => {
  const origin = req.headers.get('origin') ?? '';
  res.headers.set('access-control-allow-origin', origin);
  res.headers.set('access-control-allow-methods', '*');
  res.headers.set('access-control-allow-headers', '*');
  res.headers.set('access-control-allow-credentials', 'true');

  if (req.method === 'OPTIONS') {
    res.status = 204;
    return;
  }
});
