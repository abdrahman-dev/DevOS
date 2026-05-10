import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface ShortcutOptions {
  onNewProject?: () => void;
  onSearch?: () => void;
}

export function useKeyboardShortcuts({ onNewProject, onSearch }: ShortcutOptions = {}) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      switch (e.key) {
        case 'n':
        case 'N':
          onNewProject?.();
          break;

        case '/':
          e.preventDefault();
          onSearch?.();
          break;

        case 'g':
        case 'G':
          const nextKeyHandler = (e2: KeyboardEvent) => {
            switch (e2.key) {
              case 'd': navigate('/dashboard'); break;
              case 'p': navigate('/projects'); break;
              case 'l': navigate('/learning'); break;
              case 's': navigate('/settings'); break;
            }
            window.removeEventListener('keydown', nextKeyHandler);
          };
          window.addEventListener('keydown', nextKeyHandler);
          setTimeout(() => window.removeEventListener('keydown', nextKeyHandler), 1500);
          break;
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [navigate, location, onNewProject, onSearch]);
}
