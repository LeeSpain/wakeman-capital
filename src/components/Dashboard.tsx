import React from 'react';

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-bold text-card-foreground mb-4">
          Trading Dashboard
        </h2>
        <p className="text-muted-foreground">
          Welcome back! Your trading analytics dashboard is loading...
        </p>
      </div>
    </div>
  );
};

export default Dashboard;