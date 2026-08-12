from fastapi import APIRouter, HTTPException
from typing import List
from app.services.user_service import UserService
from app.models.schemas import UserBase, MovieBase, SimilarUserSchema

router = APIRouter(prefix="/api/users", tags=["Users"])

@router.get("", response_model=List[UserBase])
def get_users():
    return UserService.get_all_users()

@router.get("/{user_id}", response_model=UserBase)
def get_user(user_id: str):
    user = UserService.get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail=f"User with ID {user_id} not found")
    return user

@router.get("/{user_id}/liked-movies", response_model=List[MovieBase])
def get_user_liked_movies(user_id: str):
    """
    Required Query 1: Get all movies liked by a user.
    """
    user = UserService.get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail=f"User with ID {user_id} not found")
    return UserService.get_liked_movies(user_id)

@router.get("/{user_id}/similar", response_model=List[SimilarUserSchema])
def get_similar_users(user_id: str):
    """
    Required Query 3: Find users with similar interests.
    """
    user = UserService.get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail=f"User with ID {user_id} not found")
    return UserService.get_similar_users(user_id)
