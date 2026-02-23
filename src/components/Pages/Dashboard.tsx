import React, { useState, useEffect } from 'react';
import DashboardLayout from '../Common/DashboardLayout';
import OwnerDashboard from './OwnerDashboard';
import TenantDashboard from './TenantDashboard';
import AdminDashboard from './AdminDashboard';
import AdminUserManagement from './AdminUserManagement';
import { useLocation } from 'react-router-dom';

function Dashboard() {
  const location = useLocation();
  const [user, setUser] = useState<{ fullname: string; role: 'ADMIN' | 'OWNER' | 'TENANT' } | null>(null);

  useEffect(() => {

    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {

      setUser({ fullname: 'Nanda Kumar', role: 'OWNER' });
    }
  }, []);

  if (!user) return <div className="flex items-center justify-center h-screen font-bold text-primary">Loading RentEase...</div>;

  const renderContent = () => {
    if (location.pathname === '/admin/users' && user.role === 'ADMIN') {
      return <AdminUserManagement />;
    }

    switch (user.role) {
      case 'ADMIN': return <AdminDashboard />;
      case 'OWNER': return <OwnerDashboard />;
      case 'TENANT': return <TenantDashboard />;
      default: return <div>Role not recognized</div>;
    }
  };

  return (
    <DashboardLayout role={user.role} userName={user.fullname}>
      {renderContent()}
    </DashboardLayout>
  );
}

export default Dashboard;
