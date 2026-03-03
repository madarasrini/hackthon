import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { 
  Zap, 
  Brain, 
  Target, 
  TrendingUp,
  Activity,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { T } from '@/components/T';

const data = [
  { name: 'Mon', xp: 400, focus: 240 },
  { name: 'Tue', xp: 300, focus: 139 },
  { name: 'Wed', xp: 200, focus: 980 },
  { name: 'Thu', xp: 278, focus: 390 },
  { name: 'Fri', xp: 189, focus: 480 },
  { name: 'Sat', xp: 239, focus: 380 },
  { name: 'Sun', xp: 349, focus: 430 },
];

const StatCard = ({ title, value, icon: Icon, color, trend }: any) => (
  <motion.div 
    whileHover={{ scale: 1.02, translateY: -5 }}
    className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm relative overflow-hidden group transition-all duration-300 hover:border-white/20 hover:shadow-lg hover:shadow-cyan-500/10"
  >
    <div className={cn("absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500", color)} />
    <div className="flex justify-between items-start mb-4">
      <div>
        <p className="text-sm font-medium text-slate-400"><T>{title}</T></p>
        <h3 className="text-3xl font-bold text-slate-100 mt-1 font-display">{value}</h3>
      </div>
      <div className={cn("p-3 rounded-xl bg-white/5 border border-white/10 group-hover:scale-110 transition-transform duration-300", color.replace('bg-', 'text-'))}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
    <div className="flex items-center gap-2 text-xs font-medium">
      <span className="text-emerald-400 flex items-center gap-1">
        <TrendingUp className="w-3 h-3" />
        {trend}
      </span>
      <span className="text-slate-500"><T>vs last week</T></span>
    </div>
  </motion.div>
);

const BrainTwin = () => {
  return (
    <div className="relative w-full h-[300px] flex items-center justify-center group cursor-pointer">
      {/* Animated Rings */}
      <div className="absolute w-64 h-64 border border-cyan-500/20 rounded-full animate-[spin_10s_linear_infinite] group-hover:border-cyan-500/40 transition-colors" />
      <div className="absolute w-48 h-48 border border-purple-500/20 rounded-full animate-[spin_15s_linear_infinite_reverse] group-hover:border-purple-500/40 transition-colors" />
      <div className="absolute w-32 h-32 border border-emerald-500/20 rounded-full animate-[spin_8s_linear_infinite] group-hover:border-emerald-500/40 transition-colors" />
      
      {/* Core Brain */}
      <div className="relative z-10">
        <Brain className="w-24 h-24 text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)] animate-pulse group-hover:scale-110 transition-transform duration-500" />
      </div>

      {/* Nodes */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-3 h-3 bg-purple-500 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.8)]"
          animate={{
            x: Math.cos(i * (Math.PI / 4)) * 100,
            y: Math.sin(i * (Math.PI / 4)) * 100,
            scale: [1, 1.5, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: i * 0.2,
          }}
        />
      ))}
      
      {/* Connecting Lines (SVG) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.line
            key={i}
            x1="50%"
            y1="50%"
            x2={`${50 + Math.cos(i * (Math.PI / 4)) * 30}%`}
            y2={`${50 + Math.sin(i * (Math.PI / 4)) * 30}%`}
            stroke="rgba(168, 85, 247, 0.2)"
            strokeWidth="1"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
          />
        ))}
      </svg>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs font-mono text-cyan-400/80 bg-black/40 px-3 py-1 rounded-full border border-cyan-500/20 backdrop-blur-sm group-hover:bg-cyan-500/10 transition-colors">
        NEURAL SYNC: 98.4%
      </div>
    </div>
  );
};

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2 font-display">
            <T>Welcome back,</T> <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">{user?.name || 'User'}</span>
          </h2>
          <p className="text-slate-400"><T>Your cognitive performance is peaking today.</T></p>
        </div>
        <div className="flex gap-3">
          <Link to="/assessment" className="px-4 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/20 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 group">
            <Activity className="w-4 h-4 group-hover:animate-pulse" />
            <T>Analyze Skills</T>
          </Link>
          <Link to="/courses" className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-sm font-medium shadow-lg shadow-purple-500/25 transition-all hover:scale-105 flex items-center gap-2">
            <T>Start Learning</T>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total XP" 
          value={user?.xp?.toLocaleString() || "12,450"} 
          icon={Zap} 
          color="bg-yellow-500" 
          trend="+12%" 
        />
        <StatCard 
          title="Focus Time" 
          value="4h 12m" 
          icon={Target} 
          color="bg-cyan-500" 
          trend="+8%" 
        />
        <StatCard 
          title="Knowledge Nodes" 
          value="84" 
          icon={Brain} 
          color="bg-purple-500" 
          trend="+3" 
        />
        <StatCard 
          title="Avg. Accuracy" 
          value="94%" 
          icon={Activity} 
          color="bg-emerald-500" 
          trend="+2%" 
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart Section */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:border-white/20 transition-colors">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
              <T>Learning Velocity</T>
            </h3>
            <select className="bg-black/20 border border-white/10 rounded-lg px-3 py-1 text-sm text-slate-400 outline-none focus:border-cyan-500/50 transition-colors">
              <option>This Week</option>
              <option>Last Week</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorXp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorFocus" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)' }}
                  itemStyle={{ color: '#e2e8f0' }}
                  cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 2 }}
                />
                <Area type="monotone" dataKey="xp" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorXp)" />
                <Area type="monotone" dataKey="focus" stroke="#06b6d4" strokeWidth={3} fillOpacity={1} fill="url(#colorFocus)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Brain Twin Section */}
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm flex flex-col hover:border-white/20 transition-colors">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-400" />
              <T>AI Brain Twin</T>
            </h3>
            <span className="px-2 py-1 rounded-full bg-green-500/10 text-green-400 text-xs font-medium border border-green-500/20 animate-pulse">
              <T>Live Sync</T>
            </span>
          </div>
          <div className="flex-1 flex items-center justify-center bg-black/20 rounded-xl border border-white/5 relative overflow-hidden group">
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
             <BrainTwin />
          </div>
          <div className="mt-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400"><T>Memory Retention</T></span>
              <span className="text-cyan-400"><T>High</T> (92%)</span>
            </div>
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '92%' }}
                transition={{ duration: 1.5, delay: 0.5 }}
                className="h-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]" 
              />
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-slate-400"><T>Cognitive Load</T></span>
              <span className="text-purple-400"><T>Optimal</T></span>
            </div>
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '65%' }}
                transition={{ duration: 1.5, delay: 0.7 }}
                className="h-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]" 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
