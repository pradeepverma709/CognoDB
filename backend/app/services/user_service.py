from typing import List, Dict, Any, Optional
from app.database import db_manager
from app.services.mock_data import USERS, USER_LIKES, USER_SIMILARITIES, MOVIES

class UserService:
    @staticmethod
    def get_all_users() -> List[Dict[str, Any]]:
        if db_manager.is_connected:
            query = """
            MATCH (u:User)
            RETURN u.id AS id, u.name AS name, u.email AS email, u.avatar_url AS avatar_url, u.joined_date AS joined_date
            ORDER BY u.name ASC
            """
            records = db_manager.execute_query(query)
            if records:
                return records
        return USERS

    @staticmethod
    def get_user_by_id(user_id: str) -> Optional[Dict[str, Any]]:
        if db_manager.is_connected:
            query = """
            MATCH (u:User {id: $user_id})
            RETURN u.id AS id, u.name AS name, u.email AS email, u.avatar_url AS avatar_url, u.joined_date AS joined_date
            """
            records = db_manager.execute_query(query, {"user_id": user_id})
            if records and records[0]["id"] is not None:
                return records[0]

        return next((u for u in USERS if u["id"] == user_id), None)

    @staticmethod
    def get_liked_movies(user_id: str) -> List[Dict[str, Any]]:
        """
        Required Query 1: Get all movies liked by a user.
        Cypher:
        MATCH (u:User {id: $user_id})-[r:LIKED]->(m:Movie)
        OPTIONAL MATCH (m)-[:BELONGS_TO]->(g:Genre)
        RETURN m.id AS id, m.title AS title, m.release_year AS release_year, m.rating AS rating,
               m.duration_mins AS duration_mins, m.poster_url AS poster_url, collect(DISTINCT g.name) AS genres
        """
        if db_manager.is_connected:
            query = """
            MATCH (u:User {id: $user_id})-[:LIKED]->(m:Movie)
            OPTIONAL MATCH (m)-[:BELONGS_TO]->(g:Genre)
            OPTIONAL MATCH (d:Director)-[:DIRECTED]->(m)
            RETURN m.id AS id, m.title AS title, m.release_year AS release_year, m.rating AS rating,
                   m.duration_mins AS duration_mins, m.poster_url AS poster_url, m.plot AS plot,
                   collect(DISTINCT g.name) AS genres, d.name AS director
            ORDER BY m.rating DESC
            """
            records = db_manager.execute_query(query, {"user_id": user_id})
            if records:
                return records

        liked_movie_ids = USER_LIKES.get(user_id, [])
        return [m for m in MOVIES if m["id"] in liked_movie_ids]

    @staticmethod
    def get_similar_users(user_id: str) -> List[Dict[str, Any]]:
        """
        Required Query 3: Find users with similar interests.
        Cypher:
        MATCH (u1:User {id: $user_id})-[s:SIMILAR_TO]-(u2:User)
        OPTIONAL MATCH (u2)-[:LIKED]->(m:Movie)
        RETURN u2.id AS id, u2.name AS name, u2.email AS email, u2.avatar_url AS avatar_url,
               s.score AS similarity_score, collect(DISTINCT m.title)[..3] AS common_liked_movies
        ORDER BY s.score DESC
        """
        if db_manager.is_connected:
            query = """
            MATCH (u1:User {id: $user_id})-[s:SIMILAR_TO]-(u2:User)
            OPTIONAL MATCH (u2)-[:LIKED]->(m:Movie)
            RETURN u2.id AS id, u2.name AS name, u2.email AS email, u2.avatar_url AS avatar_url,
                   s.score AS similarity_score, collect(DISTINCT m.title)[..3] AS common_liked_movies
            ORDER BY s.score DESC
            """
            records = db_manager.execute_query(query, {"user_id": user_id})
            if records:
                return records

        sims = [s for s in USER_SIMILARITIES if s["u1"] == user_id]
        res = []
        for s in sims:
            u2 = next((u for u in USERS if u["id"] == s["u2"]), None)
            if u2:
                u2_likes = USER_LIKES.get(s["u2"], [])
                common_titles = [m["title"] for m in MOVIES if m["id"] in u2_likes][:3]
                res.append({
                    "id": u2["id"],
                    "name": u2["name"],
                    "email": u2["email"],
                    "avatar_url": u2["avatar_url"],
                    "similarity_score": s["score"],
                    "common_liked_movies": common_titles
                })
        return sorted(res, key=lambda x: x["similarity_score"], reverse=True)
