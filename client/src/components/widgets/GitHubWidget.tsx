import { motion } from 'framer-motion';
import type { GitHubWidgetData } from '../../types';
import { timeAgo } from '../../utils';

interface Props {
  data?: GitHubWidgetData;
}

const LANG_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  Rust: '#dea584',
  Go: '#00ADD8',
  Java: '#b07219',
  C: '#555555',
  'C++': '#f34b7d',
  'C#': '#178600',
  CSS: '#563d7c',
  HTML: '#e34c26',
  Shell: '#89e051',
  Vue: '#41b883',
  Svelte: '#ff3e00',
  Kotlin: '#A97BFF',
  Swift: '#F05138',
  Ruby: '#701516',
  PHP: '#4F5D95',
  Dart: '#00B4AB',
};

export default function GitHubWidget({ data }: Props) {
  if (!data) return null;
  const { user, repos } = data;

  const langMap: Record<string, number> = {};
  repos.forEach((repo) => {
    if (repo.language) {
      langMap[repo.language] = (langMap[repo.language] ?? 0) + 1;
    }
  });
  const total = Object.values(langMap).reduce((a, b) => a + b, 0);
  const topLangs = Object.entries(langMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count]) => ({ name, count, percent: Math.round((count / total) * 100) }));

  const recentRepos = [...repos]
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .slice(0, 5);

  return (
    <div style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius)', padding: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid var(--border)' }}>
        <img
          src={user.avatar_url}
          alt={user.login}
          loading="lazy"
          style={{ width: 44, height: 44, borderRadius: '50%', border: '2px solid var(--border)' }}
        />
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 14 }}>{user.name}</div>
          <a href={`https://github.com/${user.login}`} target="_blank" style={{ fontSize: 12, color: 'var(--text-2)', textDecoration: 'none' }}>
            @{user.login}
          </a>
        </div>
        <div style={{ display: 'flex', gap: 16, textAlign: 'center' }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--accent)' }}>{user.public_repos}</div>
            <div style={{ fontSize: 10, color: 'var(--text-2)' }}>repos</div>
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--accent)' }}>{user.followers}</div>
            <div style={{ fontSize: 10, color: 'var(--text-2)' }}>followers</div>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: 20 }}>
        <div className="section-label" style={{ marginBottom: 10 }}>Languages</div>
        <div style={{ display: 'flex', height: 8, borderRadius: 99, overflow: 'hidden', marginBottom: 12, gap: 2 }}>
          {topLangs.map((lang) => (
            <div
              key={lang.name}
              style={{ width: `${lang.percent}%`, background: LANG_COLORS[lang.name] ?? 'var(--text-2)', borderRadius: 99 }}
              title={`${lang.name} ${lang.percent}%`}
            />
          ))}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 16px' }}>
          {topLangs.map((lang) => (
            <div key={lang.name} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: LANG_COLORS[lang.name] ?? 'var(--text-2)', flexShrink: 0 }} />
              <span>{lang.name}</span>
              <span style={{ color: 'var(--text-2)' }}>{lang.percent}%</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="section-label" style={{ marginBottom: 10 }}>Recent Repos</div>
        {recentRepos.map((repo, i) => (
          <motion.a
            key={repo.id}
            href={repo.html_url}
            target="_blank"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '8px 0',
              borderBottom: i < 4 ? '1px solid var(--border)' : 'none',
              textDecoration: 'none',
              color: 'var(--text)',
              transition: 'color 0.15s',
            }}
          >
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: LANG_COLORS[repo.language ?? ''] ?? 'var(--border)', flexShrink: 0 }} />
            <span style={{ flex: 1, fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {repo.name}
            </span>
            {repo.stargazers_count > 0 && (
              <span style={{ fontSize: 11, color: 'var(--text-2)', display: 'flex', alignItems: 'center', gap: 3 }}>
                ⭐ {repo.stargazers_count}
              </span>
            )}
            <span style={{ fontSize: 11, color: 'var(--text-2)', flexShrink: 0 }}>
              {timeAgo(repo.updated_at)}
            </span>
          </motion.a>
        ))}
      </div>
    </div>
  );
}
