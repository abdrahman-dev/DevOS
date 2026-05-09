const BASE = 'https://wakatime.com/api/v1';

export async function fetchWakaTimeUser(apiKey: string) {
  const encoded = btoa(apiKey);
  const res = await fetch(`${BASE}/users/current`, {
    headers: { Authorization: `Basic ${encoded}` },
  });
  if (!res.ok) throw new Error('Invalid WakaTime API key');
  return res.json();
}

export async function fetchWakaTimeStats(apiKey: string) {
  const encoded = btoa(apiKey);
  const res = await fetch(`${BASE}/users/current/stats/last_7_days`, {
    headers: { Authorization: `Basic ${encoded}` },
  });
  if (!res.ok) throw new Error('Failed to fetch WakaTime stats');
  return res.json();
}
