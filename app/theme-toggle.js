'use client';

import { useEffect, useRef, useState } from 'react';

const storageKey = 'sayan-theme';
function savedPreference() {
  try {
    const saved = localStorage.getItem(storageKey);
    return saved === 'dark' || saved === 'light' ? saved : null;
  } catch { return null; }
}
function setPageTheme(theme) {
  document.documentElement.dataset.theme = theme;
  window.dispatchEvent(new Event('themechange'));
}

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);
  const manualChoice = useRef(null);

  useEffect(() => {
    const sync = () => {
      const theme = manualChoice.current || savedPreference() || 'light';
      setPageTheme(theme);
      setDark(theme === 'dark');
    };
    const storageChanged = event => {
      if (event.key === storageKey || event.key === null) { manualChoice.current = null; sync(); }
    };
    sync();
    window.addEventListener('storage', storageChanged);
    return () => { window.removeEventListener('storage', storageChanged); };
  }, []);

  function toggle() {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    manualChoice.current = next;
    try { localStorage.setItem(storageKey, next); } catch {}
    setPageTheme(next);
    setDark(next === 'dark');
  }

  return <button type="button" className="theme-toggle" role="switch" aria-checked={dark} aria-label="Dark mode" title={dark ? 'Switch to light mode' : 'Switch to dark mode'} onClick={toggle}>
    <svg className="theme-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20.7 13.1A8.8 8.8 0 0 1 10.9 3.3 8.8 8.8 0 1 0 20.7 13.1Z" /></svg>
    <svg className="theme-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="12" r="3.6" /><path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" /></svg>
  </button>;
}
