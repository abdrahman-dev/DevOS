import { useState, useEffect } from 'react';
import type { Settings, WidgetDataMap } from '../types';
import { fetchGitHubUser, fetchGitHubRepos } from '../services/github';

export function useIntegrationData(settings: Settings) {
  const [data, setData] = useState<WidgetDataMap>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    const fetchAll = async () => {
      const result: WidgetDataMap = {};

      if (settings.githubUsername) {
        try {
          const [user, repos] = await Promise.all([
            fetchGitHubUser(settings.githubUsername),
            fetchGitHubRepos(settings.githubUsername),
          ]);
          if (cancelled) return;
          result.github = {
            user: {
              avatar_url: user.avatar_url,
              login: user.login,
              name: user.name ?? user.login,
              public_repos: user.public_repos,
              followers: user.followers,
            },
            repos: repos.map((r: any) => ({
              id: r.id,
              name: r.name,
              language: r.language,
              stargazers_count: r.stargazers_count,
              updated_at: r.updated_at,
              html_url: r.html_url,
            })),
          };
        } catch {}
      }

      if (!cancelled) {
        setData(result);
        setLoading(false);
      }
    };

    fetchAll();
    return () => { cancelled = true; };
  }, [settings.githubUsername]);

  return { data, loading };
}
