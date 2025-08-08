import React from 'react';
import { Link } from 'react-router-dom';

const MarketingFooter: React.FC = () => {
  return (
    <footer className="border-t border-border bg-card/50">
      <div className="max-w-7xl mx-auto px-4 py-10 grid md:grid-cols-3 gap-8 text-sm">
        <div>
          <div className="font-bold text-card-foreground mb-2">Wakeman Capital</div>
          <p className="text-muted-foreground">AI-driven market intelligence for modern traders.</p>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="font-medium text-card-foreground mb-2">Product</div>
            <ul className="space-y-1 text-muted-foreground">
              <li><Link to="/trends" className="hover:text-foreground">Features</Link></li>
              <li><Link to="/billing" className="hover:text-foreground">Pricing</Link></li>
              <li><Link to="/signal-center" className="hover:text-foreground">Signal Center</Link></li>
              <li><Link to="/coach" className="hover:text-foreground">AI Coach</Link></li>
            </ul>
          </div>
          <div>
            <div className="font-medium text-card-foreground mb-2">Company</div>
            <ul className="space-y-1 text-muted-foreground">
              <li><Link to="/" className="hover:text-foreground">Home</Link></li>
              <li><Link to="/dashboard" className="hover:text-foreground">Dashboard</Link></li>
            </ul>
          </div>
        </div>
        <div className="md:text-right text-muted-foreground">© {new Date().getFullYear()} Wakeman Capital. All rights reserved.</div>
      </div>
    </footer>
  );
};

export default MarketingFooter;
