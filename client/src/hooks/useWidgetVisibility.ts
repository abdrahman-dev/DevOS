import { useState } from 'react';

const STORAGE_KEY = 'devos-widget-visible';

export function useWidgetVisibility() {
  const [visible, setVisible] = useState<Record<string, boolean>>(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}');
    } catch {
      return {};
    }
  });

  const toggle = (key: string) => {
    setVisible((prev) => {
      const next = { ...prev, [key]: prev[key] === undefined ? false : !prev[key] };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const isVisible = (key: string) => visible[key] !== false;

  const anyHidden = () => Object.values(visible).some((v) => v === false);

  return { isVisible, toggle, anyHidden };
}
