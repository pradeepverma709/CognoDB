from fastapi import APIRouter, Query
from app.models.schemas import SearchResultsSchema
from app.services.mock_data import MOVIES, ACTORS, DIRECTORS, USERS

router = APIRouter(prefix="/api/search", tags=["Search"])

@router.get("", response_model=SearchResultsSchema)
def global_search(q: str = Query(..., min_length=1, description="Search query")):
    q_lower = q.lower()
    
    matching_movies = [m for m in MOVIES if q_lower in m["title"].lower()][:10]
    matching_actors = [a for a in ACTORS if q_lower in a["name"].lower()][:10]
    matching_dirs = [d for d in DIRECTORS if q_lower in d["name"].lower()][:10]
    matching_users = [u for u in USERS if q_lower in u["name"].lower() or q_lower in u["email"].lower()][:10]
    
    return {
        "movies": matching_movies,
        "actors": matching_actors,
        "directors": matching_dirs,
        "users": matching_users
    }
