
def destination_agent(data):
    destination = data["destination"]

    recommendations = {
        "Goa": [
            "Baga Beach",
            "Chapora Fort",
            "Anjuna Market"
        ],
        "Manali": [
            "Solang Valley",
            "Old Manali",
            "Hidimba Temple"
        ]
    }

    return {
        "must_visit": recommendations.get(destination, [])
    }