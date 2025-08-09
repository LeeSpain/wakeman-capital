import React from 'react';
import { Helmet } from 'react-helmet-async';

const Terms: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Terms of Service | Wakeman Capital</title>
        <meta name="description" content="Terms of Service for Wakeman Capital." />
        <link rel="canonical" href="/terms" />
      </Helmet>
      <main className="min-h-screen bg-background">
        <div className="max-w-3xl mx-auto px-4 py-10">
          <h1 className="text-3xl font-bold text-foreground mb-6">Terms of Service</h1>
          <section className="prose prose-invert max-w-none text-card-foreground/90">
            <p>By using our app, you agree to these terms. Please read them carefully.</p>
            <h2>Use of Service</h2>
            <p>Do not misuse our services. You may use our services only as permitted by law.</p>
            <h2>Subscriptions & Payments</h2>
            <p>Subscriptions renew automatically until canceled. Manage your plan in the billing portal.</p>
          </section>
        </div>
      </main>
    </>
  );
};

export default Terms;
