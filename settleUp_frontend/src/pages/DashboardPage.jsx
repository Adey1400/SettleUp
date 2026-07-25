import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, LogOut, Wallet, Users, ReceiptText } from 'lucide-react';
import apiClient from '../api/axiosConfig';

export default function DashboardPage({ isDark }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('jwt_token');
    if (!token) {
      navigate('/auth');
      return;
    }

    apiClient.get('/users/me')
      .then(({ data }) => setUser(data))
      .catch(() => {
        localStorage.removeItem('jwt_token');
        navigate('/auth');
      });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('jwt_token');
    navigate('/auth');
  };

  const shellClasses = isDark
    ? 'border-slate-800 bg-slate-900/80 shadow-[0_30px_90px_-35px_rgba(2,6,23,0.95)]'
    : 'border-slate-200 bg-white/85 shadow-[0_30px_90px_-35px_rgba(15,23,42,0.2)]';

  const mutedText = isDark ? 'text-slate-400' : 'text-slate-600';
  const cardClasses = isDark ? 'border-slate-800 bg-slate-950/70' : 'border-slate-200 bg-slate-50';

  return (
    <div className={`min-h-screen px-4 py-10 sm:px-6 lg:px-8 transition-colors ${isDark ? 'bg-slate-950' : 'bg-slate-100'}`}>
      <div className={`mx-auto flex max-w-6xl flex-col gap-6 rounded-4xl border p-6 sm:p-8 ${shellClasses}`}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className={`text-sm font-medium ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>Welcome back</p>
            <h1 className={`text-3xl font-semibold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
              {user ? `${user.firstName || 'There'} ${user.lastName || ''}`.trim() : 'Your dashboard'}
            </h1>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${isDark ? 'border-slate-700 text-slate-200 hover:bg-slate-800' : 'border-slate-200 text-slate-700 hover:bg-slate-50'}`}
          >
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div className={`rounded-3xl border p-6 ${cardClasses}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${mutedText}`}>Available balance</p>
                <p className={`mt-2 text-4xl font-semibold ${isDark ? 'text-slate-50' : 'text-slate-900'}`}>$0.00</p>
              </div>
              <div className={`rounded-2xl p-3 ${isDark ? 'bg-emerald-500/10' : 'bg-emerald-600/10'}`}>
                <Wallet className={isDark ? 'h-6 w-6 text-emerald-400' : 'h-6 w-6 text-emerald-600'} />
              </div>
            </div>
          </div>

          <div className={`rounded-3xl border p-6 ${cardClasses}`}>
            <p className={`text-sm ${mutedText}`}>Quick actions</p>
            <div className="mt-4 space-y-3">
              <button className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left ${isDark ? 'border-slate-800 bg-slate-900/70' : 'border-slate-200 bg-white'}`}>
                <span className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-emerald-500" /> Create group
                </span>
                <ArrowRight className="h-4 w-4" />
              </button>
              <button className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left ${isDark ? 'border-slate-800 bg-slate-900/70' : 'border-slate-200 bg-white'}`}>
                <span className="flex items-center gap-2">
                  <ReceiptText className="h-4 w-4 text-emerald-500" /> Add expense
                </span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className={`rounded-3xl border p-6 ${cardClasses}`}>
          <p className={`text-sm ${mutedText}`}>Recent activity</p>
          <div className={`mt-4 rounded-2xl border p-4 ${isDark ? 'border-slate-800 bg-slate-900/70' : 'border-slate-200 bg-white'}`}>
            <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Your account is ready. Start by creating a group or adding your first expense.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
