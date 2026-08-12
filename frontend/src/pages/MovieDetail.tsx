import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Clock, Calendar, User, Film, Heart, Eye, Code, ArrowLeft, Clapperboard } from 'lucide-react';
import { fetchMovieDetail } from '../api/client';
import { MovieDetail as MovieDetailType } from '../types';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { ErrorAlert } from '../components/ErrorAlert';

export const MovieDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<MovieDetailType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);

    fetchMovieDetail(id)
      .then((data) => setMovie(data))
      .catch((err) => {
        console.error('Error loading movie details:', err);
        setError(`Failed to fetch movie details for ID ${id}.`);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingSkeleton count={1} />;
  if (error || !movie) return <ErrorAlert message={error || 'Movie not found.'} />;

  return (
    <div className="space-y-8 pb-12">
      {/* Back button */}
      <Link to="/movies" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Movies Catalog
      </Link>

      {/* Hero Header Card */}
      <div className="glass-panel rounded-3xl p-6 md:p-8 border border-slate-800 flex flex-col md:flex-row gap-8">
        {/* Poster */}
        <div className="w-full md:w-64 aspect-[2/3] rounded-2xl overflow-hidden bg-slate-900 shrink-0 shadow-2xl">
          {movie.poster_url ? (
            <img src={movie.poster_url} alt={movie.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-600">
              <Film className="w-16 h-16" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 space-y-6">
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <span className="px-3 py-1 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-extrabold flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {movie.rating} Rating
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> {movie.release_year}
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {movie.duration_mins || 120} mins
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">{movie.title}</h1>
          </div>

          {/* Plot */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Synopsis</h3>
            <p className="text-slate-300 text-sm leading-relaxed">{movie.plot || 'No overview available.'}</p>
          </div>

          {/* Genres */}
          {movie.genres && movie.genres.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Genres</h3>
              <div className="flex flex-wrap gap-2">
                {movie.genres.map((g) => (
                  <Link
                    key={g}
                    to={`/movies?genre=${encodeURIComponent(g)}`}
                    className="px-3 py-1 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 text-xs font-semibold text-purple-300 transition-colors"
                  >
                    {g}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Graph Engagement Metrics */}
          <div className="flex flex-wrap gap-6 pt-2 border-t border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-pink-500/20 flex items-center justify-center">
                <Heart className="w-4 h-4 text-pink-400" />
              </div>
              <div>
                <div className="text-sm font-bold text-white">{movie.liked_by_users_count} Users</div>
                <div className="text-[10px] text-slate-400">(:User)-[:LIKED]-&gt;(:Movie)</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                <Eye className="w-4 h-4 text-cyan-400" />
              </div>
              <div>
                <div className="text-sm font-bold text-white">{movie.watched_by_users_count} Users</div>
                <div className="text-[10px] text-slate-400">(:User)-[:WATCHED]-&gt;(:Movie)</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Directors & Cast Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Director */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Clapperboard className="w-5 h-5 text-emerald-400" /> Directed By
          </h2>
          {movie.director ? (
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center font-bold text-emerald-300">
                {movie.director[0]}
              </div>
              <div>
                <h4 className="font-bold text-white text-base">{movie.director}</h4>
                <p className="text-xs text-slate-400">Director Node Relationship</p>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-400">Director details unavailable.</p>
          )}
        </div>

        {/* Actors Cast */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <User className="w-5 h-5 text-amber-400" /> Cast &amp; Actors
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {movie.actors && movie.actors.length > 0 ? (
              movie.actors.map((actor) => (
                <Link
                  key={actor.id}
                  to={`/actors/${actor.id}`}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 transition-colors group"
                >
                  {actor.photo_url ? (
                    <img src={actor.photo_url} alt={actor.name} className="w-10 h-10 rounded-xl object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center font-bold text-amber-300">
                      {actor.name[0]}
                    </div>
                  )}
                  <div>
                    <h4 className="font-bold text-xs text-slate-200 group-hover:text-purple-300">{actor.name}</h4>
                    <p className="text-[10px] text-slate-400">Actor Node</p>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-xs text-slate-400">Cast details unavailable.</p>
            )}
          </div>
        </div>
      </div>

      {/* Cypher Query Inspector */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-3 bg-slate-950/80">
        <div className="flex items-center gap-2 text-xs font-bold text-purple-400">
          <Code className="w-4 h-4" /> Cypher Query Execution Context
        </div>
        <pre className="p-4 rounded-2xl bg-slate-900 text-xs font-mono text-purple-300 overflow-x-auto border border-slate-800">
{`MATCH (m:Movie {id: "${movie.id}"})
OPTIONAL MATCH (m)-[:BELONGS_TO]->(g:Genre)
OPTIONAL MATCH (d:Director)-[:DIRECTED]->(m)
OPTIONAL MATCH (a:Actor)-[:ACTED_IN]->(m)
OPTIONAL MATCH (u1:User)-[:LIKED]->(m)
OPTIONAL MATCH (u2:User)-[:WATCHED]->(m)
RETURN m, collect(g.name), d, collect(a), count(u1), count(u2);`}
        </pre>
      </div>
    </div>
  );
};
