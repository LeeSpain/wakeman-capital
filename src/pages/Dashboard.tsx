import React from 'react';
import { Helmet } from 'react-helmet-async';
import Dashboard from '../components/Dashboard';

const DashboardPage = () => {
  return (
    <>
      <Helmet>
        <title>Trading Dashboard | Trend Pulse</title>
        <meta name="description" content="Access your personalized trading dashboard with real-time market data, portfolio analytics, and AI-powered insights." />
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