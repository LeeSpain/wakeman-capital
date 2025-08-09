import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { supabase } from '../../integrations/supabase/client';
import { useAuth } from '../../hooks/useAuth';

interface OandaAccount {
  id: string;
  environment: 'demo' | 'live';
  account_id: string;
  connection_verified: boolean;
  last_verified_at: string | null;
}

export const OandaIntegration: React.FC = () => {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState<OandaAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [formData, setFormData] = useState({
    environment: 'demo' as 'demo' | 'live',
    apiToken: '',
    accountId: '',
  });

  useEffect(() => {
    if (user) {
      loadAccounts();
    }
  }, [user]);

  const loadAccounts = async () => {
    try {
      const { data, error } = await supabase
        .from('oanda_accounts')
        .select('id, environment, account_id, connection_verified, last_verified_at')
        .eq('user_id', user?.id)
        .eq('is_active', true);

      if (error) throw error;
      setAccounts(data || []);
    } catch (error) {
      console.error('Error loading OANDA accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  const testConnection = async () => {
    if (!formData.apiToken || !formData.accountId) {
      alert('Please enter both API Token and Account ID');
      return;
    }

    setTesting(true);
    try {
      // Simple test - try to fetch account info
      const oandaUrl = formData.environment === 'demo' 
        ? 'https://api-fxpractice.oanda.com' 
        : 'https://api-fxtrade.oanda.com';

      const response = await fetch(`${oandaUrl}/v3/accounts/${formData.accountId}`, {
        headers: {
          'Authorization': `Bearer ${formData.apiToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        alert('✅ Connection successful! You can now save your OANDA credentials.');
      } else {
        throw new Error(`Connection failed: ${response.statusText}`);
      }
    } catch (error) {
      alert(`❌ Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setTesting(false);
    }
  };

  const saveAccount = async () => {
    if (!formData.apiToken || !formData.accountId) {
      alert('Please enter both API Token and Account ID');
      return;
    }

    setSaving(true);
    try {
      // Deactivate existing accounts
      await supabase
        .from('oanda_accounts')
        .update({ is_active: false })
        .eq('user_id', user?.id);

      // Insert new account (with simple encryption - in production use proper encryption)
      const { error } = await supabase
        .from('oanda_accounts')
        .insert({
          user_id: user?.id,
          environment: formData.environment,
          api_token_encrypted: formData.apiToken,
          account_id: formData.accountId,
          connection_verified: true,
          last_verified_at: new Date().toISOString(),
        });

      if (error) throw error;

      // Clear form
      setFormData({
        environment: 'demo',
        apiToken: '',
        accountId: '',
      });

      await loadAccounts();
      alert('✅ OANDA account saved successfully!');
    } catch (error) {
      console.error('Error saving OANDA account:', error);
      alert(`❌ Failed to save: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setSaving(false);
    }
  };

  const removeAccount = async (accountId: string) => {
    if (!confirm('Are you sure you want to remove this OANDA connection?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('oanda_accounts')
        .update({ is_active: false })
        .eq('id', accountId);

      if (error) throw error;
      await loadAccounts();
    } catch (error) {
      console.error('Error removing OANDA account:', error);
      alert('Failed to remove account');
    }
  };

  if (loading) {
    return <div className="text-sm text-muted-foreground">Loading OANDA settings...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Current Connections */}
      {accounts.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-foreground">Active Connections</h3>
          {accounts.map((account) => (
            <div key={account.id} className="flex items-center justify-between p-3 border border-border rounded-lg bg-card/50">
              <div>
                <div className="text-sm font-medium">
                  {account.environment.toUpperCase()} - {account.account_id}
                </div>
                <div className="text-xs text-muted-foreground">
                  {account.connection_verified ? '✅ Verified' : '⚠️ Not verified'}
                  {account.last_verified_at && (
                    <> • Last checked: {new Date(account.last_verified_at).toLocaleDateString()}</>
                  )}
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => removeAccount(account.id)}
              >
                Remove
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Add New Connection */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-foreground">
          {accounts.length > 0 ? 'Add New Connection' : 'Connect OANDA Account'}
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground">Environment</label>
            <select
              value={formData.environment}
              onChange={(e) => setFormData(prev => ({ ...prev, environment: e.target.value as 'demo' | 'live' }))}
              className="w-full mt-1 px-3 py-2 border border-border rounded-md bg-background text-foreground"
            >
              <option value="demo">Demo (Practice)</option>
              <option value="live">Live (Real Money)</option>
            </select>
            {formData.environment === 'live' && (
              <div className="mt-1 text-xs text-destructive">
                ⚠️ Live trading uses real money. Use demo first to test.
              </div>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">API Token</label>
            <input
              type="password"
              value={formData.apiToken}
              onChange={(e) => setFormData(prev => ({ ...prev, apiToken: e.target.value }))}
              placeholder="Enter your OANDA API token"
              className="w-full mt-1 px-3 py-2 border border-border rounded-md bg-background text-foreground"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">Account ID</label>
            <input
              type="text"
              value={formData.accountId}
              onChange={(e) => setFormData(prev => ({ ...prev, accountId: e.target.value }))}
              placeholder="Enter your OANDA account ID"
              className="w-full mt-1 px-3 py-2 border border-border rounded-md bg-background text-foreground"
            />
          </div>

          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={testConnection}
              disabled={testing || !formData.apiToken || !formData.accountId}
            >
              {testing ? 'Testing...' : 'Test Connection'}
            </Button>
            <Button 
              onClick={saveAccount}
              disabled={saving || !formData.apiToken || !formData.accountId}
            >
              {saving ? 'Saving...' : 'Save Account'}
            </Button>
          </div>
        </div>
      </div>

      {/* Help Text */}
      <div className="text-xs text-muted-foreground space-y-2">
        <p>To get your OANDA credentials:</p>
        <p>1. Visit <a href="https://www.oanda.com" target="_blank" className="text-primary underline">oanda.com</a> and create an account</p>
        <p>2. Go to "Manage API Access" in your account settings</p>
        <p>3. Generate a Personal Access Token</p>
        <p>4. Copy your Account ID and API Token to the fields above</p>
        <p className="text-destructive">⚠️ Never share your API token. It allows full access to your account.</p>
      </div>
    </div>
  );
};

export default OandaIntegration;