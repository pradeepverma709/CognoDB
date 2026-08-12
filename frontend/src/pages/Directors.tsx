import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Clapperboard } from 'lucide-react';
import { fetchDirectors } from '../api/client';
import { Director } from '../types';
import { LoadingSkeleton } from '../components/LoadingSkeleton';

export const Directors: React.FC = () => {
  const [directors, setDirectors] = useState<Director[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchDirectors()
      .then((data) => setDirectors(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white flex items-center gap-2">
          <Clapperboard className="w-7 h-7 text-emerald-400" /> Director Graph Catalog ({directors.length})
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Directors linked to movies via (:Director)-[:DIRECTED]-&gt;(:Movie) relationships.
        </p>
      </div>

      {loading ? (
        <LoadingSkeleton count={8} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {directors.map((d) => (
            <Link
              key={d.id}
              to={`/directors/${d.id}`}
              className="glass-panel glass-panel-hover p-5 rounded-3xl border border-slate-800 flex flex-col items-center text-center space-y-3 group"
            >
              {d.photo_url ? (
                <img src={d.photo_url} alt={d.name} className="w-24 h-24 rounded-full object-cover border-2 border-emerald-500/30 group-hover:scale-105 transition-transform" />
              ) : (
                <div className="w-24 h-24 rounded-full bg-emerald-500/20 flex items-center justify-center font-bold text-2xl text-emerald-300">
                  {d.name[0]}
                </div>
              )}
              <div>
                <h3 className="font-bold text-slate-100 text-base group-hover:text-purple-300 transition-colors">{d.name}</h3>
                <p className="text-xs text-slate-400 mt-0.5">Director Node Entity</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
