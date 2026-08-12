import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, Film } from 'lucide-react';
import { Movie } from '../types';

interface MovieCardProps {
  movie: Movie;
  badgeText?: string;
  badgeColor?: string;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie, badgeText, badgeColor = 'bg-purple-500/20 text-purple-300 border-purple-500/30' }) => {
  return (
    <Link
      to={`/movies/${movie.id}`}
      className="group relative flex flex-col rounded-2xl glass-panel glass-panel-hover overflow-hidden transition-all duration-300"
    >
      {/* Poster Image */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-slate-900">
        {movie.poster_url ? (
          <img
            src={movie.poster_url}
            alt={movie.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-600 bg-slate-950">
            <Film className="w-12 h-12 mb-2" />
            <span className="text-xs">No Poster</span>
          </div>
        )}

        {/* Rating Star Badge */}
        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-xl bg-slate-950/80 backdrop-blur-md border border-slate-700/60 flex items-center gap-1 shadow-lg">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span className="text-xs font-bold text-slate-100">{movie.rating}</span>
        </div>

        {/* Custom badge */}
        {badgeText && (
          <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-xl backdrop-blur-md text-[11px] font-bold border ${badgeColor}`}>
            {badgeText}
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-[#131b2e] via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
      </div>

      {/* Movie Details */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          <h3 className="font-bold text-slate-100 text-base group-hover:text-purple-300 transition-colors line-clamp-1">
            {movie.title}
          </h3>
          <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
            <span>{movie.release_year}</span>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-400" />
              <span>{movie.duration_mins || 120}m</span>
            </div>
          </div>
        </div>

        {/* Genre Tags */}
        {movie.genres && movie.genres.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {movie.genres.slice(0, 3).map((g) => (
              <span
                key={g}
                className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-300 border border-slate-700/50"
              >
                {g}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
};
