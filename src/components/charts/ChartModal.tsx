import React from 'react'
import { X } from 'lucide-react'
import { Button } from '../ui/button'
import { TradingViewChart } from './TradingViewChart'
import { ChartAnnotations } from '../../lib/tradingview'

interface ChartModalProps {
  isOpen: boolean
  onClose: () => void
  symbol: string
  annotations?: ChartAnnotations
  title?: string
}

export const ChartModal: React.FC<ChartModalProps> = ({
  isOpen,
  onClose,
  symbol,
  annotations,
  title
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-background rounded-lg shadow-xl w-full max-w-6xl h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">
            {title || `${symbol} Chart Analysis`}
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex-1 p-4">
          <TradingViewChart
            symbol={symbol}
            annotations={annotations}
            height={500}
            theme="dark"
            container_id={`modal_chart_${symbol}`}
          />
        </div>
      </div>
    </div>
  )
}

export default ChartModal