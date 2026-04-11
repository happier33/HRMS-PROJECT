import React, { useState } from 'react';
import { useAuth, useUI } from '@/app/store';
import { MobileMenuButton } from './Sidebar';
import {
  Search, Bell, ChevronDown, Settings, LogOut, UserCircle, Menu,
} from 'lucide-react';

const Header: React.FC = () => {
  const { auth } = useAuth();
  const { ui, setCurrentPage } = useUI();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: 1, text: 'New leave request from Alice Johnson', time: '5 min ago', unread: true },
    { id: 2, text: 'Payroll processing completed for January', time: '1 hour ago', unread: true },
    { id: 3, text: 'Nathan Clark updated his profile', time: '3 hours ago', unread: false },
    { id: 4, text: 'Attendance report generated', time: 'Yesterday', unread: false },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  // Page title mapping
  const pageTitles: Record<string, string> = {
    dashboard: 'Dashboard',
    'employees/list': 'Employee Directory',
    'employees/add': 'Add Employee',
    'employees/departments': 'Departments',
    'attendance/daily': 'Daily Attendance',
    'attendance/reports': 'Attendance Reports',
    'leave/requests': 'Leave Requests',
    'leave/apply': 'Apply for Leave',
    'leave/balance': 'Leave Balance',
    'payroll/list': 'Payroll',
    'payroll/payslips': 'Payslips',
    profile: 'My Profile',
    reports: 'Reports',
    settings: 'Settings',
  };

  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <MobileMenuButton />
        <div>
          <h1 className="text-lg font-semibold text-foreground">
            {pageTitles[ui.currentPage] || 'Dashboard'}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="hidden md:flex items-center relative">
          <Search className="absolute left-3 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search anything..."
            className="hrms-input pl-9 w-64 bg-muted/50"
          />
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => { setShowNotifications(!showNotifications); setShowUserMenu(false); }}
            className="relative p-2.5 rounded-lg hover:bg-muted transition-colors"
          >
            <Bell className="w-5 h-5 text-muted-foreground" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
              <div className="absolute right-0 top-full mt-2 w-80 bg-card rounded-xl border border-border shadow-xl z-50 animate-scale-in">
                <div className="px-4 py-3 border-b border-border">
                  <h3 className="text-sm font-semibold text-foreground">Notifications</h3>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.map(n => (
                    <div
                      key={n.id}
                      className={`px-4 py-3 border-b border-border last:border-0 hover:bg-muted/50 cursor-pointer transition-colors ${n.unread ? 'bg-primary/5' : ''}`}
                    >
                      <p className="text-sm text-foreground">{n.text}</p>
                      <p className="text-xs text-muted-foreground mt-1">{n.time}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => { setShowUserMenu(!showUserMenu); setShowNotifications(false); }}
            className="flex items-center gap-2 p-1.5 pr-3 rounded-lg hover:bg-muted transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
              {auth.user?.avatar || 'U'}
            </div>
            <span className="hidden md:block text-sm font-medium text-foreground">{auth.user?.name}</span>
            <ChevronDown className="w-4 h-4 text-muted-foreground hidden md:block" />
          </button>

          {showUserMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
              <div className="absolute right-0 top-full mt-2 w-56 bg-card rounded-xl border border-border shadow-xl z-50 animate-scale-in">
                <div className="px-4 py-3 border-b border-border">
                  <p className="text-sm font-semibold text-foreground">{auth.user?.name}</p>
                  <p className="text-xs text-muted-foreground">{auth.user?.email}</p>
                </div>
                <div className="py-1">
                  <button
                    onClick={() => { setCurrentPage('profile'); setShowUserMenu(false); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
                  >
                    <UserCircle className="w-4 h-4 text-muted-foreground" />
                    My Profile
                  </button>
                  <button
                    onClick={() => { setCurrentPage('settings'); setShowUserMenu(false); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
                  >
                    <Settings className="w-4 h-4 text-muted-foreground" />
                    Settings
                  </button>
                </div>
                <div className="border-t border-border py-1">
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      // Small delay for visual feedback
                      setTimeout(() => {
                        window.location.reload();
                      }, 100);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
