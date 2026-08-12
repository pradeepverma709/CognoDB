from fastapi import APIRouter, HTTPException
from typing import List
from app.services.movie_service import MovieService
from app.services.recommend_service import RecommendationService
from app.models.schemas import ActorDetailSchema
from app.services.mock_data import ACTORS

router = APIRouter(prefix="/api/actors", tags=["Actors"])

@router.get("", response_model=List[dict])
def get_actors():
    return ACTORS

@router.get("/{actor_id}", response_model=ActorDetailSchema)
def get_actor(actor_id: str):
    actor = MovieService.get_actor_by_id(actor_id)
    if not actor:
        raise HTTPException(status_code=404, detail=f"Actor with ID {actor_id} not found")
    
    # Required Query 5: Actor co-stars
    co_actors = RecommendationService.get_actor_costars(actor_id)
    actor["co_actors"] = co_actors
    return actor
