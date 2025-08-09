import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Badge } from '../../ui/badge';
import { Mail, CheckCircle } from 'lucide-react';
import { supabase } from '../../../integrations/supabase/client';
import { toast } from 'sonner';

const EmailSettings = () => {
  const [settings, setSettings] = useState({
    sender_email: 'wakemancapitallive@gmail.com',
    sender_name: 'Wakeman Capital'
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchEmailSettings();
  }, []);

  const fetchEmailSettings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('email_settings')
        .select('*')
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching email settings:', error);
        toast.error('Failed to load email settings');
      } else if (data) {
        setSettings({
          sender_email: data.sender_email,
          sender_name: data.sender_name
        });
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('email_settings')
        .upsert({
          sender_email: settings.sender_email,
          sender_name: settings.sender_name
        });

      if (error) {
        console.error('Error saving settings:', error);
        toast.error('Failed to save settings');
      } else {
        toast.success('Email settings saved successfully!');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Configuration
          </CardTitle>
          <CardDescription>
            Configure your Gmail sender details for client communications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sender_email">Sender Email</Label>
              <Input
                id="sender_email"
                type="email"
                value={settings.sender_email}
                onChange={(e) => setSettings({ ...settings, sender_email: e.target.value })}
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sender_name">Sender Name</Label>
              <Input
                id="sender_name"
                value={settings.sender_name}
                onChange={(e) => setSettings({ ...settings, sender_name: e.target.value })}
                disabled={loading}
              />
            </div>
          </div>
          <Button 
            onClick={saveSettings} 
            disabled={saving || loading}
            className="w-full md:w-auto"
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-primary" />
            Email Service Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Resend Email Service</p>
              <p className="text-sm text-muted-foreground">Connected and ready to send emails</p>
            </div>
            <Badge variant="default" className="bg-primary">
              Active
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Email Guidelines</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>• All emails will be sent from <strong>wakemancapitallive@gmail.com</strong></p>
          <p>• Templates support variables like {`{{client_name}}, {{profit_amount}}`}, etc.</p>
          <p>• Automated emails are triggered by client events (signup, profits, billing)</p>
          <p>• Email analytics help track engagement and campaign performance</p>
          <p>• Always test email templates before sending campaigns</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailSettings;