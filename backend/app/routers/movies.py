from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from app.services.movie_service import MovieService
from app.models.schemas import MovieBase, MovieDetailSchema

router = APIRouter(prefix="/api/movies", tags=["Movies"])

@router.get("", response_model=List[MovieBase])
def get_movies(
    genre: Optional[str] = Query(None, description="Filter movies by genre name"),
    search: Optional[str] = Query(None, description="Search movie title"),
    limit: int = Query(100, ge=1, le=200)
):
    return MovieService.get_all_movies(genre=genre, search=search, limit=limit)

@router.get("/top-rated", response_model=List[MovieBase])
def get_top_rated_movies(limit: int = Query(10, ge=1, le=50)):
    """
    Required Query 2: Get top-rated movies.
    """
    return MovieService.get_top_rated_movies(limit=limit)

@router.get("/{movie_id}", response_model=MovieDetailSchema)
def get_movie(movie_id: str):
    movie = MovieService.get_movie_by_id(movie_id)
    if not movie:
        raise HTTPException(status_code=404, detail=f"Movie with ID {movie_id} not found")
    return movie
