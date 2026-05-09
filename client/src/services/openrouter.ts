const OPENROUTER_BASE = 'https://openrouter.ai/api/v1';

export async function fetchOpenRouterModels(apiKey: string) {
  const res = await fetch(`${OPENROUTER_BASE}/models`, {
    headers: { Authorization: `Bearer ${apiKey}` },
  });
  if (!res.ok) throw new Error('Invalid API key or network error');
  return res.json();
}

export async function fetchOpenRouterUsage(apiKey: string) {
  const res = await fetch(`${OPENROUTER_BASE}/auth/key`, {
    headers: { Authorization: `Bearer ${apiKey}` },
  });
  if (!res.ok) throw new Error('Failed to fetch usage');
  return res.json();
}
