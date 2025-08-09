import React, { useMemo, useState } from 'react';
import { supabase } from '../../integrations/supabase/client';
import { Button } from '../ui/button';
import { useTranslation } from 'react-i18next';

export const SignInCard: React.FC = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const canSend = useMemo(() => email.includes('@') && !loading, [email, loading]);

  const sendMagicLink = async () => {
    if (!canSend) return;
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: window.location.origin } });
    setLoading(false);
    if (error) alert(error.message);
    else setSent(true);
  };

  return (
    <div className="p-6 border border-border rounded-lg bg-card">
      <h3 className="text-lg font-semibold text-foreground mb-2">{t('auth.signInTitle')}</h3>
      <p className="text-sm text-muted-foreground mb-4">{t('auth.signInDesc')}</p>
      {sent ? (
        <p className="text-sm text-foreground">{t('auth.checkInbox')}</p>
      ) : (
        <div className="flex items-center gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('auth.emailPlaceholder')}
            className="flex-1 rounded-md border border-input bg-background px-3 py-2"
          />
          <Button onClick={sendMagicLink} disabled={!canSend}>{loading ? t('auth.sending') : t('auth.sendLink')}</Button>
        </div>
      )}
    </div>
  );
};

export default SignInCard;
