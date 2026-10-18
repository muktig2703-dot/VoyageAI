"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  MapPin,
  Wallet,
  Loader2,
  Sparkles,
  Clock,
} from "lucide-react";
import { useAuth } from "../../../context/AuthContext";


const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:8000";

interface Trip {
  id: string;
  destination: string;
  start_date: string;
  end_date: string;
  budget: number;
  travel_style: string;
  interests: string[];
  status: string;
  itinerary: Record<string, any> | null;
}

export default function TripDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const { user, loading: authLoading } = useAuth();

  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const tripId = params.id as string;

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login");
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (authLoading || !user || !tripId) {
      return;
    }

    const fetchTrip = async () => {
      try {
        const token = localStorage.getItem(
          "voyageai_access_token"
        );

        if (!token) {
          router.replace("/login");
          return;
        }

        const response = await fetch(
          `${API_URL}/trip/${tripId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.detail || "Failed to load trip"
          );
        }

        setTrip(data);
      } catch (err) {
        console.error("Failed to load trip:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load your trip."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTrip();
  }, [authLoading, user, tripId, router]);

  if (
    authLoading ||
    loading
  ) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-500/10">
            <Loader2
              size={28}
              className="animate-spin text-blue-400"
            />
          </div>

          <div>
            <p className="font-semibold text-white">
              Loading your adventure...
            </p>

            <p className="mt-1 text-sm text-slate-500">
              VoyageAI is preparing your itinerary.
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (error || !trip) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
        <div className="max-w-md text-center">
          <div className="mb-5 text-5xl">🗺️</div>

          <h1 className="text-2xl font-bold text-white">
            Trip not found
          </h1>

          <p className="mt-3 text-slate-400">
            {error ||
              "We couldn't find this trip."}
          </p>

          <button
            onClick={() => router.push("/dashboard")}
            className="mt-6 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-5 py-3 font-semibold text-white"
          >
            Back to Dashboard
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">

        {/* Top navigation */}
        <div className="mb-8 flex items-center justify-between">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 text-sm font-semibold text-slate-400 transition hover:text-white"
          >
            <ArrowLeft size={18} />
            Dashboard
          </button>

          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Sparkles
              size={16}
              className="text-blue-400"
            />
            VoyageAI
          </div>
        </div>

        {/* Hero */}
        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-blue-600/20 via-purple-600/10 to-transparent p-7 sm:p-10">

          <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />

          <div className="relative">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-300">
              <Sparkles size={15} />
              Your AI-generated itinerary
            </div>

            <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
              {trip.destination}
            </h1>

            <p className="mt-3 text-slate-400">
              Your personalized adventure is ready,
              {user?.name ? ` ${user.name}` : ""}.
            </p>

            {/* Trip stats */}
            <div className="mt-8 grid gap-3 sm:grid-cols-3">

              <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
                <div className="mb-2 flex items-center gap-2 text-slate-500">
                  <CalendarDays size={17} />
                  <span className="text-xs font-semibold uppercase tracking-wide">
                    Dates
                  </span>
                </div>

                <p className="font-semibold text-white">
                  {trip.start_date} → {trip.end_date}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
                <div className="mb-2 flex items-center gap-2 text-slate-500">
                  <Wallet size={17} />
                  <span className="text-xs font-semibold uppercase tracking-wide">
                    Budget
                  </span>
                </div>

                <p className="font-semibold text-white">
                  ₹{trip.budget.toLocaleString("en-IN")}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
                <div className="mb-2 flex items-center gap-2 text-slate-500">
                  <MapPin size={17} />
                  <span className="text-xs font-semibold uppercase tracking-wide">
                    Style
                  </span>
                </div>

                <p className="font-semibold capitalize text-white">
                  {trip.travel_style}
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* Interests */}
        <section className="mt-8">
          <h2 className="mb-4 text-xl font-bold">
            Your interests
          </h2>

          <div className="flex flex-wrap gap-2">
            {trip.interests.map((interest) => (
              <span
                key={interest}
                className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm text-slate-300"
              >
                {interest}
              </span>
            ))}
          </div>
        </section>

        {/* Itinerary */}
        <section className="mt-10">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">
              <CalendarDays
                size={20}
                className="text-blue-400"
              />
            </div>

            <div>
              <h2 className="text-2xl font-bold">
                Your itinerary
              </h2>

              <p className="text-sm text-slate-500">
                Planned by your VoyageAI agent team
              </p>
            </div>
          </div>

          {trip.itinerary ? (
            <div className="space-y-5">
              {Object.entries(trip.itinerary).map(
                ([key, value]) => (
                  <div
                    key={key}
                    className="rounded-2xl border border-white/10 bg-white/[0.04] p-6"
                  >
                    <div className="mb-4 flex items-center gap-3">
                      <Clock
                        size={18}
                        className="text-purple-400"
                      />

                      <h3 className="font-bold capitalize text-white">
                        {key.replaceAll("_", " ")}
                      </h3>
                    </div>

                    <pre className="overflow-x-auto whitespace-pre-wrap text-sm leading-7 text-slate-400">
                      {typeof value === "string"
                        ? value
                        : JSON.stringify(
                            value,
                            null,
                            2
                          )}
                    </pre>
                  </div>
                )
              )}
            </div>
          ) : (
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-8 text-center">
              <p className="text-slate-400">
                Your itinerary is still being prepared.
              </p>
            </div>
          )}
        </section>

      </div>
    </main>
  );
}