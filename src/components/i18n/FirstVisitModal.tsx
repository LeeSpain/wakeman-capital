import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import i18n from '../../i18n';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../integrations/supabase/client';

const regions = ['US', 'EU', 'UK', 'AU', 'JP', 'CA'];
const currencies = ['USD', 'EUR', 'GBP', 'AUD', 'JPY', 'CAD'];
const languages = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
  { code: 'fr', label: 'Français' },
  { code: 'de', label: 'Deutsch' },
  { code: 'it', label: 'Italiano' },
  { code: 'pt', label: 'Português' },
  { code: 'pt-BR', label: 'Português (Brasil)' },
  { code: 'zh-CN', label: '简体中文' },
  { code: 'ja', label: '日本語' },
  { code: 'ko', label: '한국어' },
  { code: 'ar', label: 'العربية' },
  { code: 'hi', label: 'हिन्दी' },
  { code: 'ru', label: 'Русский' },
];

const FirstVisitModal: React.FC = () => {
  const { user } = useAuth();
  const [open, setOpen] = React.useState(false);
  const [lang, setLang] = React.useState<string>(localStorage.getItem('app_language') || (i18n.language || 'en'));
  const [region, setRegion] = React.useState<string>(localStorage.getItem('app_region') || 'US');
  const [currency, setCurrency] = React.useState<string>(localStorage.getItem('app_currency') || 'AUD');

  React.useEffect(() => {
    const confirmed = localStorage.getItem('prefs_confirmed');
    if (!confirmed) setOpen(true);
  }, []);

  const onSave = async () => {
    localStorage.setItem('app_language', lang);
    localStorage.setItem('app_region', region);
    localStorage.setItem('app_currency', currency);
    localStorage.setItem('prefs_confirmed', '1');
    i18n.changeLanguage(lang);

    if (user) {
      await supabase.from('profiles').upsert({
        id: user.id,
        preferred_language: lang,
        region,
        preferred_currency: currency,
      }).select().single();
    }
    setOpen(false);
  };

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{i18n.t('modal.title')}</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground mb-4">{i18n.t('modal.intro')}</p>

        <div className="space-y-3">
          <div>
            <label className="block text-sm text-muted-foreground mb-1">{i18n.t('common.language')}</label>
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2"
            >
              {languages.map(l => <option value={l.code} key={l.code}>{l.label}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm text-muted-foreground mb-1">{i18n.t('common.region')}</label>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2"
            >
              {regions.map(r => <option value={r} key={r}>{r}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm text-muted-foreground mb-1">{i18n.t('common.currency')}</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2"
            >
              {currencies.map(c => <option value={c} key={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <Button onClick={onSave}>{i18n.t('common.continue')}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FirstVisitModal;
