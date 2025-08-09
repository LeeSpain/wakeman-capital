import React from 'react';
import { useTopOpportunities } from '../../hooks/useSignals';

export const TopOpportunities: React.FC = () => {
  const { data, loading, error } = useTopOpportunities();
  const rows = data.slice(0, 5);

  return (
    <section className="rounded-xl border border-border bg-card p-6">
      <h4 className="text-xl font-semibold text-card-foreground mb-3">Top Opportunities</h4>
      {loading ? (
        <p className="text-sm text-muted-foreground">Loading opportunities...</p>
      ) : error ? (
        <p className="text-sm text-destructive">Error: {error}</p>
      ) : rows.length === 0 ? (
        <p className="text-sm text-muted-foreground">No trading opportunities available yet.</p>
      ) : (
        <ul className="divide-y divide-border">
          {rows.map(s => (
            <li key={s.id} className="py-3 flex items-center justify-between">
              <div>
                <div className="font-medium">{s.symbol} · {s.timeframe}</div>
                <div className="text-xs text-muted-foreground">{s.direction} · RR {s.risk_reward_ratio?.toFixed?.(2) ?? s.risk_reward_ratio}</div>
              </div>
              <span className="text-xs px-2 py-1 rounded border border-border">Conf {Math.round(s.confidence_score)}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default TopOpportunities;
