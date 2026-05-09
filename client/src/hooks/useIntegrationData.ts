import { useState, useEffect } from 'react';
import type { Settings, WidgetDataMap } from '../types';
import { fetchGitHubUser, fetchGitHubRepos } from '../services/github';
import { fetchOpenRouterUsage } from '../services/openrouter';
import { fetchVercelUser, fetchVercelProjects, fetchVercelDeployments } from '../services/vercel';
import { fetchOllamaStatus, fetchOllamaModels } from '../services/ollama';
import { fetchWakaTimeUser, fetchWakaTimeStats } from '../services/wakatime';
import { fetchRailwayUser, fetchRailwayProjects } from '../services/railway';
import { fetchRenderUser, fetchRenderServices } from '../services/render';
import { fetchSupabaseProjects, fetchSupabaseOrgs } from '../services/supabase';
import { fetchDevToUser, fetchDevToArticles } from '../services/devto';

export function useIntegrationData(settings: Settings) {
  const [data, setData] = useState<WidgetDataMap>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    const fetchAll = async () => {
      const result: WidgetDataMap = {};
      const promises: Promise<void>[] = [];

      if (settings.githubUsername) {
        promises.push(
          Promise.all([
            fetchGitHubUser(settings.githubUsername),
            fetchGitHubRepos(settings.githubUsername),
          ]).then(([user, repos]) => {
            if (cancelled) return;
            result.github = {
              avatar: user.avatar_url,
              name: user.name ?? user.login,
              publicRepos: user.public_repos,
              followers: user.followers,
              topRepos: repos.slice(0, 5).map((r: any) => ({
                name: r.name,
                stars: r.stargazers_count,
                language: r.language ?? 'Unknown',
              })),
            };
          }).catch(() => {}),
        );
      }

      if (settings.openRouterApiKey) {
        promises.push(
          fetchOpenRouterUsage(settings.openRouterApiKey).then((usageData) => {
            if (cancelled) return;
            result.openrouter = {
              label: usageData.label ?? usageData.key?.label ?? 'OpenRouter Key',
              usage: usageData.usage ?? usageData.key?.usage ?? 0,
              limit: usageData.limit ?? usageData.key?.limit ?? 0,
              isFreeTier: usageData.is_free_tier ?? usageData.key?.is_free_tier ?? false,
            };
          }).catch(() => {}),
        );
      }

      if (settings.vercelApiToken) {
        promises.push(
          Promise.all([
            fetchVercelUser(settings.vercelApiToken),
            fetchVercelProjects(settings.vercelApiToken, settings.vercelTeamId || undefined),
            fetchVercelDeployments(settings.vercelApiToken, settings.vercelTeamId || undefined),
          ]).then(([user, projRes, deplRes]) => {
            if (cancelled) return;
            result.vercel = {
              name: user.user?.name ?? user.user?.username ?? 'Vercel User',
              projects: projRes.projects?.length ?? 0,
              deployments: deplRes.deployments?.length ?? 0,
            };
          }).catch(() => {}),
        );
      }

      if (settings.ollamaBaseUrl) {
        promises.push(
          Promise.all([
            fetchOllamaStatus(settings.ollamaBaseUrl),
            fetchOllamaModels(settings.ollamaBaseUrl),
          ]).then(([ver, models]) => {
            if (cancelled) return;
            result.ollama = {
              version: ver.version ?? 'unknown',
              models: models.models?.length ?? 0,
            };
          }).catch(() => {}),
        );
      }

      if (settings.wakatimeApiKey) {
        promises.push(
          Promise.all([
            fetchWakaTimeUser(settings.wakatimeApiKey),
            fetchWakaTimeStats(settings.wakatimeApiKey),
          ]).then(([user, stats]) => {
            if (cancelled) return;
            result.wakatime = {
              username: user.data?.username ?? user.data?.display_name ?? 'WakaTime User',
              totalCodingTime: stats.data?.human_readable_total ?? 'N/A',
              topLanguage: stats.data?.languages?.[0]?.name ?? 'N/A',
              topLanguagePercent: stats.data?.languages?.[0]?.percent ?? 0,
            };
          }).catch(() => {}),
        );
      }

      if (settings.railwayToken) {
        promises.push(
          Promise.all([
            fetchRailwayUser(settings.railwayToken),
            fetchRailwayProjects(settings.railwayToken),
          ]).then(([user, projects]) => {
            if (cancelled) return;
            result.railway = {
              name: user.name ?? user.email ?? 'Railway User',
              projects: projects.length,
            };
          }).catch(() => {}),
        );
      }

      if (settings.renderApiKey) {
        promises.push(
          Promise.all([
            fetchRenderUser(settings.renderApiKey),
            fetchRenderServices(settings.renderApiKey),
          ]).then(([user, services]) => {
            if (cancelled) return;
            result.render = {
              name: user?.name ?? user?.email ?? 'Render User',
              services: services.length,
            };
          }).catch(() => {}),
        );
      }

      if (settings.supabaseToken) {
        promises.push(
          Promise.all([
            fetchSupabaseOrgs(settings.supabaseToken),
            fetchSupabaseProjects(settings.supabaseToken),
          ]).then(([orgs, projects]) => {
            if (cancelled) return;
            result.supabase = {
              orgName: orgs[0]?.name ?? 'Supabase User',
              projects: projects.length,
            };
          }).catch(() => {}),
        );
      }

      if (settings.devtoApiKey) {
        promises.push(
          Promise.all([
            fetchDevToUser(settings.devtoApiKey),
            fetchDevToArticles(settings.devtoApiKey),
          ]).then(([user, articles]) => {
            if (cancelled) return;
            const totalReactions = articles.reduce((sum: number, a: any) => sum + (a.positive_reactions_count ?? 0), 0);
            result.devto = {
              username: user.username ?? user.name ?? 'DEV User',
              articles: articles.length,
              totalReactions,
            };
          }).catch(() => {}),
        );
      }

      await Promise.all(promises);
      if (!cancelled) {
        setData(result);
        setLoading(false);
      }
    };

    fetchAll();
    return () => { cancelled = true; };
  }, [
    settings.githubUsername,
    settings.openRouterApiKey,
    settings.vercelApiToken,
    settings.vercelTeamId,
    settings.ollamaBaseUrl,
    settings.wakatimeApiKey,
    settings.railwayToken,
    settings.renderApiKey,
    settings.supabaseToken,
    settings.devtoApiKey,
  ]);

  return { data, loading };
}
