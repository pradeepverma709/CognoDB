import React, { useEffect, useState } from 'react';
import { Sparkles, Layers, Users, Code, CheckCircle, HelpCircle } from 'lucide-react';
import { fetchGenreRecommendations, fetchSimilarUserRecommendations } from '../api/client';
import { GenreRecommendation, UserRecommendation, User } from '../types';
import { MovieCard } from '../components/MovieCard';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { ErrorAlert } from '../components/ErrorAlert';

interface RecommendationsProps {
  selectedUser: User | null;
}

export const Recommendations: React.FC<RecommendationsProps> = ({ selectedUser }) => {
  const [activeTab, setActiveTab] = useState<'genre' | 'collaborative'>('genre');
  const [genreRecs, setGenreRecs] = useState<GenreRecommendation[]>([]);
  const [similarRecs, setSimilarRecs] = useState<UserRecommendation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const userId = selectedUser?.id || 'u1';

  useEffect(() => {
    setLoading(true);
    setError(null);

    if (activeTab === 'genre') {
      fetchGenreRecommendations(userId, 12)
        .then((data) => setGenreRecs(data))
        .catch((err) => setError('Failed to fetch multi-hop genre recommendations.'))
        .finally(() => setLoading(false));
    } else {
      fetchSimilarUserRecommendations(userId, 12)
        .then((data) => setSimilarRecs(data))
        .catch((err) => setError('Failed to fetch collaborative graph recommendations.'))
        .finally(() => setLoading(false));
    }
  }, [userId, activeTab]);

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Multi-Hop Graph Traversal Engine
        </div>
        <h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">
          Personalized Graph Recommendations
        </h1>
        <p className="text-xs md:text-sm text-slate-400 mt-1 max-w-3xl leading-relaxed">
          Generating predictions for <span className="text-purple-300 font-bold">{selectedUser?.name || 'Alex Mercer'}</span> using 2+ hop Cypher pattern matching against CognoDB.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 gap-4">
        <button
          onClick={() => setActiveTab('genre')}
          className={`pb-3 text-sm font-bold flex items-center gap-2 transition-all border-b-2 ${
            activeTab === 'genre'
              ? 'border-purple-500 text-purple-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-4 h-4 text-purple-400" /> Genre Multi-Hop (Query 4)
        </button>

        <button
          onClick={() => setActiveTab('collaborative')}
          className={`pb-3 text-sm font-bold flex items-center gap-2 transition-all border-b-2 ${
            activeTab === 'collaborative'
              ? 'border-pink-500 text-pink-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Users className="w-4 h-4 text-pink-400" /> Collaborative Traversal (Query 6)
        </button>
      </div>

      {/* Explanation Banner */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-3 bg-slate-950/80">
        <div className="flex items-center gap-2 text-xs font-bold text-cyan-400">
          <Code className="w-4 h-4" /> Cypher Graph Query (2+ Hops Traversal)
        </div>
        {activeTab === 'genre' ? (
          <pre className="p-4 rounded-2xl bg-slate-900 text-xs font-mono text-purple-300 overflow-x-auto border border-slate-800">
{`MATCH (u:User {id: "${userId}"})-[:LIKED]->(m1:Movie)-[:BELONGS_TO]->(g:Genre)<-[:BELONGS_TO]-(rec:Movie)
WHERE NOT (u)-[:WATCHED]->(rec) AND rec <> m1
WITH rec, collect(DISTINCT g.name) AS matching_genres, count(DISTINCT g) AS common_genres_count
RETURN rec, matching_genres, common_genres_count
ORDER BY common_genres_count DESC, rec.rating DESC LIMIT 12;`}
          </pre>
        ) : (
          <pre className="p-4 rounded-2xl bg-slate-900 text-xs font-mono text-pink-300 overflow-x-auto border border-slate-800">
{`MATCH (u:User {id: "${userId}"})-[s:SIMILAR_TO]-(sim:User)-[:LIKED]->(m:Movie)
WHERE NOT (u)-[:WATCHED]->(m)
WITH m, sum(s.score) AS recommendation_score, collect(DISTINCT sim.name) AS recommended_by_users
RETURN m, recommendation_score, recommended_by_users
ORDER BY recommendation_score DESC, m.rating DESC LIMIT 12;`}
          </pre>
        )}
      </div>

      {error && <ErrorAlert message={error} />}

      {/* Grid */}
      {loading ? (
        <LoadingSkeleton count={8} />
      ) : activeTab === 'genre' ? (
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
              badgeColor="bg-purple-500/20 text-purple-300 border-purple-500/30"
            />
          ))}
        </div>
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
    </div>
  );
};
