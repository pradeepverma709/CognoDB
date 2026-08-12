from fastapi import APIRouter
from app.services.analytics_service import AnalyticsService
from app.models.schemas import GraphStatsSchema, GraphDataSchema

router = APIRouter(prefix="/api/analytics", tags=["Analytics & Graph"])

@router.get("/stats", response_model=GraphStatsSchema)
def get_graph_stats():
    """
    Returns graph statistics including node counts, relationship counts, and network density.
    """
    return AnalyticsService.get_graph_stats()

@router.get("/graph-data", response_model=GraphDataSchema)
def get_graph_data(limit: int = 60):
    """
    Returns nodes and edges payload for canvas interactive graph visualizer.
    """
    return AnalyticsService.get_graph_data(limit_nodes=limit)
