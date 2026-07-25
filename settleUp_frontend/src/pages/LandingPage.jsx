import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Wallet, Users, ArrowRight, ShieldCheck } from 'lucide-react';

export default function LandingPage({ isDark }) {
  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, staggerChildren: 0.2 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const shellClasses = isDark
    ? 'border-slate-800 bg-slate-900/80 shadow-[0_30px_90px_-35px_rgba(2,6,23,0.9)]'
    : 'border-slate-200 bg-white/80 shadow-[0_30px_90px_-35px_rgba(15,23,42,0.2)]';

  const mutedText = isDark ? 'text-slate-400' : 'text-slate-600';
  const iconWrap = isDark ? 'bg-slate-800/90' : 'bg-slate-100';
  const primaryGlow = isDark ? 'bg-emerald-500/20' : 'bg-emerald-600/10';
  const primaryButton = isDark
    ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
    : 'bg-emerald-600 text-white hover:bg-emerald-500';

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center px-4 py-16 sm:px-6 lg:px-8 relative overflow-hidden transition-colors ${isDark ? 'bg-slate-950' : 'bg-slate-100'}`}>
      <div className={`absolute top-1/4 left-1/2 -translate-x-1/2 h-80 w-80 rounded-full blur-[120px] pointer-events-none ${primaryGlow}`} />

      <motion.div
        className={`w-full max-w-5xl rounded-4xl border px-6 py-10 text-center backdrop-blur-sm sm:px-10 lg:px-14 lg:py-14 ${shellClasses}`}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="mb-6 flex justify-center">
          <div className={`rounded-2xl border p-3 ${iconWrap}`}>
            <Wallet className={`h-10 w-10 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="mb-4 inline-flex items-center rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-sm font-medium text-emerald-600">
          Smart group budgeting for real life
        </motion.div>

        <motion.h1 variants={itemVariants} className="mb-6 text-4xl font-semibold tracking-tight sm:text-5xl lg:text-7xl">
          Settle up, <span className={isDark ? 'text-emerald-400' : 'text-emerald-600'}>stress less.</span>
        </motion.h1>

        <motion.p variants={itemVariants} className={`mx-auto mb-10 max-w-2xl text-lg ${mutedText}`}>
          A calm, trustworthy way to split expenses with friends, roommates, and travel groups without the usual confusion.
        </motion.p>

        <motion.div variants={itemVariants}>
          <Link
            to="/auth"
            className={`inline-flex items-center gap-2 rounded-full px-7 py-3.5 font-semibold transition-all hover:scale-[1.01] active:scale-95 ${primaryButton}`}
          >
            Get Started <ArrowRight className="h-5 w-5" />
          </Link>
        </motion.div>

        <motion.div variants={itemVariants} className="mt-14 grid gap-5 text-left md:grid-cols-3">
          <FeatureCard
            icon={<Users className={isDark ? 'text-emerald-400' : 'text-emerald-600'} />}
            title="Create Groups"
            desc="Organize shared costs for trips, apartments, and everyday life in a single place."
            isDark={isDark}
          />
          <FeatureCard
            icon={<Wallet className={isDark ? 'text-emerald-400' : 'text-emerald-600'} />}
            title="Track Balances"
            desc="See exactly who owes what with a clear, reassuring view of every balance."
            isDark={isDark}
          />
          <FeatureCard
            icon={<ShieldCheck className={isDark ? 'text-emerald-400' : 'text-emerald-600'} />}
            title="Secure & Private"
            desc="Built with privacy and reliability in mind, so shared finances feel calm and safe."
            isDark={isDark}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}

function FeatureCard({ icon, title, desc, isDark }) {
  const cardClasses = isDark
    ? 'border-slate-800 bg-slate-900/70'
    : 'border-slate-200 bg-slate-50/80';

  return (
    <div className={`rounded-2xl border p-6 transition-colors ${cardClasses}`}>
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10">{icon}</div>
      <h3 className={`mb-2 text-lg font-semibold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>{title}</h3>
      <p className={`text-sm leading-6 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{desc}</p>
    </div>
  );
}