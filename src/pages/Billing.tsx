import React from 'react';
import { Helmet } from 'react-helmet-async';

const Billing = () => (
  <>
    <Helmet>
      <title>Billing | Trend Pulse</title>
      <meta name="description" content="Manage billing, subscriptions, and invoices." />
      <link rel="canonical" href="/billing" />
    </Helmet>
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Billing</h1>
          <p className="text-muted-foreground">Subscription and payment details.</p>
        </header>
        <section className="p-6 border border-border rounded-lg bg-card">
          <p className="text-muted-foreground">Billing information will be restored here.</p>
        </section>
      </div>
    </main>
  </>
);

export default Billing;
