import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  BookOpen, 
  FlaskConical, 
  Bot, 
  User, 
  Settings, 
  LogOut,
  BrainCircuit,
  Activity,
  Compass
} from 'lucide-react';
import { cn } from '@/lib/utils';
import ParallaxStarsBackground from './ParallaxStarsBackground';
import { useAuth } from '@/context/AuthContext';
import LanguageSelector from './LanguageSelector';

const sidebarItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Compass, label: 'Career Guidance', path: '/career-guidance' },
  { icon: BookOpen, label: 'Courses', path: '/courses' },
  { icon: Activity, label: 'Assessment', path: '/assessment' },
  { icon: FlaskConical, label: 'Virtual Labs', path: '/labs' },
  { icon: User, label: 'Profile', path: '/profile' },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();

  // Redirect if not authenticated (simple check)
  React.useEffect(() => {
    if (!isAuthenticated && location.pathname !== '/login') {
      navigate('/login');
    }
  }, [isAuthenticated, location, navigate]);

  if (!isAuthenticated) return <>{children}</>;

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans selection:bg-cyan-500/30 relative">
      <div className="absolute inset-0 z-0">
        <ParallaxStarsBackground speed={0.5} />
      </div>
      
      {/* Sidebar */}
      <motion.aside 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-64 flex-shrink-0 border-r border-white/10 bg-slate-900/50 backdrop-blur-xl flex flex-col z-20 relative"
      >
        <div className="p-6 flex items-center justify-center">
          <img src="/logo.png" alt="NeuroLearn AI" className="h-12 w-auto object-contain" />
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {sidebarItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <Link 
                key={item.path} 
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden",
                  isActive 
                    ? "text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.15)] border border-cyan-500/20" 
                    : "text-slate-400 hover:text-slate-100 hover:bg-white/5 border border-transparent"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-cyan-500/10 rounded-xl"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <Icon className={cn("w-5 h-5 relative z-10 transition-transform duration-300 group-hover:scale-110", isActive && "animate-pulse")} />
                <span className="font-medium relative z-10 tracking-wide">{item.label}</span>
                
                {/* Hover Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button 
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/20 border border-transparent transition-all duration-300 group"
          >
            <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative z-10">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-8 border-b border-white/10 bg-slate-900/30 backdrop-blur-md z-20">
          <h1 className="text-lg font-medium text-slate-200 font-display tracking-wider">
            {sidebarItems.find(i => i.path === location.pathname)?.label || 'Dashboard'}
          </h1>
          
          <div className="flex items-center gap-4">
            <LanguageSelector />
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
              <span className="text-xs font-medium text-slate-300">System Online</span>
            </div>
            <button className="w-8 h-8 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center hover:bg-slate-700 hover:border-cyan-500/30 transition-all duration-300 group">
              <Settings className="w-4 h-4 text-slate-400 group-hover:rotate-90 transition-transform duration-500" />
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-white/10">
              <div className="text-right hidden md:block">
                <div className="text-sm font-medium text-white">{user?.name}</div>
                <div className="text-xs text-slate-400 capitalize">{user?.role} • Lvl {user?.level}</div>
              </div>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 border border-white/20 shadow-lg shadow-purple-500/20" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-8 z-10 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
