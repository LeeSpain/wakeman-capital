import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../hooks/useAuth';
import ProfileForm from '../components/settings/ProfileForm';
import ThemeSection from '../components/settings/ThemeSection';
import SignInCard from '../components/settings/SignInCard';
import OandaIntegration from '../components/settings/OandaIntegration';
import { supabase } from '../integrations/supabase/client';
import { Button } from '../components/ui/button';

const Settings = () => {
  const { user, loading } = useAuth();

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <>
      <Helmet>
        <title>Settings | Wakeman Capital</title>
        <meta name="description" content="Manage your profile, preferences, and security settings." />
        <link rel="canonical" href="/settings" />
      </Helmet>
      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
            <p className="text-muted-foreground">Update your profile and customize your experience.</p>
          </header>

          {loading ? (
            <p className="text-muted-foreground">Checking your session…</p>
          ) : !user ? (
            <SignInCard />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <section className="lg:col-span-2 p-6 border border-border rounded-lg bg-card">
                <h2 className="text-xl font-semibold text-foreground mb-4">Profile</h2>
                <ProfileForm userId={user.id} />
              </section>

              <aside className="space-y-6">
                <section className="p-6 border border-border rounded-lg bg-card">
                  <h2 className="text-xl font-semibold text-foreground mb-4">OANDA Integration</h2>
                  <OandaIntegration />
                </section>
                <section className="p-6 border border-border rounded-lg bg-card">
                  <h2 className="text-xl font-semibold text-foreground mb-2">Appearance</h2>
                  <ThemeSection />
                </section>
                <section className="p-6 border border-border rounded-lg bg-card">
                  <h2 className="text-xl font-semibold text-foreground mb-2">Session</h2>
                  <p className="text-sm text-muted-foreground mb-3">Signed in as {user.email}</p>
                  <Button variant="secondary" onClick={signOut}>Sign out</Button>
                </section>
              </aside>
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default Settings;
