import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../integrations/supabase/client';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/use-toast';

const Auth: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [showPayment, setShowPayment] = useState(false);

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
        setLoading(false);
        setShowPayment(true);
        setMessage('Account created successfully! Start your monthly subscription to access all features.');
      } else {
        setLoading(false);
        setMessage('Check your email to confirm your account, then start your subscription to access all features.');
      }
    }
  };

  const handlePayment = async () => {
    setPaymentLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: {
          amount: 2999, // $29.99 in cents for monthly subscription
          description: 'Wakeman Capital Monthly Subscription'
        }
      });

      if (error) {
        console.error('Payment error:', error);
        setError('Failed to initiate payment. Please try again.');
        setPaymentLoading(false);
        return;
      }

      if (data?.url) {
        // Open Stripe checkout in a new tab
        window.open(data.url, '_blank');
        toast({
          title: "Payment Processing",
          description: "Complete your payment in the new tab to access all features.",
        });
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError('Failed to initiate payment. Please try again.');
    } finally {
      setPaymentLoading(false);
    }
  };

  if (showPayment) {
    return (
      <>
        <Helmet>
          <title>Complete Your Registration — Wakeman Capital</title>
          <meta name="description" content="Complete your registration with a one-time payment to access premium trading insights." />
          <link rel="canonical" href="/auth" />
        </Helmet>
        <main className="min-h-[calc(100vh-4rem-4rem)] bg-background flex items-center">
          <section className="max-w-7xl mx-auto px-4 w-full">
            <div className="mx-auto max-w-lg rounded-xl border border-border bg-card p-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎉</span>
                </div>
                <h1 className="text-2xl font-bold text-card-foreground mb-2">Complete Your Subscription!</h1>
                <p className="text-muted-foreground">
                  Your account has been created successfully. Complete your subscription to unlock:
                </p>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/20">
                  <span className="text-primary">✓</span>
                  <span className="text-sm">Real-time market signals and alerts</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/20">
                  <span className="text-primary">✓</span>
                  <span className="text-sm">SMC-aligned trading opportunities</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/20">
                  <span className="text-primary">✓</span>
                  <span className="text-sm">Advanced analytics and backtesting</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/20">
                  <span className="text-primary">✓</span>
                  <span className="text-sm">Paper trading and journal tools</span>
                </div>
              </div>

              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-1">$29.99/month</div>
                  <div className="text-sm text-muted-foreground">Monthly subscription • 10% profit share</div>
                </div>
              </div>

              {error && <p className="text-sm text-destructive mb-4 p-3 bg-destructive/10 rounded-lg">{error}</p>}
              
              <button
                onClick={handlePayment}
                disabled={paymentLoading}
                className="w-full px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 font-medium mb-4"
              >
                {paymentLoading ? 'Processing...' : 'Start Monthly Subscription'}
              </button>

              <div className="text-center">
                <button
                  onClick={() => setShowPayment(false)}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  ← Back to sign up
                </button>
              </div>

              <div className="mt-6 pt-4 border-t border-border text-center">
                <p className="text-xs text-muted-foreground">
                  Secure payment powered by Stripe • Monthly billing • 10% profit share • Cancel anytime
                </p>
              </div>
            </div>
          </section>
        </main>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{mode === 'login' ? 'Welcome Back' : 'Join Wakeman Capital'} — AI Market Intelligence</title>
        <meta name="description" content="Access your Wakeman Capital account or join thousands of traders using AI-powered market intelligence." />
        <link rel="canonical" href="/auth" />
      </Helmet>
      <main className="min-h-[calc(100vh-4rem-4rem)] bg-background flex items-center">
        <section className="max-w-7xl mx-auto px-4 w-full">
          <div className="mx-auto max-w-lg rounded-xl border border-border bg-card p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📈</span>
              </div>
              <h1 className="text-3xl font-bold text-card-foreground mb-2">
                {mode === 'login' ? 'Welcome Back!' : 'Join Wakeman Capital'}
              </h1>
              <p className="text-muted-foreground">
                {mode === 'login' 
                  ? 'Sign in to access your trading dashboard and continue your profitable journey.' 
                  : 'Join thousands of traders using AI-powered market intelligence to maximize profits.'
                }
              </p>
            </div>

            {mode === 'signup' && (
              <div className="mb-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                <h3 className="font-semibold text-foreground mb-2">🎯 What You'll Get:</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Real-time SMC trading signals</li>
                  <li>• AI-powered market analysis</li>
                  <li>• Advanced backtesting tools</li>
                  <li>• Paper trading & journal features</li>
                </ul>
                <div className="mt-3 text-center">
                  <span className="inline-flex items-center gap-2 text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                    💰 $29.99/month + 10% profit share
                  </span>
                </div>
              </div>
            )}
            
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setMode('login')}
                className={`flex-1 px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                  mode === 'login' 
                    ? 'bg-primary text-primary-foreground border-transparent' 
                    : 'border-border hover:bg-muted text-muted-foreground'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setMode('signup')}
                className={`flex-1 px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                  mode === 'signup' 
                    ? 'bg-primary text-primary-foreground border-transparent' 
                    : 'border-border hover:bg-muted text-muted-foreground'
                }`}
              >
                Join Now
              </button>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              {mode === 'signup' && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground" htmlFor="firstName">
                        First Name *
                      </label>
                      <input
                        id="firstName"
                        type="text"
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring transition-colors"
                        placeholder="John"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground" htmlFor="lastName">
                        Last Name *
                      </label>
                      <input
                        id="lastName"
                        type="text"
                        required
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring transition-colors"
                        placeholder="Doe"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground" htmlFor="mobile">
                      Mobile Number
                    </label>
                    <input
                      id="mobile"
                      type="tel"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring transition-colors"
                      placeholder="+1 555 123 4567"
                    />
                  </div>
                </>
              )}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground" htmlFor="email">
                  Email Address *
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring transition-colors"
                  placeholder="you@example.com"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground" htmlFor="password">
                  Password *
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring transition-colors"
                  placeholder={mode === 'login' ? 'Enter your password' : 'Choose a strong password'}
                />
              </div>
              
              {error && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}
              
              {message && (
                <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
                  <p className="text-sm text-foreground">{message}</p>
                </div>
              )}
              
              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 font-medium text-base transition-colors"
              >
                {loading 
                  ? (mode === 'login' ? 'Signing you in...' : 'Creating your account...') 
                  : (mode === 'login' ? 'Sign In' : 'Create Account & Continue')
                }
              </button>
            </form>

            {mode === 'signup' && (
              <div className="mt-6 pt-4 border-t border-border text-center">
                <p className="text-xs text-muted-foreground">
                  By creating an account, you agree to our Terms of Service and Privacy Policy.
                  <br />
                  Monthly subscription will be processed securely via Stripe after account creation.
                </p>
              </div>
            )}

            {mode === 'login' && (
              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Don't have an account?{' '}
                  <button
                    onClick={() => setMode('signup')}
                    className="text-primary hover:underline font-medium"
                  >
                    Join Wakeman Capital
                  </button>
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
};

export default Auth;