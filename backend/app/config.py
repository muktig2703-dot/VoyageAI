from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    APP_NAME: str = "VoyageAI"
    APP_VERSION: str = "1.0.0"

    DATABASE_URL: str
    GEMINI_API_KEY: str = ""
    GOOGLE_MAPS_API_KEY: str = ""
    OPENWEATHER_API_KEY: str = ""
    TAVILY_API_KEY: str = ""   # ← Add this line

    model_config = SettingsConfigDict(env_file=".env")

settings = Settings()