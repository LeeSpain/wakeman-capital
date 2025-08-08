import React from 'react';
import { Helmet } from 'react-helmet-async';

const Settings = () => (
  <>
    <Helmet>
      <title>Settings | Trend Pulse</title>
      <meta name="description" content="Manage your account and application settings." />
      <link rel="canonical" href="/settings" />
    </Helmet>
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
          <p className="text-muted-foreground">Configure your preferences and account.</p>
        </header>
        <section className="p-6 border border-border rounded-lg bg-card">
          <p className="text-muted-foreground">Settings UI will be restored here.</p>
        </section>
      </div>
    </main>
  </>
);

export default Settings;
