export interface Movie {
  id: string;
  title: string;
  release_year: number;
  rating: number;
  duration_mins: number;
  poster_url?: string;
  plot?: string;
  genres?: string[];
  director?: string;
}

export interface Actor {
  id: string;
  name: string;
  birth_year?: number;
  photo_url?: string;
  bio?: string;
}

export interface Director {
  id: string;
  name: string;
  photo_url?: string;
  bio?: string;
}

export interface Genre {
  id: string;
  name: string;
  movie_count?: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  joined_date?: string;
}

export interface MovieDetail extends Movie {
  actors?: Actor[];
  directors?: Director[];
  liked_by_users_count: number;
  watched_by_users_count: number;
}

export interface ActorDetail extends Actor {
  movies: Movie[];
  co_actors: {
    co_actor_id: string;
    co_actor_name: string;
    photo_url?: string;
    shared_movies: string[];
    movie_count: number;
  }[];
  top_genres: string[];
}

export interface DirectorDetail extends Director {
  movies: Movie[];
  frequent_actors: any[];
}

export interface SimilarUser {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  similarity_score: number;
  common_liked_movies: string[];
}

export interface GenreRecommendation {
  id: string;
  title: string;
  release_year: number;
  rating: number;
  poster_url?: string;
  matching_genres: string[];
  common_genres_count: number;
}

export interface UserRecommendation {
  id: string;
  title: string;
  release_year: number;
  rating: number;
  poster_url?: string;
  genres: string[];
  recommendation_score: number;
  recommended_by_users: string[];
}

export interface GraphStats {
  node_counts: {
    User: number;
    Movie: number;
    Actor: number;
    Director: number;
    Genre: number;
  };
  relationship_counts: {
    WATCHED: number;
    LIKED: number;
    BELONGS_TO: number;
    ACTED_IN: number;
    DIRECTED: number;
    SIMILAR_TO: number;
  };
  total_nodes: number;
  total_relationships: number;
  density: number;
}

export interface GraphNode {
  id: string;
  label: string;
  name: string;
  type: 'User' | 'Movie' | 'Actor' | 'Director' | 'Genre';
  properties?: any;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  label: 'WATCHED' | 'LIKED' | 'BELONGS_TO' | 'ACTED_IN' | 'DIRECTED' | 'SIMILAR_TO';
  properties?: any;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface SearchResults {
  movies: Movie[];
  actors: Actor[];
  directors: Director[];
  users: User[];
}
