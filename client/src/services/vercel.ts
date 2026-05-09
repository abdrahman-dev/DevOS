export async function fetchVercelProjects(token: string, teamId?: string) {
  const url = teamId
    ? `https://api.vercel.com/v9/projects?teamId=${teamId}`
    : 'https://api.vercel.com/v9/projects';
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Invalid Vercel token');
  return res.json();
}

export async function fetchVercelUser(token: string) {
  const res = await fetch('https://api.vercel.com/v2/user', {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch Vercel user');
  return res.json();
}

export async function fetchVercelDeployments(token: string, teamId?: string) {
  const url = teamId
    ? `https://api.vercel.com/v6/deployments?limit=10&teamId=${teamId}`
    : 'https://api.vercel.com/v6/deployments?limit=10';
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch deployments');
  return res.json();
}
