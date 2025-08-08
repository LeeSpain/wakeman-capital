import React, { useMemo, useState } from 'react';
import { useProfile } from '@/hooks/useProfile';
import { Button } from '@/components/ui/button';

interface Props {
  userId: string;
}

const currencies = ['USD', 'EUR', 'GBP', 'AUD', 'JPY', 'CAD'];

export const ProfileForm: React.FC<Props> = ({ userId }) => {
  const { profile, loading, error, updateProfile } = useProfile(userId);
  const [displayName, setDisplayName] = useState<string>(profile?.display_name || '');
  const [currency, setCurrency] = useState<string>(profile?.preferred_currency || 'AUD');
  const [saving, setSaving] = useState(false);
  const canSave = useMemo(() => displayName.trim().length > 1 && !saving, [displayName, saving]);

  React.useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name || '');
      setCurrency(profile.preferred_currency || 'AUD');
    }
  }, [profile]);

  const onSave = async () => {
    if (!canSave) return;
    setSaving(true);
    const { error } = await updateProfile({ display_name: displayName.trim(), preferred_currency: currency });
    setSaving(false);
    if (error) alert('Failed to save: ' + error.message);
    else alert('Profile updated');
  };

  if (loading) return <p className="text-muted-foreground">Loading profile…</p>;
  if (error) return <p className="text-destructive">{error}</p>;

  return (
    <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); onSave(); }}>
      <div>
        <label className="block text-sm text-muted-foreground mb-1">Display name</label>
        <input
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className="w-full rounded-md border border-input bg-background px-3 py-2"
          placeholder="Your name"
        />
      </div>

      <div>
        <label className="block text-sm text-muted-foreground mb-1">Preferred currency</label>
        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          className="w-full rounded-md border border-input bg-background px-3 py-2"
        >
          {currencies.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <Button type="submit" disabled={!canSave}>{saving ? 'Saving…' : 'Save changes'}</Button>
    </form>
  );
};

export default ProfileForm;
