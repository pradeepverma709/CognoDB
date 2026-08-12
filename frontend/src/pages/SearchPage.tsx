import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Film, User, Clapperboard, Users } from 'lucide-react';
import { fetchGlobalSearch } from '../api/client';
import { SearchResults } from '../types';
import { MovieCard } from '../components/MovieCard';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { ErrorAlert } from '../components/ErrorAlert';

export const SearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query) return;
    setLoading(true);
    setError(null);

    fetchGlobalSearch(query)
      .then((data) => setResults(data))
      .catch((err) => {
        console.error('Error running search:', err);
        setError('Global search query failed.');
      })
      .finally(() => setLoading(false));
  }, [query]);

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white flex items-center gap-2">
          <Search className="w-7 h-7 text-purple-400" /> Search Results for "{query}"
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Searching across Movies, Actors, Directors, and Users in CognoDB.
        </p>
      </div>

      {error && <ErrorAlert message={error} />}

      {loading ? (
        <LoadingSkeleton count={6} />
      ) : results ? (
        <div className="space-y-8">
          {/* Movies Results */}
          {results.movies.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Film className="w-5 h-5 text-purple-400" /> Movies ({results.movies.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {results.movies.map((m) => (
                  <MovieCard key={m.id} movie={m} />
                ))}
              </div>
            </section>
          )}

          {/* Actors Results */}
          {results.actors.length > 0 && (
            <section className="space-y-4 pt-4 border-t border-slate-800">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <User className="w-5 h-5 text-amber-400" /> Actors ({results.actors.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.actors.map((a) => (
                  <Link
                    key={a.id}
                    to={`/actors/${a.id}`}
                    className="p-4 rounded-2xl glass-panel glass-panel-hover border border-slate-800 flex items-center gap-4"
                  >
                    {a.photo_url ? (
                      <img src={a.photo_url} alt={a.name} className="w-12 h-12 rounded-2xl object-cover" />
                    ) : (
                      <div className="w-12 h-12 rounded-2xl bg-amber-500/20 flex items-center justify-center font-bold text-amber-300">
                        {a.name[0]}
                      </div>
                    )}
                    <div>
                      <h4 className="font-bold text-sm text-slate-200">{a.name}</h4>
                      <p className="text-[11px] text-slate-400">Actor Node</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Directors Results */}
          {results.directors.length > 0 && (
            <section className="space-y-4 pt-4 border-t border-slate-800">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Clapperboard className="w-5 h-5 text-emerald-400" /> Directors ({results.directors.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.directors.map((d) => (
                  <Link
                    key={d.id}
                    to={`/directors/${d.id}`}
                    className="p-4 rounded-2xl glass-panel glass-panel-hover border border-slate-800 flex items-center gap-4"
                  >
                    {d.photo_url ? (
                      <img src={d.photo_url} alt={d.name} className="w-12 h-12 rounded-2xl object-cover" />
                    ) : (
                      <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center font-bold text-emerald-300">
                        {d.name[0]}
                      </div>
                    )}
                    <div>
                      <h4 className="font-bold text-sm text-slate-200">{d.name}</h4>
                      <p className="text-[11px] text-slate-400">Director Node</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Users Results */}
          {results.users.length > 0 && (
            <section className="space-y-4 pt-4 border-t border-slate-800">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-cyan-400" /> Users ({results.users.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.users.map((u) => (
                  <div key={u.id} className="p-4 rounded-2xl glass-panel border border-slate-800 flex items-center gap-4">
                    {u.avatar_url ? (
                      <img src={u.avatar_url} alt={u.name} className="w-12 h-12 rounded-2xl object-cover" />
                    ) : (
                      <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 flex items-center justify-center font-bold text-cyan-300">
                        {u.name[0]}
                      </div>
                    )}
                    <div>
                      <h4 className="font-bold text-sm text-slate-200">{u.name}</h4>
                      <p className="text-[11px] text-slate-400">{u.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      ) : null}
    </div>
  );
};
