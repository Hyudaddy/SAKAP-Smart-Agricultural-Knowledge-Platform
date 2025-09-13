import React from 'react';
import { useLocation } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import FloatingChatbot from '@/components/FloatingChatbot';
import AdminDashboard from '@/components/dashboards/AdminDashboard';
import AEWDashboard from '@/components/dashboards/AEWDashboard';
import PublicDashboard from '@/components/dashboards/PublicDashboard';

const Dashboard = () => {
  const location = useLocation();
  const userRole = location.state?.userRole || sessionStorage.getItem('userRole') || 'public';

  const renderDashboard = () => {
    switch (userRole) {
      case 'admin':
        return <AdminDashboard />;
      case 'aew':
        return <AEWDashboard />;
      case 'public':
        return <PublicDashboard />;
      default:
        return <PublicDashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-background w-full">
      <Navigation userRole={userRole} />
      <main className="flex-1 overflow-auto ml-64">
        {renderDashboard()}
      </main>
      <FloatingChatbot />
    </div>
  );
};

export default Dashboard;