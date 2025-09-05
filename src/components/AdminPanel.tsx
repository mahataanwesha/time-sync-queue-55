import React from 'react';
import { AdminHeader } from './AdminHeader';
import { QueueDashboard } from './QueueDashboard';

export const AdminPanel: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      <main className="container mx-auto px-4 py-8">
        <QueueDashboard />
      </main>
    </div>
  );
};