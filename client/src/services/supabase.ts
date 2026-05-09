const BASE = 'https://api.supabase.com/v1';

export async function fetchSupabaseProjects(token: string) {
  const res = await fetch(`${BASE}/projects`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Invalid Supabase token');
  return res.json();
}

export async function fetchSupabaseOrgs(token: string) {
  const res = await fetch(`${BASE}/organizations`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch organizations');
  return res.json();
}
