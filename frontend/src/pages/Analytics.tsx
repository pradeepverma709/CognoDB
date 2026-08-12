import React, { useEffect, useState } from 'react';
import { Network, Sparkles, Database, Server, Cpu, CheckCircle } from 'lucide-react';
import { fetchGraphStats, fetchGraphData } from '../api/client';
import { GraphStats, GraphData } from '../types';
import { GraphVisualizer } from '../components/GraphVisualizer';
import { StatCard } from '../components/StatCard';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { ErrorAlert } from '../components/ErrorAlert';

export const Analytics: React.FC = () => {
  const [stats, setStats] = useState<GraphStats | null>(null);
  const [graphData, setGraphData] = useState<GraphData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    Promise.all([
      fetchGraphStats(),
      fetchGraphData(60)
    ])
      .then(([st, gData]) => {
        setStats(st);
        setGraphData(gData);
      })
      .catch((err) => {
        console.error('Error loading graph analytics:', err);
        setError('Could not fetch graph topology statistics.');
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8 pb-12">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold mb-2">
          <Network className="w-3.5 h-3.5" /> Interactive Graph Canvas
        </div>
        <h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">
          CognoDB Graph Topology & Analytics
        </h1>
        <p className="text-xs md:text-sm text-slate-400 mt-1 max-w-3xl leading-relaxed">
          Visualizing node distribution, relationship edges, and network metrics across the CognoDB graph database.
        </p>
      </div>

      {error && <ErrorAlert message={error} />}

      {/* Main Interactive Graph Canvas */}
      {loading ? (
        <div className="h-[500px] glass-panel rounded-3xl animate-pulse flex items-center justify-center text-slate-500 text-sm">
          Loading interactive graph topology...
        </div>
      ) : graphData ? (
        <GraphVisualizer data={graphData} />
      ) : null}

      {/* Metrics Cards Grid */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Nodes" value={stats.total_nodes} icon={Database} color="from-purple-600 to-indigo-600" />
          <StatCard title="Total Edges" value={stats.total_relationships} icon={Network} color="from-cyan-600 to-blue-600" />
          <StatCard title="Graph Density" value={stats.density} icon={Cpu} color="from-emerald-600 to-teal-600" />
          <StatCard title="Node Types" value={Object.keys(stats.node_counts).length} subtitle="User, Movie, Actor, Director, Genre" icon={Server} color="from-pink-600 to-rose-600" />
        </div>
      )}

      {/* Comparison: Why Graph Database? */}
      <div className="glass-panel p-6 md:p-8 rounded-3xl border border-purple-500/20 bg-gradient-to-br from-purple-950/20 via-slate-900 to-cyan-950/20 space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-400" /> Why a Graph Database for Recommendations?
        </h2>
        <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
          Traditional relational databases (RDBMS) require expensive SQL JOIN operations across multiple tables (e.g. JOIN Users, JOIN Movies, JOIN Genres, JOIN Ratings) which degrade exponentially in performance as join depth increases.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/30 space-y-2">
            <h4 className="font-bold text-rose-300 text-sm">Relational Databases (SQL)</h4>
            <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside">
              <li>Multiple JOIN tables required for multi-hop lookups.</li>
              <li>O(N<sup>k</sup>) complexity as hop depth (k) increases.</li>
              <li>Rigid schemas make adding new connections painful.</li>
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
            <h4 className="font-bold text-emerald-300 text-sm">Graph Databases (CognoDB / Cypher)</h4>
            <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside">
              <li>Index-free adjacency: O(1) constant pointer traversal.</li>
              <li>Multi-hop queries execute in milliseconds.</li>
              <li>Flexible schema: easily add new node &amp; edge types.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
