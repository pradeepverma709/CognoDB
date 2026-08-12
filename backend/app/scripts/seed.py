import os
import sys
import logging

# Append parent dir to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from app.database import db_manager
from app.services.mock_data import USERS, MOVIES, ACTORS, DIRECTORS, GENRES, USER_LIKES, USER_WATCHES, USER_SIMILARITIES

logger = logging.getLogger("seed_script")
logging.basicConfig(level=logging.INFO)

def seed_database():
    logger.info("Initializing CognoDB seed script...")
    db_manager.connect()

    if not db_manager.is_connected:
        logger.error("Could not connect to CognoDB graph database. Please verify environment variables COGNO_DB_URI, COGNO_DB_USER, COGNO_DB_PASSWORD.")
        return

    try:
        logger.info("Creating graph schema constraints & indexes...")
        constraints = [
            "CREATE CONSTRAINT user_id_unique IF NOT EXISTS FOR (u:User) REQUIRE u.id IS UNIQUE",
            "CREATE CONSTRAINT movie_id_unique IF NOT EXISTS FOR (m:Movie) REQUIRE m.id IS UNIQUE",
            "CREATE CONSTRAINT actor_id_unique IF NOT EXISTS FOR (a:Actor) REQUIRE a.id IS UNIQUE",
            "CREATE CONSTRAINT director_id_unique IF NOT EXISTS FOR (d:Director) REQUIRE d.id IS UNIQUE",
            "CREATE CONSTRAINT genre_id_unique IF NOT EXISTS FOR (g:Genre) REQUIRE g.id IS UNIQUE"
        ]
        for c in constraints:
            try:
                db_manager.execute_query(c)
            except Exception as e:
                logger.warning(f"Constraint notice: {e}")

        logger.info(f"Seeding {len(GENRES)} Genres...")
        for g in GENRES:
            db_manager.execute_query("MERGE (genre:Genre {id: $id}) SET genre.name = $name", g)

        logger.info(f"Seeding {len(DIRECTORS)} Directors...")
        for d in DIRECTORS:
            db_manager.execute_query("MERGE (dir:Director {id: $id}) SET dir.name = $name, dir.photo_url = $photo_url, dir.bio = $bio", d)

        logger.info(f"Seeding {len(ACTORS)} Actors...")
        for a in ACTORS:
            db_manager.execute_query("MERGE (act:Actor {id: $id}) SET act.name = $name, act.birth_year = $birth_year, act.photo_url = $photo_url, act.bio = $bio", a)

        logger.info(f"Seeding {len(MOVIES)} Movies and relationships...")
        for m in MOVIES:
            db_manager.execute_query("""
                MERGE (mov:Movie {id: $id})
                SET mov.title = $title, mov.release_year = $release_year, mov.rating = $rating,
                    mov.duration_mins = $duration_mins, mov.poster_url = $poster_url, mov.plot = $plot
            """, m)

            # Director -> Movie
            if m.get("director_id"):
                db_manager.execute_query("""
                    MATCH (d:Director {id: $dir_id}), (mov:Movie {id: $m_id})
                    MERGE (d)-[:DIRECTED]->(mov)
                """, {"dir_id": m["director_id"], "m_id": m["id"]})

            # Movie -> Genres
            for g_name in m.get("genres", []):
                db_manager.execute_query("""
                    MATCH (g:Genre {name: $g_name}), (mov:Movie {id: $m_id})
                    MERGE (mov)-[:BELONGS_TO]->(g)
                """, {"g_name": g_name, "m_id": m["id"]})

            # Actors -> Movie
            for a_id in m.get("actors", []):
                db_manager.execute_query("""
                    MATCH (a:Actor {id: $a_id}), (mov:Movie {id: $m_id})
                    MERGE (a)-[:ACTED_IN]->(mov)
                """, {"a_id": a_id, "m_id": m["id"]})

        logger.info(f"Seeding {len(USERS)} Users & Interaction Graph...")
        for u in USERS:
            db_manager.execute_query("""
                MERGE (usr:User {id: $id})
                SET usr.name = $name, usr.email = $email, usr.avatar_url = $avatar_url, usr.joined_date = $joined_date
            """, u)

            # User LIKED Movie
            u_likes = USER_LIKES.get(u["id"], [])
            for m_id in u_likes:
                db_manager.execute_query("""
                    MATCH (usr:User {id: $u_id}), (mov:Movie {id: $m_id})
                    MERGE (usr)-[:LIKED]->(mov)
                """, {"u_id": u["id"], "m_id": m_id})

            # User WATCHED Movie
            u_watches = USER_WATCHES.get(u["id"], [])
            for m_id in u_watches:
                db_manager.execute_query("""
                    MATCH (usr:User {id: $u_id}), (mov:Movie {id: $m_id})
                    MERGE (usr)-[:WATCHED {watched_at: '2024-02-01'}]->(mov)
                """, {"u_id": u["id"], "m_id": m_id})

        # User SIMILAR_TO User
        logger.info(f"Seeding {len(USER_SIMILARITIES)} SIMILAR_TO user edges...")
        for s in USER_SIMILARITIES:
            db_manager.execute_query("""
                MATCH (u1:User {id: $u1}), (u2:User {id: $u2})
                MERGE (u1)-[r:SIMILAR_TO]->(u2)
                SET r.score = $score
            """, s)

        logger.info("Successfully seeded CognoDB Graph Database!")
    except Exception as e:
        logger.error(f"Error seeding database: {e}")
    finally:
        db_manager.close()

if __name__ == "__main__":
    seed_database()
