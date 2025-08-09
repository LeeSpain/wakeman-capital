import React from 'react'
import { BarChart3 } from 'lucide-react'
import { Button } from '../ui/button'
import { generateQuickChartUrl } from '../../lib/tradingview'
import { SignalRecord } from '../../hooks/useSignals'

interface ChartLinkButtonProps {
  signal: SignalRecord
  variant?: 'default' | 'outline' | 'secondary'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  showIcon?: boolean
  className?: string
}

export const ChartLinkButton: React.FC<ChartLinkButtonProps> = ({
  signal,
  variant = 'outline',
  size = 'sm',
  showIcon = true,
  className = ''
}) => {
  const chartSymbol = (signal as any).tradingview_symbol || signal.symbol

  const handleChartClick = () => {
    const chartUrl = generateQuickChartUrl(chartSymbol, signal.timeframe)
    window.open(chartUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleChartClick}
      className={`gap-1.5 ${className}`}
      title="Open chart in TradingView"
    >
      {showIcon && <BarChart3 className="h-3.5 w-3.5" />}
      <span>View Chart</span>
    </Button>
  )
}

export default ChartLinkButton