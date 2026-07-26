import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, ArrowLeft, Wallet } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import apiClient from '../api/axiosConfig';

export default function AuthPage({ isDark }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  // useEffect(() => {
  //   if (localStorage.getItem('jwt_token')) {
  //     navigate('/dashboard');
  //   }
  // }, [navigate]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (!isLogin && !formData.name.trim()) {
      toast.error('Please enter your full name to create an account.');
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        const { data } = await apiClient.post('/auth/login', {
          email: formData.email,
          password: formData.password
        });

        localStorage.setItem('jwt_token', data.token);
        toast.success('Signed in successfully.');
        navigate('/dashboard');
      } else {
        const [firstName, ...lastNameParts] = formData.name.trim().split(/\s+/);
        const lastName = lastNameParts.join(' ') || 'User';

        const { data } = await apiClient.post('/auth/register', {
          firstName,
          lastName,
          email: formData.email,
          password: formData.password
        });

        localStorage.setItem('jwt_token', data.token);
        toast.success('Account created successfully.');
        navigate('/dashboard');
      }
    } catch (error) {
      const message = error.response?.data?.message || error.response?.data?.error || error.message || 'Something went wrong.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const shellClasses = isDark
    ? 'border-slate-800 bg-slate-900/80 shadow-[0_30px_90px_-35px_rgba(2,6,23,0.95)]'
    : 'border-slate-200 bg-white/85 shadow-[0_30px_90px_-35px_rgba(15,23,42,0.2)]';

  const fieldClasses = isDark
    ? 'border-slate-800 bg-slate-950/80 text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500/20'
    : 'border-slate-200 bg-slate-50 text-slate-800 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-emerald-500/20';

  const mutedText = isDark ? 'text-slate-400' : 'text-slate-600';
  const linkText = isDark ? 'text-emerald-400 hover:text-emerald-300' : 'text-emerald-600 hover:text-emerald-500';
  const buttonClasses = isDark
    ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
    : 'bg-emerald-600 text-white hover:bg-emerald-500';

  return (
    <div className={`flex min-h-screen flex-col items-center justify-center px-4 py-16 relative transition-colors ${isDark ? 'bg-slate-950' : 'bg-slate-100'}`}>
      <Link to="/" className={`absolute left-4 top-6 flex items-center gap-2 rounded-full px-3 py-2 text-sm transition-colors ${isDark ? 'text-slate-400 hover:text-slate-100' : 'text-slate-600 hover:text-slate-900'}`}>
        <ArrowLeft className="h-4 w-4" /> Back
      </Link>

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`w-full max-w-md rounded-[2rem] border p-8 ${shellClasses}`}
      >
        <div className="mb-8 text-center">
          <div className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
            <Wallet className={isDark ? 'h-6 w-6 text-emerald-400' : 'h-6 w-6 text-emerald-600'} />
          </div>
          <h2 className={`text-3xl font-semibold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
            {isLogin ? 'Welcome back' : 'Create an account'}
          </h2>
          <p className={`mt-2 text-sm ${mutedText}`}>
            {isLogin ? 'Enter your details to access your dashboard.' : 'Sign up to start splitting expenses with confidence.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <AnimatePresence mode="popLayout">
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="relative"
              >
                <User className={`absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  onChange={handleChange}
                  className={`w-full rounded-2xl border py-3 pl-12 pr-4 transition-all focus:outline-none focus:ring-2 ${fieldClasses}`}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="relative">
            <Mail className={`absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
            <input
              type="email"
              name="email"
              placeholder="Email address"
              required
              onChange={handleChange}
              className={`w-full rounded-2xl border py-3 pl-12 pr-4 transition-all focus:outline-none focus:ring-2 ${fieldClasses}`}
            />
          </div>

          <div className="relative">
            <Lock className={`absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              onChange={handleChange}
              className={`w-full rounded-2xl border py-3 pl-12 pr-4 transition-all focus:outline-none focus:ring-2 ${fieldClasses}`}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`mt-2 w-full rounded-2xl py-3 font-semibold shadow-sm transition-all ${buttonClasses} ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? (isLogin ? 'Signing In...' : 'Creating Account...') : isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <div className={`mt-6 text-center text-sm ${mutedText}`}>
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className={`font-medium transition-colors ${linkText}`}
          >
            {isLogin ? 'Register here' : 'Login instead'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}