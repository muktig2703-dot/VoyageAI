from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_NAME: str = "VoyageAI"
    APP_VERSION: str = "1.0.0"

    DATABASE_URL: str
    OPENAI_API_KEY: str = ""
    GOOGLE_MAPS_API_KEY: str = ""
    OPENWEATHER_API_KEY: str = ""

    class Config:
        env_file = ".env"

settings = Settings()