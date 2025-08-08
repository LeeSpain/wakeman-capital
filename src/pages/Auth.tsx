import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../integrations/supabase/client';
import { useAuth } from '../hooks/useAuth';

const Auth: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (user) navigate('/dashboard');
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    if (mode === 'login') {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setLoading(false);
        return setError(error.message);
      }
      // Ensure profile exists on login using user metadata if available
      const u = data.user;
      if (u) {
        const meta: any = u.user_metadata || {};
        const display = `${meta.first_name ?? ''} ${meta.last_name ?? ''}`.trim() || (u.email ? u.email.split('@')[0] : '');
        await supabase.from('profiles').upsert({
          id: u.id,
          first_name: meta.first_name ?? null,
          last_name: meta.last_name ?? null,
          mobile: meta.mobile ?? null,
          display_name: display || null,
          preferred_currency: 'AUD',
        });
      }
      setLoading(false);
      navigate('/dashboard');
    } else {
      const redirectUrl = `${window.location.origin}/`;
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: redirectUrl, data: { first_name: firstName, last_name: lastName, mobile } },
      });
      if (error) {
        setLoading(false);
        return setError(error.message);
      }
      // If session exists immediately (email confirmations disabled), create profile now
      const sessionUser = data.session?.user;
      if (sessionUser) {
        await supabase.from('profiles').upsert({
          id: sessionUser.id,
          first_name: firstName || null,
          last_name: lastName || null,
          mobile: mobile || null,
          display_name: `${firstName} ${lastName}`.trim() || null,
          preferred_currency: 'AUD',
        });
      }
      setLoading(false);
      setMessage('Check your email to confirm your account and sign in.');
    }
  };

  return (
    <>
      <Helmet>
        <title>{mode === 'login' ? 'Sign In' : 'Create Account'} — Trend Pulse</title>
        <meta name="description" content="Access your Trend Pulse account or create a new one to start tracking market sentiment with AI." />
        <link rel="canonical" href="/auth" />
      </Helmet>
      <main className="min-h-[calc(100vh-4rem-4rem)] bg-background flex items-center">
        <section className="max-w-7xl mx-auto px-4 w-full">
          <div className="mx-auto max-w-md rounded-xl border border-border bg-card p-6">
            <h1 className="text-2xl font-bold text-card-foreground mb-1">{mode === 'login' ? 'Welcome back' : 'Create your account'}</h1>
            <p className="text-sm text-muted-foreground mb-4">
              {mode === 'login' ? 'Sign in to continue to your dashboard.' : 'Sign up with your email and password to get started.'}
            </p>
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setMode('login')}
                className={`px-3 py-1.5 rounded-md border text-sm ${mode === 'login' ? 'bg-primary text-primary-foreground border-transparent' : 'border-border hover:bg-muted'}`}
              >
                Login
              </button>
              <button
                onClick={() => setMode('signup')}
                className={`px-3 py-1.5 rounded-md border text-sm ${mode === 'signup' ? 'bg-primary text-primary-foreground border-transparent' : 'border-border hover:bg-muted'}`}
              >
                Sign up
              </button>
            </div>
            <form className="space-y-3" onSubmit={handleSubmit}>
              {mode === 'signup' && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="grid gap-2">
                      <label className="text-sm text-muted-foreground" htmlFor="firstName">First name</label>
                      <input
                        id="firstName"
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                        placeholder="John"
                      />
                    </div>
                    <div className="grid gap-2">
                      <label className="text-sm text-muted-foreground" htmlFor="lastName">Surname</label>
                      <input
                        id="lastName"
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                        placeholder="Doe"
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm text-muted-foreground" htmlFor="mobile">Mobile</label>
                    <input
                      id="mobile"
                      type="tel"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                      placeholder="+1 555 123 4567"
                    />
                  </div>
                </>
              )}
              <div className="grid gap-2">
                <label className="text-sm text-muted-foreground" htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                  placeholder="you@example.com"
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm text-muted-foreground" htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Your password"
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              {message && <p className="text-sm text-muted-foreground">{message}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              >
                {loading ? (mode === 'login' ? 'Signing in...' : 'Creating account...') : (mode === 'login' ? 'Sign In' : 'Create account')}
              </button>
            </form>
            <p className="text-xs text-muted-foreground mt-3">Note: For testing, you can sign in with your own credentials.</p>
          </div>
        </section>
      </main>
    </>
  );
};

export default Auth;
