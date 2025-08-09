import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { supabase } from '../../integrations/supabase/client';
import { format } from 'date-fns';
import { DollarSign, Users, CreditCard, AlertCircle, CheckCircle, Clock } from 'lucide-react';

interface Payment {
  id: string;
  user_id: string;
  stripe_session_id: string | null;
  amount: number;
  currency: string;
  status: string;
  paid_at: string | null;
  created_at: string;
  profiles: {
    display_name: string | null;
    first_name: string | null;
    last_name: string | null;
  } | null;
}

interface PaymentStats {
  monthlyRevenue: number;
  totalSubscriptions: number;
  activeSubscribers: number;
  pendingSubscriptions: number;
}

const PaymentTracking = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [stats, setStats] = useState<PaymentStats>({
    monthlyRevenue: 0,
    totalSubscriptions: 0,
    activeSubscribers: 0,
    pendingSubscriptions: 0
  });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'paid' | 'pending' | 'failed'>('all');

  const fetchPayments = async () => {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select(`
          *,
          profiles!payments_user_id_fkey (
            display_name,
            first_name,
            last_name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching payments:', error);
        return;
      }

      setPayments(data || []);

      // Calculate subscription stats
      const monthlyRevenue = data?.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0) || 0;
      const totalSubscriptions = data?.length || 0;
      const activeSubscribers = data?.filter(p => p.status === 'paid').length || 0;
      const pendingSubscriptions = data?.filter(p => p.status === 'pending').length || 0;

      setStats({
        monthlyRevenue: monthlyRevenue / 100, // Convert from cents to dollars
        totalSubscriptions,
        activeSubscribers,
        pendingSubscriptions
      });
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const filteredPayments = payments.filter(payment => {
    if (filter === 'all') return true;
    return payment.status === filter;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'failed':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse">Loading payment data...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Monthly Revenue</p>
                <p className="text-2xl font-bold">${stats.monthlyRevenue.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Active Subscribers</p>
                <p className="text-2xl font-bold">{stats.activeSubscribers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Subscriptions</p>
                <p className="text-2xl font-bold">{stats.totalSubscriptions}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">{stats.pendingSubscriptions}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Subscription History</CardTitle>
            <div className="flex gap-2">
              <Button
                variant={filter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('all')}
              >
                All
              </Button>
              <Button
                variant={filter === 'paid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('paid')}
              >
                Paid
              </Button>
              <Button
                variant={filter === 'pending' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('pending')}
              >
                Pending
              </Button>
              <Button
                variant={filter === 'failed' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('failed')}
              >
                Failed
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredPayments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No subscriptions found for the selected filter.
            </div>
          ) : (
            <div className="space-y-3">
              {filteredPayments.map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    {getStatusIcon(payment.status)}
                    <div>
                      <div className="font-medium">
                        {payment.profiles?.display_name || 
                         `${payment.profiles?.first_name || ''} ${payment.profiles?.last_name || ''}`.trim() ||
                         'Unknown User'}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {format(new Date(payment.created_at), 'MMM d, yyyy at h:mm a')}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="font-medium">
                        ${(payment.amount / 100).toFixed(2)} {payment.currency.toUpperCase()}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {payment.paid_at && (
                          <div className="text-sm text-muted-foreground">
                            Subscribed {format(new Date(payment.paid_at), 'MMM d, yyyy')}
                          </div>
                        )}
                      </div>
                    </div>
                    <Badge variant={getStatusColor(payment.status)}>
                      {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentTracking;