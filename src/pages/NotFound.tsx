import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <>
      <Helmet>
        <title>Page Not Found | Wakeman Capital</title>
        <meta name="description" content="404 page not found — Wakeman Capital." />
        <link rel="canonical" href="/404" />
      </Helmet>
      <main className="min-h-screen bg-background">
        <section className="max-w-7xl mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">Page Not Found</h1>
          <p className="text-muted-foreground mb-8">The page you’re looking for doesn’t exist.</p>
          <Link to="/" className="text-primary underline">Go back home</Link>
        </section>
      </main>
    </>
  );
};

export default NotFound;
