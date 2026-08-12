import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Clapperboard, Film, ArrowLeft } from 'lucide-react';
import { fetchDirectorDetail } from '../api/client';
import { DirectorDetail as DirectorDetailType } from '../types';
import { MovieCard } from '../components/MovieCard';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { ErrorAlert } from '../components/ErrorAlert';

export const DirectorDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [director, setDirector] = useState<DirectorDetailType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);

    fetchDirectorDetail(id)
      .then((data) => setDirector(data))
      .catch((err) => {
        console.error('Error loading director details:', err);
        setError(`Failed to fetch director details for ID ${id}`);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingSkeleton count={1} />;
  if (error || !director) return <ErrorAlert message={error || 'Director not found.'} />;

  return (
    <div className="space-y-8 pb-12">
      <Link to="/directors" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Directors
      </Link>

      {/* Header Profile */}
      <div className="glass-panel rounded-3xl p-6 md:p-8 border border-slate-800 flex flex-col md:flex-row gap-6 items-center md:items-start">
        {director.photo_url ? (
          <img src={director.photo_url} alt={director.name} className="w-32 h-32 md:w-40 md:h-40 rounded-3xl object-cover shadow-2xl border-2 border-emerald-500/30" />
        ) : (
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl bg-emerald-500/20 flex items-center justify-center font-bold text-3xl text-emerald-300">
            {director.name[0]}
          </div>
        )}

        <div className="space-y-3 flex-1 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
            <Clapperboard className="w-3.5 h-3.5" /> Director Node Entity
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white">{director.name}</h1>
          <p className="text-slate-300 text-xs md:text-sm leading-relaxed max-w-2xl">{director.bio || 'Director profile details.'}</p>
        </div>
      </div>

      {/* Directed Movies Catalog */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Film className="w-5 h-5 text-purple-400" /> Directed Movies ({director.movies.length} Films)
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {director.movies.map((m) => (
            <MovieCard key={m.id} movie={m} />
          ))}
        </div>
      </section>
    </div>
  );
};
