from pydantic import BaseModel, Field
from typing import List, Optional, Any, Dict

class GenreBase(BaseModel):
    id: str
    name: str

class ActorBase(BaseModel):
    id: str
    name: str
    birth_year: Optional[int] = None
    photo_url: Optional[str] = None
    bio: Optional[str] = None

class DirectorBase(BaseModel):
    id: str
    name: str
    photo_url: Optional[str] = None
    bio: Optional[str] = None

class MovieBase(BaseModel):
    id: str
    title: str
    release_year: int
    rating: float
    duration_mins: int
    poster_url: Optional[str] = None
    plot: Optional[str] = None
    genres: Optional[List[str]] = []
    director: Optional[str] = None

class UserBase(BaseModel):
    id: str
    name: str
    email: str
    avatar_url: Optional[str] = None
    joined_date: Optional[str] = None

class MovieDetailSchema(MovieBase):
    actors: Optional[List[ActorBase]] = []
    directors: Optional[List[DirectorBase]] = []
    liked_by_users_count: int = 0
    watched_by_users_count: int = 0

class ActorDetailSchema(ActorBase):
    movies: List[MovieBase] = []
    co_actors: List[Dict[str, Any]] = []
    top_genres: List[str] = []

class DirectorDetailSchema(DirectorBase):
    movies: List[MovieBase] = []
    frequent_actors: List[Dict[str, Any]] = []

class SimilarUserSchema(BaseModel):
    id: str
    name: str
    email: str
    avatar_url: Optional[str] = None
    similarity_score: float
    common_liked_movies: List[str] = []

class GenreRecommendationSchema(BaseModel):
    id: str
    title: str
    release_year: int
    rating: float
    poster_url: Optional[str] = None
    matching_genres: List[str]
    common_genres_count: int

class UserRecommendationSchema(BaseModel):
    id: str
    title: str
    release_year: int
    rating: float
    poster_url: Optional[str] = None
    genres: List[str]
    recommendation_score: float
    recommended_by_users: List[str]

class GraphStatsSchema(BaseModel):
    node_counts: Dict[str, int]
    relationship_counts: Dict[str, int]
    total_nodes: int
    total_relationships: int
    density: float

class SearchResultsSchema(BaseModel):
    movies: List[MovieBase] = []
    actors: List[ActorBase] = []
    directors: List[DirectorBase] = []
    users: List[UserBase] = []

class GraphNode(BaseModel):
    id: str
    label: str
    name: str
    type: str  # User, Movie, Actor, Director, Genre
    properties: Dict[str, Any] = {}

class GraphEdge(BaseModel):
    id: str
    source: str
    target: str
    label: str  # WATCHED, LIKED, BELONGS_TO, ACTED_IN, DIRECTED, SIMILAR_TO
    properties: Dict[str, Any] = {}

class GraphDataSchema(BaseModel):
    nodes: List[GraphNode]
    edges: List[GraphEdge]
