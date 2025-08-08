import React, { useState } from 'react'
import { BarChart3, ExternalLink } from 'lucide-react'
import { Button } from '../ui/button'
import { formatSignalForTradingView, generateQuickChartUrl } from '../../lib/tradingview'
import { SignalRecord } from '../../hooks/useSignals'
import { ChartModal } from '../charts/ChartModal'

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
  const [showModal, setShowModal] = useState(false)
  const [showExternal, setShowExternal] = useState(false)

  const chartSymbol = (signal as any).tradingview_symbol || signal.symbol
  const annotations = formatSignalForTradingView(signal)

  const handleChartClick = () => {
    setShowModal(true)
  }

  const handleExternalChart = () => {
    const chartUrl = generateQuickChartUrl(chartSymbol, signal.timeframe)
    window.open(chartUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <>
      <div className="flex gap-1">
        <Button
          variant={variant}
          size={size}
          onClick={handleChartClick}
          className={`gap-1.5 ${className}`}
        >
          {showIcon && <BarChart3 className="h-3.5 w-3.5" />}
          <span>Interactive Chart</span>
        </Button>
        <Button
          variant="ghost"
          size={size}
          onClick={handleExternalChart}
          className="px-2"
          title="Open in TradingView"
        >
          <ExternalLink className="h-3.5 w-3.5" />
        </Button>
      </div>
      
      <ChartModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        symbol={chartSymbol}
        annotations={annotations}
        title={`${signal.symbol} - ${signal.direction?.toUpperCase()} Signal`}
      />
    </>
  )
}

export default ChartLinkButton