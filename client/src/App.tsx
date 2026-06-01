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
import { useAuthStore } from './store/authStore';

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/projects': 'Projects',
  '/learning': 'Learning',
  '/settings': 'Settings',
  '/profile': 'Profile',
  '/people': 'People',
};

function AppLayout() {
  const location = useLocation();
  const isLanding = location.pathname === '/';
  const isAuthPage = ['/login', '/register'].includes(location.pathname);
  const hideChrome = isLanding || isAuthPage;
  const loadSettings = useSettingsStore((s) => s.loadSettings);
  const loadProjects = useProjectsStore((s) => s.loadProjects);
  const loadLearning = useLearningStore((s) => s.loadItems);
  const checkAuth = useAuthStore((s) => s.checkAuth);
  const initialized = useAuthStore((s) => s.initialized);

  useEffect(() => {
    checkAuth();
    loadSettings();
    loadProjects();
    loadLearning();
  }, [checkAuth, loadSettings, loadProjects, loadLearning]);

  if (!initialized) {
    return (
      <>
        <AnimatedBackground />
        <div style={{
          position: 'fixed', inset: 0, display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          zIndex: 10,
        }}>
          <div className="loading-bar" />
        </div>
      </>
    );
  }

  const title = (() => {
    if (location.pathname.startsWith('/projects/') && location.pathname !== '/projects') {
      return 'Project Detail';
    }
    return pageTitles[location.pathname] ?? 'DevOS';
  })();

  if (hideChrome) {
    return (
      <>
        <AnimatedBackground />
        <AppRoutes />
      </>
    );
  }

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
