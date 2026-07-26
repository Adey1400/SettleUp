import { useState, useEffect } from 'react'; // <-- Import these
import { motion,AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Wallet, Users, ArrowRight, ShieldCheck, CheckCircle2, ChevronDown } from 'lucide-react';
import TopNavbar from '../components/TopNavbar';
import Footer from '../components/Footer';

export default function LandingPage({ isDark }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check for JWT token on component mount
  useEffect(() => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${isDark ? 'bg-slate-950' : 'bg-slate-100'}`}>
      
      <TopNavbar isDark={isDark} />

      {/* Hero Section */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 pt-32 pb-20 relative overflow-hidden">
        
        {/* Soft Background Glow */}
        <div className={`absolute top-1/3 left-1/2 -translate-x-1/2 h-[500px] w-[500px] rounded-full blur-[120px] pointer-events-none opacity-50 ${isDark ? 'bg-emerald-900/30' : 'bg-emerald-200/50'}`} />

        <motion.div 
          className="w-full max-w-5xl text-center z-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className={`mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium shadow-sm transition-colors backdrop-blur-sm
            ${isDark ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400' : 'border-emerald-200 bg-emerald-50 text-emerald-700'}`}>
            <CheckCircle2 className="w-4 h-4" /> The new standard in group finance
          </motion.div>

          <motion.h1 variants={itemVariants} className={`mb-6 text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
            Settle up, <br className="md:hidden" />
            <span className={isDark ? 'text-emerald-400' : 'text-emerald-600'}>stress less.</span>
          </motion.h1>

          <motion.p variants={itemVariants} className={`mx-auto mb-10 max-w-2xl text-lg sm:text-xl leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            A calm, trustworthy way to split expenses with friends, roommates, and travel groups. Powered by an intelligent algorithm that minimizes the number of payments.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            
            {/* DYNAMIC HERO BUTTON */}
            <Link to={isAuthenticated ? "/dashboard" : "/auth"} className={`inline-flex items-center justify-center w-full sm:w-auto gap-2 rounded-full px-8 py-4 font-semibold transition-all hover:scale-105 active:scale-95 shadow-lg ${
              isDark ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-emerald-900/20' : 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-emerald-600/20'
            }`}>
              {isAuthenticated ? 'Go to Dashboard' : 'Start for free'} <ArrowRight className="h-5 w-5" />
            </Link>

            <a href="#how-it-works" className={`inline-flex items-center justify-center w-full sm:w-auto gap-2 rounded-full px-8 py-4 font-semibold transition-all ${
              isDark ? 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800' : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 shadow-sm'
            }`}>
              See how it works
            </a>
          </motion.div>
        </motion.div>

        {/* ... Rest of your Feature Cards Grid remains the same ... */}
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mt-32 grid gap-6 md:grid-cols-3 max-w-6xl w-full z-10 px-4"
        >
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
        <FAQSection isDark={isDark} />
      </main>

      <Footer isDark={isDark} />
    </div>
  );
}

// ... FeatureCard component remains the same ...
function FeatureCard({ icon, title, desc, isDark }) {
  return (
    <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} 
      className={`rounded-3xl border p-8 transition-all hover:-translate-y-1 ${
        isDark ? 'border-slate-800 bg-slate-900/50 backdrop-blur-md hover:border-slate-700' : 'border-slate-200 bg-white/80 backdrop-blur-md shadow-sm hover:shadow-md'
      }`}
    >
      <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl ${isDark ? 'bg-slate-800' : 'bg-emerald-50'}`}>
        {icon}
      </div>
      <h3 className={`mb-3 text-xl font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>{title}</h3>
      <p className={`text-base leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{desc}</p>
    </motion.div>
  );
}

function FAQSection({ isDark }) {
  const faqs = [
    {
      question: "How does the debt simplification work?",
      answer: "Our algorithm calculates the net balance for everyone in a group. Instead of paying back 5 different people, it optimizes the debts so you only make the minimum number of payments required to settle up."
    },
    {
      question: "Is SettleUp completely free?",
      answer: "Yes! Core features like creating groups, adding expenses, and calculating settlements are 100% free with no hidden fees or paywalls."
    },
    {
      question: "Is my financial data secure?",
      answer: "Absolutely. We use enterprise-grade Spring Security and JWT authentication. Your data is encrypted in transit and safely stored in PostgreSQL databases."
    }
  ];

  return (
    <div className="w-full max-w-3xl mx-auto mt-32 px-4 z-10 relative">
      <div className="text-center mb-12">
        <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>Frequently Asked Questions</h2>
        <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Everything you need to know about SettleUp.</p>
      </div>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <FAQItem key={index} faq={faq} isDark={isDark} />
        ))}
      </div>
    </div>
  );
}

function FAQItem({ faq, isDark }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`border rounded-2xl overflow-hidden transition-colors ${
      isDark ? 'border-slate-800 bg-slate-900/50' : 'border-slate-200 bg-white'
    }`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none"
      >
        <span className={`font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{faq.question}</span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className={`w-5 h-5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className={`px-6 pb-5 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              {faq.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}