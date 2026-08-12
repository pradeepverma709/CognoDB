import axios from 'axios';
import {
  Movie,
  MovieDetail,
  Actor,
  ActorDetail,
  Director,
  DirectorDetail,
  Genre,
  User,
  SimilarUser,
  GenreRecommendation,
  UserRecommendation,
  GraphStats,
  GraphData,
  SearchResults
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchHealth = async () => {
  const res = await api.get<{ status: string; database_connected: boolean }>('/api/health');
  return res.data;
};

export const fetchMovies = async (params?: { genre?: string; search?: string; limit?: number }) => {
  const res = await api.get<Movie[]>('/api/movies', { params });
  return res.data;
};

export const fetchTopRatedMovies = async (limit = 10) => {
  const res = await api.get<Movie[]>('/api/movies/top-rated', { params: { limit } });
  return res.data;
};

export const fetchMovieDetail = async (id: string) => {
  const res = await api.get<MovieDetail>(`/api/movies/${id}`);
  return res.data;
};

export const fetchActors = async () => {
  const res = await api.get<Actor[]>('/api/actors');
  return res.data;
};

export const fetchActorDetail = async (id: string) => {
  const res = await api.get<ActorDetail>(`/api/actors/${id}`);
  return res.data;
};

export const fetchDirectors = async () => {
  const res = await api.get<Director[]>('/api/directors');
  return res.data;
};

export const fetchDirectorDetail = async (id: string) => {
  const res = await api.get<DirectorDetail>(`/api/directors/${id}`);
  return res.data;
};

export const fetchGenres = async () => {
  const res = await api.get<Genre[]>('/api/genres');
  return res.data;
};

export const fetchUsers = async () => {
  const res = await api.get<User[]>('/api/users');
  return res.data;
};

export const fetchUserLikedMovies = async (userId: string) => {
  const res = await api.get<Movie[]>(`/api/users/${userId}/liked-movies`);
  return res.data;
};

export const fetchSimilarUsers = async (userId: string) => {
  const res = await api.get<SimilarUser[]>(`/api/users/${userId}/similar`);
  return res.data;
};

export const fetchGenreRecommendations = async (userId: string, limit = 10) => {
  const res = await api.get<GenreRecommendation[]>('/api/recommendations/genre-based', {
    params: { user_id: userId, limit }
  });
  return res.data;
};

export const fetchSimilarUserRecommendations = async (userId: string, limit = 10) => {
  const res = await api.get<UserRecommendation[]>('/api/recommendations/similar-users', {
    params: { user_id: userId, limit }
  });
  return res.data;
};

export const fetchActorCostars = async (actorId: string) => {
  const res = await api.get<any[]>(`/api/recommendations/actor-costars/${actorId}`);
  return res.data;
};

export const fetchGraphStats = async () => {
  const res = await api.get<GraphStats>('/api/analytics/stats');
  return res.data;
};

export const fetchGraphData = async (limit = 60) => {
  const res = await api.get<GraphData>('/api/analytics/graph-data', { params: { limit } });
  return res.data;
};

export const fetchGlobalSearch = async (query: string) => {
  const res = await api.get<SearchResults>('/api/search', { params: { q: query } });
  return res.data;
};
