export interface TripRequest {
  destination: string;
  start_date: string;
  end_date: string;
  budget: number;
  travel_style: string;
  interests: string[];
}

export interface TripResponse {
  id: string;
  status: string;
}