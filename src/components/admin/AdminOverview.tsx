import React, { useEffect, useState } from 'react';
import { supabase } from '../../integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { TrendingUp, TrendingDown, Users, DollarSign, Activity, Target } from 'lucide-react';

interface OverviewStats {
  totalClients: number;
  activeClients: number;
  totalRevenue: number;
  monthlyRevenue: number;
  totalTrades: number;
  profitableClients: number;
  averageProfitPerClient: number;
  growthRate: number;
}

const AdminOverview = () => {
  const [stats, setStats] = useState<OverviewStats>({
    totalClients: 0,
    activeClients: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    totalTrades: 0,
    profitableClients: 0,
    averageProfitPerClient: 0,
    growthRate: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    fetchOverviewData();
  }, []);

  const fetchOverviewData = async () => {
    try {
      // Fetch client statistics
      const { data: subscriptions } = await supabase
        .from('client_subscriptions')
        .select('*');

      const { data: profitCalcs } = await supabase
        .from('profit_calculations')
        .select('*');

      const { data: trades } = await supabase
        .from('trades')
        .select('*');

      const { data: oandaTrades } = await supabase
        .from('oanda_trades')
        .select('*');

      // Calculate stats
      const totalClients = subscriptions?.length || 0;
      const activeClients = subscriptions?.filter(s => s.subscription_status === 'active').length || 0;
      const totalRevenue = profitCalcs?.reduce((sum, calc) => sum + Number(calc.fee_amount), 0) || 0;
      
      // Calculate monthly revenue (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const monthlyRevenue = profitCalcs?.filter(calc => 
        new Date(calc.calculation_date) >= thirtyDaysAgo
      ).reduce((sum, calc) => sum + Number(calc.fee_amount), 0) || 0;

      const totalTrades = (trades?.length || 0) + (oandaTrades?.length || 0);
      
      // Calculate profitable clients
      const clientProfits = new Map();
      profitCalcs?.forEach(calc => {
        const current = clientProfits.get(calc.user_id) || 0;
        clientProfits.set(calc.user_id, current + Number(calc.profit_amount));
      });
      const profitableClients = Array.from(clientProfits.values()).filter(profit => profit > 0).length;
      
      const averageProfitPerClient = totalClients > 0 ? totalRevenue / totalClients : 0;

      // Fetch recent activity
      const { data: recentProfits } = await supabase
        .from('profit_calculations')
        .select('*, trades(symbol), oanda_trades(symbol)')
        .order('created_at', { ascending: false })
        .limit(5);

      setStats({
        totalClients,
        activeClients,
        totalRevenue,
        monthlyRevenue,
        totalTrades,
        profitableClients,
        averageProfitPerClient,
        growthRate: 12.5, // Mock growth rate
      });

      setRecentActivity(recentProfits || []);
    } catch (error) {
      console.error('Error fetching overview data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading overview...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalClients}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeClients} active subscriptions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${stats.totalRevenue.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              ${stats.monthlyRevenue.toFixed(2)} this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Trades</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTrades}</div>
            <p className="text-xs text-muted-foreground">
              Across all clients
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profitable Clients</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.profitableClients}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalClients > 0 ? ((stats.profitableClients / stats.totalClients) * 100).toFixed(1) : 0}% success rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Business Performance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Average Revenue per Client</span>
              <div className="text-right">
                <div className="font-bold text-green-600">
                  ${stats.averageProfitPerClient.toFixed(2)}
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Growth Rate</span>
              <div className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="font-bold text-green-600">+{stats.growthRate}%</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Client Retention</span>
              <div className="font-bold">
                {stats.totalClients > 0 ? ((stats.activeClients / stats.totalClients) * 100).toFixed(1) : 0}%
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div key={activity.id} className="flex items-center justify-between text-sm">
                  <div>
                    <div className="font-medium">
                      ${Number(activity.profit_amount).toFixed(2)} profit
                    </div>
                    <div className="text-muted-foreground">
                      {activity.trades?.symbol || activity.oanda_trades?.symbol || 'Unknown pair'}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-green-600">
                      +${Number(activity.fee_amount).toFixed(2)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(activity.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
              
              {recentActivity.length === 0 && (
                <div className="text-center text-muted-foreground py-4">
                  No recent activity
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminOverview;