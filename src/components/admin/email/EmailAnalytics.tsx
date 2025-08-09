import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { BarChart3, Eye, Users, Send, TrendingUp, Mail } from 'lucide-react';
import { supabase } from '../../../integrations/supabase/client';

interface EmailStats {
  totalSent: number;
  totalOpened: number;
  totalClicked: number;
  openRate: number;
  clickRate: number;
  recentEmails: any[];
}

const EmailAnalytics = () => {
  const [stats, setStats] = useState<EmailStats>({
    totalSent: 0,
    totalOpened: 0,
    totalClicked: 0,
    openRate: 0,
    clickRate: 0,
    recentEmails: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmailStats();
  }, []);

  const fetchEmailStats = async () => {
    try {
      // Fetch email history for analytics
      const { data: emailHistory, error: historyError } = await supabase
        .from('email_history')
        .select('*')
        .order('sent_at', { ascending: false });

      if (historyError) {
        console.error('Error fetching email history:', historyError);
        return;
      }

      // Fetch recent campaigns
      const { data: campaigns, error: campaignsError } = await supabase
        .from('email_campaigns')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (campaignsError) {
        console.error('Error fetching campaigns:', campaignsError);
        return;
      }

      // Calculate stats
      const totalSent = emailHistory?.length || 0;
      const totalOpened = emailHistory?.filter(email => email.status === 'opened' || email.opened_at).length || 0;
      const totalClicked = emailHistory?.filter(email => email.status === 'clicked' || email.clicked_at).length || 0;
      
      const openRate = totalSent > 0 ? (totalOpened / totalSent) * 100 : 0;
      const clickRate = totalOpened > 0 ? (totalClicked / totalOpened) * 100 : 0;

      setStats({
        totalSent,
        totalOpened,
        totalClicked,
        openRate,
        clickRate,
        recentEmails: campaigns || []
      });
    } catch (error) {
      console.error('Error fetching email stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'bg-green-500';
      case 'sending': return 'bg-yellow-500';
      case 'draft': return 'bg-gray-500';
      case 'failed': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading analytics...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Email Analytics</h3>
        <p className="text-sm text-muted-foreground">Track the performance of your email campaigns and communications</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Sent</p>
                <p className="text-2xl font-bold">{stats.totalSent}</p>
              </div>
              <Send className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Opened</p>
                <p className="text-2xl font-bold">{stats.totalOpened}</p>
              </div>
              <Eye className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Clicked</p>
                <p className="text-2xl font-bold">{stats.totalClicked}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Open Rate</p>
                <p className="text-2xl font-bold">{stats.openRate.toFixed(1)}%</p>
              </div>
              <BarChart3 className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Click Rate</p>
                <p className="text-2xl font-bold">{stats.clickRate.toFixed(1)}%</p>
              </div>
              <Users className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Campaigns */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Email Campaigns</CardTitle>
          <CardDescription>Overview of your latest email campaigns and their performance</CardDescription>
        </CardHeader>
        <CardContent>
          {stats.recentEmails.length > 0 ? (
            <div className="space-y-4">
              {stats.recentEmails.map((campaign) => (
                <div key={campaign.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{campaign.name}</p>
                      <p className="text-sm text-muted-foreground">{campaign.subject}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right text-sm">
                      <p className="font-medium">{campaign.sent_count || 0} sent</p>
                      <p className="text-muted-foreground">
                        {campaign.opened_count || 0} opened ({campaign.sent_count > 0 ? ((campaign.opened_count || 0) / campaign.sent_count * 100).toFixed(1) : 0}%)
                      </p>
                    </div>
                    <Badge className={`${getStatusColor(campaign.status)} text-white`}>
                      {campaign.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Mail className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No campaigns yet</h3>
              <p className="text-muted-foreground">Create your first email campaign to see analytics here</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Performance Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Performance Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Average Open Rate</span>
              <span className="font-medium">{stats.openRate.toFixed(1)}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Average Click Rate</span>
              <span className="font-medium">{stats.clickRate.toFixed(1)}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Industry Average (Finance)</span>
              <span className="font-medium text-muted-foreground">22.1%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recommendations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {stats.openRate < 20 && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-800">💡 Consider improving your subject lines to increase open rates</p>
              </div>
            )}
            {stats.clickRate < 5 && stats.totalOpened > 0 && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-800">📈 Add more compelling calls-to-action to improve click rates</p>
              </div>
            )}
            {stats.totalSent === 0 && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800">🚀 Start by creating and sending your first email campaign</p>
              </div>
            )}
            {stats.openRate >= 20 && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800">✅ Great open rate! Your subject lines are performing well</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmailAnalytics;