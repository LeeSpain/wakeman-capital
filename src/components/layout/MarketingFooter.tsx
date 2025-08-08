import React from 'react';
import { Link } from 'react-router-dom';

const MarketingFooter: React.FC = () => {
  return (
    <footer className="border-t border-border bg-card/50">
      <div className="max-w-7xl mx-auto px-4 py-10 grid md:grid-cols-3 gap-8 text-sm">
        <div>
          <div className="font-bold text-card-foreground mb-2">Trend Pulse</div>
          <p className="text-muted-foreground">AI-driven market sentiment for modern traders.</p>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="font-medium text-card-foreground mb-2">Product</div>
            <ul className="space-y-1 text-muted-foreground">
              <li><Link to="/trends" className="hover:text-foreground">Features</Link></li>
              <li><Link to="/billing" className="hover:text-foreground">Pricing</Link></li>
              <li><Link to="/signal-center" className="hover:text-foreground">Signal Center</Link></li>
            </ul>
          </div>
          <div>
            <div className="font-medium text-card-foreground mb-2">Company</div>
            <ul className="space-y-1 text-muted-foreground">
              <li><a href="/" className="hover:text-foreground">Home</a></li>
              <li><a href="/dashboard" className="hover:text-foreground">Dashboard</a></li>
            </ul>
          </div>
        </div>
        <div className="md:text-right text-muted-foreground">© {new Date().getFullYear()} Trend Pulse. All rights reserved.</div>
      </div>
    </footer>
  );
};

export default MarketingFooter;
