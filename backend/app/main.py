from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import time

from app.config import settings
from app.database import db_manager
from app.routers import movies, actors, directors, genres, users, recommendations, analytics, search

app = FastAPI(
    title="CognoDB Movie Recommendation Platform API",
    description="Full-stack Graph Database Application for WEXA AI CognoDB Assignment built with Neo4j driver & Cypher queries.",
    version="1.0.0"
)

# CORS Middleware setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_db_client():
    db_manager.connect()

@app.on_event("shutdown")
def shutdown_db_client():
    db_manager.close()

# Request timing logging middleware
@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    return response

# Include Routers
app.include_router(movies.router)
app.include_router(actors.router)
app.include_router(directors.router)
app.include_router(genres.router)
app.include_router(users.router)
app.include_router(recommendations.router)
app.include_router(analytics.router)
app.include_router(search.router)

@app.get("/")
def root():
    return {
        "message": "Welcome to WEXA AI CognoDB Movie Recommendation Graph Platform API!",
        "status": "online",
        "database_connected": db_manager.is_connected,
        "docs": "/docs"
    }

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "database_connected": db_manager.is_connected,
        "environment": settings.ENV
    }

@app.exception_handler(Exception)
def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"detail": "An internal server error occurred.", "error": str(exc)}
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=settings.PORT, reload=True)
