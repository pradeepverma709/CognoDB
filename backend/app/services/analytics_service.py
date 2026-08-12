from typing import Dict, Any, List
from app.database import db_manager
from app.services.mock_data import USERS, MOVIES, ACTORS, DIRECTORS, GENRES, USER_LIKES, USER_WATCHES, USER_SIMILARITIES

class AnalyticsService:
    @staticmethod
    def get_graph_stats() -> Dict[str, Any]:
        if db_manager.is_connected:
            query = """
            CALL {
                MATCH (u:User) RETURN count(u) AS user_count
            }
            CALL {
                MATCH (m:Movie) RETURN count(m) AS movie_count
            }
            CALL {
                MATCH (a:Actor) RETURN count(a) AS actor_count
            }
            CALL {
                MATCH (d:Director) RETURN count(d) AS director_count
            }
            CALL {
                MATCH (g:Genre) RETURN count(g) AS genre_count
            }
            CALL {
                MATCH ()-[r:WATCHED]->() RETURN count(r) AS watched_count
            }
            CALL {
                MATCH ()-[r:LIKED]->() RETURN count(r) AS liked_count
            }
            CALL {
                MATCH ()-[r:BELONGS_TO]->() RETURN count(r) AS belongs_count
            }
            CALL {
                MATCH ()-[r:ACTED_IN]->() RETURN count(r) AS acted_count
            }
            CALL {
                MATCH ()-[r:DIRECTED]->() RETURN count(r) AS directed_count
            }
            CALL {
                MATCH ()-[r:SIMILAR_TO]->() RETURN count(r) AS similar_count
            }
            RETURN user_count, movie_count, actor_count, director_count, genre_count,
                   watched_count, liked_count, belongs_count, acted_count, directed_count, similar_count
            """
            records = db_manager.execute_query(query)
            if records:
                r = records[0]
                total_n = r["user_count"] + r["movie_count"] + r["actor_count"] + r["director_count"] + r["genre_count"]
                total_rel = r["watched_count"] + r["liked_count"] + r["belongs_count"] + r["acted_count"] + r["directed_count"] + r["similar_count"]
                max_edges = (total_n * (total_n - 1)) / 2 if total_n > 1 else 1
                density = round(total_rel / max_edges, 4)
                return {
                    "node_counts": {
                        "User": r["user_count"],
                        "Movie": r["movie_count"],
                        "Actor": r["actor_count"],
                        "Director": r["director_count"],
                        "Genre": r["genre_count"]
                    },
                    "relationship_counts": {
                        "WATCHED": r["watched_count"],
                        "LIKED": r["liked_count"],
                        "BELONGS_TO": r["belongs_count"],
                        "ACTED_IN": r["acted_count"],
                        "DIRECTED": r["directed_count"],
                        "SIMILAR_TO": r["similar_count"]
                    },
                    "total_nodes": total_n,
                    "total_relationships": total_rel,
                    "density": density
                }

        # Fallback graph stats from mock dataset
        user_c = len(USERS)
        movie_c = len(MOVIES)
        actor_c = len(ACTORS)
        dir_c = len(DIRECTORS)
        genre_c = len(GENRES)

        liked_rel_c = sum(len(v) for v in USER_LIKES.values())
        watched_rel_c = sum(len(v) for v in USER_WATCHES.values())
        belongs_rel_c = sum(len(m.get("genres", [])) for m in MOVIES)
        acted_rel_c = sum(len(m.get("actors", [])) for m in MOVIES)
        directed_rel_c = movie_c
        similar_rel_c = len(USER_SIMILARITIES)

        total_n = user_c + movie_c + actor_c + dir_c + genre_c
        total_rel = liked_rel_c + watched_rel_c + belongs_rel_c + acted_rel_c + directed_rel_c + similar_rel_c
        max_possible = (total_n * (total_n - 1)) / 2
        density = round(total_rel / max_possible, 4)

        return {
            "node_counts": {
                "User": user_c,
                "Movie": movie_c,
                "Actor": actor_c,
                "Director": dir_c,
                "Genre": genre_c
            },
            "relationship_counts": {
                "WATCHED": watched_rel_c,
                "LIKED": liked_rel_c,
                "BELONGS_TO": belongs_rel_c,
                "ACTED_IN": acted_rel_c,
                "DIRECTED": directed_rel_c,
                "SIMILAR_TO": similar_rel_c
            },
            "total_nodes": total_n,
            "total_relationships": total_rel,
            "density": density
        }

    @staticmethod
    def get_graph_data(limit_nodes: int = 60) -> Dict[str, Any]:
        """
        Generates graph nodes & relationships payload for front-end interactive canvas graph visualizer.
        """
        nodes = []
        edges = []

        # Add top sample nodes from each category for smooth rendering
        sub_users = USERS[:10]
        sub_movies = MOVIES[:15]
        sub_actors = ACTORS[:15]
        sub_dirs = DIRECTORS[:10]
        sub_genres = GENRES[:10]

        for u in sub_users:
            nodes.append({"id": u["id"], "label": u["name"], "name": u["name"], "type": "User", "properties": u})
        for m in sub_movies:
            nodes.append({"id": m["id"], "label": m["title"], "name": m["title"], "type": "Movie", "properties": m})
        for a in sub_actors:
            nodes.append({"id": a["id"], "label": a["name"], "name": a["name"], "type": "Actor", "properties": a})
        for d in sub_dirs:
            nodes.append({"id": d["id"], "label": d["name"], "name": d["name"], "type": "Director", "properties": d})
        for g in sub_genres:
            nodes.append({"id": g["id"], "label": g["name"], "name": g["name"], "type": "Genre", "properties": g})

        node_ids = set(n["id"] for n in nodes)

        # Edges
        edge_id = 1
        # DIRECTED
        for m in sub_movies:
            d_id = m.get("director_id")
            if d_id and d_id in node_ids:
                edges.append({
                    "id": f"e{edge_id}",
                    "source": d_id,
                    "target": m["id"],
                    "label": "DIRECTED",
                    "properties": {}
                })
                edge_id += 1

            # ACTED_IN
            for a_id in m.get("actors", []):
                if a_id in node_ids:
                    edges.append({
                        "id": f"e{edge_id}",
                        "source": a_id,
                        "target": m["id"],
                        "label": "ACTED_IN",
                        "properties": {}
                    })
                    edge_id += 1

            # BELONGS_TO
            for g_name in m.get("genres", []):
                g_obj = next((g for g in sub_genres if g["name"] == g_name), None)
                if g_obj:
                    edges.append({
                        "id": f"e{edge_id}",
                        "source": m["id"],
                        "target": g_obj["id"],
                        "label": "BELONGS_TO",
                        "properties": {}
                    })
                    edge_id += 1

        # LIKED
        for u in sub_users:
            u_likes = USER_LIKES.get(u["id"], [])
            for m_id in u_likes:
                if m_id in node_ids:
                    edges.append({
                        "id": f"e{edge_id}",
                        "source": u["id"],
                        "target": m_id,
                        "label": "LIKED",
                        "properties": {}
                    })
                    edge_id += 1

        # SIMILAR_TO
        for s in USER_SIMILARITIES:
            if s["u1"] in node_ids and s["u2"] in node_ids:
                edges.append({
                    "id": f"e{edge_id}",
                    "source": s["u1"],
                    "target": s["u2"],
                    "label": "SIMILAR_TO",
                    "properties": {"score": s["score"]}
                })
                edge_id += 1

        return {"nodes": nodes, "edges": edges}
