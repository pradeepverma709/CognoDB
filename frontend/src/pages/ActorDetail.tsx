import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { UserCheck, Film, Users, Calendar, ArrowLeft } from 'lucide-react';
import { fetchActorDetail } from '../api/client';
import { ActorDetail as ActorDetailType } from '../types';
import { MovieCard } from '../components/MovieCard';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { ErrorAlert } from '../components/ErrorAlert';

export const ActorDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [actor, setActor] = useState<ActorDetailType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);

    fetchActorDetail(id)
      .then((data) => setActor(data))
      .catch((err) => {
        console.error('Error fetching actor:', err);
        setError(`Failed to fetch actor details for ID ${id}`);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingSkeleton count={1} />;
  if (error || !actor) return <ErrorAlert message={error || 'Actor not found.'} />;

  return (
    <div className="space-y-8 pb-12">
      <Link to="/actors" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Actors
      </Link>

      {/* Profile Card */}
      <div className="glass-panel rounded-3xl p-6 md:p-8 border border-slate-800 flex flex-col md:flex-row gap-6 items-center md:items-start">
        {actor.photo_url ? (
          <img src={actor.photo_url} alt={actor.name} className="w-32 h-32 md:w-40 md:h-40 rounded-3xl object-cover shadow-2xl border-2 border-amber-500/30" />
        ) : (
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl bg-amber-500/20 flex items-center justify-center font-bold text-3xl text-amber-300">
            {actor.name[0]}
          </div>
        )}

        <div className="space-y-3 flex-1 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold">
            <UserCheck className="w-3.5 h-3.5" /> Actor Node Entity
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white">{actor.name}</h1>
          {actor.birth_year && (
            <p className="text-xs text-slate-400 flex items-center justify-center md:justify-start gap-1">
              <Calendar className="w-3.5 h-3.5 text-amber-400" /> Born in {actor.birth_year}
            </p>
          )}
          <p className="text-slate-300 text-xs md:text-sm leading-relaxed max-w-2xl">{actor.bio || 'Actor biography details.'}</p>

          {/* Top genres */}
          {actor.top_genres && actor.top_genres.length > 0 && (
            <div className="flex flex-wrap gap-1.5 justify-center md:justify-start pt-2">
              {actor.top_genres.map((g) => (
                <span key={g} className="text-[10px] font-semibold px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700">
                  {g}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Filmography Section */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Film className="w-5 h-5 text-purple-400" /> Filmography ({actor.movies.length} Movies)
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {actor.movies.map((m) => (
            <MovieCard key={m.id} movie={m} />
          ))}
        </div>
      </section>

      {/* Required Query 5: Actor Co-stars */}
      {actor.co_actors && actor.co_actors.length > 0 && (
        <section className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-cyan-400" /> Actor Co-Star Graph Paths (Cypher Query 5)
              </h2>
              <p className="text-xs text-slate-400">(:Actor {`{name: "${actor.name}"}`})-[:ACTED_IN]-&gt;(:Movie)&lt;-[:ACTED_IN]-(co:Actor)</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {actor.co_actors.slice(0, 6).map((co) => (
              <Link
                key={co.co_actor_id}
                to={`/actors/${co.co_actor_id}`}
                className="p-4 rounded-2xl bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 flex items-center gap-4 transition-colors group"
              >
                {co.photo_url ? (
                  <img src={co.photo_url} alt={co.co_actor_name} className="w-12 h-12 rounded-2xl object-cover shrink-0" />
                ) : (
                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 flex items-center justify-center font-bold text-cyan-300 shrink-0">
                    {co.co_actor_name[0]}
                  </div>
                )}
                <div>
                  <h4 className="font-bold text-sm text-slate-200 group-hover:text-purple-300">{co.co_actor_name}</h4>
                  <p className="text-[11px] text-slate-400">{co.movie_count} Shared Movie(s)</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
