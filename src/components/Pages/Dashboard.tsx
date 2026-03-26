import { useMemo } from 'react';
import DashboardLayout from '../common/DashboardLayout';
import OwnerDashboard from './OwnerDashboard';
import TenantDashboard from './TenantDashboard';
import AdminDashboard from '../../features/admin/components/AdminDashboard';
import AdminUserManagement from '../../features/admin/components/AdminUserManagement';
import { useLocation } from 'react-router-dom';
import { RoleTypes, type RoleType } from '../../types/Constants/role.constant';
import { API_ROUTES } from '../../config/routes';

function Dashboard() {
  const location = useLocation();
  const user = useMemo<{ fullname: string; role: RoleType } | null>(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  }, []);

  if (!user) return <div className="flex items-center justify-center h-screen font-bold text-primary">Loading RentEase...</div>;

  const renderContent = () => {
    if (location.pathname === API_ROUTES.ADMIN_USERS && user.role === RoleTypes.ADMIN_USER) {
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
