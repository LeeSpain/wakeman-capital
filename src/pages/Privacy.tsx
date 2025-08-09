import React from 'react';
import { Helmet } from 'react-helmet-async';

const Privacy: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Privacy Policy | Wakeman Capital</title>
        <meta name="description" content="Privacy Policy for Wakeman Capital." />
        <link rel="canonical" href="/privacy-policy" />
      </Helmet>
      <main className="min-h-screen bg-background">
        <div className="max-w-3xl mx-auto px-4 py-10">
          <h1 className="text-3xl font-bold text-foreground mb-6">Privacy Policy</h1>
          <section className="prose prose-invert max-w-none text-card-foreground/90">
            <p>We value your privacy. This page explains what data we collect, how we use it, and your rights.</p>
            <h2>Information We Collect</h2>
            <p>Account information, usage data, and data necessary to provide our services.</p>
            <h2>How We Use Information</h2>
            <p>To operate the app, improve features, and provide customer support.</p>
            <h2>Contact</h2>
            <p>For privacy inquiries, contact support@wakemancapital.com.</p>
          </section>
        </div>
      </main>
    </>
  );
};

export default Privacy;
