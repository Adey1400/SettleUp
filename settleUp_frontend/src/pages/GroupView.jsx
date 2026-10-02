import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Receipt, ArrowRightLeft, User, Calendar, Plus, UserPlus, X, DollarSign, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import apiClient from '../api/axiosConfig';

export default function GroupView() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('ledger');

  // Data States
  const [group, setGroup] = useState(null);
  const [currentUserEmail, setCurrentUserEmail] = useState('');
  const [expenses, setExpenses] = useState([]);
  const [settlements, setSettlements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Add Member Modal States
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [isSubmittingMember, setIsSubmittingMember] = useState(false);

  // Add Expense Modal States
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [expenseDesc, setExpenseDesc] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [splitType, setSplitType] = useState('EQUAL');
  const [splitData, setSplitData] = useState([]);
  const [isSubmittingExpense, setIsSubmittingExpense] = useState(false);

  // Group management states
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [renamedGroupName, setRenamedGroupName] = useState('');
  const [isSubmittingGroupAction, setIsSubmittingGroupAction] = useState(false);

  const isGroupCreator = Boolean(
    group?.createdByEmail && currentUserEmail &&
    group.createdByEmail.toLowerCase() === currentUserEmail.toLowerCase()
  );

  const fetchGroupData = async () => {
    try {
      setIsLoading(true);
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

  useEffect(() => {
    fetchGroupData();
  }, [groupId]);

  useEffect(() => {
    apiClient.get('/users/me')
      .then(({ data }) => setCurrentUserEmail(data.email || ''))
      .catch(() => setCurrentUserEmail(''));
  }, []);

  const handleRenameGroup = async (event) => {
    event.preventDefault();
    const name = renamedGroupName.trim();
    if (!name || name === group?.name) {
      setIsRenameModalOpen(false);
      return;
    }

    setIsSubmittingGroupAction(true);
    try {
      const { data } = await apiClient.put(`/groups/${groupId}`, { name });
      setGroup(data);
      setIsRenameModalOpen(false);
      toast.success('Group renamed successfully.');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to rename group.');
    } finally {
      setIsSubmittingGroupAction(false);
    }
  };

  const handleDeleteGroup = async () => {
    if (!window.confirm(`Delete "${group.name}"? This action cannot be undone.`)) return;

    setIsSubmittingGroupAction(true);
    try {
      await apiClient.delete(`/groups/${groupId}`);
      toast.success('Group deleted.');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete group.');
    } finally {
      setIsSubmittingGroupAction(false);
    }
  };

  // Sync split data options when group members load or modal opens
  useEffect(() => {
    if (group?.members) {
      setSplitData(group.members.map(email => ({
        email,
        included: true,
        amount: '',
        percentage: ''
      })));
    }
  }, [group, isExpenseModalOpen]);

  // Handle Split Field Adjustments
  const handleSplitChange = (index, field, value) => {
    const newData = [...splitData];
    newData[index][field] = value;
    setSplitData(newData);
  };

  // Submit Member Invite
  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!newMemberEmail.trim()) return;

    setIsSubmittingMember(true);
    try {
      await apiClient.post(`/groups/${groupId}/invites`, { email: newMemberEmail });
      setNewMemberEmail('');
      setIsMemberModalOpen(false);
      toast.success('Invite sent! They must accept it to join the group.');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send invite.');
    } finally {
      setIsSubmittingMember(false);
    }
  };

  // Submit New Expense
  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (!expenseDesc.trim() || !expenseAmount) return;

    setIsSubmittingExpense(true);
    try {
      const activeSplits = splitData.filter(s => s.included);
      if (activeSplits.length === 0) {
        toast.error("You must include at least one person in the split.");
        setIsSubmittingExpense(false);
        return;
      }

      const payload = {
        groupId: Number(groupId),
        amount: parseFloat(expenseAmount),
        description: expenseDesc,
        splitType: splitType,
        splits: activeSplits.map(s => ({
          userEmail: s.email,
          amount: splitType === 'EXACT' ? parseFloat(s.amount || 0) : null,
          percentage: splitType === 'PERCENT' ? parseFloat(s.percentage || 0) : null
        }))
      };

      await apiClient.post('/expenses', payload);
      
      // Refresh the ledger and debt graph seamlessly
      fetchGroupData();
      
      setIsExpenseModalOpen(false);
      setExpenseDesc('');
      setExpenseAmount('');
      setSplitType('EQUAL');
      toast.success('Expense recorded successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add expense.');
    } finally {
      setIsSubmittingExpense(false);
    }
  };

  // Handle Marking a Debt as Paid
  const handleMarkPaid = async (debtorEmail, creditorEmail, amount) => {
    try {
      await apiClient.post('/balances/settlements', {
        groupId: parseInt(groupId),
        payerEmail: debtorEmail,
        receiverEmail: creditorEmail,
        amount: amount
      });
      
      toast.success('Debt marked as paid!');
      
      // Refresh the data to recalculate the graph!
      const [expensesRes, balancesRes] = await Promise.all([
        apiClient.get(`/groups/${groupId}/expenses`),
        apiClient.get(`/balances/group/${groupId}`)
      ]);
      setExpenses(Array.isArray(expensesRes.data) ? expensesRes.data : []);
      setSettlements(Array.isArray(balancesRes.data) ? balancesRes.data : []);
      
    } catch (error) {
      toast.error('Failed to record settlement.');
    }
  };

  // Animation variants
  const listVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-50 p-4 md:p-8 font-sans transition-colors duration-300">
      <div className="max-w-3xl mx-auto">
        {/* Header Section */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="p-2 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-500 rounded-full shadow-sm border border-slate-200 dark:border-slate-800 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold">{group ? group.name : 'Loading...'}</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">Group #{groupId}</p>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
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

            <button onClick={() => setIsMemberModalOpen(true)} className="p-2 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 shadow-sm transition-colors" title="Invite Member">
              <UserPlus className="w-5 h-5" />
            </button>

            {isGroupCreator && (
              <>
                <button
                  onClick={() => {
                    setRenamedGroupName(group.name);
                    setIsRenameModalOpen(true);
                  }}
                  disabled={isSubmittingGroupAction}
                  className="p-2 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 shadow-sm transition-colors disabled:opacity-50"
                  title="Rename group"
                  aria-label="Rename group"
                >
                  <Pencil className="w-5 h-5" />
                </button>
                <button
                  onClick={handleDeleteGroup}
                  disabled={isSubmittingGroupAction}
                  className="p-2 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 shadow-sm transition-colors disabled:opacity-50"
                  title="Delete group"
                  aria-label="Delete group"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </>
            )}

            <button onClick={() => setIsExpenseModalOpen(true)} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white px-5 py-2.5 rounded-2xl font-medium shadow-lg shadow-emerald-600/20 transition-all active:scale-95 ml-2">
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">Add Expense</span>
            </button>
          </div>
        </header>

        {/* Tab Navigation */}
        <div className="flex p-1 mb-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm">
          <button onClick={() => setActiveTab('ledger')} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-medium transition-all ${activeTab === 'ledger' ? 'bg-slate-100 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}>
            <Receipt className="w-4 h-4" /> Ledger
          </button>
          <button onClick={() => setActiveTab('settlements')} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-medium transition-all ${activeTab === 'settlements' ? 'bg-slate-100 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}>
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
                        <button
                        onClick={() => handleMarkPaid(settlement.debtorEmail, settlement.creditorEmail, settlement.amount)} 
                        className="w-full sm:w-auto px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-medium hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors shadow-sm">
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

      {/* Rename Group Modal */}
      <AnimatePresence>
        {isRenameModalOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsRenameModalOpen(false)} className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md p-8 rounded-[2rem] border shadow-2xl z-50 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold">Rename Group</h3>
                <button type="button" onClick={() => setIsRenameModalOpen(false)} aria-label="Close rename dialog" className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleRenameGroup}>
                <label htmlFor="renamed-group-name" className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">Group name</label>
                <input id="renamed-group-name" type="text" required maxLength={100} autoFocus value={renamedGroupName} onChange={(event) => setRenamedGroupName(event.target.value)} className="w-full px-4 py-3.5 mb-6 rounded-2xl border focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white" />
                <button type="submit" disabled={isSubmittingGroupAction || !renamedGroupName.trim()} className="w-full py-3.5 rounded-2xl font-bold shadow-md transition-all bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-60 disabled:cursor-not-allowed">
                  {isSubmittingGroupAction ? 'Saving...' : 'Save name'}
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Add Member Modal */}
      <AnimatePresence>
        {isMemberModalOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsMemberModalOpen(false)} className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md p-8 rounded-[2rem] border shadow-2xl z-50 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold">Invite Member</h3>
                <button onClick={() => setIsMemberModalOpen(false)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleAddMember}>
                <div className="mb-6">
                  <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">User Email</label>
                  <input type="email" required autoFocus placeholder="teammate@example.com" value={newMemberEmail} onChange={(e) => setNewMemberEmail(e.target.value)} className="w-full px-4 py-3.5 rounded-2xl border focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600" />
                </div>
                <button type="submit" disabled={isSubmittingMember} className={`w-full py-3.5 rounded-2xl font-bold shadow-md transition-all bg-emerald-600 dark:bg-emerald-500 text-white dark:text-slate-950 hover:bg-emerald-500 dark:hover:bg-emerald-400 ${isSubmittingMember ? 'opacity-70 cursor-not-allowed' : ''}`}>
                  {isSubmittingMember ? 'Sending...' : 'Send Invite'}
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Add Expense Modal */}
      <AnimatePresence>
        {isExpenseModalOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsExpenseModalOpen(false)} className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md p-8 rounded-[2rem] border shadow-2xl z-50 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold">Record Expense</h3>
                <button onClick={() => setIsExpenseModalOpen(false)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleAddExpense}>
                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">Description</label>
                  <input type="text" required placeholder="e.g. Dinner at Mario's" value={expenseDesc} onChange={(e) => setExpenseDesc(e.target.value)} className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white" />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">Amount</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input type="number" step="0.01" min="0.01" required placeholder="0.00" value={expenseAmount} onChange={(e) => setExpenseAmount(e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white" />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">Split Mode</label>
                  <select value={splitType} onChange={(e) => setSplitType(e.target.value)} className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white appearance-none">
                    <option value="EQUAL">Split Equally</option>
                    <option value="EXACT">Split by Exact Amounts</option>
                    <option value="PERCENT">Split by Percentages</option>
                  </select>
                </div>

                {/* Dynamic Member Split Allocation */}
                <div className="mb-6 space-y-2 max-h-40 overflow-y-auto pr-2">
                  <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">Who is involved?</label>
                  {splitData.map((split, index) => (
                    <div key={split.email} className="flex items-center gap-3 bg-slate-50 dark:bg-slate-950 p-2 rounded-lg border border-slate-200 dark:border-slate-800">
                      <input 
                        type="checkbox" 
                        checked={split.included} 
                        onChange={(e) => handleSplitChange(index, 'included', e.target.checked)} 
                        className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 cursor-pointer"
                      />
                      <span className="text-sm flex-1 truncate dark:text-slate-200" title={split.email}>{split.email}</span>
                      
                      {splitType === 'EXACT' && split.included && (
                        <input type="number" step="0.01" min="0" placeholder="$0.00" value={split.amount} onChange={(e) => handleSplitChange(index, 'amount', e.target.value)} className="w-24 px-2 py-1 text-sm rounded border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white" required />
                      )}
                      
                      {splitType === 'PERCENT' && split.included && (
                        <input type="number" step="0.01" min="0" max="100" placeholder="0%" value={split.percentage} onChange={(e) => handleSplitChange(index, 'percentage', e.target.value)} className="w-20 px-2 py-1 text-sm rounded border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white" required />
                      )}
                    </div>
                  ))}
                </div>
                
                <button type="submit" disabled={isSubmittingExpense} className={`w-full py-3.5 rounded-2xl font-bold shadow-md transition-all bg-emerald-600 dark:bg-emerald-500 text-white dark:text-slate-950 hover:bg-emerald-500 dark:hover:bg-emerald-400 ${isSubmittingExpense ? 'opacity-70 cursor-not-allowed' : ''}`}>
                  {isSubmittingExpense ? 'Recording...' : 'Add Expense'}
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function EmptyState({ icon, message }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-slate-400 dark:text-slate-500">
      <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800/50 rounded-full flex items-center justify-center mb-4">{icon}</div>
      <p className="font-medium text-lg text-slate-600 dark:text-slate-300">{message}</p>
    </div>
  );
}