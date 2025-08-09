import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { Badge } from '../../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Send, Plus, Users, Eye, BarChart3 } from 'lucide-react';
import { supabase } from '../../../integrations/supabase/client';
import { toast } from '../../../hooks/use-toast';

interface EmailCampaign {
  id: string;
  name: string;
  subject: string;
  html_content: string;
  text_content?: string;
  recipient_count: number;
  sent_count: number;
  opened_count: number;
  clicked_count: number;
  status: string;
  sent_at?: string;
  created_at: string;
}

const EmailCampaigns = () => {
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newCampaign, setNewCampaign] = useState({
    name: '',
    subject: '',
    html_content: '',
    text_content: ''
  });

  useEffect(() => {
    fetchCampaigns();
    fetchClients();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const { data, error } = await supabase
        .from('email_campaigns')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching campaigns:', error);
        toast({
          title: "Error",
          description: "Failed to load email campaigns",
          variant: "destructive"
        });
      } else {
        setCampaigns(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchClients = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('get-client-emails');

      if (error) {
        console.error('Error fetching clients:', error);
        toast({
          title: "Error",
          description: "Failed to load client data",
          variant: "destructive"
        });
        return;
      }

      setClients(data.clients || []);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error", 
        description: "Failed to load client data",
        variant: "destructive"
      });
    }
  };

  const createCampaign = async () => {
    try {
      const { data, error } = await supabase
        .from('email_campaigns')
        .insert({
          name: newCampaign.name,
          subject: newCampaign.subject,
          html_content: newCampaign.html_content,
          text_content: newCampaign.text_content,
          recipient_count: clients.length,
          status: 'draft'
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Campaign created successfully!"
      });
      setIsDialogOpen(false);
      setNewCampaign({ name: '', subject: '', html_content: '', text_content: '' });
      fetchCampaigns();
    } catch (error) {
      console.error('Error creating campaign:', error);
      toast({
        title: "Error",
        description: "Failed to create campaign",
        variant: "destructive"
      });
    }
  };

  const sendCampaign = async (campaign: EmailCampaign) => {
    try {
      // Update campaign status to 'sending'
      await supabase
        .from('email_campaigns')
        .update({ status: 'sending' })
        .eq('id', campaign.id);

      // Call edge function to send emails
      const { error } = await supabase.functions.invoke('send-bulk-email', {
        body: {
          campaign_id: campaign.id,
          recipients: clients.map(client => client.email),
          subject: campaign.subject,
          html_content: campaign.html_content,
          text_content: campaign.text_content
        }
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Campaign sent successfully!"
      });
      fetchCampaigns();
    } catch (error) {
      console.error('Error sending campaign:', error);
      toast({
        title: "Error", 
        description: "Failed to send campaign",
        variant: "destructive"
      });
      
      // Revert status on error
      await supabase
        .from('email_campaigns')
        .update({ status: 'draft' })
        .eq('id', campaign.id);
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-500';
      case 'sending': return 'bg-yellow-500';
      case 'sent': return 'bg-green-500';
      case 'failed': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading campaigns...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Email Campaigns</h3>
          <p className="text-sm text-muted-foreground">Send bulk emails to your active clients</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Campaign
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Email Campaign</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="campaign-name">Campaign Name</Label>
                <Input
                  id="campaign-name"
                  value={newCampaign.name}
                  onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                  placeholder="Monthly Profit Update"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="campaign-subject">Subject Line</Label>
                <Input
                  id="campaign-subject"
                  value={newCampaign.subject}
                  onChange={(e) => setNewCampaign({ ...newCampaign, subject: e.target.value })}
                  placeholder="Your Monthly Trading Results"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="campaign-content">Email Content (HTML)</Label>
                <Textarea
                  id="campaign-content"
                  value={newCampaign.html_content}
                  onChange={(e) => setNewCampaign({ ...newCampaign, html_content: e.target.value })}
                  rows={8}
                  placeholder="Enter your email HTML content..."
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Will be sent to {clients.length} active clients
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={createCampaign}>
                    Create Campaign
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {campaigns.map((campaign) => (
          <Card key={campaign.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base">{campaign.name}</CardTitle>
                  <CardDescription className="text-sm">{campaign.subject}</CardDescription>
                </div>
                <Badge className={`${getStatusBadgeColor(campaign.status)} text-white`}>
                  {campaign.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {campaign.recipient_count} recipients
                  </div>
                  <div className="flex items-center gap-1">
                    <Send className="h-3 w-3" />
                    {campaign.sent_count} sent
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {campaign.opened_count} opened
                  </div>
                  <div className="flex items-center gap-1">
                    <BarChart3 className="h-3 w-3" />
                    {campaign.clicked_count} clicked
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  Created: {new Date(campaign.created_at).toLocaleDateString()}
                  {campaign.sent_at && (
                    <div>Sent: {new Date(campaign.sent_at).toLocaleDateString()}</div>
                  )}
                </div>
                {campaign.status === 'draft' && (
                  <Button 
                    size="sm" 
                    className="w-full"
                    onClick={() => sendCampaign(campaign)}
                  >
                    <Send className="h-3 w-3 mr-1" />
                    Send Campaign
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {campaigns.length === 0 && (
        <Card className="text-center py-8">
          <CardContent>
            <Send className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No campaigns yet</h3>
            <p className="text-muted-foreground mb-4">Create your first email campaign to communicate with all your clients</p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Campaign
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EmailCampaigns;