import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export function useRequireAuth() {
  const user = useAuthStore((s) => s.user);
  const initialized = useAuthStore((s) => s.initialized);
  const navigate = useNavigate();

  useEffect(() => {
    if (initialized && !user) navigate('/login');
  }, [user, initialized, navigate]);
}
