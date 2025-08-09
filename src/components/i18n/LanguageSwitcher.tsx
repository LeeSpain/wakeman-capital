import React from 'react';
import i18n from '../../i18n';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../integrations/supabase/client';

const languages = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
];

const LanguageSwitcher: React.FC = () => {
  const { user } = useAuth();
  const current = i18n.language || 'en';

  const onChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lang = e.target.value;
    i18n.changeLanguage(lang);
    localStorage.setItem('app_language', lang);

    if (user) {
      // Persist preference to profile
      await supabase.from('profiles').upsert({ id: user.id, preferred_language: lang }).select().single();
    }
  };

  return (
    <select
      aria-label="Change language"
      value={current}
      onChange={onChange}
      className="px-2 py-1 rounded-md border border-border bg-card text-sm"
    >
      {languages.map(l => (
        <option key={l.code} value={l.code}>{l.label}</option>
      ))}
    </select>
  );
};

export default LanguageSwitcher;
