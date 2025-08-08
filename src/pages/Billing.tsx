import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../hooks/useAuth';
import PlanCard from '../components/billing/PlanCard';
import SignInCard from '../components/settings/SignInCard';

const Billing = () => {
  const { user } = useAuth();

  const notifySetup = () => {
    alert('Stripe not connected yet. Add your Stripe Secret Key to enable checkout.');
  };

  return (
    <>
      <Helmet>
        <title>Billing | Wakeman Capital</title>
        <meta name="description" content="Manage billing, subscriptions, and invoices for Wakeman Capital." />
        <link rel="canonical" href="/billing" />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'Wakeman Capital',
          url: window.location.origin + '/billing',
          makesOffer: [
            { '@type': 'Offer', name: 'Basic Plan', priceCurrency: 'USD', price: '7.99', availability: 'https://schema.org/PreOrder' },
            { '@type': 'Offer', name: 'Pro Plan', priceCurrency: 'USD', price: '19.99', availability: 'https://schema.org/PreOrder' }
          ]
        })}</script>
      </Helmet>
      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Billing</h1>
            <p className="text-muted-foreground">Choose a plan and manage your subscription.</p>
          </header>

          {!user ? (
            <SignInCard />
          ) : (
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6" aria-label="Plans">
              <PlanCard
                title="Basic"
                price="$7.99"
                features={[
                  'Core analytics access',
                  'Email alerts',
                  'Community support',
                ]}
                cta="Start Basic"
                onClick={notifySetup}
                disabled
              />
              <PlanCard
                title="Pro"
                price="$19.99"
                features={[
                  'All Basic features',
                  'Advanced signals + trends',
                  'AI Coach priority access',
                ]}
                cta="Upgrade to Pro"
                onClick={notifySetup}
                disabled
              />
            </section>
          )}

          <section className="mt-8 p-6 border border-border rounded-lg bg-card">
            <h2 className="text-xl font-semibold text-foreground mb-2">Setup required</h2>
            <p className="text-sm text-muted-foreground">Stripe is not connected. Add your Stripe Secret Key to enable checkout and manage subscriptions.</p>
          </section>
        </div>
      </main>
    </>
  );
};

export default Billing;

