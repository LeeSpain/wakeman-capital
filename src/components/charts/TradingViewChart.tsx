import React, { useEffect, useRef } from 'react'
import { ChartAnnotations } from '../../lib/tradingview'

interface TradingViewChartProps {
  symbol: string
  interval?: string
  annotations?: ChartAnnotations
  height?: number
  theme?: 'light' | 'dark'
  container_id?: string
}

export const TradingViewChart: React.FC<TradingViewChartProps> = ({
  symbol,
  interval = '1H',
  annotations,
  height = 400,
  theme = 'dark',
  container_id
}) => {
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const widgetRef = useRef<any>(null)

  useEffect(() => {
    if (!chartContainerRef.current) return

    const script = document.createElement('script')
    script.src = '/charting_library/charting_library.min.js'
    script.type = 'text/javascript'
    script.async = true
    script.onload = () => {
      if (window.TradingView) {
        initializeChart()
      }
    }
    document.head.appendChild(script)

    return () => {
      if (widgetRef.current) {
        widgetRef.current.remove()
      }
      document.head.removeChild(script)
    }
  }, [symbol, interval, theme])

  const initializeChart = () => {
    if (!chartContainerRef.current || !window.TradingView) return

    const containerId = container_id || `tradingview_${Date.now()}`
    chartContainerRef.current.id = containerId

    widgetRef.current = new window.TradingView.widget({
      symbol: symbol,
      interval: interval,
      container: containerId,
      library_path: '/charting_library/',
      locale: 'en',
      disabled_features: [
        'use_localstorage_for_settings',
        'volume_force_overlay',
        'header_symbol_search',
        'header_compare',
        'header_screenshot'
      ],
      enabled_features: [
        'study_templates',
        'side_toolbar_in_fullscreen_mode'
      ],
      charts_storage_url: 'https://saveload.tradingview.com',
      charts_storage_api_version: '1.1',
      client_id: 'tradingview.com',
      user_id: 'public_user_id',
      fullscreen: false,
      autosize: true,
      theme: theme,
      overrides: {
        'paneProperties.background': theme === 'dark' ? '#1a1a1a' : '#ffffff',
        'paneProperties.vertGridProperties.color': theme === 'dark' ? '#2a2a2a' : '#e0e0e0',
        'paneProperties.horzGridProperties.color': theme === 'dark' ? '#2a2a2a' : '#e0e0e0',
        'symbolWatermarkProperties.transparency': 90,
        'scalesProperties.textColor': theme === 'dark' ? '#b0b0b0' : '#333333'
      },
      studies_overrides: {},
      loading_screen: {
        backgroundColor: theme === 'dark' ? '#1a1a1a' : '#ffffff',
        foregroundColor: theme === 'dark' ? '#ffffff' : '#000000'
      },
      datafeed: {
        onReady: (callback: any) => {
          setTimeout(() => callback({
            exchanges: [],
            symbols_types: [],
            supported_resolutions: ['1', '5', '15', '30', '60', '240', '1D']
          }), 0)
        },
        searchSymbols: () => {},
        resolveSymbol: (symbolName: string, onSymbolResolvedCallback: any) => {
          setTimeout(() => onSymbolResolvedCallback({
            name: symbolName,
            full_name: symbolName,
            description: symbolName,
            type: 'forex',
            session: '24x7',
            timezone: 'Etc/UTC',
            ticker: symbolName,
            exchange: '',
            minmov: 1,
            pricescale: 100000,
            has_intraday: true,
            supported_resolutions: ['1', '5', '15', '30', '60', '240', '1D'],
            volume_precision: 2,
            data_status: 'streaming'
          }), 0)
        },
        getBars: () => {},
        subscribeBars: () => {},
        unsubscribeBars: () => {}
      }
    })

    // Add annotations after chart is ready
    if (annotations && widgetRef.current) {
      widgetRef.current.onChartReady(() => {
        addAnnotations(annotations)
      })
    }
  }

  const addAnnotations = (annotations: ChartAnnotations) => {
    if (!widgetRef.current) return

    const chart = widgetRef.current.chart()

    // Add horizontal price lines
    if (annotations.entry_price) {
      chart.createShape(
        { time: Date.now() / 1000, price: annotations.entry_price },
        {
          shape: 'horizontal_line',
          overrides: {
            linecolor: '#00ff88',
            linewidth: 2,
            linestyle: 0,
            showLabel: true,
            textcolor: '#00ff88',
            text: `Entry: ${annotations.entry_price}`
          }
        }
      )
    }

    if (annotations.stop_loss) {
      chart.createShape(
        { time: Date.now() / 1000, price: annotations.stop_loss },
        {
          shape: 'horizontal_line',
          overrides: {
            linecolor: '#ff4444',
            linewidth: 2,
            linestyle: 0,
            showLabel: true,
            textcolor: '#ff4444',
            text: `SL: ${annotations.stop_loss}`
          }
        }
      )
    }

    if (annotations.take_profit_1) {
      chart.createShape(
        { time: Date.now() / 1000, price: annotations.take_profit_1 },
        {
          shape: 'horizontal_line',
          overrides: {
            linecolor: '#ffaa00',
            linewidth: 2,
            linestyle: 2,
            showLabel: true,
            textcolor: '#ffaa00',
            text: `TP1: ${annotations.take_profit_1}`
          }
        }
      )
    }

    // Add supply zones as rectangles
    annotations.supply_zones?.forEach((zone, index) => {
      chart.createShape(
        [
          { time: Date.now() / 1000 - 86400, price: zone.high },
          { time: Date.now() / 1000, price: zone.low }
        ],
        {
          shape: 'rectangle',
          overrides: {
            color: '#ff444444',
            transparency: 70,
            showLabel: true,
            text: `Supply Zone ${index + 1}`
          }
        }
      )
    })

    // Add demand zones as rectangles
    annotations.demand_zones?.forEach((zone, index) => {
      chart.createShape(
        [
          { time: Date.now() / 1000 - 86400, price: zone.high },
          { time: Date.now() / 1000, price: zone.low }
        ],
        {
          shape: 'rectangle',
          overrides: {
            color: '#00ff8844',
            transparency: 70,
            showLabel: true,
            text: `Demand Zone ${index + 1}`
          }
        }
      )
    })
  }

  return (
    <div 
      ref={chartContainerRef}
      className="tradingview-chart"
      style={{ height: `${height}px`, width: '100%' }}
    />
  )
}

// Add TradingView types to window
declare global {
  interface Window {
    TradingView: any
  }
}

export default TradingViewChart