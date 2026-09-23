import requests

from app.config import settings

BASE_URL = "https://places.googleapis.com/v1/places:searchText"


def search_places(query):
    headers = {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": settings.GOOGLE_MAPS_API_KEY,
        "X-Goog-FieldMask": "places.displayName,places.formattedAddress,places.rating"
    }

    body = {
        "textQuery": query
    }

    response = requests.post(
        BASE_URL,
        headers=headers,
        json=body,
        timeout=15
    )

    response.raise_for_status()

    data = response.json()

    places = []

    for place in data.get("places", [])[:5]:
        places.append({
            "name": place.get("displayName", {}).get("text"),
            "rating": place.get("rating"),
            "address": place.get("formattedAddress")
        })

    return places