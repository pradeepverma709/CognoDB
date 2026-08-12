import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Film, Sparkles, Users, Layers, Network, Clapperboard, UserCheck } from 'lucide-react';

export const Sidebar: React.FC = () => {
  const navItems = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/movies', label: 'Browse Movies', icon: Film },
    { to: '/recommendations', label: 'Recommendations', icon: Sparkles, badge: 'Cypher 2-Hop' },
    { to: '/similar-users', label: 'Similar Users', icon: Users },
    { to: '/genres', label: 'Genre Explorer', icon: Layers },
    { to: '/analytics', label: 'Graph Explorer', icon: Network, badge: 'Interactive' },
    { to: '/actors', label: 'Actors', icon: UserCheck },
    { to: '/directors', label: 'Directors', icon: Clapperboard },
  ];

  return (
    <aside className="w-64 bg-[#0d1322]/90 border-r border-slate-800/80 min-h-[calc(100vh-61px)] p-4 hidden md:block shrink-0">
      <div className="space-y-6">
        <div>
          <h2 className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            Navigation Menu
          </h2>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-purple-600/30 to-indigo-600/20 text-purple-300 border border-purple-500/30 font-semibold shadow-md shadow-purple-900/20'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Info Callout */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-purple-900/30 via-slate-900 to-cyan-900/20 border border-slate-800/90 text-xs">
          <div className="font-semibold text-purple-300 mb-1 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> CognoDB Cypher Engine
          </div>
          <p className="text-slate-400 leading-relaxed text-[11px]">
            Powered by multi-hop graph traversal algorithms & Neo4j Bolt protocol.
          </p>
        </div>
      </div>
    </aside>
  );
};
