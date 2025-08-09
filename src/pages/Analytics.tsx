import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import TrendPulse from '../components/TrendPulse';

const Analytics = () => {
  const { t } = useTranslation();
  return (
    <>
      <Helmet>
        <title>{t('analytics.seoTitle')}</title>
        <meta name="description" content={t('analytics.seoDescription')} />
      </Helmet>
      
      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">{t('analytics.pageTitle')}</h1>
            <p className="text-muted-foreground">{t('analytics.pageSubtitle')}</p>
          </header>
          <TrendPulse />
        </div>
      </main>
    </>
  );
};

export default Analytics;