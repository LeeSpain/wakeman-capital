import React, { useMemo, useState } from 'react';
import { useProfile } from '../../hooks/useProfile';
import { Button } from '../ui/button';

interface Props {
  userId: string;
}

const currencies = ['USD', 'EUR', 'GBP', 'AUD', 'JPY', 'CAD'];

export const ProfileForm: React.FC<Props> = ({ userId }) => {
  const { profile, loading, error, updateProfile } = useProfile(userId);
  const [firstName, setFirstName] = useState<string>(profile?.first_name || '');
  const [lastName, setLastName] = useState<string>(profile?.last_name || '');
  const [mobile, setMobile] = useState<string>(profile?.mobile || '');
  const [displayName, setDisplayName] = useState<string>(profile?.display_name || '');
  const [currency, setCurrency] = useState<string>(profile?.preferred_currency || 'AUD');
  const [saving, setSaving] = useState(false);
  const canSave = useMemo(() => !saving, [saving]);

  React.useEffect(() => {
    if (profile) {
      setFirstName(profile.first_name || '');
      setLastName(profile.last_name || '');
      setMobile(profile.mobile || '');
      setDisplayName(profile.display_name || '');
      setCurrency(profile.preferred_currency || 'AUD');
    }
  }, [profile]);

  const onSave = async () => {
    if (!canSave) return;
    setSaving(true);
    const computedDisplay = (displayName || `${firstName} ${lastName}`).trim();
    const { error } = await updateProfile({
      display_name: computedDisplay || null,
      preferred_currency: currency,
      first_name: firstName.trim() || null,
      last_name: lastName.trim() || null,
      mobile: mobile.trim() || null,
    });
    setSaving(false);
    if (error) alert('Failed to save: ' + error.message);
    else alert('Profile updated');
  };

  if (loading) return <p className="text-muted-foreground">Loading profile…</p>;
  if (error) return <p className="text-destructive">{error}</p>;

  return (
    <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); onSave(); }}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-muted-foreground mb-1">First name</label>
          <input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2"
            placeholder="John"
          />
        </div>
        <div>
          <label className="block text-sm text-muted-foreground mb-1">Surname</label>
          <input
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2"
            placeholder="Doe"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm text-muted-foreground mb-1">Mobile</label>
        <input
          type="tel"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          className="w-full rounded-md border border-input bg-background px-3 py-2"
          placeholder="+1 555 123 4567"
        />
      </div>

      <div>
        <label className="block text-sm text-muted-foreground mb-1">Display name (optional)</label>
        <input
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className="w-full rounded-md border border-input bg-background px-3 py-2"
          placeholder="Your public name"
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
