import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Receipt, ArrowRightLeft, User, Calendar, Plus, UserPlus, X } from 'lucide-react';
import { toast } from 'react-toastify';
import apiClient from '../api/axiosConfig';

export default function GroupView() {
  const { groupId } = useParams();
  const [activeTab, setActiveTab] = useState('ledger'); 
  
  // Data States
  const [group, setGroup] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [settlements, setSettlements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal States
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        setIsLoading(true);
        // Fetch group details, expenses, and balances all at once!
        const [groupRes, expensesRes, balancesRes] = await Promise.all([
          apiClient.get(`/groups/${groupId}`),
          apiClient.get(`/groups/${groupId}/expenses`),
          apiClient.get(`/balances/group/${groupId}`)
        ]);
        
        setGroup(groupRes.data);
        setExpenses(Array.isArray(expensesRes.data) ? expensesRes.data : []);
        setSettlements(Array.isArray(balancesRes.data) ? balancesRes.data : []);
      } catch (error) {
        console.error("Error fetching group data:", error);
        toast.error("Unable to load group details.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchGroupData();
  }, [groupId]);

  // Handle Adding a Member
  // Handle Sending an Invite
  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!newMemberEmail.trim()) return;
    setIsSubmitting(true);
    try {
      await apiClient.post(`/groups/${groupId}/invites`, { 
        email: newMemberEmail 
      });
      
     
      
      setNewMemberEmail('');
      setIsMemberModalOpen(false);
      toast.success('Invite sent! They must accept it to join the group.');
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to send invite.';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };
  // Animation variants
  const listVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-50 p-4 md:p-8 font-sans transition-colors duration-300">
      <div className="max-w-3xl mx-auto">
        
        {/* Header Section */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <Link 
              to="/dashboard" 
              className="p-2 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-500 rounded-full shadow-sm border border-slate-200 dark:border-slate-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold">{group ? group.name : 'Loading...'}</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">Group #{groupId}</p>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            {/* Display Member Avatars */}
            <div className="flex -space-x-2 mr-2">
              {group?.members?.slice(0, 4).map((email, idx) => (
                <div key={idx} title={email} className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 border-2 border-slate-100 dark:border-slate-950 flex items-center justify-center font-bold text-xs uppercase shadow-sm">
                  {email.charAt(0)}
                </div>
              ))}
              {group?.members?.length > 4 && (
                <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-2 border-slate-100 dark:border-slate-950 flex items-center justify-center font-bold text-xs shadow-sm">
                  +{group.members.length - 4}
                </div>
              )}
            </div>

            <button 
              onClick={() => setIsMemberModalOpen(true)}
              className="p-2 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 shadow-sm transition-colors"
              title="Add Member"
            >
              <UserPlus className="w-5 h-5" />
            </button>

            <button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white px-5 py-2.5 rounded-2xl font-medium shadow-lg shadow-emerald-600/20 transition-all active:scale-95 ml-2">
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">Add Expense</span>
            </button>
          </div>
        </header>

        {/* Tab Navigation */}
        <div className="flex p-1 mb-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm">
          <button
            onClick={() => setActiveTab('ledger')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-medium transition-all ${
              activeTab === 'ledger' 
                ? 'bg-slate-100 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            <Receipt className="w-4 h-4" /> Ledger
          </button>
          <button
            onClick={() => setActiveTab('settlements')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-medium transition-all ${
              activeTab === 'settlements' 
                ? 'bg-slate-100 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            <ArrowRightLeft className="w-4 h-4" /> Settlements
          </button>
        </div>

        {/* Content Area */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-2 sm:p-6 shadow-sm min-h-[400px]">
          {isLoading ? (
            <div className="flex justify-center items-center h-64 text-emerald-600 dark:text-emerald-500">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-current"></div>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              {activeTab === 'ledger' ? (
                <motion.div key="ledger" variants={listVariants} initial="hidden" animate="visible" exit={{ opacity: 0 }} className="space-y-3">
                  {expenses.length === 0 ? (
                    <EmptyState icon={<Receipt />} message="No expenses recorded yet." />
                  ) : (
                    expenses.map((expense) => (
                      <motion.div key={expense.id} variants={itemVariants} className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 border border-transparent hover:border-slate-100 dark:hover:border-slate-800 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-2xl">
                            <Receipt className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 dark:text-white">{expense.description}</p>
                            <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
                              <span className="flex items-center gap-1"><User className="w-3 h-3" /> {expense.paidByEmail}</span>
                              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(expense.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg text-slate-900 dark:text-white">${expense.amount.toFixed(2)}</p>
                          <p className="text-xs font-medium text-emerald-600 dark:text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 inline-block px-2 py-0.5 rounded-full mt-1">
                            {expense.splitType}
                          </p>
                        </div>
                      </motion.div>
                    ))
                  )}
                </motion.div>
              ) : (
                <motion.div key="settlements" variants={listVariants} initial="hidden" animate="visible" exit={{ opacity: 0 }} className="space-y-4">
                  {settlements.length === 0 ? (
                    <EmptyState icon={<ArrowRightLeft />} message="Everyone is settled up!" />
                  ) : (
                    settlements.map((settlement, idx) => (
                      <motion.div key={idx} variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-between p-5 bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800 rounded-2xl">
                        <div className="flex items-center gap-3 w-full sm:w-auto mb-3 sm:mb-0">
                          <div className="flex flex-col items-center">
                            <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold text-sm">
                              {settlement.debtorEmail.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-xs text-slate-500 mt-1 max-w-[80px] truncate" title={settlement.debtorEmail}>{settlement.debtorEmail.split('@')[0]}</span>
                          </div>
                          
                          <div className="flex-1 flex flex-col items-center px-4">
                            <span className="text-sm font-bold text-slate-900 dark:text-white mb-1">${settlement.amount.toFixed(2)}</span>
                            <div className="w-full h-[2px] bg-slate-200 dark:bg-slate-700 relative flex items-center justify-center min-w-[60px]">
                              <ArrowRightLeft className="w-4 h-4 text-slate-400 absolute bg-slate-50 dark:bg-slate-950 px-0.5" />
                            </div>
                            <span className="text-[10px] uppercase tracking-wider text-slate-400 mt-1 font-semibold">Owes</span>
                          </div>

                          <div className="flex flex-col items-center">
                            <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-sm">
                              {settlement.creditorEmail.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-xs text-slate-500 mt-1 max-w-[80px] truncate" title={settlement.creditorEmail}>{settlement.creditorEmail.split('@')[0]}</span>
                          </div>
                        </div>
                        
                        <button className="w-full sm:w-auto px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-medium hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors shadow-sm">
                          Mark Paid
                        </button>
                      </motion.div>
                    ))
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </div>

      {/* Add Member Modal */}
      <AnimatePresence>
        {isMemberModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsMemberModalOpen(false)}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md p-8 rounded-[2rem] border shadow-2xl z-50 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold">Add Member</h3>
                <button onClick={() => setIsMemberModalOpen(false)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddMember}>
                <div className="mb-6">
                  <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">
                    User Email
                  </label>
                  <input
                    type="email"
                    required
                    autoFocus
                    placeholder="teammate@example.com"
                    value={newMemberEmail}
                    onChange={(e) => setNewMemberEmail(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-2xl border focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600"
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3.5 rounded-2xl font-bold shadow-md transition-all bg-emerald-600 dark:bg-emerald-500 text-white dark:text-slate-950 hover:bg-emerald-500 dark:hover:bg-emerald-400 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isSubmitting ? 'Adding...' : 'Send Invite'}
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// Reusable empty state component
function EmptyState({ icon, message }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-slate-400 dark:text-slate-500">
      <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800/50 rounded-full flex items-center justify-center mb-4">
        {icon}
      </div>
      <p className="font-medium text-lg text-slate-600 dark:text-slate-300">{message}</p>
    </div>
  );
}