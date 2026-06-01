import { Routes, Route, useLocation } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';
import DashboardPage from '../pages/DashboardPage';
import ProjectsPage from '../pages/ProjectsPage';
import ProjectDetailPage from '../pages/ProjectDetailPage';
import LearningPage from '../pages/LearningPage';
import SettingsPage from '../pages/SettingsPage';
import ProfilePage from '../pages/ProfilePage';
import PublicProfilePage from '../pages/PublicProfilePage';
import PeoplePage from '../pages/PeoplePage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';

export default function AppRoutes() {
  const location = useLocation();

  return (
    <Routes location={location} key={location.pathname}>
      <Route path="/" element={<LandingPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/profile/:username" element={<PublicProfilePage />} />
      <Route path="/people" element={<PeoplePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/projects" element={<ProjectsPage />} />
      <Route path="/projects/:id" element={<ProjectDetailPage />} />
      <Route path="/learning" element={<LearningPage />} />
      <Route path="/settings" element={<SettingsPage />} />
    </Routes>
  );
}
