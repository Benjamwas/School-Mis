import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, CalendarDays, FileText, Images, School,
  Quote, Users, FolderOpen, Inbox, Settings, LogOut, Menu, X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/events', label: 'Events', icon: CalendarDays },
  { to: '/admin/blog', label: 'Blog', icon: FileText },
  { to: '/admin/gallery', label: 'Gallery', icon: Images },
  { to: '/admin/campuses', label: 'Campuses', icon: School },
  { to: '/admin/testimonials', label: 'Testimonials', icon: Quote },
  { to: '/admin/staff', label: 'Staff', icon: Users },
  { to: '/admin/media', label: 'Media Library', icon: FolderOpen },
  { to: '/admin/leads', label: 'Leads', icon: Inbox },
  { to: '/admin/settings', label: 'Settings', icon: Settings }
];

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-40 w-64 bg-gray-900 text-white transition-transform duration-200 flex flex-col`}>
        <div className="px-5 py-5 border-b border-gray-700 flex items-center justify-between">
          <div>
            <div className="text-lg font-bold">
              <span className="text-red-500">Vendramini</span> CMS
            </div>
            <div className="text-xs text-gray-400 mt-0.5">Admin Dashboard</div>
          </div>
          <button className="lg:hidden text-gray-400 hover:text-white" onClick={() => setSidebarOpen(false)}>
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto py-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center px-5 py-2.5 text-sm transition-colors ${
                  isActive
                    ? 'bg-red-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`
              }
            >
              <item.icon className="h-4 w-4 mr-3" />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-gray-700 p-4">
          <div className="text-sm text-gray-300 mb-2 truncate">{user?.email}</div>
          <button
            onClick={handleLogout}
            className="flex items-center w-full text-sm text-gray-300 hover:text-white transition-colors"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign out
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white shadow-sm px-4 py-3 flex items-center justify-between sticky top-0 z-20">
          <button className="lg:hidden text-gray-600" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-6 w-6" />
          </button>
          <div className="text-sm text-gray-500 hidden lg:block">Vendramini Schools · Content Management</div>
          <div className="text-sm text-gray-700 font-medium">{user?.name}</div>
        </header>
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
