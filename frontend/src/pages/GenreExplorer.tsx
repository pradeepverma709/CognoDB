import React, { useEffect, useState } from 'react';
import { Layers, Film, Sparkles } from 'lucide-react';
import { fetchGenres, fetchMovies } from '../api/client';
import { Genre, Movie } from '../types';
import { MovieCard } from '../components/MovieCard';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { ErrorAlert } from '../components/ErrorAlert';

export const GenreExplorer: React.FC = () => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string>('Sci-Fi');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchGenres()
      .then((data) => {
        setGenres(data);
        if (data.length > 0 && !selectedGenre) {
          setSelectedGenre(data[0].name);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    if (!selectedGenre) return;
    setLoading(true);
    setError(null);

    fetchMovies({ genre: selectedGenre })
      .then((data) => setMovies(data))
      .catch((err) => setError('Failed to fetch movies for genre.'))
      .finally(() => setLoading(false));
  }, [selectedGenre]);

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white flex items-center gap-2">
          <Layers className="w-7 h-7 text-pink-400" /> Genre Graph Explorer
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Explore movies linked to specific Genre nodes in CognoDB: (:Movie)-[:BELONGS_TO]-&gt;(:Genre)
        </p>
      </div>

      {/* Genre Grid selector */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {genres.map((g) => {
          const isSelected = selectedGenre === g.name;
          return (
            <button
              key={g.id}
              onClick={() => setSelectedGenre(g.name)}
              className={`p-4 rounded-2xl border text-left transition-all duration-200 ${
                isSelected
                  ? 'bg-gradient-to-br from-pink-900/50 via-purple-900/30 to-slate-900 border-pink-500/50 shadow-lg shadow-pink-950/40 text-white'
                  : 'glass-panel border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <Sparkles className={`w-4 h-4 ${isSelected ? 'text-pink-400' : 'text-slate-600'}`} />
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                  {g.movie_count || 10} films
                </span>
              </div>
              <h4 className="font-bold text-sm truncate">{g.name}</h4>
            </button>
          );
        })}
      </div>

      {error && <ErrorAlert message={error} />}

      {/* Movies in Genre */}
      <section className="space-y-4 pt-4 border-t border-slate-800">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Film className="w-5 h-5 text-purple-400" /> Movies in <span className="text-pink-400">{selectedGenre}</span>
          </h2>
          <span className="text-xs text-slate-400">{movies.length} Results</span>
        </div>

        {loading ? (
          <LoadingSkeleton count={6} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {movies.map((m) => (
              <MovieCard key={m.id} movie={m} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
