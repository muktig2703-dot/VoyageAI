
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
  Compass,
  Hotel,
  Utensils,
  Car,
  CheckCircle2,
  Plane,
  Mountain,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "../../../context/AuthContext";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

interface Trip {
  id: string;
  destination: string;
  start_date: string;
  end_date: string;
  budget: number;
  travel_style: string;
  interests: string[];
  status: string;
  itinerary: Record<string, unknown> | null;
}

function formatLabel(value: string): string {
  return value
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatDate(date: string): string {
  if (!date) return "Not specified";

  const parsed = new Date(`${date.slice(0, 10)}T12:00:00`);

  if (Number.isNaN(parsed.getTime())) return date;

  return parsed.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getIcon(key: string) {
  const value = key.toLowerCase();

  if (value.includes("accommodation") || value.includes("hotel") || value.includes("stay"))
    return Hotel;

  if (value.includes("transport") || value.includes("arrival") || value.includes("travel"))
    return Plane;

  if (value.includes("food") || value.includes("restaurant") || value.includes("dining"))
    return Utensils;

  if (value.includes("budget") || value.includes("cost") || value.includes("expense"))
    return Wallet;

  if (value.includes("activity") || value.includes("adventure") || value.includes("attraction"))
    return Mountain;

  if (value.includes("day") || value.includes("schedule") || value.includes("itinerary"))
    return CalendarDays;

  if (value.includes("destination") || value.includes("place") || value.includes("area"))
    return MapPin;

  if (value.includes("transport") || value.includes("car"))
    return Car;

  return Compass;
}

function isEmpty(value: unknown): boolean {
  return (
    value === null ||
    value === undefined ||
    value === "" ||
    (Array.isArray(value) && value.length === 0)
  );
}

function isDateKey(key: string): boolean {
  return /date|check.?in|check.?out/i.test(key);
}

function ValueView({
  value,
  depth = 0,
}: {
  value: unknown;
  depth?: number;
}) {
  if (isEmpty(value)) {
    return (
      <p className="text-sm text-stone-400">
        Details coming soon.
      </p>
    );
  }

  if (typeof value === "string" || typeof value === "number") {
    return (
      <p className="whitespace-pre-line text-sm leading-7 text-stone-600">
        {String(value)}
      </p>
    );
  }

  if (typeof value === "boolean") {
    return (
      <span className="text-sm text-stone-600">
        {value ? "Yes" : "No"}
      </span>
    );
  }

  if (Array.isArray(value)) {
    const objectItems = value.some(
      (item) => item !== null && typeof item === "object"
    );

    if (!objectItems) {
      return (
        <ul className="space-y-3">
          {value.map((item, index) => (
            <li key={index} className="flex items-start gap-3 text-sm leading-6 text-stone-600">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-600" />
              <span>{String(item)}</span>
            </li>
          ))}
        </ul>
      );
    }

    return (
      <div className="grid gap-3 sm:grid-cols-2">
        {value.map((item, index) => (
          <div
            key={index}
            className="rounded-2xl border border-stone-200 bg-white p-4"
          >
            <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
              <MapPin size={16} />
            </div>
            <ValueView value={item} depth={depth + 1} />
          </div>
        ))}
      </div>
    );
  }

  if (typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>).filter(
      ([, item]) => !isEmpty(item)
    );

    if (!entries.length) {
      return (
        <p className="text-sm text-stone-400">
          More details will appear here.
        </p>
      );
    }

    return (
      <div className={depth === 0 ? "space-y-5" : "space-y-4"}>
        {entries.map(([key, item]) => {
          const Icon = getIcon(key);
          const nestedObject =
            item !== null && typeof item === "object";

          return (
            <div key={key} className="min-w-0">
              <div className="mb-2 flex items-center gap-2">
                <Icon size={15} className="shrink-0 text-emerald-700" />
                <h4 className="text-sm font-semibold text-stone-800">
                  {formatLabel(key)}
                </h4>
              </div>

              {nestedObject ? (
                <div className="rounded-xl bg-stone-50 p-3 sm:p-4">
                  <ValueView value={item} depth={depth + 1} />
                </div>
              ) : (
                <div className="pl-0 sm:pl-6">
                  {isDateKey(key) && typeof item === "string" ? (
                    <p className="text-sm text-stone-600">
                      {formatDate(item)}
                    </p>
                  ) : (
                    <ValueView value={item} depth={depth + 1} />
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  return null;
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
    if (authLoading || !user || !tripId) return;

    const fetchTrip = async () => {
      try {
        const token = localStorage.getItem("voyageai_access_token");

        if (!token) {
          router.replace("/login");
          return;
        }

        const response = await fetch(`${API_URL}/trip/${tripId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.detail || "Failed to load trip");
        }

        setTrip(data);
      } catch (err) {
        console.error("Failed to load trip:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load your trip."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTrip();
  }, [authLoading, user, tripId, router]);

  if (authLoading || loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f8f7f2]">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100">
            <Loader2 size={28} className="animate-spin text-emerald-700" />
          </div>
          <div>
            <p className="font-semibold text-stone-900">
              Loading your adventure...
            </p>
            <p className="mt-1 text-sm text-stone-500">
              Getting your travel plans ready.
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (error || !trip) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f8f7f2] px-4">
        <div className="max-w-md text-center">
          <div className="mb-5 text-5xl">🗺️</div>
          <h1 className="text-2xl font-bold text-stone-900">
            Trip not found
          </h1>
          <p className="mt-3 text-stone-500">
            {error || "We couldn't find this trip."}
          </p>
          <button
            onClick={() => router.push("/dashboard")}
            className="mt-6 rounded-xl bg-emerald-800 px-5 py-3 font-semibold text-white transition hover:bg-emerald-900"
          >
            Back to Dashboard
          </button>
        </div>
      </main>
    );
  }

  const itinerary = trip.itinerary;
  const itineraryEntries = itinerary
    ? Object.entries(itinerary).filter(
        ([key, value]) =>
          !["destination", "start_date", "end_date"].includes(
            key.toLowerCase()
          ) && !isEmpty(value)
      )
    : [];

  const start = new Date(`${trip.start_date.slice(0, 10)}T12:00:00`);
  const end = new Date(`${trip.end_date.slice(0, 10)}T12:00:00`);

  const tripDays =
    !Number.isNaN(start.getTime()) && !Number.isNaN(end.getTime())
      ? Math.max(
          1,
          Math.round((end.getTime() - start.getTime()) / 86400000) + 1
        )
      : null;

  return (
    <main className="min-h-screen bg-[#f8f7f2] px-4 py-6 text-stone-900 sm:px-6 sm:py-10 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Navigation */}
        <div className="mb-7 flex items-center justify-between">
          <button
            onClick={() => router.push("/dashboard")}
            className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold text-stone-600 transition hover:bg-white hover:text-stone-900"
          >
            <ArrowLeft size={17} />
            Dashboard
          </button>

          <div className="flex items-center gap-2 text-sm font-bold tracking-tight text-emerald-900">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-900 text-white">
              <Compass size={19} />
            </span>
            VoyageAI
          </div>
        </div>

        {/* Hero */}
        <section className="relative overflow-hidden rounded-[2rem] bg-[#173f35] px-6 py-8 text-white sm:px-10 sm:py-12">
          <div className="pointer-events-none absolute -right-16 -top-20 h-72 w-72 rounded-full bg-emerald-300/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-28 left-1/3 h-64 w-64 rounded-full bg-lime-300/10 blur-3xl" />

          <div className="relative">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold tracking-wide text-emerald-50">
              <Sparkles size={14} />
              YOUR NEXT ADVENTURE
            </div>

            <h1 className="max-w-3xl text-4xl font-black tracking-tight sm:text-6xl">
              {trip.destination}
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-7 text-emerald-50/80 sm:text-base">
              A trip shaped around your interests, your pace, and the places
              you want to discover
              {user?.name ? `, ${user.name}` : ""}.
            </p>

            <div className="mt-8 flex flex-wrap gap-2">
              {(trip.interests || []).map((interest) => (
                <span
                  key={interest}
                  className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-white"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Trip overview */}
        <section className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-stone-200/80 bg-white p-5">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-800">
              <CalendarDays size={19} />
            </div>
            <p className="text-xs font-semibold uppercase tracking-wider text-stone-400">
              Travel dates
            </p>
            <p className="mt-2 font-bold text-stone-900">
              {formatDate(trip.start_date)}
            </p>
            <p className="mt-1 text-sm text-stone-500">
              to {formatDate(trip.end_date)}
            </p>
          </div>

          <div className="rounded-2xl border border-stone-200/80 bg-white p-5">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-800">
              <Clock size={19} />
            </div>
            <p className="text-xs font-semibold uppercase tracking-wider text-stone-400">
              Duration
            </p>
            <p className="mt-2 text-2xl font-bold text-stone-900">
              {tripDays ?? "—"}{" "}
              <span className="text-sm font-medium text-stone-500">
                {tripDays === 1 ? "day" : "days"}
              </span>
            </p>
          </div>

          <div className="rounded-2xl border border-stone-200/80 bg-white p-5">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-lime-50 text-lime-800">
              <Wallet size={19} />
            </div>
            <p className="text-xs font-semibold uppercase tracking-wider text-stone-400">
              Your budget
            </p>
            <p className="mt-2 text-2xl font-bold text-stone-900">
              ₹{Number(trip.budget).toLocaleString("en-IN")}
            </p>
          </div>

          <div className="rounded-2xl border border-stone-200/80 bg-white p-5">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-800">
              <MapPin size={19} />
            </div>
            <p className="text-xs font-semibold uppercase tracking-wider text-stone-400">
              Travel style
            </p>
            <p className="mt-2 text-lg font-bold capitalize text-stone-900">
              {trip.travel_style}
            </p>
          </div>
        </section>

        {/* Itinerary heading */}
        <section className="mt-12">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-emerald-800">
                THE JOURNEY
              </p>
              <h2 className="text-3xl font-black tracking-tight text-stone-900 sm:text-4xl">
                Your itinerary
              </h2>
              <p className="mt-2 text-sm text-stone-500">
                Your trip, thoughtfully put together.
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-2 text-xs font-semibold text-emerald-900">
              <CheckCircle2 size={15} />
              Personalised plan
            </div>
          </div>

          {itineraryEntries.length > 0 ? (
            <div className="space-y-5">
              {itineraryEntries.map(([key, value], index) => {
                const Icon = getIcon(key);
                const title = formatLabel(key);
                const isSummary = /summary|overview|introduction/i.test(key);

                return (
                  <article
                    key={key}
                    className="overflow-hidden rounded-3xl border border-stone-200/80 bg-white shadow-sm"
                  >
                    <div className="flex items-center gap-4 border-b border-stone-100 px-5 py-5 sm:px-7">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-800">
                        <Icon size={22} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-stone-400">
                          {isSummary ? "THE BIG PICTURE" : `TRIP DETAILS · ${String(index + 1).padStart(2, "0")}`}
                        </p>
                        <h3 className="text-lg font-bold text-stone-900 sm:text-xl">
                          {title}
                        </h3>
                      </div>

                      <ChevronRight
                        size={19}
                        className="shrink-0 text-stone-300"
                      />
                    </div>

                    <div className="px-5 py-6 sm:px-7 sm:py-7">
                      <ValueView value={value} />
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="rounded-3xl border border-stone-200 bg-white px-6 py-12 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-800">
                <Compass size={26} />
              </div>
              <h3 className="text-lg font-bold text-stone-900">
                Your itinerary is not available yet
              </h3>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-stone-500">
                We couldn't find itinerary details for this trip. Your trip
                information is still available above.
              </p>
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="mt-12 border-t border-stone-200 py-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-bold text-emerald-950">
                Made for the way you travel.
              </p>
              <p className="mt-1 text-xs text-stone-500">
                Your next chapter starts somewhere new.
              </p>
            </div>

            <button
              onClick={() => router.push("/dashboard")}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
            >
              <ArrowLeft size={16} />
              Back to dashboard
            </button>
          </div>
        </footer>
      </div>
    </main>
  );
}
