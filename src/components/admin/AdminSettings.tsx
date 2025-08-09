import React, { useState, useEffect } from 'react';
import { supabase } from '../../integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Settings, Percent, Save, AlertCircle } from 'lucide-react';

interface AdminSettingsData {
  defaultProfitPercentage: number;
  platformFee: number;
  minimumTradeAmount: number;
  enableAutoCalculations: boolean;
  billingFrequency: string;
}

const AdminSettings = () => {
  const [settings, setSettings] = useState<AdminSettingsData>({
    defaultProfitPercentage: 10,
    platformFee: 0,
    minimumTradeAmount: 100,
    enableAutoCalculations: true,
    billingFrequency: 'monthly',
  });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      // In a real implementation, you'd save these to a settings table
      console.log('Saving admin settings:', settings);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = (key: keyof AdminSettingsData, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          <h2 className="text-lg font-medium">Platform Settings</h2>
        </div>
        {saved && (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Settings Saved
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profit & Billing Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Percent className="h-4 w-4" />
              Profit Sharing
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Default Profit Share Percentage
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={settings.defaultProfitPercentage}
                  onChange={(e) => updateSetting('defaultProfitPercentage', Number(e.target.value))}
                  className="w-20 px-3 py-2 border border-border rounded-md bg-background text-foreground"
                />
                <span className="text-sm text-muted-foreground">%</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Default percentage charged on client profits
              </p>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Platform Fee (Fixed)
              </label>
              <div className="flex items-center gap-2">
                <span className="text-sm">$</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={settings.platformFee}
                  onChange={(e) => updateSetting('platformFee', Number(e.target.value))}
                  className="w-24 px-3 py-2 border border-border rounded-md bg-background text-foreground"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Additional fixed fee per transaction (optional)
              </p>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Minimum Trade Amount
              </label>
              <div className="flex items-center gap-2">
                <span className="text-sm">$</span>
                <input
                  type="number"
                  min="0"
                  value={settings.minimumTradeAmount}
                  onChange={(e) => updateSetting('minimumTradeAmount', Number(e.target.value))}
                  className="w-24 px-3 py-2 border border-border rounded-md bg-background text-foreground"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Minimum trade size for profit calculations
              </p>
            </div>
          </CardContent>
        </Card>

        {/* System Settings */}
        <Card>
          <CardHeader>
            <CardTitle>System Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Billing Frequency
              </label>
              <select
                value={settings.billingFrequency}
                onChange={(e) => updateSetting('billingFrequency', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
              >
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">Auto Profit Calculations</div>
                <p className="text-xs text-muted-foreground">
                  Automatically calculate fees when trades close
                </p>
              </div>
              <Button
                variant={settings.enableAutoCalculations ? "default" : "outline"}
                size="sm"
                onClick={() => updateSetting('enableAutoCalculations', !settings.enableAutoCalculations)}
              >
                {settings.enableAutoCalculations ? 'Enabled' : 'Disabled'}
              </Button>
            </div>

            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-yellow-800">
                    Important Notice
                  </div>
                  <p className="text-xs text-yellow-700 mt-1">
                    Changes to profit percentages will only affect new subscriptions. 
                    Existing clients will maintain their current rates.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Danger Zone */}
      <Card className="border-destructive/20">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">Reset All Settings</div>
              <p className="text-xs text-muted-foreground">
                This will reset all platform settings to default values
              </p>
            </div>
            <Button variant="destructive" size="sm">
              Reset Settings
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button 
          onClick={handleSave} 
          disabled={loading}
          className="flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          {loading ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>
    </div>
  );
};

export default AdminSettings;