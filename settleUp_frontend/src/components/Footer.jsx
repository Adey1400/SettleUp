import { Wallet } from 'lucide-react';

export default function Footer({ isDark }) {
  return (
    <footer className={`border-t py-12 transition-colors ${
      isDark ? 'bg-slate-950 border-slate-800 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-500'
    }`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2">
          <Wallet className={`w-5 h-5 ${isDark ? 'text-emerald-500' : 'text-emerald-600'}`} />
          <span className={`font-semibold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>SettleUp</span>
        </div>
        <div className="flex gap-6 text-sm">
          <a href="#" className="hover:text-emerald-500 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-emerald-500 transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-emerald-500 transition-colors">Contact</a>
        </div>
        <p className="text-sm">© {new Date().getFullYear()} SettleUp. All rights reserved.</p>
      </div>
    </footer>
  );
}