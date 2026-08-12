from fastapi import APIRouter
from typing import List, Dict, Any
from app.services.movie_service import MovieService

router = APIRouter(prefix="/api/genres", tags=["Genres"])

@router.get("", response_model=List[Dict[str, Any]])
def get_genres():
    return MovieService.get_all_genres()
