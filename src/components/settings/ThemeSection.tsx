import React from 'react';

const STORAGE_KEY = 'theme';

export const ThemeSection: React.FC = () => {
  const [theme, setTheme] = React.useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as 'light' | 'dark' | null;
    return saved || 'dark';
  });

  React.useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  return (
    <div className="space-y-3">
      <p className="text-muted-foreground">Choose your appearance preference. This is stored on your device.</p>
      <div className="flex items-center gap-4">
        <label className="inline-flex items-center gap-2">
          <input
            type="radio"
            checked={theme === 'light'}
            onChange={() => setTheme('light')}
          />
          <span>Light</span>
        </label>
        <label className="inline-flex items-center gap-2">
          <input
            type="radio"
            checked={theme === 'dark'}
            onChange={() => setTheme('dark')}
          />
          <span>Dark</span>
        </label>
      </div>
    </div>
  );
};

export default ThemeSection;
