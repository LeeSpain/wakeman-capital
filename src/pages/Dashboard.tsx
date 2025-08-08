import React from 'react';
import { Helmet } from 'react-helmet-async';
import Dashboard from '../components/Dashboard';

const DashboardPage = () => {
  return (
    <>
      <Helmet>
        <title>Dashboard | Wakeman Capital</title>
        <meta name="description" content="Live trading dashboard with trades, signals, and market trends." />
        <link rel="canonical" href="/dashboard" />
      </Helmet>
      
      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <Dashboard />
        </div>
      </main>
    </>
  );
};

export default DashboardPage;