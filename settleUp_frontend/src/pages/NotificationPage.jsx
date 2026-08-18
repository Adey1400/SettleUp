import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Check, X } from 'lucide-react';
import { toast } from 'react-toastify';
import apiClient from '../api/axiosConfig';
import SideNavbar from '../components/SideNavbar';

export default function NotificationsPage({ isDark }) {
  const navigate = useNavigate();
  const [invites, setInvites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchInvites();
  }, []);

  const fetchInvites = async () => {
    try {
      setIsLoading(true);
      const { data } = await apiClient.get('/groups/invites/me');
      setInvites(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error('Failed to load notifications.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('jwt_token');
    navigate('/auth');
  };

  const respondToInvite = async (inviteId, accept) => {
    try {
      await apiClient.post(`/groups/invites/${inviteId}/respond?accept=${accept}`);
      setInvites(invites.filter(invite => invite.id !== inviteId));
      toast.success(accept ? 'Invite accepted!' : 'Invite declined.');
    } catch (error) {
      toast.error('Failed to process invite response.');
    }
  };

  const shellClasses = isDark ? 'bg-slate-950 text-slate-50' : 'bg-slate-100 text-slate-900';
  const cardClasses = isDark ? 'border-slate-800 bg-slate-900/50' : 'border-slate-200 bg-white shadow-sm';

  return (
    <div className={`min-h-screen flex transition-colors ${shellClasses}`}>
      <SideNavbar isDark={isDark} handleLogout={handleLogout} />
      
      <main className="flex-1 md:ml-64 p-6 sm:p-10 lg:p-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <header>
            <p className={`text-sm font-semibold uppercase tracking-wider ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
              Inbox
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold mt-1">Notifications</h1>
          </header>

          <div className="space-y-4">
            {isLoading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
              </div>
            ) : invites.length === 0 ? (
              <div className={`text-center py-20 rounded-3xl border border-dashed ${isDark ? 'border-slate-800 bg-slate-900/30' : 'border-slate-300 bg-white'}`}>
                <Bell className={`w-12 h-12 mx-auto mb-4 opacity-20 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
                <h3 className="text-xl font-bold mb-2">You're all caught up</h3>
                <p className={`${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  You have no pending group invitations.
                </p>
              </div>
            ) : (
              invites.map((invite) => (
                <div key={invite.id} className={`flex flex-col sm:flex-row items-center justify-between p-6 rounded-3xl border transition-colors ${cardClasses}`}>
                  <div className="mb-4 sm:mb-0 text-center sm:text-left">
                    <p className="text-lg font-semibold mb-1">
                      <span className="text-emerald-500">{invite.inviterEmail}</span> invited you to join <span className="font-bold">"{invite.groupName}"</span>
                    </p>
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      Received on {new Date(invite.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => respondToInvite(invite.id, false)}
                      className={`p-3 rounded-xl border transition-colors ${isDark ? 'border-slate-700 hover:bg-slate-800 text-slate-300' : 'border-slate-200 hover:bg-slate-100 text-slate-600'}`}
                      title="Decline"
                    >
                      <X className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => respondToInvite(invite.id, true)}
                      className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-all active:scale-95 shadow-md shadow-emerald-600/20"
                    >
                      <Check className="w-5 h-5" /> Accept
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}