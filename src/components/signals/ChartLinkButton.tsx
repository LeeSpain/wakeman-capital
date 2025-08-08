import React from 'react'
import { ExternalLink, TrendingUp } from 'lucide-react'
import { Button } from '../ui/button'
import { generateTradingViewChartUrl, formatSignalForTradingView } from '../../lib/tradingview'
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
  const handleChartClick = () => {
    // Use tradingview_symbol if available, otherwise fall back to symbol
    const chartSymbol = (signal as any).tradingview_symbol || signal.symbol
    
    // Format signal data for TradingView annotations
    const annotations = formatSignalForTradingView(signal)
    
    // Generate the annotated chart URL
    const chartUrl = generateTradingViewChartUrl(
      chartSymbol, 
      (signal as any).chart_template || 'TradingPlan2.0',
      annotations
    )
    
    // Open in new tab
    window.open(chartUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleChartClick}
      className={`gap-1.5 ${className}`}
    >
      {showIcon && <TrendingUp className="h-3.5 w-3.5" />}
      <span>View Chart</span>
      <ExternalLink className="h-3 w-3 opacity-70" />
    </Button>
  )
}

export default ChartLinkButton