import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Activity, Settings, LogOut, Wallet, Bell } from 'lucide-react';
import apiClient from '../api/axiosConfig';

export default function SideNavbar({ isDark, handleLogout }) {
  const location = useLocation();
  const [inviteCount, setInviteCount] = useState(0);

  useEffect(() => {
    const fetchInviteCount = async () => {
      try {
        const { data } = await apiClient.get('/groups/invites/me');
        if (Array.isArray(data)) {
          setInviteCount(data.length);
        }
      } catch (error) {
        console.error("Failed to fetch invite count");
      }
    };
    fetchInviteCount();
  }, [location.pathname]); // Re-fetch when navigating

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'All Groups', path: '/dashboard', icon: Users },
    { name: 'Notifications', path: '/notifications', icon: Bell, badge: inviteCount },
    { name: 'Activity', path: '/activity', icon: Activity },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside className={`fixed left-0 top-0 h-screen w-64 border-r hidden md:flex flex-col justify-between transition-colors z-30 ${
      isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
    }`}>
      {/* Brand Header */}
      <div className="h-24 flex items-center px-8 border-b border-transparent">
        <Link to="/" className="flex items-center gap-3">
          <div className={`p-2 rounded-xl shadow-sm ${isDark ? 'bg-emerald-500/20' : 'bg-emerald-600/10'}`}>
            <Wallet className={`w-6 h-6 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
          </div>
          <span className={`text-2xl font-bold tracking-tight ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
            SettleUp
          </span>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-8 space-y-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path && item.path !== '#';
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center justify-between px-4 py-3.5 rounded-2xl font-semibold transition-all ${
                isActive
                  ? (isDark ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-600 shadow-sm border border-emerald-100')
                  : (isDark ? 'text-slate-400 hover:bg-slate-900 hover:text-slate-200' : 'text-slate-500 hover:bg-slate-200/50 hover:text-slate-900')
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className="w-5 h-5" />
                {item.name}
              </div>
              {/* Notification Badge */}
              {item.badge > 0 && (
                <span className="bg-rose-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-transparent">
        <button
          onClick={handleLogout}
          className={`flex items-center gap-3 w-full px-4 py-3.5 rounded-2xl font-semibold transition-all ${
            isDark ? 'text-slate-400 hover:bg-slate-900 hover:text-rose-400' : 'text-slate-500 hover:bg-rose-50 hover:text-rose-600'
          }`}
        >
          <LogOut className="w-5 h-5" />
          Log Out
        </button>
      </div>
    </aside>
  );
}