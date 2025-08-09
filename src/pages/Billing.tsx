import React, { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../hooks/useAuth';
import PlanCard from '../components/billing/PlanCard';
import SignInCard from '../components/settings/SignInCard';
import { Button } from '../components/ui/button';
import { useSubscription } from '../hooks/useSubscription';

const planConfig = [
  {
    key: 'Basic',
    priceCents: 799, // TODO: update if pricing changes
    features: ['Core analytics access', 'Email alerts', 'Community support'],
  },
  {
    key: 'Pro',
    priceCents: 1999, // TODO: update if pricing changes
    features: ['All Basic features', 'Advanced signals + trends', 'AI Coach priority access'],
  },
];

const formatPrice = (cents: number) => `$${(cents / 100).toFixed(2)}`;

const Billing = () => {
  const { user } = useAuth();
  const { subscribed, subscription_tier, subscription_end, loading, refresh, openCheckout, openPortal } = useSubscription();

  const offersJsonLd = useMemo(() => ({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Wakeman Capital',
    url: window.location.origin + '/billing',
    makesOffer: planConfig.map((p) => ({
      '@type': 'Offer',
      name: `${p.key} Plan`,
      priceCurrency: 'USD',
      price: (p.priceCents / 100).toFixed(2),
      availability: 'https://schema.org/InStock',
    })),
  }), []);

  return (
    <>
      <Helmet>
        <title>Pricing & Billing | Wakeman Capital</title>
        <meta name="description" content="Pricing plans and subscription management for Wakeman Capital." />
        <link rel="canonical" href="/billing" />
        <script type="application/ld+json">{JSON.stringify(offersJsonLd)}</script>
      </Helmet>
      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Pricing & Billing</h1>
            <p className="text-muted-foreground">Choose a plan, subscribe, and manage your membership.</p>
          </header>

          {!user ? (
            <SignInCard />
          ) : (
            <>
              <section className="mb-6 p-6 border border-border rounded-lg bg-card">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">Membership status</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      {loading ? 'Checking subscription…' : (
                        subscribed ? (
                          <>Active: {subscription_tier || 'Premium'}{subscription_end ? ` • renews by ${new Date(subscription_end).toLocaleDateString()}` : ''}</>
                        ) : (
                          <>No active subscription</>
                        )
                      )}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={refresh} aria-label="Refresh subscription status">Refresh</Button>
                    {subscribed && (
                      <Button onClick={openPortal} aria-label="Manage subscription">Manage subscription</Button>
                    )}
                  </div>
                </div>
              </section>

              <section className="grid grid-cols-1 md:grid-cols-2 gap-6" aria-label="Plans">
                {planConfig.map((plan) => {
                  const isCurrent = subscribed && subscription_tier?.toLowerCase().includes(plan.key.toLowerCase());
                  const cta = isCurrent ? 'Manage in Stripe' : (subscribed ? `Switch to ${plan.key}` : `Subscribe to ${plan.key}`);

                  const onClick = async () => {
                    if (isCurrent) return openPortal();
                    await openCheckout(plan.priceCents, `${plan.key} Subscription`);
                    setTimeout(() => refresh(), 1000);
                  };

                  return (
                    <PlanCard
                      key={plan.key}
                      title={plan.key}
                      price={formatPrice(plan.priceCents)}
                      features={plan.features}
                      cta={cta}
                      onClick={onClick}
                    />
                  );
                })}
              </section>
            </>
          )}
        </div>
      </main>
    </>
  );
};

export default Billing;
