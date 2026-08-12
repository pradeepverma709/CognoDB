import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { UserCheck, Calendar } from 'lucide-react';
import { fetchActors } from '../api/client';
import { Actor } from '../types';
import { LoadingSkeleton } from '../components/LoadingSkeleton';

export const Actors: React.FC = () => {
  const [actors, setActors] = useState<Actor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchActors()
      .then((data) => setActors(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white flex items-center gap-2">
          <UserCheck className="w-7 h-7 text-amber-400" /> Actor Graph Catalog ({actors.length})
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Explore actors linked to movies via (:Actor)-[:ACTED_IN]-&gt;(:Movie) relationships.
        </p>
      </div>

      {loading ? (
        <LoadingSkeleton count={8} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {actors.map((actor) => (
            <Link
              key={actor.id}
              to={`/actors/${actor.id}`}
              className="glass-panel glass-panel-hover p-5 rounded-3xl border border-slate-800 flex flex-col items-center text-center space-y-3 group"
            >
              {actor.photo_url ? (
                <img src={actor.photo_url} alt={actor.name} className="w-24 h-24 rounded-full object-cover border-2 border-amber-500/30 group-hover:scale-105 transition-transform" />
              ) : (
                <div className="w-24 h-24 rounded-full bg-amber-500/20 flex items-center justify-center font-bold text-2xl text-amber-300">
                  {actor.name[0]}
                </div>
              )}
              <div>
                <h3 className="font-bold text-slate-100 text-base group-hover:text-purple-300 transition-colors">{actor.name}</h3>
                {actor.birth_year && (
                  <p className="text-xs text-slate-400 mt-0.5 flex items-center justify-center gap-1">
                    <Calendar className="w-3 h-3 text-amber-400" /> Born {actor.birth_year}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
