const BASE = 'https://dev.to/api';

export async function fetchDevToUser(apiKey: string) {
  const res = await fetch(`${BASE}/users/me`, {
    headers: { 'api-key': apiKey },
  });
  if (!res.ok) throw new Error('Invalid DEV.to API key');
  return res.json();
}

export async function fetchDevToArticles(apiKey: string) {
  const res = await fetch(`${BASE}/articles/me?per_page=10`, {
    headers: { 'api-key': apiKey },
  });
  if (!res.ok) throw new Error('Failed to fetch articles');
  return res.json();
}
