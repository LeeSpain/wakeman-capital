import React, { useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';

export const SignInCard: React.FC = () => {
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
      <h3 className="text-lg font-semibold text-foreground mb-2">Sign in to manage your settings</h3>
      <p className="text-sm text-muted-foreground mb-4">We'll email you a secure link to sign in.</p>
      {sent ? (
        <p className="text-sm text-foreground">Check your inbox for the sign-in link.</p>
      ) : (
        <div className="flex items-center gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="flex-1 rounded-md border border-input bg-background px-3 py-2"
          />
          <Button onClick={sendMagicLink} disabled={!canSend}>{loading ? 'Sending…' : 'Send link'}</Button>
        </div>
      )}
    </div>
  );
};

export default SignInCard;
