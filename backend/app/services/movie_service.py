from typing import List, Dict, Any, Optional
from app.database import db_manager
from app.services.mock_data import MOVIES, ACTORS, DIRECTORS, GENRES, USER_LIKES, USER_WATCHES

class MovieService:
    @staticmethod
    def get_all_movies(genre: Optional[str] = None, search: Optional[str] = None, limit: int = 100) -> List[Dict[str, Any]]:
        if db_manager.is_connected:
            query = """
            MATCH (m:Movie)
            OPTIONAL MATCH (m)-[:BELONGS_TO]->(g:Genre)
            OPTIONAL MATCH (d:Director)-[:DIRECTED]->(m)
            WITH m, collect(DISTINCT g.name) AS genres, d.name AS director
            WHERE ($genre IS NULL OR $genre IN genres) AND ($search IS NULL OR toLower(m.title) CONTAINS toLower($search))
            RETURN m.id AS id, m.title AS title, m.release_year AS release_year, m.rating AS rating,
                   m.duration_mins AS duration_mins, m.poster_url AS poster_url, m.plot AS plot,
                   genres, director
            ORDER BY m.rating DESC
            LIMIT $limit
            """
            params = {"genre": genre, "search": search, "limit": limit}
            records = db_manager.execute_query(query, params)
            if records:
                return records

        # Fallback to in-memory data
        res = MOVIES
        if genre:
            res = [m for m in res if genre in m["genres"]]
        if search:
            search_lower = search.lower()
            res = [m for m in res if search_lower in m["title"].lower()]
        return res[:limit]

    @staticmethod
    def get_top_rated_movies(limit: int = 10) -> List[Dict[str, Any]]:
        """
        Required Query 2: Get top-rated movies.
        """
        if db_manager.is_connected:
            query = """
            MATCH (m:Movie)
            OPTIONAL MATCH (m)-[:BELONGS_TO]->(g:Genre)
            OPTIONAL MATCH (d:Director)-[:DIRECTED]->(m)
            RETURN m.id AS id, m.title AS title, m.release_year AS release_year, m.rating AS rating,
                   m.duration_mins AS duration_mins, m.poster_url AS poster_url, m.plot AS plot,
                   collect(DISTINCT g.name) AS genres, d.name AS director
            ORDER BY m.rating DESC
            LIMIT $limit
            """
            return db_manager.execute_query(query, {"limit": limit})
        
        sorted_movies = sorted(MOVIES, key=lambda x: x["rating"], reverse=True)
        return sorted_movies[:limit]

    @staticmethod
    def get_movie_by_id(movie_id: str) -> Optional[Dict[str, Any]]:
        if db_manager.is_connected:
            query = """
            MATCH (m:Movie {id: $movie_id})
            OPTIONAL MATCH (m)-[:BELONGS_TO]->(g:Genre)
            OPTIONAL MATCH (d:Director)-[:DIRECTED]->(m)
            OPTIONAL MATCH (a:Actor)-[:ACTED_IN]->(m)
            OPTIONAL MATCH (u1:User)-[:LIKED]->(m)
            OPTIONAL MATCH (u2:User)-[:WATCHED]->(m)
            RETURN m.id AS id, m.title AS title, m.release_year AS release_year, m.rating AS rating,
                   m.duration_mins AS duration_mins, m.poster_url AS poster_url, m.plot AS plot,
                   collect(DISTINCT g.name) AS genres, d.name AS director, d.id AS director_id,
                   collect(DISTINCT {id: a.id, name: a.name, photo_url: a.photo_url, birth_year: a.birth_year}) AS actors,
                   count(DISTINCT u1) AS liked_by_users_count, count(DISTINCT u2) AS watched_by_users_count
            """
            records = db_manager.execute_query(query, {"movie_id": movie_id})
            if records and records[0]["id"] is not None:
                return records[0]

        movie = next((m for m in MOVIES if m["id"] == movie_id), None)
        if not movie:
            return None
        
        # Populate details from fallback sets
        actors_list = [a for a in ACTORS if a["id"] in movie.get("actors", [])]
        director_obj = next((d for d in DIRECTORS if d["id"] == movie.get("director_id")), None)

        liked_count = sum(1 for likes in USER_LIKES.values() if movie_id in likes)
        watched_count = sum(1 for watches in USER_WATCHES.values() if movie_id in watches)

        return {
            **movie,
            "actors": actors_list,
            "directors": [director_obj] if director_obj else [],
            "liked_by_users_count": liked_count,
            "watched_by_users_count": watched_count
        }

    @staticmethod
    def get_actor_by_id(actor_id: str) -> Optional[Dict[str, Any]]:
        if db_manager.is_connected:
            query = """
            MATCH (a:Actor {id: $actor_id})
            OPTIONAL MATCH (a)-[:ACTED_IN]->(m:Movie)
            OPTIONAL MATCH (m)-[:BELONGS_TO]->(g:Genre)
            RETURN a.id AS id, a.name AS name, a.photo_url AS photo_url, a.bio AS bio, a.birth_year AS birth_year,
                   collect(DISTINCT {id: m.id, title: m.title, rating: m.rating, release_year: m.release_year, poster_url: m.poster_url}) AS movies,
                   collect(DISTINCT g.name) AS top_genres
            """
            records = db_manager.execute_query(query, {"actor_id": actor_id})
            if records and records[0]["id"] is not None:
                return records[0]

        actor = next((a for a in ACTORS if a["id"] == actor_id), None)
        if not actor:
            return None
        
        acted_movies = [m for m in MOVIES if actor_id in m.get("actors", [])]
        top_genres = list(set([g for m in acted_movies for g in m.get("genres", [])]))

        return {
            **actor,
            "movies": acted_movies,
            "co_actors": [],
            "top_genres": top_genres
        }

    @staticmethod
    def get_director_by_id(director_id: str) -> Optional[Dict[str, Any]]:
        if db_manager.is_connected:
            query = """
            MATCH (d:Director {id: $director_id})
            OPTIONAL MATCH (d)-[:DIRECTED]->(m:Movie)
            RETURN d.id AS id, d.name AS name, d.photo_url AS photo_url, d.bio AS bio,
                   collect(DISTINCT {id: m.id, title: m.title, rating: m.rating, release_year: m.release_year, poster_url: m.poster_url}) AS movies
            """
            records = db_manager.execute_query(query, {"director_id": director_id})
            if records and records[0]["id"] is not None:
                return records[0]

        director = next((d for d in DIRECTORS if d["id"] == director_id), None)
        if not director:
            return None
        
        directed_movies = [m for m in MOVIES if m.get("director_id") == director_id]
        return {
            **director,
            "movies": directed_movies,
            "frequent_actors": []
        }

    @staticmethod
    def get_all_genres() -> List[Dict[str, Any]]:
        if db_manager.is_connected:
            query = """
            MATCH (g:Genre)
            OPTIONAL MATCH (m:Movie)-[:BELONGS_TO]->(g)
            RETURN g.id AS id, g.name AS name, count(m) AS movie_count
            ORDER BY movie_count DESC
            """
            records = db_manager.execute_query(query)
            if records:
                return records
        
        # Calculate counts from mock
        res = []
        for g in GENRES:
            count = sum(1 for m in MOVIES if g["name"] in m["genres"])
            res.append({**g, "movie_count": count})
        return res
