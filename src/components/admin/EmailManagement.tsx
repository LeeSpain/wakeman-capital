import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Settings, FileText, Send, BarChart3, Zap } from 'lucide-react';
import EmailSettings from './email/EmailSettings';
import EmailTemplates from './email/EmailTemplates';
import EmailCampaigns from './email/EmailCampaigns';
import EmailAnalytics from './email/EmailAnalytics';
import AutomatedEmails from './email/AutomatedEmails';

const EmailManagement = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Email Management</h2>
        <div className="text-sm text-muted-foreground">
          Client Communication & Marketing
        </div>
      </div>

      <Tabs defaultValue="settings" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="campaigns" className="flex items-center gap-2">
            <Send className="h-4 w-4" />
            Campaigns
          </TabsTrigger>
          <TabsTrigger value="automation" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Automation
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="settings">
          <EmailSettings />
        </TabsContent>

        <TabsContent value="templates">
          <EmailTemplates />
        </TabsContent>

        <TabsContent value="campaigns">
          <EmailCampaigns />
        </TabsContent>

        <TabsContent value="automation">
          <AutomatedEmails />
        </TabsContent>

        <TabsContent value="analytics">
          <EmailAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmailManagement;