import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Database, Sparkles, Film, User as UserIcon } from 'lucide-react';
import { fetchHealth, fetchUsers } from '../api/client';
import { User } from '../types';

interface NavbarProps {
  selectedUser: User | null;
  onSelectUser: (user: User) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ selectedUser, onSelectUser }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [dbConnected, setDbConnected] = useState<boolean | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchHealth()
      .then((data) => setDbConnected(data.database_connected))
      .catch(() => setDbConnected(false));

    fetchUsers()
      .then((data) => {
        setUsers(data);
        if (data.length > 0 && !selectedUser) {
          onSelectUser(data[0]);
        }
      })
      .catch((err) => console.error("Error loading users:", err));
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0d1322]/80 backdrop-blur-xl border-b border-slate-800/80 px-4 lg:px-8 py-3">
      <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-500 to-cyan-400 p-0.5 shadow-lg shadow-purple-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#0d1322] rounded-[10px] flex items-center justify-center">
              <Film className="w-5 h-5 text-purple-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-bold text-lg tracking-tight">
              <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">CognoDB</span>
              <span className="text-white">Movies</span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium tracking-wide flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 text-cyan-400" /> GRAPH ENGINE
            </p>
          </div>
        </Link>

        {/* Global Search Bar */}
        <form onSubmit={handleSearch} className="flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search movies, actors, directors, users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/90 border border-slate-700/60 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
            />
          </div>
        </form>

        {/* Right Status Controls */}
        <div className="flex items-center gap-3">
          {/* User Selector Dropdown */}
          <div className="flex items-center gap-2 bg-slate-900/80 border border-slate-800 px-3 py-1.5 rounded-xl">
            <UserIcon className="w-4 h-4 text-purple-400" />
            <select
              value={selectedUser?.id || ''}
              onChange={(e) => {
                const found = users.find((u) => u.id === e.target.value);
                if (found) onSelectUser(found);
              }}
              className="bg-transparent text-xs font-medium text-slate-200 focus:outline-none cursor-pointer"
            >
              {users.map((u) => (
                <option key={u.id} value={u.id} className="bg-slate-900 text-slate-200">
                  {u.name} ({u.id})
                </option>
              ))}
            </select>
          </div>

          {/* Database Connectivity Status Badge */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border bg-slate-900/80 border-slate-800">
            <Database className="w-3.5 h-3.5 text-slate-400" />
            <span>CognoDB:</span>
            {dbConnected === null ? (
              <span className="flex items-center gap-1.5 text-amber-400">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span> Connecting
              </span>
            ) : dbConnected ? (
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Connected
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-cyan-400" title="Running with fallback dataset">
                <span className="w-2 h-2 rounded-full bg-cyan-400"></span> Mock Fallback
              </span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
