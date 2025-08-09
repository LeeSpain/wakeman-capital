import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Badge } from '../../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Switch } from '../../ui/switch';
import { Zap, Plus, Clock, Users, Settings } from 'lucide-react';
import { supabase } from '../../../integrations/supabase/client';
import { toast } from 'sonner';

interface AutomatedRule {
  id: string;
  name: string;
  trigger_event: string;
  template_id: string;
  is_active: boolean;
  delay_minutes: number;
  conditions: any;
  created_at: string;
  template?: {
    name: string;
    subject: string;
  };
}

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  template_type: string;
}

const AutomatedEmails = () => {
  const [rules, setRules] = useState<AutomatedRule[]>([]);
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newRule, setNewRule] = useState({
    name: '',
    trigger_event: '',
    template_id: '',
    delay_minutes: 0,
    is_active: true
  });

  useEffect(() => {
    fetchRules();
    fetchTemplates();
  }, []);

  const fetchRules = async () => {
    try {
      const { data, error } = await supabase
        .from('automated_email_rules')
        .select(`
          *,
          template:email_templates(name, subject)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching rules:', error);
        toast.error('Failed to load automated email rules');
      } else {
        setRules(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('email_templates')
        .select('id, name, subject, template_type')
        .eq('is_active', true);

      if (error) {
        console.error('Error fetching templates:', error);
      } else {
        setTemplates(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const createRule = async () => {
    try {
      const { error } = await supabase
        .from('automated_email_rules')
        .insert({
          name: newRule.name,
          trigger_event: newRule.trigger_event,
          template_id: newRule.template_id,
          delay_minutes: newRule.delay_minutes,
          is_active: newRule.is_active
        });

      if (error) throw error;

      toast.success('Automated email rule created successfully!');
      setIsDialogOpen(false);
      setNewRule({
        name: '',
        trigger_event: '',
        template_id: '',
        delay_minutes: 0,
        is_active: true
      });
      fetchRules();
    } catch (error) {
      console.error('Error creating rule:', error);
      toast.error('Failed to create automated email rule');
    }
  };

  const toggleRule = async (rule: AutomatedRule) => {
    try {
      const { error } = await supabase
        .from('automated_email_rules')
        .update({ is_active: !rule.is_active })
        .eq('id', rule.id);

      if (error) throw error;

      toast.success(`Rule ${rule.is_active ? 'deactivated' : 'activated'}`);
      fetchRules();
    } catch (error) {
      console.error('Error updating rule:', error);
      toast.error('Failed to update rule');
    }
  };

  const getTriggerEventLabel = (event: string) => {
    switch (event) {
      case 'user_signup': return 'User Signup';
      case 'profit_generated': return 'Profit Generated';
      case 'billing_due': return 'Billing Due';
      case 'subscription_status_change': return 'Subscription Change';
      default: return event;
    }
  };

  const getTriggerEventColor = (event: string) => {
    switch (event) {
      case 'user_signup': return 'bg-green-500';
      case 'profit_generated': return 'bg-blue-500';
      case 'billing_due': return 'bg-orange-500';
      case 'subscription_status_change': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading automated rules...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Automated Email Rules</h3>
          <p className="text-sm text-muted-foreground">Set up triggers to automatically send emails based on client actions</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Rule
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Automated Email Rule</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="rule-name">Rule Name</Label>
                <Input
                  id="rule-name"
                  value={newRule.name}
                  onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                  placeholder="Welcome Email for New Clients"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="trigger-event">Trigger Event</Label>
                <Select
                  value={newRule.trigger_event}
                  onValueChange={(value) => setNewRule({ ...newRule, trigger_event: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select trigger event" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user_signup">User Signup</SelectItem>
                    <SelectItem value="profit_generated">Profit Generated</SelectItem>
                    <SelectItem value="billing_due">Billing Due</SelectItem>
                    <SelectItem value="subscription_status_change">Subscription Status Change</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="template">Email Template</Label>
                <Select
                  value={newRule.template_id}
                  onValueChange={(value) => setNewRule({ ...newRule, template_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select email template" />
                  </SelectTrigger>
                  <SelectContent>
                    {templates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name} ({template.template_type})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="delay">Delay (minutes)</Label>
                <Input
                  id="delay"
                  type="number"
                  value={newRule.delay_minutes}
                  onChange={(e) => setNewRule({ ...newRule, delay_minutes: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                  min="0"
                />
                <p className="text-xs text-muted-foreground">How long to wait before sending the email (0 = immediate)</p>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={newRule.is_active}
                    onCheckedChange={(checked) => setNewRule({ ...newRule, is_active: checked })}
                  />
                  <Label>Active</Label>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={createRule}>
                    Create Rule
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {rules.map((rule) => (
          <Card key={rule.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base">{rule.name}</CardTitle>
                  <CardDescription className="text-sm">
                    {rule.template?.name} - {rule.template?.subject}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={`${getTriggerEventColor(rule.trigger_event)} text-white text-xs`}>
                    {getTriggerEventLabel(rule.trigger_event)}
                  </Badge>
                  <Badge variant={rule.is_active ? "default" : "secondary"}>
                    {rule.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {rule.delay_minutes > 0 && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    Delay: {rule.delay_minutes} minutes
                  </div>
                )}
                <div className="text-xs text-muted-foreground">
                  Created: {new Date(rule.created_at).toLocaleDateString()}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={rule.is_active}
                      onCheckedChange={() => toggleRule(rule)}
                    />
                    <span className="text-sm">{rule.is_active ? 'Active' : 'Inactive'}</span>
                  </div>
                  <Button size="sm" variant="outline">
                    <Settings className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {rules.length === 0 && (
        <Card className="text-center py-8">
          <CardContent>
            <Zap className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No automated rules yet</h3>
            <p className="text-muted-foreground mb-4">Create automated email rules to streamline your client communications</p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Rule
            </Button>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Available Triggers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">User Signup</h4>
              <p className="text-muted-foreground">Triggered when a new user creates an account</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Profit Generated</h4>
              <p className="text-muted-foreground">Triggered when a client generates profit</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Billing Due</h4>
              <p className="text-muted-foreground">Triggered when billing is processed</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Subscription Change</h4>
              <p className="text-muted-foreground">Triggered when subscription status changes</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AutomatedEmails;