import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import GroupView from './pages/GroupView';
import ActivityPage from './pages/ActivityPage';
import SettingsPage from './pages/SettingsPage';
function App() {
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'dark';
    const storedTheme = window.localStorage.getItem('settleup-theme');
    if (storedTheme === 'light' || storedTheme === 'dark') {
      return storedTheme;
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    window.localStorage.setItem('settleup-theme', theme);
  }, [theme]);

  const isDark = theme === 'dark';

  return (
    <Router>
      <div className={`relative min-h-screen overflow-hidden font-sans transition-colors duration-300 ${isDark ? 'bg-slate-950 text-slate-50' : 'bg-slate-100 text-slate-900'}`}>
        <button
          type="button"
          onClick={() => setTheme(isDark ? 'light' : 'dark')}
          className={`fixed right-4 top-4 z-20 rounded-full border px-4 py-2 text-sm font-medium shadow-sm transition-all ${isDark ? 'border-slate-800 bg-slate-900/80 text-slate-100 hover:bg-slate-800' : 'border-slate-200 bg-white/80 text-slate-700 hover:bg-slate-50'}`}
        >
          {isDark ? '☀️ Light' : '🌙 Dark'}
        </button>

        <Routes>
          <Route path="/" element={<LandingPage isDark={isDark} />} />
          <Route path="/auth" element={<AuthPage isDark={isDark} />} />
          <Route path="/dashboard" element={<DashboardPage isDark={isDark} />} />
          <Route path="/group/:groupId" element={<GroupView isDark={isDark} />} />
           <Route path="/activity" element={<ActivityPage isDark={isDark} />} />
            <Route path="/settings" element={<SettingsPage isDark={isDark} />} />
        </Routes>

        <ToastContainer
          position="bottom-right"
          theme={isDark ? 'dark' : 'light'}
          toastClassName={isDark ? 'bg-slate-900 text-slate-100 border border-slate-800' : 'bg-white text-slate-900 border border-slate-200'}
        />
      </div>
    </Router>
  );
}

export default App;