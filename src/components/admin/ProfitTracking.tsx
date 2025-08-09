import React, { useEffect, useState } from 'react';
import { supabase } from '../../integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { formatDistanceToNow } from 'date-fns';

interface ProfitRecord {
  id: string;
  user_email: string;
  profit_amount: number;
  fee_amount: number;
  fee_percentage: number;
  calculation_date: string;
  billing_period_start: string;
  billing_period_end: string;
  trade_symbol?: string;
}

const ProfitTracking = () => {
  const [profitRecords, setProfitRecords] = useState<ProfitRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalFees, setTotalFees] = useState(0);
  const [totalProfits, setTotalProfits] = useState(0);

  useEffect(() => {
    fetchProfitRecords();
  }, []);

  const fetchProfitRecords = async () => {
    try {
      const { data: calculations, error } = await supabase
        .from('profit_calculations')
        .select(`
          *,
          trades(symbol),
          oanda_trades(symbol),
          paper_trades_history(symbol)
        `)
        .order('calculation_date', { ascending: false })
        .limit(50);

      if (error) throw error;

      // Get user emails
      const userIds = [...new Set(calculations?.map(calc => calc.user_id) || [])];
      const userDetailsPromises = userIds.map(async (userId) => {
        const { data: user } = await supabase.auth.admin.getUserById(userId);
        return { id: userId, email: user.user?.email || 'Unknown' };
      });

      const userDetails = await Promise.all(userDetailsPromises);
      const userEmailMap = new Map(userDetails.map(user => [user.id, user.email]));

      const profitData = calculations?.map(calc => ({
        id: calc.id,
        user_email: userEmailMap.get(calc.user_id) || 'Unknown',
        profit_amount: Number(calc.profit_amount),
        fee_amount: Number(calc.fee_amount),
        fee_percentage: Number(calc.fee_percentage),
        calculation_date: calc.calculation_date,
        billing_period_start: calc.billing_period_start,
        billing_period_end: calc.billing_period_end,
        trade_symbol: calc.trades?.symbol || calc.oanda_trades?.symbol || calc.paper_trades_history?.symbol
      })) || [];

      setProfitRecords(profitData);
      
      // Calculate totals
      const totalFeesCollected = profitData.reduce((sum, record) => sum + record.fee_amount, 0);
      const totalProfitsTracked = profitData.reduce((sum, record) => sum + record.profit_amount, 0);
      
      setTotalFees(totalFeesCollected);
      setTotalProfits(totalProfitsTracked);
    } catch (error) {
      console.error('Error fetching profit records:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading profit tracking data...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Fees Collected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${totalFees.toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Client Profits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalProfits.toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Fee Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalProfits > 0 ? ((totalFees / totalProfits) * 100).toFixed(1) : '0'}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Profit Records Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Profit Calculations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {profitRecords.map((record) => (
              <div key={record.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{record.user_email}</span>
                    {record.trade_symbol && (
                      <Badge variant="outline">{record.trade_symbol}</Badge>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(record.calculation_date), { addSuffix: true })}
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="font-medium text-green-600">
                    Profit: ${record.profit_amount.toFixed(2)}
                  </div>
                  <div className="text-sm font-medium">
                    Fee ({record.fee_percentage}%): ${record.fee_amount.toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {profitRecords.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No profit calculations found. Fees will be calculated automatically when clients make profitable trades.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfitTracking;