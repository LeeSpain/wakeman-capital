import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../integrations/supabase/client';

const MarketingHeader: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();

  const NavLink = ({ to, children }: { to: string; children: React.ReactNode }) => (
    <Link
      to={to}
      className={`text-sm transition-colors ${
        location.pathname === to
          ? 'text-primary font-medium'
          : 'text-muted-foreground hover:text-foreground'
      }`}
    >
      {children}
    </Link>
  );

  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur border-b border-border">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="font-bold text-lg tracking-tight">
            <span className="font-display">Wakeman Capital</span>
          </Link>
        </div>
        <div className="flex items-center gap-3">
          {!user ? (
            <Link
              to="/auth"
              className="px-3 py-1.5 rounded-md border border-border bg-secondary text-secondary-foreground hover:bg-muted transition-colors"
            >
              Sign in
            </Link>
          ) : (
            <>
              <Link
                to="/dashboard"
                className="px-3 py-1.5 rounded-md border border-border bg-card hover:bg-muted transition-colors"
              >
                Go to Dashboard
              </Link>
              <button
                onClick={() => supabase.auth.signOut()}
                className="px-3 py-1.5 rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Sign out
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default MarketingHeader;
