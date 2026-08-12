import React, { useEffect, useState } from 'react';
import { Users, Sparkles, Heart, Film, ArrowRight } from 'lucide-react';
import { fetchSimilarUsers, fetchUserLikedMovies } from '../api/client';
import { SimilarUser, Movie, User } from '../types';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { ErrorAlert } from '../components/ErrorAlert';
import { MovieCard } from '../components/MovieCard';

interface SimilarUsersProps {
  selectedUser: User | null;
}

export const SimilarUsers: React.FC<SimilarUsersProps> = ({ selectedUser }) => {
  const [similarUsers, setSimilarUsers] = useState<SimilarUser[]>([]);
  const [userLikes, setUserLikes] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const userId = selectedUser?.id || 'u1';

  useEffect(() => {
    setLoading(true);
    setError(null);

    Promise.all([
      fetchSimilarUsers(userId),
      fetchUserLikedMovies(userId)
    ])
      .then(([sims, likes]) => {
        setSimilarUsers(sims);
        setUserLikes(likes);
      })
      .catch((err) => {
        console.error('Error fetching similar users:', err);
        setError('Failed to fetch similar user network graph.');
      })
      .finally(() => setLoading(false));
  }, [userId]);

  return (
    <div className="space-y-8 pb-12">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold mb-2">
          <Users className="w-3.5 h-3.5" /> Graph Connection Matrix (Cypher Query 3)
        </div>
        <h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">
          Users with Similar Interests
        </h1>
        <p className="text-xs md:text-sm text-slate-400 mt-1 max-w-3xl leading-relaxed">
          Traversing <span className="text-cyan-300 font-bold">SIMILAR_TO</span> graph relationships for <span className="text-purple-300 font-bold">{selectedUser?.name || 'Alex Mercer'}</span> based on overlapping liked movies.
        </p>
      </div>

      {error && <ErrorAlert message={error} />}

      {/* User Liked Movies section (Query 1) */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Heart className="w-5 h-5 text-pink-400" /> Movies Liked by {selectedUser?.name || 'Current User'} (Cypher Query 1)
        </h2>
        {userLikes.length === 0 ? (
          <p className="text-xs text-slate-400">No liked movies recorded for this user yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {userLikes.slice(0, 4).map((m) => (
              <MovieCard key={m.id} movie={m} badgeText="Liked" badgeColor="bg-pink-500/20 text-pink-300 border-pink-500/30" />
            ))}
          </div>
        )}
      </section>

      {/* Similar Users List Grid */}
      <section className="space-y-4 pt-4 border-t border-slate-800">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-cyan-400" /> Closest Cinephile Graph Neighbors ({similarUsers.length})
        </h2>

        {loading ? (
          <LoadingSkeleton count={4} />
        ) : similarUsers.length === 0 ? (
          <p className="text-xs text-slate-400">No similar users found in the database graph.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {similarUsers.map((u) => (
              <div
                key={u.id}
                className="glass-panel glass-panel-hover p-6 rounded-3xl border border-slate-800 space-y-4 flex flex-col justify-between"
              >
                <div className="flex items-center gap-4">
                  {u.avatar_url ? (
                    <img src={u.avatar_url} alt={u.name} className="w-14 h-14 rounded-2xl object-cover shrink-0 border border-slate-700" />
                  ) : (
                    <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 flex items-center justify-center font-bold text-lg text-cyan-300 shrink-0">
                      {u.name[0]}
                    </div>
                  )}
                  <div>
                    <h3 className="font-bold text-white text-base">{u.name}</h3>
                    <p className="text-xs text-slate-400">{u.email}</p>
                    <div className="mt-1 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[11px] font-bold">
                      {(u.similarity_score * 100).toFixed(0)}% Similarity Score
                    </div>
                  </div>
                </div>

                {u.common_liked_movies && u.common_liked_movies.length > 0 && (
                  <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Shared Film Interests:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {u.common_liked_movies.map((mTitle, i) => (
                        <span key={i} className="text-[10px] font-semibold px-2 py-0.5 rounded-lg bg-slate-800 text-slate-300">
                          {mTitle}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
