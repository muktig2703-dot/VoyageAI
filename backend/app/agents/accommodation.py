
def accommodation_agent(data):
    budget = data["budget"]

    if budget < 10000:
        stay = "Budget Hostel"
        price = 700
    elif budget < 30000:
        stay = "3-Star Hotel"
        price = 1800
    else:
        stay = "Luxury Resort"
        price = 5000

    return {
        "recommended_stay": stay,
        "estimated_per_night": price
    }