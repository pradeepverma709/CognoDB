import React, { useEffect, useState } from 'react';
import { Film, Filter, Search, ArrowUpDown } from 'lucide-react';
import { fetchMovies, fetchGenres } from '../api/client';
import { Movie, Genre } from '../types';
import { MovieCard } from '../components/MovieCard';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { ErrorAlert } from '../components/ErrorAlert';

export const Movies: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'rating' | 'year' | 'title'>('rating');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadMovies = () => {
    setLoading(true);
    setError(null);

    Promise.all([
      fetchMovies({ genre: selectedGenre || undefined, search: searchQuery || undefined }),
      fetchGenres()
    ])
      .then(([movieList, genreList]) => {
        setMovies(movieList);
        setGenres(genreList);
      })
      .catch((err) => {
        console.error('Error fetching movies:', err);
        setError('Could not load movies from backend.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadMovies();
  }, [selectedGenre]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadMovies();
  };

  // Sorting
  const sortedMovies = [...movies].sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'year') return b.release_year - a.release_year;
    return a.title.localeCompare(b.title);
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white flex items-center gap-2">
            <Film className="w-7 h-7 text-purple-400" /> Browse Movie Graph Catalog
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Querying node entities filtered by genres, ratings, and parameterized Cypher lookups.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-xl text-xs">
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-400">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-transparent text-slate-200 font-semibold focus:outline-none cursor-pointer"
          >
            <option value="rating" className="bg-slate-900">Highest Rating</option>
            <option value="year" className="bg-slate-900">Release Year</option>
            <option value="title" className="bg-slate-900">Title (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="w-full md:w-80 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search movie title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700/60 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
          />
        </form>

        {/* Genre Pill Filter Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto w-full pb-2 md:pb-0 scrollbar-none">
          <button
            onClick={() => setSelectedGenre('')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all ${
              selectedGenre === ''
                ? 'bg-purple-600 text-white shadow-md shadow-purple-900/40'
                : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
            }`}
          >
            All Genres
          </button>
          {genres.map((g) => (
            <button
              key={g.id}
              onClick={() => setSelectedGenre(g.name)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all ${
                selectedGenre === g.name
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-900/40'
                  : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
              }`}
            >
              {g.name}
            </button>
          ))}
        </div>
      </div>

      {error && <ErrorAlert message={error} onRetry={loadMovies} />}

      {/* Movies Grid */}
      {loading ? (
        <LoadingSkeleton count={8} />
      ) : sortedMovies.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl text-center border border-slate-800">
          <Film className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-200">No Movies Found</h3>
          <p className="text-xs text-slate-400 mt-1">Try resetting your genre filter or search term.</p>
          <button
            onClick={() => { setSelectedGenre(''); setSearchQuery(''); loadMovies(); }}
            className="mt-4 px-4 py-2 bg-purple-600 text-white text-xs font-semibold rounded-xl"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {sortedMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
};
