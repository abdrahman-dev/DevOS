import { useState } from 'react';

const STORAGE_KEY = 'devos-widget-collapsed';

export function useWidgetCollapse() {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}');
    } catch {
      return {};
    }
  });

  const toggle = (key: string) => {
    setCollapsed((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const isCollapsed = (key: string) => !!collapsed[key];

  return { isCollapsed, toggle };
}
