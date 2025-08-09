-- Create paper trading tables for authenticated users

-- Paper wallets table
CREATE TABLE public.paper_wallets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  balance NUMERIC NOT NULL DEFAULT 10000,
  total_equity NUMERIC NOT NULL DEFAULT 10000,
  total_pnl NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Paper positions table (open positions)
CREATE TABLE public.paper_positions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  symbol TEXT NOT NULL,
  qty NUMERIC NOT NULL,
  entry_price NUMERIC NOT NULL,
  current_price NUMERIC NOT NULL,
  unrealized_pnl NUMERIC NOT NULL DEFAULT 0,
  opened_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Paper trades history table (closed positions)
CREATE TABLE public.paper_trades_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  symbol TEXT NOT NULL,
  qty NUMERIC NOT NULL,
  entry_price NUMERIC NOT NULL,
  exit_price NUMERIC NOT NULL,
  realized_pnl NUMERIC NOT NULL,
  opened_at TIMESTAMP WITH TIME ZONE NOT NULL,
  closed_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.paper_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.paper_positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.paper_trades_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies for paper_wallets
CREATE POLICY "Users can view their own paper wallet" 
ON public.paper_wallets 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own paper wallet" 
ON public.paper_wallets 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own paper wallet" 
ON public.paper_wallets 
FOR UPDATE 
USING (auth.uid() = user_id);

-- RLS Policies for paper_positions
CREATE POLICY "Users can view their own paper positions" 
ON public.paper_positions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own paper positions" 
ON public.paper_positions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own paper positions" 
ON public.paper_positions 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own paper positions" 
ON public.paper_positions 
FOR DELETE 
USING (auth.uid() = user_id);

-- RLS Policies for paper_trades_history
CREATE POLICY "Users can view their own paper trades history" 
ON public.paper_trades_history 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own paper trades history" 
ON public.paper_trades_history 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Add indexes for better performance
CREATE INDEX idx_paper_positions_user_id ON public.paper_positions(user_id);
CREATE INDEX idx_paper_trades_history_user_id ON public.paper_trades_history(user_id);
CREATE INDEX idx_paper_trades_history_closed_at ON public.paper_trades_history(closed_at DESC);

-- Add triggers for automatic timestamp updates
CREATE TRIGGER update_paper_wallets_updated_at
BEFORE UPDATE ON public.paper_wallets
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_paper_positions_updated_at
BEFORE UPDATE ON public.paper_positions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_paper_trades_history_updated_at
BEFORE UPDATE ON public.paper_trades_history
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();