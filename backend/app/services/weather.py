import requests

from app.config import settings

BASE_URL = "https://api.openweathermap.org/data/2.5/weather"


def get_weather(city):
    response = requests.get(
        BASE_URL,
        params={
            "q": city,
            "appid": settings.OPENWEATHER_API_KEY,
            "units": "metric"
        },
        timeout=15
    )

    response.raise_for_status()

    data = response.json()

    return {
        "temperature": data["main"]["temp"],
        "condition": data["weather"][0]["main"]
    }