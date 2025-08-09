import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const MarketingFooter: React.FC = () => {
  const { t } = useTranslation();
  return (
    <footer className="border-t border-border bg-card/50">
      <div className="max-w-7xl mx-auto px-4 py-10 grid md:grid-cols-3 gap-8 text-sm">
        <div>
          <div className="font-bold text-card-foreground mb-2">{t('footer.company')}</div>
          <p className="text-muted-foreground">{t('footer.tagline')}</p>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="font-medium text-card-foreground mb-2">{t('footer.product')}</div>
            <ul className="space-y-1 text-muted-foreground">
              <li><Link to="/trends" className="hover:text-foreground">{t('footer.features')}</Link></li>
              <li><Link to="/billing" className="hover:text-foreground">{t('footer.pricing')}</Link></li>
              <li><Link to="/signal-center" className="hover:text-foreground">{t('footer.signalCenter')}</Link></li>
              <li><Link to="/coach" className="hover:text-foreground">{t('footer.aiCoach')}</Link></li>
            </ul>
          </div>
          <div>
            <div className="font-medium text-card-foreground mb-2">{t('footer.companySection')}</div>
            <ul className="space-y-1 text-muted-foreground">
              <li><Link to="/" className="hover:text-foreground">{t('footer.home')}</Link></li>
              <li><Link to="/dashboard" className="hover:text-foreground">{t('footer.dashboard')}</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-foreground">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-foreground">Terms</Link></li>
              <li><Link to="/risk-disclaimer" className="hover:text-foreground">Risk Disclaimer</Link></li>
            </ul>
          </div>
        </div>
        <div className="md:text-right text-muted-foreground">© {new Date().getFullYear()} {t('footer.company')}. {t('footer.rights')}</div>
      </div>
    </footer>
  );
};

export default MarketingFooter;
