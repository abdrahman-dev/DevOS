export async function fetchOllamaModels(baseUrl: string) {
  const res = await fetch(`${baseUrl}/api/tags`);
  if (!res.ok) throw new Error('Ollama not reachable');
  return res.json();
}

export async function fetchOllamaStatus(baseUrl: string) {
  const res = await fetch(`${baseUrl}/api/version`);
  if (!res.ok) throw new Error('Ollama not running');
  return res.json();
}
