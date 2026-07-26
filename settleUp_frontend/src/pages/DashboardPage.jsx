import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, Users, ReceiptText, Plus, X, ArrowRight } from 'lucide-react';
import { toast } from 'react-toastify';
import apiClient from '../api/axiosConfig';
import SideNavbar from '../components/SideNavbar';

export default function DashboardPage({ isDark }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [groups, setGroups] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('jwt_token');
    if (!token) {
      navigate('/auth');
      return;
    }

    // Fetch User Profile and Groups concurrently
    const fetchDashboardData = async () => {
      try {
        const [userRes, groupsRes] = await Promise.all([
          apiClient.get('/users/me'),
          apiClient.get('/groups')
        ]);
        
        setUser(userRes.data);
        setGroups(Array.isArray(groupsRes.data) ? groupsRes.data : []);
      } catch (error) {
        toast.error('Session expired. Please log in again.');
        localStorage.removeItem('jwt_token');
        navigate('/auth');
      }
    };

    fetchDashboardData();
  }, [navigate]);

  // THIS IS THE LOGOUT FUNCTIONALITY
  const handleLogout = () => {
    localStorage.removeItem('jwt_token');
    navigate('/auth');
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;
    
    setIsSubmitting(true);
    try {
      const { data } = await apiClient.post('/groups', { name: newGroupName });
      setGroups([...groups, data]);
      setNewGroupName('');
      setIsModalOpen(false);
      toast.success('Group created successfully!');
    } catch (error) {
      toast.error('Failed to create group. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const shellClasses = isDark ? 'bg-slate-950 text-slate-50' : 'bg-slate-100 text-slate-900';
  const cardClasses = isDark ? 'border-slate-800 bg-slate-900/50' : 'border-slate-200 bg-white shadow-sm';

  return (
    <div className={`min-h-screen flex transition-colors ${shellClasses}`}>
      
      {/* We pass the handleLogout function to the Sidebar here */}
      <SideNavbar isDark={isDark} handleLogout={handleLogout} />

      {/* Main Content Area (Offset by Sidebar width on desktop) */}
      <main className="flex-1 md:ml-64 p-6 sm:p-10 lg:p-12">
        <div className="max-w-5xl mx-auto space-y-8">
          
          {/* Header */}
          <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className={`text-sm font-semibold uppercase tracking-wider ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                Overview
              </p>
              <h1 className="text-3xl sm:text-4xl font-bold mt-1">
                {user ? `Hello, ${user.firstName || 'User'}` : 'Loading...'}
              </h1>
            </div>
            
            <button 
              onClick={() => setIsModalOpen(true)}
              className={`inline-flex items-center gap-2 px-5 py-3 rounded-2xl font-semibold transition-all hover:scale-105 active:scale-95 shadow-md ${
                isDark ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-emerald-900/20' : 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-emerald-600/20'
              }`}
            >
              <Plus className="w-5 h-5" /> New Group
            </button>
          </header>

          {/* Top Widgets */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className={`rounded-3xl border p-8 flex items-center justify-between transition-colors ${cardClasses}`}>
              <div>
                <p className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Total Balance</p>
                <p className="mt-2 text-4xl font-bold text-emerald-500">$0.00</p>
              </div>
              <div className={`p-4 rounded-2xl ${isDark ? 'bg-emerald-500/10' : 'bg-emerald-50'}`}>
                <Wallet className={`w-8 h-8 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
              </div>
            </div>

            <div className={`rounded-3xl border p-8 transition-colors ${cardClasses}`}>
              <p className={`text-sm font-medium mb-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Quick Actions</p>
              <div className="space-y-3">
                <button className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-colors ${
                  isDark ? 'border-slate-700 bg-slate-800/50 hover:bg-slate-800' : 'border-slate-100 bg-slate-50 hover:bg-slate-100'
                }`}>
                  <span className="flex items-center gap-3 font-medium">
                    <ReceiptText className="w-5 h-5 text-emerald-500" /> Add Expense
                  </span>
                  <ArrowRight className={`w-5 h-5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                </button>
              </div>
            </div>
          </div>

          {/* Groups Section */}
          <div className="pt-4">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Users className="w-6 h-6 text-emerald-500" /> Your Groups
            </h2>
            
            {groups.length === 0 ? (
              <div className={`text-center py-16 rounded-3xl border border-dashed ${isDark ? 'border-slate-700 bg-slate-900/30 text-slate-400' : 'border-slate-300 bg-white text-slate-500'}`}>
                <Users className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p className="font-medium text-lg mb-2">No groups yet</p>
                <p className="text-sm">Create a group to start splitting expenses.</p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {groups.map((group) => (
                  <Link 
                    key={group.id} 
                    to={`/group/${group.id}`}
                    className={`group relative p-6 rounded-3xl border transition-all hover:-translate-y-1 hover:shadow-lg ${cardClasses}`}
                  >
                    <div className={`absolute inset-0 rounded-3xl border-2 border-transparent transition-colors ${isDark ? 'group-hover:border-emerald-500/30' : 'group-hover:border-emerald-500/50'}`} />
                    <h3 className="font-bold text-lg mb-1">{group.name}</h3>
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Click to view ledger</p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Create Group Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40"
            />
            
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md p-8 rounded-[2rem] border shadow-2xl z-50 ${
                isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold">New Group</h3>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className={`p-2 rounded-full transition-colors ${isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateGroup}>
                <div className="mb-6">
                  <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Group Name
                  </label>
                  <input
                    type="text"
                    required
                    autoFocus
                    placeholder="e.g. Ski Trip 2026, Apartment..."
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    className={`w-full px-4 py-3.5 rounded-2xl border focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all ${
                      isDark ? 'bg-slate-950 border-slate-800 text-white placeholder:text-slate-600' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400'
                    }`}
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3.5 rounded-2xl font-bold shadow-md transition-all ${
                    isDark ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400' : 'bg-emerald-600 text-white hover:bg-emerald-500'
                  } ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isSubmitting ? 'Creating...' : 'Create Group'}
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}