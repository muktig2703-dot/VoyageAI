
from uuid import UUID

valid_id = "550e8400-e29b-41d4-a716-446655440000"
invalid_ids = [
    "not-a-uuid",
    "12345",
    "",
]

# A valid UUID should parse successfully.
parsed_id = UUID(valid_id)
assert str(parsed_id) == valid_id
print("Valid UUID: PASSED")

# Malformed IDs should raise ValueError.
for trip_id in invalid_ids:
    try:
        UUID(trip_id)
        print(f"Invalid UUID {trip_id!r}: FAILED")
    except ValueError:
        print(f"Invalid UUID {trip_id!r}: PASSED")
