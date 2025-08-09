import React, { useEffect, useState } from 'react';
import { supabase } from '../../integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Plus, Mail, Users } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import InviteClientModal from './InviteClientModal';

interface Client {
  id: string;
  email: string;
  created_at: string;
  subscription_status: string;
  profit_share_percentage: number;
  total_trades: number;
  total_profit: number;
  total_fees: number;
}

const ClientList = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      // Get all users with their subscription info and calculated metrics
      const { data: subscriptions, error } = await supabase
        .from('client_subscriptions')
        .select(`
          *,
          profit_calculations(profit_amount, fee_amount),
          trades(count),
          oanda_trades(count)
        `);

      if (error) throw error;

      // Get user details from auth
      const userIds = subscriptions?.map(sub => sub.user_id) || [];
      const userDetailsPromises = userIds.map(async (userId) => {
        const { data: user } = await supabase.auth.admin.getUserById(userId);
        return user.user;
      });

      const userDetails = await Promise.all(userDetailsPromises);

      // Combine subscription data with user details and metrics
      const clientsData = subscriptions?.map((sub, index) => {
        const user = userDetails[index];
        const totalProfit = sub.profit_calculations?.reduce((sum: number, calc: any) => sum + Number(calc.profit_amount), 0) || 0;
        const totalFees = sub.profit_calculations?.reduce((sum: number, calc: any) => sum + Number(calc.fee_amount), 0) || 0;
        const totalTrades = (sub.trades?.length || 0) + (sub.oanda_trades?.length || 0);

        return {
          id: sub.id,
          email: user?.email || 'Unknown',
          created_at: sub.created_at,
          subscription_status: sub.subscription_status,
          profit_share_percentage: sub.profit_share_percentage,
          total_trades: totalTrades,
          total_profit: totalProfit,
          total_fees: totalFees
        };
      }) || [];

      setClients(clientsData);
      
      // Calculate total revenue
      const revenue = clientsData.reduce((sum, client) => sum + client.total_fees, 0);
      setTotalRevenue(revenue);
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSubscriptionStatus = async (clientId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    
    try {
      const { error } = await supabase
        .from('client_subscriptions')
        .update({ subscription_status: newStatus })
        .eq('id', clientId);

      if (error) throw error;
      
      setClients(prev => prev.map(client => 
        client.id === clientId 
          ? { ...client, subscription_status: newStatus }
          : client
      ));
    } catch (error) {
      console.error('Error updating subscription status:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading clients...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats and Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-muted-foreground" />
            <span className="text-lg font-medium">{clients.length} Clients</span>
          </div>
          <div className="text-sm text-muted-foreground">
            Total Revenue: <span className="font-medium text-green-600">${totalRevenue.toFixed(2)}</span>
          </div>
        </div>
        <Button onClick={() => setShowInviteModal(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Invite Client
        </Button>
      </div>

      <div className="grid gap-4">
        {clients.map((client) => (
          <Card key={client.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {client.email}
              </CardTitle>
              <Badge variant={client.subscription_status === 'active' ? 'default' : 'secondary'}>
                {client.subscription_status}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Total Trades</p>
                  <p className="font-medium">{client.total_trades}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Total Profit</p>
                  <p className="font-medium text-green-600">${client.total_profit.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Fees Collected</p>
                  <p className="font-medium">${client.total_fees.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Member Since</p>
                  <p className="font-medium">
                    {formatDistanceToNow(new Date(client.created_at), { addSuffix: true })}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Fee Rate: {client.profit_share_percentage}%
                </span>
                <Button
                  size="sm"
                  variant={client.subscription_status === 'active' ? 'destructive' : 'default'}
                  onClick={() => toggleSubscriptionStatus(client.id, client.subscription_status)}
                >
                  {client.subscription_status === 'active' ? 'Deactivate' : 'Activate'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {clients.length === 0 && !loading && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No clients yet</h3>
          <p className="text-muted-foreground mb-4">Start by inviting clients to join your platform</p>
          <Button onClick={() => setShowInviteModal(true)} className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Send Your First Invite
          </Button>
        </div>
      )}

      <InviteClientModal 
        open={showInviteModal} 
        onClose={() => setShowInviteModal(false)}
        onInviteSent={fetchClients}
      />
    </div>
  );
};

export default ClientList;