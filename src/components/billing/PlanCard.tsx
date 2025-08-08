import React from 'react';
import { Button } from '../ui/button';

interface PlanCardProps {
  title: string;
  price: string;
  period?: string;
  features: string[];
  cta: string;
  onClick?: () => void;
  disabled?: boolean;
}

export const PlanCard: React.FC<PlanCardProps> = ({ title, price, period = 'month', features, cta, onClick, disabled }) => {
  return (
    <article className="rounded-lg border border-border bg-card p-6 flex flex-col">
      <header className="mb-4">
        <h3 className="text-xl font-semibold text-foreground">{title}</h3>
        <p className="mt-2 text-3xl font-bold text-foreground">
          {price}
          <span className="text-sm font-normal text-muted-foreground">/{period}</span>
        </p>
      </header>

      <ul className="mt-2 mb-6 space-y-2 text-sm text-card-foreground/90">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2">
            <span aria-hidden>•</span>
            <span>{f}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto">
        <Button onClick={onClick} disabled={disabled} className="w-full">{cta}</Button>
        {disabled && (
          <p className="mt-2 text-xs text-muted-foreground">Connect Stripe to enable checkout.</p>
        )}
      </div>
    </article>
  );
};

export default PlanCard;
