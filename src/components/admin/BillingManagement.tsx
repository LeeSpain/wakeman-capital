import React, { useEffect, useState } from 'react';
import { supabase } from '../../integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { formatDistanceToNow, format } from 'date-fns';

interface BillingRecord {
  id: string;
  user_email: string;
  billing_period_start: string;
  billing_period_end: string;
  total_profits: number;
  total_fees: number;
  status: string;
  invoice_number?: string;
  payment_date?: string;
  created_at: string;
}

const BillingManagement = () => {
  const [billingRecords, setBillingRecords] = useState<BillingRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBillingRecords();
  }, []);

  const fetchBillingRecords = async () => {
    try {
      const { data: records, error } = await supabase
        .from('billing_records')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Get user emails
      const userIds = [...new Set(records?.map(record => record.user_id) || [])];
      const userDetailsPromises = userIds.map(async (userId) => {
        const { data: user } = await supabase.auth.admin.getUserById(userId);
        return { id: userId, email: user.user?.email || 'Unknown' };
      });

      const userDetails = await Promise.all(userDetailsPromises);
      const userEmailMap = new Map(userDetails.map(user => [user.id, user.email]));

      const billingData = records?.map(record => ({
        id: record.id,
        user_email: userEmailMap.get(record.user_id) || 'Unknown',
        billing_period_start: record.billing_period_start,
        billing_period_end: record.billing_period_end,
        total_profits: Number(record.total_profits),
        total_fees: Number(record.total_fees),
        status: record.status,
        invoice_number: record.invoice_number,
        payment_date: record.payment_date,
        created_at: record.created_at
      })) || [];

      setBillingRecords(billingData);
    } catch (error) {
      console.error('Error fetching billing records:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateBillingStatus = async (recordId: string, newStatus: string) => {
    try {
      const updateData: any = { status: newStatus };
      
      if (newStatus === 'paid') {
        updateData.payment_date = new Date().toISOString();
      }

      const { error } = await supabase
        .from('billing_records')
        .update(updateData)
        .eq('id', recordId);

      if (error) throw error;

      setBillingRecords(prev => prev.map(record => 
        record.id === recordId 
          ? { 
              ...record, 
              status: newStatus,
              payment_date: newStatus === 'paid' ? new Date().toISOString() : record.payment_date
            }
          : record
      ));
    } catch (error) {
      console.error('Error updating billing status:', error);
    }
  };

  const generateInvoiceNumber = async (recordId: string) => {
    try {
      const invoiceNumber = `INV-${Date.now()}`;
      
      const { error } = await supabase
        .from('billing_records')
        .update({ invoice_number: invoiceNumber })
        .eq('id', recordId);

      if (error) throw error;

      setBillingRecords(prev => prev.map(record => 
        record.id === recordId 
          ? { ...record, invoice_number: invoiceNumber }
          : record
      ));
    } catch (error) {
      console.error('Error generating invoice number:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading billing records...</div>;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Billing Records</h3>
        <Button onClick={fetchBillingRecords} variant="outline" size="sm">
          Refresh
        </Button>
      </div>

      <div className="grid gap-4">
        {billingRecords.map((record) => (
          <Card key={record.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {record.user_email}
              </CardTitle>
              <Badge className={getStatusColor(record.status)}>
                {record.status.toUpperCase()}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
                <div>
                  <p className="text-muted-foreground">Billing Period</p>
                  <p className="font-medium">
                    {format(new Date(record.billing_period_start), 'MMM dd')} - {format(new Date(record.billing_period_end), 'MMM dd, yyyy')}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Client Profits</p>
                  <p className="font-medium text-green-600">${record.total_profits.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Fees Due</p>
                  <p className="font-medium">${record.total_fees.toFixed(2)}</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  {record.invoice_number ? (
                    <span>Invoice: {record.invoice_number}</span>
                  ) : (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => generateInvoiceNumber(record.id)}
                    >
                      Generate Invoice
                    </Button>
                  )}
                </div>

                <div className="flex gap-2">
                  {record.status === 'pending' && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateBillingStatus(record.id, 'overdue')}
                      >
                        Mark Overdue
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => updateBillingStatus(record.id, 'paid')}
                      >
                        Mark Paid
                      </Button>
                    </>
                  )}
                  
                  {record.status === 'overdue' && (
                    <Button
                      size="sm"
                      onClick={() => updateBillingStatus(record.id, 'paid')}
                    >
                      Mark Paid
                    </Button>
                  )}

                  {record.status === 'paid' && record.payment_date && (
                    <span className="text-sm text-muted-foreground">
                      Paid {formatDistanceToNow(new Date(record.payment_date), { addSuffix: true })}
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {billingRecords.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No billing records found. Records will be generated automatically based on client profits.
        </div>
      )}
    </div>
  );
};

export default BillingManagement;