import React from 'react';
import { Helmet } from 'react-helmet-async';
import AdminDashboard from '../components/admin/AdminDashboard';
import { useUserRole } from '../hooks/useUserRole';

const Admin = () => {
  const { isAdmin, loading } = useUserRole();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Access Denied</h1>
          <p className="text-muted-foreground">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Admin Dashboard | Wakeman Capital</title>
        <meta name="description" content="Admin dashboard for managing SaaS subscriptions and profit-based billing." />
        <link rel="canonical" href="/admin" />
      </Helmet>
      
      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <AdminDashboard />
        </div>
      </main>
    </>
  );
};

export default Admin;