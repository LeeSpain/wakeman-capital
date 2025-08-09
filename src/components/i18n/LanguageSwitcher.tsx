import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../integrations/supabase/client';

const languages = [
  { code: 'en', label: 'English' },
  { code: 'nl', label: 'Nederlands' },
  { code: 'es', label: 'Español' },
  { code: 'ar', label: 'العربية' },
  { code: 'zh-CN', label: '简体中文' },
];

const LanguageSwitcher: React.FC = () => {
  const { user } = useAuth();
  const { i18n } = useTranslation();
  const current = i18n.language || 'en';

  const onChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lang = e.target.value;
    await i18n.changeLanguage(lang);
    localStorage.setItem('app_language', lang);

    if (user) {
      await supabase
        .from('profiles')
        .upsert({ id: user.id, preferred_language: lang })
        .select()
        .single();
    }
  };

  return (
    <select
      aria-label="Change language"
      value={current}
      onChange={onChange}
      className="px-2 py-1 rounded-md border border-border bg-card text-sm"
    >
      {languages.map((l) => (
        <option key={l.code} value={l.code}>
          {l.label}
        </option>
      ))}
    </select>
  );
};

export default LanguageSwitcher;
