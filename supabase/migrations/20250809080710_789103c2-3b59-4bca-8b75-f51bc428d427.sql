-- Create OANDA accounts table for storing user credentials
CREATE TABLE public.oanda_accounts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  environment TEXT NOT NULL CHECK (environment IN ('demo', 'live')),
  api_token_encrypted TEXT NOT NULL,
  account_id TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  connection_verified BOOLEAN NOT NULL DEFAULT false,
  last_verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.oanda_accounts ENABLE ROW LEVEL SECURITY;

-- Create policies for OANDA accounts
CREATE POLICY "Users can view their own OANDA accounts" 
ON public.oanda_accounts 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own OANDA accounts" 
ON public.oanda_accounts 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own OANDA accounts" 
ON public.oanda_accounts 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own OANDA accounts" 
ON public.oanda_accounts 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create OANDA trades table for live trades
CREATE TABLE public.oanda_trades (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  oanda_account_id UUID NOT NULL REFERENCES public.oanda_accounts(id) ON DELETE CASCADE,
  oanda_trade_id TEXT NOT NULL,
  symbol TEXT NOT NULL,
  direction TEXT NOT NULL CHECK (direction IN ('long', 'short')),
  units INTEGER NOT NULL,
  entry_price NUMERIC NOT NULL,
  current_price NUMERIC,
  stop_loss NUMERIC,
  take_profit NUMERIC,
  unrealized_pnl NUMERIC DEFAULT 0,
  realized_pnl NUMERIC,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'closed')),
  signal_id UUID REFERENCES public.signals_detailed(id),
  opened_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  closed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.oanda_trades ENABLE ROW LEVEL SECURITY;

-- Create policies for OANDA trades
CREATE POLICY "Users can view their own OANDA trades" 
ON public.oanda_trades 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own OANDA trades" 
ON public.oanda_trades 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own OANDA trades" 
ON public.oanda_trades 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_oanda_accounts_user_id ON public.oanda_accounts (user_id);
CREATE INDEX idx_oanda_accounts_active ON public.oanda_accounts (user_id, is_active) WHERE is_active = true;
CREATE INDEX idx_oanda_trades_user_id ON public.oanda_trades (user_id);
CREATE INDEX idx_oanda_trades_status ON public.oanda_trades (user_id, status);
CREATE INDEX idx_oanda_trades_signal ON public.oanda_trades (signal_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_oanda_accounts_updated_at
BEFORE UPDATE ON public.oanda_accounts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_oanda_trades_updated_at
BEFORE UPDATE ON public.oanda_trades
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();