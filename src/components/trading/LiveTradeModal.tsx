import React, { useState } from 'react';
import { Button } from '../ui/button';
import { useOandaAccount } from '../../hooks/useOandaAccount';

interface Signal {
  id: string;
  symbol: string;
  direction: string;
  entry_price: number;
  stop_loss: number;
  take_profit_1?: number | null;
  risk_reward_ratio?: number | null;
}

interface LiveTradeModalProps {
  signal: Signal;
  isOpen: boolean;
  onClose: () => void;
}

export const LiveTradeModal: React.FC<LiveTradeModalProps> = ({
  signal,
  isOpen,
  onClose,
}) => {
  const { data: accountData, placeOrder } = useOandaAccount();
  const [units, setUnits] = useState(1000);
  const [isPlacing, setIsPlacing] = useState(false);

  if (!isOpen) return null;

  const calculateRisk = () => {
    if (!accountData || !signal.entry_price || !signal.stop_loss) return null;
    
    const priceDiff = Math.abs(signal.entry_price - signal.stop_loss);
    const riskAmount = (priceDiff * units);
    const riskPercent = (riskAmount / accountData.balance) * 100;
    
    return { riskAmount, riskPercent };
  };

  const handlePlaceTrade = async () => {
    setIsPlacing(true);
    try {
      await placeOrder({
        symbol: signal.symbol,
        direction: signal.direction as 'long' | 'short',
        units,
        stopLoss: signal.stop_loss,
        takeProfit: signal.take_profit_1 || undefined,
        signalId: signal.id,
      });
      
      alert('✅ Live trade placed successfully!');
      onClose();
    } catch (error) {
      console.error('Error placing live trade:', error);
      alert(`❌ Failed to place trade: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsPlacing(false);
    }
  };

  const risk = calculateRisk();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card border border-border rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Live Trade Confirmation</h3>
          <Button variant="outline" size="sm" onClick={onClose}>✕</Button>
        </div>

        {!accountData ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              No OANDA account connected. Please configure your OANDA connection in Settings first.
            </p>
            <Button variant="outline" onClick={onClose}>Close</Button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Signal Details */}
            <div className="border border-border rounded-lg p-4 bg-card/50">
              <h4 className="font-medium text-foreground mb-2">Signal Details</h4>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Symbol:</span>
                  <span className="font-medium">{signal.symbol}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Direction:</span>
                  <span className="font-medium">{signal.direction.toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Entry:</span>
                  <span className="font-medium">{signal.entry_price}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Stop Loss:</span>
                  <span className="font-medium">{signal.stop_loss}</span>
                </div>
                {signal.take_profit_1 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Take Profit:</span>
                    <span className="font-medium">{signal.take_profit_1}</span>
                  </div>
                )}
                {signal.risk_reward_ratio && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Risk/Reward:</span>
                    <span className="font-medium">1:{signal.risk_reward_ratio.toFixed(2)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Account Info */}
            <div className="border border-border rounded-lg p-4 bg-card/50">
              <h4 className="font-medium text-foreground mb-2">Account Info</h4>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Environment:</span>
                  <span className={`font-medium ${accountData.environment === 'demo' ? 'text-primary' : 'text-destructive'}`}>
                    {accountData.environment.toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Balance:</span>
                  <span className="font-medium">{accountData.currency} {accountData.balance.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Available:</span>
                  <span className="font-medium">{accountData.currency} {accountData.margin_available.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Trade Size */}
            <div>
              <label className="text-sm font-medium text-foreground">Units</label>
              <input
                type="number"
                value={units}
                onChange={(e) => setUnits(Math.max(1, parseInt(e.target.value) || 1))}
                min="1"
                step="1000"
                className="w-full mt-1 px-3 py-2 border border-border rounded-md bg-background text-foreground"
              />
            </div>

            {/* Risk Calculation */}
            {risk && (
              <div className="border border-border rounded-lg p-4 bg-card/50">
                <h4 className="font-medium text-foreground mb-2">Risk Analysis</h4>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Risk Amount:</span>
                    <span className="font-medium">{accountData.currency} {risk.riskAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Risk %:</span>
                    <span className={`font-medium ${risk.riskPercent > 5 ? 'text-destructive' : 'text-foreground'}`}>
                      {risk.riskPercent.toFixed(1)}%
                    </span>
                  </div>
                  {risk.riskPercent > 5 && (
                    <p className="text-xs text-destructive mt-2">
                      ⚠️ High risk! Consider reducing position size.
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4">
              <Button variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button 
                onClick={handlePlaceTrade}
                disabled={isPlacing || !risk}
                className="flex-1"
              >
                {isPlacing ? 'Placing...' : `Place ${signal.direction.toUpperCase()} Trade`}
              </Button>
            </div>

            {accountData.environment === 'demo' && (
              <div className="text-xs text-muted-foreground text-center">
                📝 This is demo trading with virtual money
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveTradeModal;