import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Wallet, Menu } from 'lucide-react';

export default function TopNavbar({ isDark }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);


  useEffect(() => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 border-b backdrop-blur-md transition-colors ${
      isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-100/80 border-slate-200'
    }`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        

        <Link to={isAuthenticated ? "/dashboard" : "/"} className="flex items-center gap-2 group">
          <div className={`p-1.5 rounded-lg ${isDark ? 'bg-emerald-500/20' : 'bg-emerald-600/10'}`}>
            <Wallet className={`w-6 h-6 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
          </div>
          <span className={`text-xl font-bold tracking-tight ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
            SettleUp
          </span>
        </Link>


        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className={`text-sm font-medium transition-colors ${isDark ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}>Features</a>
          <a href="#how-it-works" className={`text-sm font-medium transition-colors ${isDark ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}>How it works</a>
        </div>


        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated ? (
            <Link to="/dashboard" className={`text-sm font-medium px-5 py-2 rounded-full transition-all hover:scale-105 active:scale-95 ${
              isDark ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400' : 'bg-emerald-600 text-white hover:bg-emerald-500'
            }`}>
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link to="/auth" className={`text-sm font-medium transition-colors ${isDark ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}>
                Log in
              </Link>
              <Link to="/auth" className={`text-sm font-medium px-5 py-2 rounded-full transition-all hover:scale-105 active:scale-95 ${
                isDark ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400' : 'bg-emerald-600 text-white hover:bg-emerald-500'
              }`}>
                Get Started
              </Link>
            </>
          )}
        </div>


        <button className={`md:hidden p-2 rounded-md ${isDark ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-200'}`}>
          <Menu className="w-6 h-6" />
        </button>
      </div>
    </nav>
  );
}