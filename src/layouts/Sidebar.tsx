import React, { useEffect, useRef } from 'react';
import { useStore, useUI, useAuth } from '@/app/store';
import { SIDEBAR_MENU } from '@/services/constants';
import { hasRole } from '@/utils/hasRole';
import { useLogoutMutation } from '@/services/authApi';
import {
  LayoutDashboard, Users, Clock, CalendarOff, Wallet,
  UserCircle, TrendingUp, Settings, Building2, ChevronRight,
  List, UserPlus, CalendarDays,
  BarChart3, FileText, PlusCircle, PieChart, Receipt,
  FileSpreadsheet, LogOut, Menu, X,
} from 'lucide-react';


// Icon map for dynamic rendering
const iconMap: Record<string, React.FC<{ className?: string }>> = {
  LayoutDashboard, Users, Clock, CalendarOff, Wallet,
  UserCircle, TrendingUp, Settings, Building2,
  List, UserPlus, CalendarDays,
  BarChart3, FileText, PlusCircle, PieChart, Receipt,
  FileSpreadsheet,
};


const Sidebar: React.FC = () => {
  const { auth } = useAuth();
  const { ui, setCurrentPage, setFloatingPanel, toggleSidebar } = useUI();
  const { dispatch } = useStore();
  const panelRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [logout] = useLogoutMutation();
  const userRole = auth.user?.role;

  // Close floating panel on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        ui.floatingPanelOpen &&
        panelRef.current &&
        !panelRef.current.contains(e.target as Node) &&
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target as Node)
      ) {
        setFloatingPanel(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [ui.floatingPanelOpen, setFloatingPanel]);

  const filteredMenu = SIDEBAR_MENU.filter(item =>
    userRole ? hasRole(userRole, item.roles) : false
  );

  const handleMenuClick = (item: typeof SIDEBAR_MENU[0]) => {
    if (item.subItems && item.subItems.length > 0) {
      // Toggle floating panel
      setFloatingPanel(ui.floatingPanelOpen === item.id ? null : item.id);
    } else if (item.page) {
      setCurrentPage(item.page);
      setFloatingPanel(null);
    }
  };

  const handleSubItemClick = (page: string) => {
    setCurrentPage(page);
    setFloatingPanel(null);
  };

  const handleLogout = async () => {

    try {
      await logout().unwrap();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      dispatch({ type: 'AUTH_LOGOUT' });
    }
  };

  const getIcon = (iconName: string, className: string = 'w-5 h-5') => {
    const Icon = iconMap[iconName];
    return Icon ? <Icon className={className} /> : <LayoutDashboard className={className} />;
  };

  // Find the active floating panel menu item for positioning
  const activeFloatingItem = filteredMenu.find(m => m.id === ui.floatingPanelOpen);

  return (
    <>
      {/* Mobile overlay */}
      {ui.sidebarCollapsed && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={toggleSidebar} />
      )}

      <aside
        ref={sidebarRef}
        className={`
          fixed top-0 left-0 h-full z-50
          w-[260px] flex flex-col
          transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:z-auto
          ${ui.sidebarCollapsed ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
        style={{ background: 'hsl(var(--sidebar-background))' }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-5 h-16 border-b" style={{ borderColor: 'hsl(var(--sidebar-border))' }}>
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <span className="text-base font-bold text-white tracking-tight">HRMS Pro</span>
          <button
            onClick={toggleSidebar}
            className="ml-auto lg:hidden p-1.5 rounded-lg hover:bg-white/10 text-white/60"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto scrollbar-thin">
          <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest" style={{ color: 'hsl(var(--sidebar-muted))' }}>
            Main Menu
          </p>
          {filteredMenu.map(item => {
            const isActive = ui.currentPage === item.page || ui.currentPage.startsWith(item.id + '/');
            const isPanelOpen = ui.floatingPanelOpen === item.id;

            return (
              <div key={item.id} className="relative">
                <button
                  onClick={() => handleMenuClick(item)}
                  className={`
                    w-full hrms-sidebar-item
                    ${isActive ? 'active' : ''}
                    ${isPanelOpen ? 'bg-white/10 text-white' : ''}
                  `}
                >
                  {getIcon(item.icon)}
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.subItems && (
                    <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${isPanelOpen ? 'rotate-90' : ''}`} />
                  )}
                </button>
              </div>
            );
          })}
        </nav>

        {/* User Profile */}
        {auth.user && (
          <div className="p-3 border-t" style={{ borderColor: 'hsl(var(--sidebar-border))' }}>
            <div className="flex items-center gap-3 px-3 py-2">
              <div className="w-9 h-9 rounded-full bg-indigo-500 flex items-center justify-center text-white text-sm font-bold">
                {auth.user.avatar || auth.user.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{auth.user.name}</p>
                <p className="text-xs truncate" style={{ color: 'hsl(var(--sidebar-muted))' }}>{auth.user.role}</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" style={{ color: 'hsl(var(--sidebar-muted))' }} />
              </button>
            </div>
          </div>
        )}
      </aside>

      {/* Floating Panel */}
      {activeFloatingItem && activeFloatingItem.subItems && (
        <div
          ref={panelRef}
          className="fixed lg:absolute lg:left-[260px] left-[260px] top-0 h-full flex items-start pt-24 z-50"
        >
          <div className="bg-card rounded-xl border border-border shadow-2xl p-4 min-w-[300px] animate-scale-in">
            <div className="mb-3">
              <h3 className="text-sm font-bold text-foreground">{activeFloatingItem.label}</h3>
              <p className="text-xs text-muted-foreground">Navigate to a section</p>
            </div>
            <div className="space-y-1">
              {activeFloatingItem.subItems.map(sub => (
                <button
                  key={sub.page}
                  onClick={() => handleSubItemClick(sub.page)}
                  className={`
                    w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-all duration-150
                    hover:bg-muted group
                    ${ui.currentPage === sub.page ? 'bg-primary/5 border border-primary/20' : ''}
                  `}
                >
                  <div className={`p-2 rounded-lg transition-colors ${
                    ui.currentPage === sub.page ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'
                  }`}>
                    {getIcon(sub.icon, 'w-4 h-4')}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{sub.label}</p>
                    {sub.description && (
                      <p className="text-xs text-muted-foreground">{sub.description}</p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;

// ── Mobile Menu Button (for header) ──
export const MobileMenuButton: React.FC = () => {
  const { toggleSidebar } = useUI();
  return (
    <button
      onClick={toggleSidebar}
      className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
    >
      <Menu className="w-5 h-5 text-foreground" />
    </button>
  );
};
