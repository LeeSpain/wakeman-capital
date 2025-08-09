import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import MarketingHeader from './MarketingHeader';
import MarketingFooter from './MarketingFooter';
import { useAuth } from '../../hooks/useAuth';
import { useUserRole } from '../../hooks/useUserRole';
import { supabase } from '../../integrations/supabase/client';
import LanguageSwitcher from '../i18n/LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import { useProfile } from '../../hooks/useProfile';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { user } = useAuth();
  const { isAdmin } = useUserRole();
  const { t, i18n } = useTranslation();
  const { profile } = useProfile(user?.id);

  React.useEffect(() => {
    const desired = profile?.preferred_language || localStorage.getItem('app_language') || 'en';
    if (i18n.language !== desired) {
      i18n.changeLanguage(desired);
    }
  }, [profile?.preferred_language, i18n]);

const menu = [
  { path: '/dashboard', label: t('nav.dashboard') },
  { path: '/signals', label: t('nav.signals') },
  { path: '/journal', label: t('nav.journal') },
  { path: '/coach', label: t('nav.aiCoach') },
  { path: '/trends', label: t('nav.trends') },
  { path: '/paper', label: t('nav.paperTrading') },
  { path: '/settings', label: t('nav.settings') },
  { path: '/billing', label: t('nav.billing') },
];

  const isActive = (path: string) => location.pathname === path;
  const isMarketing = location.pathname === '/' || location.pathname.startsWith('/auth');

  if (isMarketing) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <MarketingHeader />
        <main className="flex-1">{children}</main>
        <MarketingFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="h-14 border-b border-border bg-card flex items-center px-4 justify-between">
        <div className="flex items-center gap-3">
          <button
            aria-label={t('layout.toggleSidebar')}
            onClick={() => setCollapsed((c) => !c)}
            className="px-2 py-1 rounded-md border border-border bg-background hover:bg-muted transition-colors"
          >
            {collapsed ? '☰' : '×'}
          </button>
          <Link to="/" className="font-bold text-lg">
            Wakeman Capital
          </Link>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
          <Link to="/analytics" className={location.pathname === '/analytics' ? 'text-primary' : 'hover:text-foreground'}>
            {t('nav.analytics')}
          </Link>
          <Link to="/videos" className={location.pathname === '/videos' ? 'text-primary' : 'hover:text-foreground'}>
            Videos
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          {user ? (
            <button
              onClick={() => supabase.auth.signOut()}
              className="px-3 py-1.5 rounded-md border border-border bg-secondary text-secondary-foreground hover:bg-muted transition-colors"
            >
              {t('common.signOut')}
            </button>
          ) : (
            <Link
              to="/auth"
              className="px-3 py-1.5 rounded-md border border-border bg-secondary text-secondary-foreground hover:bg-muted transition-colors"
            >
              {t('common.signIn')}
            </Link>
          )}
        </div>
      </header>

      <div className="flex">
        <aside className={`${collapsed ? 'w-14' : 'w-64'} transition-all border-r border-border bg-card min-h-[calc(100vh-3.5rem)]`}>
          <div className="px-3 pt-3 text-xs uppercase tracking-wide text-muted-foreground">{t('layout.main')}</div>
          <nav className="p-2 space-y-1">
            {menu.slice(0,6).map((item) => (
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
          <div className="px-3 pt-3 text-xs uppercase tracking-wide text-muted-foreground">{t('layout.account')}</div>
          <nav className="p-2 space-y-1">
            {menu.slice(6).map((item) => (
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
            {isAdmin && (
              <Link
                to="/admin"
                className={`block rounded-md px-3 py-2 text-sm transition-colors ${
                  isActive('/admin')
                    ? 'bg-muted text-primary font-medium'
                    : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                }`}
              >
                <span className="truncate inline-block align-middle">{t('nav.admin')}</span>
              </Link>
            )}
          </nav>
        </aside>

        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
};

export default AppLayout;

