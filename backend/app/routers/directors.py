from fastapi import APIRouter, HTTPException
from typing import List
from app.services.movie_service import MovieService
from app.models.schemas import DirectorDetailSchema
from app.services.mock_data import DIRECTORS

router = APIRouter(prefix="/api/directors", tags=["Directors"])

@router.get("", response_model=List[dict])
def get_directors():
    return DIRECTORS

@router.get("/{director_id}", response_model=DirectorDetailSchema)
def get_director(director_id: str):
    director = MovieService.get_director_by_id(director_id)
    if not director:
        raise HTTPException(status_code=404, detail=f"Director with ID {director_id} not found")
    return director
