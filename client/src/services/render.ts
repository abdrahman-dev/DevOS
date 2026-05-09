const BASE = 'https://api.render.com/v1';

export async function fetchRenderUser(apiKey: string) {
  const res = await fetch(`${BASE}/owners?limit=1`, {
    headers: { Authorization: `Bearer ${apiKey}` },
  });
  if (!res.ok) throw new Error('Invalid Render API key');
  const data = await res.json();
  return data[0]?.owner ?? null;
}

export async function fetchRenderServices(apiKey: string) {
  const res = await fetch(`${BASE}/services?limit=20`, {
    headers: { Authorization: `Bearer ${apiKey}` },
  });
  if (!res.ok) throw new Error('Failed to fetch Render services');
  return res.json();
}
