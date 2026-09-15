from fastapi import FastAPI

from app.config import settings
from app.database import Base, engine
import app.models

from app.routes.health import router as health_router
from app.routes.trip import router as trip_router

# Create database tables
Base.metadata.create_all(bind=engine)

# Create FastAPI app
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="AI-powered Multi-Agent Travel Planner"
)

# Register routes AFTER app is created
app.include_router(health_router)
app.include_router(trip_router)


@app.get("/")
def home():
    return {
        "message": "Welcome to VoyageAI ✈️",
        "status": "running"
    }