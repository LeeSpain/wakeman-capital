import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Navigation = () => {
  const location = useLocation();
  const { t } = useTranslation();
  
const navItems = [
  { path: '/', label: t('nav.home') },
  { path: '/dashboard', label: t('nav.dashboard') },
  { path: '/analytics', label: t('nav.analytics') },
  { path: '/videos', label: 'Videos' },
  { path: '/paper', label: t('nav.paperTrading') },
  { path: '/coach', label: t('nav.aiCoach') },
];

  return (
    <nav className="bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl font-bold text-foreground">
            Trend Pulse
          </Link>
          
          <div className="flex space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`transition-colors ${
                  location.pathname === item.path
                    ? 'text-primary font-medium'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;