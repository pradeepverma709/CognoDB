from typing import List, Dict, Any
from app.database import db_manager
from app.services.mock_data import USERS, USER_LIKES, USER_WATCHES, USER_SIMILARITIES, MOVIES, ACTORS

class RecommendationService:
    @staticmethod
    def get_genre_based_recommendations(user_id: str, limit: int = 10) -> List[Dict[str, Any]]:
        """
        Required Query 4 (Multi-hop Traversal: 2+ Hops):
        User -> Movie -> Genre -> Movie
        Recommends movies based on genres liked by the user.
        """
        if db_manager.is_connected:
            query = """
            MATCH (u:User {id: $user_id})-[:LIKED]->(m1:Movie)-[:BELONGS_TO]->(g:Genre)<-[:BELONGS_TO]-(rec:Movie)
            WHERE NOT (u)-[:WATCHED]->(rec) AND rec <> m1
            WITH rec, collect(DISTINCT g.name) AS matching_genres, count(DISTINCT g) AS common_genres_count
            RETURN rec.id AS id, rec.title AS title, rec.release_year AS release_year, rec.rating AS rating,
                   rec.poster_url AS poster_url, matching_genres, common_genres_count
            ORDER BY common_genres_count DESC, rec.rating DESC
            LIMIT $limit
            """
            records = db_manager.execute_query(query, {"user_id": user_id, "limit": limit})
            if records:
                return records

        # In-memory implementation of Query 4
        liked_m_ids = USER_LIKES.get(user_id, [])
        watched_m_ids = set(USER_WATCHES.get(user_id, []))

        # Get genres of movies liked by user (User -> Movie -> Genre)
        user_genres = set()
        for m_id in liked_m_ids:
            m_obj = next((m for m in MOVIES if m["id"] == m_id), None)
            if m_obj:
                user_genres.update(m_obj.get("genres", []))

        # Find movies sharing these genres that user hasn't watched (Genre -> Movie)
        recommendations = []
        for m in MOVIES:
            if m["id"] in watched_m_ids:
                continue
            matching = [g for g in m.get("genres", []) if g in user_genres]
            if matching:
                recommendations.append({
                    "id": m["id"],
                    "title": m["title"],
                    "release_year": m["release_year"],
                    "rating": m["rating"],
                    "poster_url": m["poster_url"],
                    "matching_genres": matching,
                    "common_genres_count": len(matching)
                })

        sorted_recs = sorted(recommendations, key=lambda x: (x["common_genres_count"], x["rating"]), reverse=True)
        return sorted_recs[:limit]

    @staticmethod
    def get_similar_user_recommendations(user_id: str, limit: int = 10) -> List[Dict[str, Any]]:
        """
        Required Query 6 (Collaborative Filtering Multi-hop):
        User -> Similar User -> Liked Movie
        Recommends movies liked by similar users.
        """
        if db_manager.is_connected:
            query = """
            MATCH (u:User {id: $user_id})-[s:SIMILAR_TO]-(sim:User)-[:LIKED]->(m:Movie)
            WHERE NOT (u)-[:WATCHED]->(m)
            WITH m, sum(s.score) AS recommendation_score, collect(DISTINCT sim.name) AS recommended_by_users
            OPTIONAL MATCH (m)-[:BELONGS_TO]->(g:Genre)
            RETURN m.id AS id, m.title AS title, m.release_year AS release_year, m.rating AS rating,
                   m.poster_url AS poster_url, collect(DISTINCT g.name) AS genres,
                   round(recommendation_score, 2) AS recommendation_score, recommended_by_users
            ORDER BY recommendation_score DESC, m.rating DESC
            LIMIT $limit
            """
            records = db_manager.execute_query(query, {"user_id": user_id, "limit": limit})
            if records:
                return records

        # In-memory implementation of Query 6
        sims = [s for s in USER_SIMILARITIES if s["u1"] == user_id]
        watched_ids = set(USER_WATCHES.get(user_id, []))

        movie_scores = {}
        movie_recommenders = {}

        for s in sims:
            sim_u_id = s["u2"]
            sim_u_obj = next((u for u in USERS if u["id"] == sim_u_id), None)
            sim_u_name = sim_u_obj["name"] if sim_u_obj else sim_u_id
            score = s["score"]

            sim_likes = USER_LIKES.get(sim_u_id, [])
            for m_id in sim_likes:
                if m_id in watched_ids:
                    continue
                movie_scores[m_id] = movie_scores.get(m_id, 0.0) + score
                if m_id not in movie_recommenders:
                    movie_recommenders[m_id] = []
                movie_recommenders[m_id].append(sim_u_name)

        recs = []
        for m_id, rec_score in movie_scores.items():
            m_obj = next((m for m in MOVIES if m["id"] == m_id), None)
            if m_obj:
                recs.append({
                    "id": m_obj["id"],
                    "title": m_obj["title"],
                    "release_year": m_obj["release_year"],
                    "rating": m_obj["rating"],
                    "poster_url": m_obj["poster_url"],
                    "genres": m_obj.get("genres", []),
                    "recommendation_score": round(rec_score, 2),
                    "recommended_by_users": movie_recommenders[m_id][:3]
                })

        sorted_recs = sorted(recs, key=lambda x: (x["recommendation_score"], x["rating"]), reverse=True)
        return sorted_recs[:limit]

    @staticmethod
    def get_actor_costars(actor_id: str) -> List[Dict[str, Any]]:
        """
        Required Query 5:
        Find connections between actors through movies.
        Cypher:
        MATCH (a1:Actor {id: $actor_id})-[:ACTED_IN]->(m:Movie)<-[:ACTED_IN]-(a2:Actor)
        RETURN a2.id AS co_actor_id, a2.name AS co_actor_name, a2.photo_url AS photo_url,
               collect(DISTINCT m.title) AS shared_movies, count(DISTINCT m) AS movie_count
        ORDER BY movie_count DESC
        """
        if db_manager.is_connected:
            query = """
            MATCH (a1:Actor {id: $actor_id})-[:ACTED_IN]->(m:Movie)<-[:ACTED_IN]-(a2:Actor)
            RETURN a2.id AS co_actor_id, a2.name AS co_actor_name, a2.photo_url AS photo_url,
                   collect(DISTINCT m.title) AS shared_movies, count(DISTINCT m) AS movie_count
            ORDER BY movie_count DESC
            """
            records = db_manager.execute_query(query, {"actor_id": actor_id})
            if records:
                return records

        # In-memory implementation of Query 5
        actor_movies = [m for m in MOVIES if actor_id in m.get("actors", [])]
        co_actor_map = {}

        for m in actor_movies:
            for other_a_id in m.get("actors", []):
                if other_a_id == actor_id:
                    continue
                if other_a_id not in co_actor_map:
                    a_obj = next((a for a in ACTORS if a["id"] == other_a_id), None)
                    if a_obj:
                        co_actor_map[other_a_id] = {
                            "co_actor_id": a_obj["id"],
                            "co_actor_name": a_obj["name"],
                            "photo_url": a_obj["photo_url"],
                            "shared_movies": [],
                            "movie_count": 0
                        }
                if other_a_id in co_actor_map:
                    co_actor_map[other_a_id]["shared_movies"].append(m["title"])
                    co_actor_map[other_a_id]["movie_count"] += 1

        return sorted(list(co_actor_map.values()), key=lambda x: x["movie_count"], reverse=True)
