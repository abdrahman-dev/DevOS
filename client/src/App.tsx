import { useEffect } from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Topbar from './components/layout/Topbar';
import BottomNav from './components/layout/BottomNav';
import AnimatedBackground from './components/ui/AnimatedBackground';
import AppRoutes from './routes';
import { useSettingsStore } from './store/settingsStore';
import { useProjectsStore } from './store/projectsStore';
import { useLearningStore } from './store/learningStore';

const pageTitles: Record<string, string> = {
  '/': 'Dashboard',
  '/projects': 'Projects',
  '/learning': 'Learning',
  '/settings': 'Settings',
};

function AppLayout() {
  const location = useLocation();
  const loadSettings = useSettingsStore((s) => s.loadSettings);
  const loadProjects = useProjectsStore((s) => s.loadProjects);
  const loadLearning = useLearningStore((s) => s.loadItems);

  useEffect(() => {
    loadSettings();
    loadProjects();
    loadLearning();
  }, [loadSettings, loadProjects, loadLearning]);

  const title = (() => {
    if (location.pathname.startsWith('/projects/') && location.pathname !== '/projects') {
      return 'Project Detail';
    }
    return pageTitles[location.pathname] ?? 'DevOS';
  })();

  return (
    <>
      <AnimatedBackground />
      <Sidebar />
      <Topbar title={title} />
      <main className="main-content">
        <AppRoutes />
      </main>
      <BottomNav />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}
