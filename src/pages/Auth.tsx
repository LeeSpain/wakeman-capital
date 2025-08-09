import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../integrations/supabase/client';
import { useAuth } from '../hooks/useAuth';
import { useUserRole } from '../hooks/useUserRole';
import { useToast } from '../hooks/use-toast';

const Auth: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [mode, setMode] = useState<'login' | 'signup' | 'reset' | 'update-password'>('login');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [paymentStep, setPaymentStep] = useState<'form' | 'payment' | 'processing'>('form');

  useEffect(() => {
    // Check for password recovery parameters in URL
    const checkRecoveryState = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      
      // Check for recovery type in either URL params or hash
      const isRecovery = urlParams.get('type') === 'recovery' || 
                        hashParams.get('type') === 'recovery' ||
                        window.location.hash.includes('type=recovery');
      
      if (isRecovery) {
        // Validate if we have a valid recovery session
        try {
          const { data: { session }, error } = await supabase.auth.getSession();
          
          if (error) {
            console.error('Recovery session error:', error);
            setError('Password reset link has expired or is invalid. Please request a new one.');
            setMode('reset');
            return;
          }
          
          if (session?.user) {
            // Valid recovery session - show password update form
            setMode('update-password');
            setEmail(session.user.email || '');
            setMessage('Please enter your new password below.');
          } else {
            // No valid session but recovery type detected
            setError('Password reset link has expired. Please request a new one.');
            setMode('reset');
          }
        } catch (err) {
          console.error('Recovery validation error:', err);
          setError('Unable to validate reset link. Please try again.');
          setMode('reset');
        }
      } else if (user && mode !== 'update-password') {
        // Regular user login - redirect to dashboard
        navigate('/dashboard');
      }
    };
    
    checkRecoveryState();
    
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        setMode('update-password');
        setEmail(session?.user?.email || '');
        setMessage('Please enter your new password below.');
        setError(null);
      }
    });
    
    return () => subscription.unsubscribe();
  }, [user, navigate, mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    if (mode === 'reset') {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth`,
      });
      if (error) {
        setLoading(false);
        return setError(error.message);
      }
      setLoading(false);
      setMessage('Password reset link sent to your email!');
      return;
    }

    if (mode === 'update-password') {
      if (newPassword !== confirmPassword) {
        setLoading(false);
        return setError('Passwords do not match');
      }
      if (newPassword.length < 6) {
        setLoading(false);
        return setError('Password must be at least 6 characters');
      }
      
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) {
        setLoading(false);
        return setError(error.message);
      }
      
      setLoading(false);
      toast({
        title: "Password Updated",
        description: "Your password has been successfully updated.",
      });
      navigate('/dashboard');
      return;
    }

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
          access_level: 'premium', // Ensure premium access for all users
          payment_status: 'paid', // Ensure paid status for all users
        });

        // Check if user is admin and grant full access
        const { data: roleData } = await supabase.rpc('has_role', {
          _user_id: u.id,
          _role: 'admin'
        });

        if (roleData) {
          toast({
            title: "Admin Access Granted",
            description: "Welcome back! You have full platform access.",
          });
        }
      }
      setLoading(false);
      navigate('/dashboard');
    } else if (mode === 'signup') {
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
        setPaymentStep('payment');
        setMessage('Account created successfully! Complete your subscription to access all features.');
      } else {
        setLoading(false);
        setPaymentStep('payment');
        setMessage('Check your email to confirm your account, then complete your subscription to access all features.');
      }
    }
  };

  const handlePayment = async () => {
    setPaymentLoading(true);
    setError(null);
    setPaymentStep('processing');

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
        setPaymentStep('payment');
        setPaymentLoading(false);
        return;
      }

      if (data?.url) {
        // Redirect to Stripe checkout
        window.location.href = data.url;
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError('Failed to initiate payment. Please try again.');
      setPaymentStep('payment');
    } finally {
      setPaymentLoading(false);
    }
  };

  // Payment step rendering
  if (paymentStep === 'payment' || paymentStep === 'processing') {
    return (
      <>
        <Helmet>
          <title>Complete Your Subscription — Wakeman Capital</title>
          <meta name="description" content="Complete your monthly subscription to access professional trading insights and earn 10% profit share." />
          <link rel="canonical" href="/auth" />
        </Helmet>
        <main className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-primary/5 flex items-center">
          <section className="max-w-4xl mx-auto px-4 w-full">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              {/* Left side - Features & Benefits */}
              <div className="space-y-6">
                <div className="text-center lg:text-left">
                  <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-4">
                    🚀 Professional Trading Platform
                  </div>
                  <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                    Join Elite Traders at<br />
                    <span className="text-primary">Wakeman Capital</span>
                  </h1>
                  <p className="text-lg text-muted-foreground">
                    Access institutional-grade market intelligence and earn alongside our expert traders
                  </p>
                </div>

                <div className="grid gap-4">
                  <div className="flex items-start gap-4 p-4 rounded-xl bg-card border border-border">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-lg">📊</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Real-Time SMC Signals</h3>
                      <p className="text-sm text-muted-foreground">Get instant notifications for high-probability trades based on Smart Money Concepts</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 p-4 rounded-xl bg-card border border-border">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-lg">🧠</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">AI-Powered Analytics</h3>
                      <p className="text-sm text-muted-foreground">Advanced backtesting and market structure analysis using artificial intelligence</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 p-4 rounded-xl bg-card border border-border">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-lg">💰</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Profit Share Program</h3>
                      <p className="text-sm text-muted-foreground">Earn 10% of your trading profits - we succeed when you succeed</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-primary">$29.99/month</div>
                      <div className="text-sm text-muted-foreground">+ 10% profit share</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-foreground">Cancel Anytime</div>
                      <div className="text-xs text-muted-foreground">No long-term commitment</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right side - Payment Form */}
              <div className="bg-card border border-border rounded-2xl p-8 shadow-xl">
                {paymentStep === 'processing' ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                      <span className="text-2xl">⏳</span>
                    </div>
                    <h2 className="text-xl font-bold text-foreground mb-2">Redirecting to Payment...</h2>
                    <p className="text-muted-foreground mb-4">
                      Please wait while we redirect you to our secure payment portal
                    </p>
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="text-center mb-6">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-xl">🔒</span>
                      </div>
                      <h2 className="text-xl font-bold text-foreground mb-2">Secure Subscription</h2>
                      <p className="text-sm text-muted-foreground">
                        {message || "Complete your subscription to unlock all premium features"}
                      </p>
                    </div>

                    {error && (
                      <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                        <p className="text-sm text-destructive">{error}</p>
                      </div>
                    )}

                    <div className="space-y-4 mb-6">
                      <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <span className="text-sm font-medium">Monthly Subscription</span>
                        <span className="font-bold">$29.99</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <span className="text-sm font-medium">Profit Share Rate</span>
                        <span className="font-bold text-primary">10%</span>
                      </div>
                    </div>

                    <button
                      onClick={handlePayment}
                      disabled={paymentLoading}
                      className="w-full px-6 py-4 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      {paymentLoading ? (
                        <span className="flex items-center justify-center gap-2">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
                          Processing...
                        </span>
                      ) : (
                        'Complete Subscription →'
                      )}
                    </button>

                    <div className="text-center mt-4">
                      <button
                        onClick={() => setPaymentStep('form')}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                        disabled={paymentLoading}
                      >
                        ← Back to account details
                      </button>
                    </div>

                    <div className="mt-6 pt-4 border-t border-border text-center">
                      <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                        <span>🔒 SSL Secured</span>
                        <span>💳 Stripe Powered</span>
                        <span>🔄 Cancel Anytime</span>
                      </div>
                    </div>
                  </>
                )}
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
      <main className="min-h-[calc(100vh-4rem-4rem)] bg-gradient-to-br from-background via-muted/20 to-primary/5 flex items-center">
        <section className="max-w-7xl mx-auto px-4 w-full">
          <div className="mx-auto max-w-lg rounded-2xl border border-border bg-card p-8 shadow-xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📈</span>
              </div>
              <h1 className="text-3xl font-bold text-card-foreground mb-2">
                {mode === 'login' ? 'Welcome Back!' : mode === 'reset' ? 'Reset Password' : mode === 'update-password' ? 'Set New Password' : 'Join Wakeman Capital'}
              </h1>
              <p className="text-muted-foreground">
                {mode === 'login' 
                  ? 'Sign in to access your trading dashboard and continue your profitable journey.' 
                  : mode === 'reset'
                  ? 'Enter your email address and we\'ll send you a link to reset your password.'
                  : mode === 'update-password'
                  ? 'Please enter your new password below.'
                  : 'Join thousands of traders using AI-powered market intelligence to maximize profits.'
                }
              </p>
            </div>

            {mode === 'signup' && (
              <div className="mb-6 p-4 bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-xl">
                <h3 className="font-semibold text-foreground mb-3 text-center">🎯 Premium Features Included:</h3>
                <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <span className="text-primary">•</span>
                    <span>Live SMC signals</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-primary">•</span>
                    <span>AI market analysis</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-primary">•</span>
                    <span>Advanced backtesting</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-primary">•</span>
                    <span>Paper trading tools</span>
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <div className="inline-flex items-center gap-2 text-lg font-bold text-primary bg-primary/10 px-4 py-2 rounded-full">
                    💰 $29.99/month + 10% profit share
                  </div>
                </div>
              </div>
            )}
            
            {mode !== 'update-password' && (
              <div className="flex gap-1 mb-6">
                <button
                  onClick={() => setMode('login')}
                  className={`flex-1 px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                    mode === 'login' 
                      ? 'bg-primary text-primary-foreground border-transparent' 
                      : 'border-border hover:bg-muted text-muted-foreground'
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => setMode('signup')}
                  className={`flex-1 px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                    mode === 'signup' 
                      ? 'bg-primary text-primary-foreground border-transparent' 
                      : 'border-border hover:bg-muted text-muted-foreground'
                  }`}
                >
                  Join Now
                </button>
                 <button
                   onClick={() => setMode('reset')}
                   className={`flex-1 px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                     mode === 'reset' 
                       ? 'bg-primary text-primary-foreground border-transparent' 
                       : 'border-border hover:bg-muted text-muted-foreground'
                   }`}
                 >
                   Reset
                 </button>
               </div>
             )}

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
              
              {mode === 'update-password' ? (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground" htmlFor="newPassword">
                      New Password *
                    </label>
                    <input
                      id="newPassword"
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring transition-colors"
                      placeholder="Enter your new password"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground" htmlFor="confirmPassword">
                      Confirm New Password *
                    </label>
                    <input
                      id="confirmPassword"
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring transition-colors"
                      placeholder="Confirm your new password"
                    />
                  </div>
                </>
              ) : mode !== 'reset' && (
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
              )}
              
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
                className="w-full px-6 py-4 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                {loading 
                  ? (mode === 'login' ? 'Signing you in...' : mode === 'reset' ? 'Sending reset link...' : mode === 'update-password' ? 'Updating password...' : 'Creating your account...') 
                  : (mode === 'login' ? 'Sign In to Dashboard' : mode === 'reset' ? 'Send Reset Link' : mode === 'update-password' ? 'Update Password' : 'Continue to Subscription →')
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