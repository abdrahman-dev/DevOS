const GH_BASE = 'https://api.github.com';

export async function fetchGitHubUser(username: string) {
  const res = await fetch(`${GH_BASE}/users/${username}`);
  if (!res.ok) throw new Error('User not found');
  return res.json();
}

export async function fetchGitHubRepos(username: string) {
  const res = await fetch(`${GH_BASE}/users/${username}/repos?sort=updated&per_page=20`);
  if (!res.ok) throw new Error('Failed to fetch repos');
  return res.json();
}
