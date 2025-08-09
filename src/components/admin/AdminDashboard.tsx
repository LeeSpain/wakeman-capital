
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import ClientList from './ClientList';
import ProfitTracking from './ProfitTracking';
import BillingManagement from './BillingManagement';
import AdminOverview from './AdminOverview';
import AdminSettings from './AdminSettings';
import EmailManagement from './EmailManagement';
import AdminTasksList from './AdminTasksList';
import PaymentTracking from './PaymentTracking';
import AICoachSettings from './AICoachSettings';
import { NewsManagement } from './NewsManagement';
import { Users, DollarSign, FileText, BarChart3, Settings, Mail, CreditCard, Bot, Calendar, Video } from 'lucide-react';
import VideosAdmin from './VideosAdmin';

const AdminDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
        <div className="text-sm text-muted-foreground">
          SaaS Subscription Management
        </div>
      </div>

      <AdminTasksList />

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-10">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="clients" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Clients
          </TabsTrigger>
          <TabsTrigger value="profits" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Profit Tracking
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Billing
          </TabsTrigger>
          <TabsTrigger value="payments" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Payments
          </TabsTrigger>
          <TabsTrigger value="emails" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Emails
          </TabsTrigger>
          <TabsTrigger value="news" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            News
          </TabsTrigger>
          <TabsTrigger value="ai-coach" className="flex items-center gap-2">
            <Bot className="h-4 w-4" />
            AI Coach
          </TabsTrigger>
          <TabsTrigger value="videos" className="flex items-center gap-2">
            <Video className="h-4 w-4" />
            Videos
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <AdminOverview />
        </TabsContent>

        <TabsContent value="clients">
          <ClientList />
        </TabsContent>

        <TabsContent value="profits">
          <ProfitTracking />
        </TabsContent>

        <TabsContent value="payments">
          <PaymentTracking />
        </TabsContent>

        <TabsContent value="emails">
          <EmailManagement />
        </TabsContent>

        <TabsContent value="news">
          <NewsManagement />
        </TabsContent>

        <TabsContent value="ai-coach">
          <AICoachSettings />
        </TabsContent>

        <TabsContent value="videos">
          <VideosAdmin />
        </TabsContent>

        <TabsContent value="settings">
          <AdminSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
