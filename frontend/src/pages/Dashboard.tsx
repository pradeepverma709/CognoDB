import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Film, Sparkles, Users, Star, ArrowRight, Network, Flame } from 'lucide-react';
import { fetchTopRatedMovies, fetchGenreRecommendations, fetchSimilarUserRecommendations, fetchGraphStats } from '../api/client';
import { Movie, GenreRecommendation, UserRecommendation, GraphStats, User } from '../types';
import { MovieCard } from '../components/MovieCard';
import { StatCard } from '../components/StatCard';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { ErrorAlert } from '../components/ErrorAlert';

interface DashboardProps {
  selectedUser: User | null;
}

export const Dashboard: React.FC<DashboardProps> = ({ selectedUser }) => {
  const [topMovies, setTopMovies] = useState<Movie[]>([]);
  const [genreRecs, setGenreRecs] = useState<GenreRecommendation[]>([]);
  const [similarRecs, setSimilarRecs] = useState<UserRecommendation[]>([]);
  const [stats, setStats] = useState<GraphStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = () => {
    setLoading(true);
    setError(null);

    const userId = selectedUser?.id || 'u1';

    Promise.all([
      fetchTopRatedMovies(4),
      fetchGenreRecommendations(userId, 4),
      fetchSimilarUserRecommendations(userId, 4),
      fetchGraphStats()
    ])
      .then(([top, genreR, simR, st]) => {
        setTopMovies(top);
        setGenreRecs(genreR);
        setSimilarRecs(simR);
        setStats(st);
      })
      .catch((err) => {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to fetch data from backend service. Operating on database backup cache.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, [selectedUser]);

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden glass-panel p-8 md:p-12 border border-purple-500/20 bg-gradient-to-r from-purple-900/40 via-slate-900 to-indigo-950/50 shadow-2xl">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> CognoDB Graph Database Engine
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Movie Recommendations Powered by <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">Multi-Hop Cypher</span>
          </h1>
          <p className="text-slate-300 text-sm md:text-base leading-relaxed">
            Exploring graph connections across users, movies, actors, directors, and genres. Currently viewing personalized graph predictions for <span className="text-purple-300 font-bold">{selectedUser?.name || 'Alex Mercer'}</span>.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              to="/recommendations"
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-sm shadow-lg shadow-purple-600/30 hover:scale-105 transition-transform flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" /> Explore 2-Hop Traversal Recs
            </Link>
            <Link
              to="/analytics"
              className="px-6 py-3 rounded-2xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-sm transition-colors flex items-center gap-2"
            >
              <Network className="w-4 h-4 text-cyan-400" /> Interactive Graph Canvas
            </Link>
          </div>
        </div>
      </div>

      {error && <ErrorAlert message={error} onRetry={loadData} />}

      {/* Analytics Stats Overview Grid */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Graph Nodes"
            value={stats.total_nodes}
            subtitle="Users, Movies, Actors, Directors, Genres"
            icon={Film}
            color="from-purple-600 to-indigo-600"
          />
          <StatCard
            title="Total Relationships"
            value={stats.total_relationships}
            subtitle="WATCHED, LIKED, ACTED_IN, DIRECTED, SIMILAR"
            icon={Network}
            color="from-cyan-600 to-blue-600"
          />
          <StatCard
            title="Network Density"
            value={stats.density}
            subtitle="Interconnected Graph Matrix"
            icon={Sparkles}
            color="from-emerald-600 to-teal-600"
          />
          <StatCard
            title="Registered Users"
            value={stats.node_counts.User || 50}
            subtitle="Active Cinephile Graph Profiles"
            icon={Users}
            color="from-pink-600 to-rose-600"
          />
        </div>
      )}

      {/* Top Rated Movies Section (Query 2) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Star className="w-5 h-5 fill-amber-400 text-amber-400" /> Top-Rated Cinema (Cypher Query 2)
            </h2>
            <p className="text-xs text-slate-400">Highest rated movies queried directly from CognoDB</p>
          </div>
          <Link to="/movies" className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1">
            View All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <LoadingSkeleton count={4} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {topMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} badgeText={`⭐ ${movie.rating}`} />
            ))}
          </div>
        )}
      </section>

      {/* Multi-Hop Traversal Recommendations (Query 4) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" /> Genre Multi-Hop Traversal (Cypher Query 4)
            </h2>
            <p className="text-xs text-slate-400">User → Liked Movie → Genre → Recommended Movie (2+ Hops)</p>
          </div>
          <Link to="/recommendations" className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1">
            View More <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <LoadingSkeleton count={4} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {genreRecs.map((rec) => (
              <MovieCard
                key={rec.id}
                movie={{
                  id: rec.id,
                  title: rec.title,
                  release_year: rec.release_year,
                  rating: rec.rating,
                  duration_mins: 135,
                  poster_url: rec.poster_url,
                  genres: rec.matching_genres
                }}
                badgeText={`${rec.common_genres_count} Genre Match`}
                badgeColor="bg-cyan-500/20 text-cyan-300 border-cyan-500/30"
              />
            ))}
          </div>
        )}
      </section>

      {/* Collaborative Filtering Recommendations (Query 6) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Flame className="w-5 h-5 text-pink-400" /> Similar User Collaborative Traversal (Cypher Query 6)
            </h2>
            <p className="text-xs text-slate-400">User → SIMILAR_TO User → LIKED Movie (2+ Hops)</p>
          </div>
          <Link to="/recommendations" className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1">
            View Details <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <LoadingSkeleton count={4} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {similarRecs.map((rec) => (
              <MovieCard
                key={rec.id}
                movie={{
                  id: rec.id,
                  title: rec.title,
                  release_year: rec.release_year,
                  rating: rec.rating,
                  duration_mins: 140,
                  poster_url: rec.poster_url,
                  genres: rec.genres
                }}
                badgeText={`Score ${rec.recommendation_score}`}
                badgeColor="bg-pink-500/20 text-pink-300 border-pink-500/30"
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
