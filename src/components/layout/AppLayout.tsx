import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const menu = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/signals', label: 'Signal Center' },
    { path: '/journal', label: 'Trade Journal' },
    { path: '/coach', label: 'AI Coach' },
    { path: '/trends', label: 'Trends' },
    { path: '/settings', label: 'Settings' },
    { path: '/billing', label: 'Billing' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="h-14 border-b border-border bg-card flex items-center px-4 justify-between">
        <div className="flex items-center gap-3">
          <button
            aria-label="Toggle sidebar"
            onClick={() => setCollapsed((c) => !c)}
            className="px-2 py-1 rounded-md border border-border bg-background hover:bg-muted transition-colors"
          >
            {collapsed ? '☰' : '×'}
          </button>
          <Link to="/" className="font-bold text-lg">
            CMWTrading
          </Link>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
          <Link to="/analytics" className={location.pathname === '/analytics' ? 'text-primary' : 'hover:text-foreground'}>
            Analytics
          </Link>
        </nav>
        <div>
          <button className="px-3 py-1.5 rounded-md border border-border bg-secondary text-secondary-foreground hover:bg-muted transition-colors">
            Sign Out
          </button>
        </div>
      </header>

      <div className="flex">
        <aside className={`${collapsed ? 'w-14' : 'w-64'} transition-all border-r border-border bg-card min-h-[calc(100vh-3.5rem)]`}>
          <div className="px-3 pt-3 text-xs uppercase tracking-wide text-muted-foreground">Main</div>
          <nav className="p-2 space-y-1">
            {menu.slice(0,5).map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`block rounded-md px-3 py-2 text-sm transition-colors ${
                  isActive(item.path)
                    ? 'bg-muted text-primary font-medium'
                    : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                }`}
              >
                <span className="truncate inline-block align-middle">{item.label}</span>
              </Link>
            ))}
          </nav>
          <div className="px-3 pt-3 text-xs uppercase tracking-wide text-muted-foreground">Account</div>
          <nav className="p-2 space-y-1">
            {menu.slice(5).map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`block rounded-md px-3 py-2 text-sm transition-colors ${
                  isActive(item.path)
                    ? 'bg-muted text-primary font-medium'
                    : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                }`}
              >
                <span className="truncate inline-block align-middle">{item.label}</span>
              </Link>
            ))}
          </nav>
        </aside>

        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
};

export default AppLayout;
