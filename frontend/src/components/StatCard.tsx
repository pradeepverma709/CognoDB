import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle, icon: Icon, color = 'from-purple-600 to-indigo-600' }) => {
  return (
    <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex items-center justify-between group hover:border-slate-700 transition-all">
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">{title}</p>
        <h3 className="text-2xl font-extrabold text-white tracking-tight">{value}</h3>
        {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
      </div>
      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color} p-0.5 shadow-lg group-hover:scale-105 transition-transform`}>
        <div className="w-full h-full bg-[#0d1322] rounded-[14px] flex items-center justify-center">
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
};
