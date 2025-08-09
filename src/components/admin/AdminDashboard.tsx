import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import ClientList from './ClientList';
import ProfitTracking from './ProfitTracking';
import BillingManagement from './BillingManagement';
import { Users, DollarSign, FileText } from 'lucide-react';

const AdminDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
        <div className="text-sm text-muted-foreground">
          SaaS Subscription Management
        </div>
      </div>

      <Tabs defaultValue="clients" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
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
        </TabsList>

        <TabsContent value="clients">
          <ClientList />
        </TabsContent>

        <TabsContent value="profits">
          <ProfitTracking />
        </TabsContent>

        <TabsContent value="billing">
          <BillingManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;