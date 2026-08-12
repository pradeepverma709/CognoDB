from fastapi import APIRouter, Query, HTTPException
from typing import List
from app.services.recommend_service import RecommendationService
from app.models.schemas import GenreRecommendationSchema, UserRecommendationSchema
from app.services.user_service import UserService

router = APIRouter(prefix="/api/recommendations", tags=["Recommendations"])

@router.get("/genre-based", response_model=List[GenreRecommendationSchema])
def get_genre_recommendations(
    user_id: str = Query(..., description="User ID for multi-hop recommendations"),
    limit: int = Query(10, ge=1, le=50)
):
    """
    Required Query 4 (Multi-hop Traversal: 2+ Hops):
    User -> Movie -> Genre -> Movie
    Recommends movies based on genres liked by the user.
    """
    user = UserService.get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail=f"User with ID {user_id} not found")
    return RecommendationService.get_genre_based_recommendations(user_id=user_id, limit=limit)

@router.get("/similar-users", response_model=List[UserRecommendationSchema])
def get_similar_user_recommendations(
    user_id: str = Query(..., description="User ID for collaborative filtering recommendations"),
    limit: int = Query(10, ge=1, le=50)
):
    """
    Required Query 6 (Multi-hop Collaborative Traversal: 2+ Hops):
    User -> Similar User -> Liked Movie
    Recommends movies liked by users with similar taste.
    """
    user = UserService.get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail=f"User with ID {user_id} not found")
    return RecommendationService.get_similar_user_recommendations(user_id=user_id, limit=limit)

@router.get("/actor-costars/{actor_id}")
def get_actor_costars(actor_id: str):
    """
    Required Query 5: Find connections between actors through movies.
    """
    return RecommendationService.get_actor_costars(actor_id)
