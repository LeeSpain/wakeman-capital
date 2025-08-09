import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import Dashboard from '../components/Dashboard';
import OpenOandaTrades from '../components/trading/OpenOandaTrades';

const DashboardPage = () => {
  const { t } = useTranslation();
  return (
    <>
      <Helmet>
        <title>{t('dashboard.seoTitle')}</title>
        <meta name="description" content={t('dashboard.seoDescription')} />
        <link rel="canonical" href="/dashboard" />
      </Helmet>
      
      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
          <Dashboard />
          <OpenOandaTrades />
        </div>
      </main>
    </>
  );
};

export default DashboardPage;