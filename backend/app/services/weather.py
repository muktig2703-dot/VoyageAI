import requests
from app.config import settings
import time
WEATHER_CACHE_TTL = 600  # 10 minutes
_weather_cache = {}
BASE_URL = "https://api.openweathermap.org/data/2.5/weather"



def get_weather(city):
    cache_key = city.strip().casefold()
    now = time.monotonic()

    cached = _weather_cache.get(cache_key)
    if cached and now - cached["time"] < WEATHER_CACHE_TTL:
        return cached["data"].copy()

    response = requests.get(
        BASE_URL,
        params={
            "q": city,
            "appid": settings.OPENWEATHER_API_KEY,
            "units": "metric",
        },
        timeout=15,
    )

    if response.status_code == 404:
       return {
        "temperature": None,
        "condition": "Weather unavailable for this destination",
    }

    response.raise_for_status()
    data = response.json()

    result = {
        "temperature": data["main"]["temp"],
        "condition": data["weather"][0]["main"],
    }

    _weather_cache[cache_key] = {
        "time": now,
        "data": result,
    }

    return result.copy()