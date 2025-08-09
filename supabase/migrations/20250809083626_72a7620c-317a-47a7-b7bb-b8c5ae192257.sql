-- Create client subscriptions table
CREATE TABLE public.client_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription_status TEXT NOT NULL DEFAULT 'active',
  profit_share_percentage NUMERIC NOT NULL DEFAULT 10,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_billing_date TIMESTAMPTZ,
  next_billing_date TIMESTAMPTZ
);

-- Create profit calculations table
CREATE TABLE public.profit_calculations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription_id UUID NOT NULL REFERENCES public.client_subscriptions(id) ON DELETE CASCADE,
  trade_id UUID REFERENCES public.trades(id),
  oanda_trade_id UUID REFERENCES public.oanda_trades(id),
  paper_trade_id UUID REFERENCES public.paper_trades_history(id),
  profit_amount NUMERIC NOT NULL,
  fee_amount NUMERIC NOT NULL,
  fee_percentage NUMERIC NOT NULL DEFAULT 10,
  calculation_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  billing_period_start TIMESTAMPTZ NOT NULL,
  billing_period_end TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create billing records table
CREATE TABLE public.billing_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription_id UUID NOT NULL REFERENCES public.client_subscriptions(id) ON DELETE CASCADE,
  billing_period_start TIMESTAMPTZ NOT NULL,
  billing_period_end TIMESTAMPTZ NOT NULL,
  total_profits NUMERIC NOT NULL DEFAULT 0,
  total_fees NUMERIC NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending',
  invoice_number TEXT UNIQUE,
  payment_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE public.client_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profit_calculations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.billing_records ENABLE ROW LEVEL SECURITY;

-- Admin-only policies for client_subscriptions
CREATE POLICY "Admin can manage all client subscriptions" 
ON public.client_subscriptions 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admin-only policies for profit_calculations
CREATE POLICY "Admin can manage all profit calculations" 
ON public.profit_calculations 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admin-only policies for billing_records
CREATE POLICY "Admin can manage all billing records" 
ON public.billing_records 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Users can view their own subscription
CREATE POLICY "Users can view their own subscription" 
ON public.client_subscriptions 
FOR SELECT 
USING (auth.uid() = user_id);

-- Create updated_at triggers
CREATE TRIGGER update_client_subscriptions_updated_at
BEFORE UPDATE ON public.client_subscriptions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_billing_records_updated_at
BEFORE UPDATE ON public.billing_records
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();