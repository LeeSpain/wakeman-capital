import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { Badge } from '../ui/badge';
import { useTrends } from '../../hooks/useTrends';
import { useTopOpportunities } from '../../hooks/useSignals';
import { useMarketPrices } from '../../hooks/useMarketPrices';

const clampPercent = (n: number | null | undefined) => {
  if (n == null) return 0;
  const v = n <= 1 ? n * 100 : n;
  return Math.max(0, Math.min(100, Math.round(v)));
};

const TrendRow: React.FC<{
  symbol: string;
  timeframe: string;
  direction?: string | null;
  strength?: number | null;
  aligned?: boolean | null;
  timestamp?: string;
}> = ({ symbol, timeframe, direction, strength, aligned, timestamp }) => {
  const dir = (direction || '').toLowerCase();
  const isUp = dir.includes('up') || dir.includes('bull') || dir.includes('long') || dir.includes('buy');
  const isDown = dir.includes('down') || dir.includes('bear') || dir.includes('short') || dir.includes('sell');
  const pct = clampPercent(strength);

  return (
    <div className="rounded-lg border border-border bg-background/60 p-3">
      <div className="flex items-center justify-between mb-2">
        <div>
          <div className="text-sm font-semibold text-card-foreground">{symbol}</div>
          <div className="text-[11px] text-muted-foreground">{timeframe}</div>
        </div>
        <div className="flex items-center gap-2">
          {isUp && <ArrowUpRight className="text-primary" size={18} />}
          {isDown && !isUp && <ArrowDownRight className="text-destructive" size={18} />}
          {!isUp && !isDown && <span className="text-xs text-muted-foreground">—</span>}
          {aligned && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">HTF</span>
          )}
        </div>
      </div>
      <div className="h-2 rounded bg-muted overflow-hidden">
        <div
          className={`${isUp ? 'bg-primary' : isDown ? 'bg-destructive' : 'bg-muted-foreground'} h-2 transition-all`}
          style={{ width: `${pct}%` }}
        />
      </div>
      {timestamp && (
        <div className="mt-2 text-[10px] text-muted-foreground">
          {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      )}
    </div>
  );
};

const PhoneMockup: React.FC<{ targetHeight?: number }> = ({ targetHeight }) => {
  const { data, loading } = useTrends();
  const items = useMemo(() => data.slice(0, 3), [data]);
  const { data: topSignals } = useTopOpportunities();
  const { getPrice, lastUpdated } = useMarketPrices();
  const signalsCount = topSignals?.length ?? 0;
  const btcPrice = getPrice('bitcoin');
  const latestTs = items[0]?.analysis_timestamp ?? (lastUpdated ? new Date(lastUpdated).toISOString() : null);
  const timeLabel = latestTs ? new Date(latestTs).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : null;

  const phoneRef = useRef<HTMLDivElement>(null);
  const [naturalH, setNaturalH] = useState<number | null>(null);
  const [scale, setScale] = useState(1);
  const [isMd, setIsMd] = useState<boolean>(() => (typeof window !== 'undefined' ? window.innerWidth >= 768 : true));

  useEffect(() => {
    const onResize = () => setIsMd(window.innerWidth >= 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    const el = phoneRef.current;
    if (!el) return;
    const measure = () => setNaturalH(el.getBoundingClientRect().height);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [items, loading]);

  useEffect(() => {
    if (!isMd) {
      setScale(1);
      return;
    }
    if (!targetHeight || !naturalH) {
      setScale(1);
      return;
    }
    const s = Math.min(1, targetHeight / naturalH);
    setScale(s);
  }, [targetHeight, naturalH, isMd]);

  const scaledHeight = isMd && naturalH ? naturalH * scale : undefined;
  return (
<div className="relative w-full mx-auto animate-fade-in">
  <div
    className="relative"
    style={{
      height: scaledHeight ? `${scaledHeight}px` : undefined,
      transform: isMd ? `scale(${scale})` : undefined,
      transformOrigin: 'top center'
    }}
  >
    <div ref={phoneRef} className="relative mx-auto max-w-[360px] aspect-[9/19.5] rounded-[2rem] border border-border bg-background shadow-elegant">
      {/* Notch */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-5 rounded-b-2xl bg-card border border-border/60" />
      {/* Screen */}
      <div className="absolute inset-2 rounded-[1.6rem] bg-card border border-border overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-primary/5">
          <div className="flex items-center gap-2">
            <span className="relative inline-flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-75 animate-[ping_1s_linear_infinite]" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary" />
            </span>
            <span className="text-xs font-semibold text-primary uppercase tracking-wide">Live</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-muted-foreground">Wakeman Capital</span>
            {signalsCount > 0 && (
              <span className="text-[10px] px-2 py-0.5 rounded-full border border-border text-muted-foreground">Sigs {signalsCount}</span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          {loading && (
            <>
              <div className="h-16 rounded-lg bg-muted/40 animate-pulse" />
              <div className="h-16 rounded-lg bg-muted/40 animate-pulse" />
              <div className="h-16 rounded-lg bg-muted/40 animate-pulse" />
            </>
          )}
          {!loading && items.map((it) => (
            <TrendRow
              key={it.id}
              symbol={it.symbol}
              timeframe={it.timeframe}
              direction={it.trend_direction}
              strength={it.trend_strength}
              aligned={it.higher_tf_alignment}
              timestamp={it.analysis_timestamp}
            />
          ))}
          {!loading && items.length === 0 && (
            <div className="text-center text-xs text-muted-foreground py-8">No data yet — check back soon.</div>
          )}
        </div>

        {/* Footer handle */}
        <div className="absolute bottom-0 inset-x-0 px-4 py-3 bg-background/60 backdrop-blur border-t border-border">
          {(btcPrice || timeLabel) && (
            <div className="text-[10px] text-muted-foreground text-center mb-1">
              {btcPrice ? `BTC $${btcPrice.toLocaleString()}` : ''}{btcPrice && timeLabel ? ' • ' : ''}{timeLabel ?? ''}
            </div>
          )}
          <div className="mx-auto h-1.5 w-20 rounded-full bg-muted" />
        </div>
      </div>
    </div>
  </div>
  {/* Overlay badge to match hero style */}
  <div className="absolute -top-2 -left-2">
    <Badge variant="secondary" className="bg-secondary/80 backdrop-blur">AI</Badge>
  </div>
</div>
  );
};

export default PhoneMockup;
