from tavily import TavilyClient

from app.config import settings

client = TavilyClient(api_key=settings.TAVILY_API_KEY)


def web_search(query):
    results = client.search(
        query=query,
        max_results=5
    )

    return results["results"]