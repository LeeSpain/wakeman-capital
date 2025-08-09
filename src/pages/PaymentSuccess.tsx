import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../integrations/supabase/client';
import { useToast } from '../hooks/use-toast';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    
    if (sessionId) {
      // Verify payment with Stripe
      const verifyPayment = async () => {
        try {
          const { data, error } = await supabase.functions.invoke('verify-payment', {
            body: { session_id: sessionId }
          });

          if (error) {
            console.error('Payment verification error:', error);
            toast({
              title: "Payment Verification Failed",
              description: "Please contact support if payment was deducted.",
              variant: "destructive",
            });
          } else if (data?.access_granted) {
            toast({
              title: "Subscription Active! 🎉",
              description: "Welcome to Wakeman Capital! Your monthly subscription is now active.",
            });
          }
        } catch (err) {
          console.error('Payment verification failed:', err);
        }
      };

      verifyPayment();
    }

    // Redirect to dashboard after 3 seconds
    const timer = setTimeout(() => {
      navigate('/dashboard');
    }, 3000);

    return () => clearTimeout(timer);
  }, [searchParams, navigate, toast]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="max-w-md mx-auto text-center p-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">✅</span>
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Subscription Active!</h1>
        <p className="text-muted-foreground mb-4">
          Thank you for subscribing to Wakeman Capital. Your monthly subscription is now active and you have full access to all premium features.
        </p>
        <div className="text-sm text-muted-foreground mb-2">
          Monthly: $29.99 + 10% profit share when you win
        </div>
        <div className="animate-pulse text-sm text-muted-foreground">
          Redirecting to your dashboard...
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;