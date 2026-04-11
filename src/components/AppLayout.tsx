import React from 'react';
import { StoreProvider, useAuth, useUI } from '@/app/store';
import ToastContainer from '@/components/feedback/Toast';
import Login from '@/pages/auth/Login';
import ForgotPassword from '@/pages/auth/ForgotPassword';
import ResetPassword from '@/pages/auth/ResetPassword';

import MainLayout from '@/layouts/MainLayout';

// ── Lazy-loaded page imports ──
import AdminDashboard from '@/pages/Dashboard';
import HRDashboard from '@/pages/hr/Dashboard';
import EmployeeDashboard from '@/pages/employee/Dashboard';
import EmployeesPage from '@/pages/hr/Employees';
import AttendanceTable from '@/features/attendance/AttendanceTable';
import LeaveRequestPage from '@/features/leave/LeaveRequest';
import PayrollTable from '@/features/payroll/PayrollTable';
import ProfilePage from '@/pages/employee/Profile';
import SettingsPage from '@/pages/Settings';
import ReportsPage from '@/pages/Reports';
import DepartmentsPage from '@/pages/Departments';
import LeaveBalancePage from '@/pages/LeaveBalance';
import UserTable from '@/features/users/UserTable';
import PermissionTable from '@/features/permission/PermissionTable';
import RoleTable from '@/features/roles/RoleTable';


/**
 * Page Router — renders the correct page based on ui.currentPage state
 */
const PageRouter: React.FC = () => {
  const { auth } = useAuth();
  const { ui } = useUI();
  const role = auth.user?.role;

 

  // Dashboard routing based on role
  if (ui.currentPage === 'dashboard') {
    switch (role) {
      case 'ADMIN': return <AdminDashboard />;
      case 'HR': return <HRDashboard />;
      case 'EMPLOYEE': return <EmployeeDashboard />;
      default: return <AdminDashboard />;
    }
  }

  // Page routing
  const pageMap: Record<string, React.ReactNode> = {
    'employees/list': <EmployeesPage />,
    'employees/add': <EmployeesPage />,
    'employees/departments': <DepartmentsPage />,
    'attendance/daily': <AttendanceTable />,
    'attendance/reports': <AttendanceTable />,
    'leave/requests': <LeaveRequestPage />,
    'leave/apply': <LeaveRequestPage />,
    'leave/balance': <LeaveBalancePage />,
    'payroll/list': <PayrollTable />,
    'payroll/payslips': <PayrollTable />,
    'profile': <ProfilePage />,
    'reports': <ReportsPage />,
    'settings': <SettingsPage />,
    'users/list': <UserTable />,
    'permissions/list': <PermissionTable />,
    'roles/list': <RoleTable />,
  };

  return <>{pageMap[ui.currentPage] || <AdminDashboard />}</>;
};

/**
 * App Shell — handles authentication state
 */
const AppShell: React.FC = () => {
  const { auth } = useAuth();
  const { ui } = useUI();

  if (!auth.isAuthenticated) {
    switch (ui.currentPage) {
      case 'login':
        return <Login />;
      case 'forgot-password':
        return <ForgotPassword />;
      case 'reset-password':
        return <ResetPassword />;
      default:
        return <Login />;
    }
  }

  return (
    <MainLayout>
      <PageRouter />
    </MainLayout>
  );
};

/**
 * AppLayout — Root component wrapped with StoreProvider
 */
const AppLayout: React.FC = () => {
  return (
    <StoreProvider>
      <AppShell />
      <ToastContainer />
    </StoreProvider>
  );
};

export default AppLayout;
