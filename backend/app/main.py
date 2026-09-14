from fastapi import FastAPI
from app.config import settings
from app.routes.health import router as health_router

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="AI-powered Multi-Agent Travel Planner"
)

app.include_router(health_router)

@app.get("/")
def home():
    return {
        "message": "Welcome to VoyageAI ✈️",
        "status": "running"
    }