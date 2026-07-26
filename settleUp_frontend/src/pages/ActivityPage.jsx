import { useNavigate } from 'react-router-dom';
import { Activity, Clock } from 'lucide-react';
import SideNavbar from '../components/SideNavbar';

export default function ActivityPage({ isDark }) {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem('jwt_token');
    navigate('/auth');
  };

  const shellClasses = isDark ? 'bg-slate-950 text-slate-50' : 'bg-slate-100 text-slate-900';

  return (
    <div className={`min-h-screen flex transition-colors ${shellClasses}`}>
      <SideNavbar isDark={isDark} handleLogout={handleLogout} />
      
      <main className="flex-1 md:ml-64 p-6 sm:p-10 lg:p-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <header>
            <p className={`text-sm font-semibold uppercase tracking-wider ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
              History
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold mt-1">Recent Activity</h1>
          </header>

          <div className={`text-center py-20 rounded-3xl border border-dashed ${isDark ? 'border-slate-800 bg-slate-900/30' : 'border-slate-300 bg-white'}`}>
            <Clock className={`w-12 h-12 mx-auto mb-4 ${isDark ? 'text-slate-600' : 'text-slate-400'}`} />
            <h3 className="text-xl font-bold mb-2">Coming Soon</h3>
            <p className={`${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              This page will show a chronological feed of all expenses and settlements across your groups.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}