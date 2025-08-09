import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';

const PaymentConfirmation: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to dashboard after 10 seconds
    const timer = setTimeout(() => {
      navigate('/dashboard');
    }, 10000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <>
      <Helmet>
        <title>Welcome to Wakeman Capital — Payment Confirmed</title>
        <meta name="description" content="Your subscription is confirmed! Check your email and access your trading dashboard." />
        <link rel="canonical" href="/payment-confirmation" />
      </Helmet>
      
      <main className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10 flex items-center">
        <section className="max-w-4xl mx-auto px-4 w-full">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
              <span className="text-4xl">🎉</span>
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Welcome to <span className="text-primary">Wakeman Capital!</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Your subscription has been confirmed. You're now part of an elite community of professional traders.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Email Confirmation */}
            <div className="bg-card border border-border rounded-2xl p-8 shadow-xl">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📧</span>
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Check Your Email</h2>
                <p className="text-muted-foreground">
                  We've sent you important information to complete your setup
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg">
                  <span className="text-primary flex-shrink-0 mt-1">✓</span>
                  <div>
                    <h3 className="font-semibold text-foreground">Confirm Your Email</h3>
                    <p className="text-sm text-muted-foreground">Click the verification link to activate your account</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg">
                  <span className="text-primary flex-shrink-0 mt-1">✓</span>
                  <div>
                    <h3 className="font-semibold text-foreground">Login Credentials</h3>
                    <p className="text-sm text-muted-foreground">Save your login details for future access</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg">
                  <span className="text-primary flex-shrink-0 mt-1">✓</span>
                  <div>
                    <h3 className="font-semibold text-foreground">Getting Started Guide</h3>
                    <p className="text-sm text-muted-foreground">Step-by-step instructions to maximize your profits</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                <p className="text-sm text-center text-muted-foreground">
                  <strong>Can't find the email?</strong> Check your spam folder or contact support@wakemancapital.com
                </p>
              </div>
            </div>

            {/* Dashboard Access */}
            <div className="bg-card border border-border rounded-2xl p-8 shadow-xl">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📊</span>
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Access Your Dashboard</h2>
                <p className="text-muted-foreground">
                  Your professional trading platform is ready
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg border border-primary/20">
                  <div>
                    <h3 className="font-semibold text-foreground">Dashboard URL</h3>
                    <p className="text-sm text-primary font-mono">{window.location.origin}/dashboard</p>
                  </div>
                  <span className="text-2xl">🔗</span>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div>
                    <h3 className="font-semibold text-foreground">Subscription Status</h3>
                    <p className="text-sm text-primary font-medium">Active - $29.99/month</p>
                  </div>
                  <span className="text-2xl">✅</span>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div>
                    <h3 className="font-semibold text-foreground">Profit Share</h3>
                    <p className="text-sm text-accent font-medium">10% of your trading profits</p>
                  </div>
                  <span className="text-2xl">💰</span>
                </div>
              </div>

              <button
                onClick={() => navigate('/dashboard')}
                className="w-full mt-6 px-6 py-4 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Access Dashboard Now →
              </button>

              <div className="mt-4 text-center">
                <p className="text-xs text-muted-foreground">
                  Redirecting automatically in <span id="countdown">10</span> seconds...
                </p>
              </div>
            </div>
          </div>

          {/* Success Features */}
          <div className="mt-12 bg-card border border-border rounded-2xl p-8 shadow-xl">
            <h2 className="text-2xl font-bold text-center text-foreground mb-8">
              🚀 What's Next? Start Earning Today!
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl">📊</span>
                </div>
                <h3 className="font-semibold text-foreground mb-2">View Live Signals</h3>
                <p className="text-sm text-muted-foreground">Access real-time SMC trading opportunities</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl">📈</span>
                </div>
                <h3 className="font-semibold text-foreground mb-2">Start Paper Trading</h3>
                <p className="text-sm text-muted-foreground">Practice with virtual funds before going live</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl">💎</span>
                </div>
                <h3 className="font-semibold text-foreground mb-2">Connect OANDA</h3>
                <p className="text-sm text-muted-foreground">Link your broker for automated trading</p>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              Need help? Contact our support team at{' '}
              <a href="mailto:support@wakemancapital.com" className="text-primary hover:underline">
                support@wakemancapital.com
              </a>
            </p>
          </div>
        </section>
      </main>

      <script
        dangerouslySetInnerHTML={{
          __html: `
            let count = 10;
            const countdown = setInterval(() => {
              count--;
              const element = document.getElementById('countdown');
              if (element) element.textContent = count;
              if (count <= 0) clearInterval(countdown);
            }, 1000);
          `
        }}
      />
    </>
  );
};

export default PaymentConfirmation;