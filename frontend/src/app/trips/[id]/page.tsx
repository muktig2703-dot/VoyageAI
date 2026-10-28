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
  Compass,
  Hotel,
  Utensils,
  Car,
  Mountain,
  ChevronDown,
  Camera,
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

const photos = [
  {
    title: "Explore",
    subtitle: "Places worth discovering",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=85",
    icon: Camera,
    terms: /activity|attraction|sightseeing|place|explor|destination/i,
  },
  {
    title: "Local flavours",
    subtitle: "Taste something memorable",
    image:
      "https://images.unsplash.com/photo-1547595628-c61a29f496f0?auto=format&fit=crop&w=900&q=85",
    icon: Utensils,
    terms: /food|restaurant|dining|culinary|cuisine/i,
  },
  {
    title: "Nature & adventure",
    subtitle: "Get out and experience it",
    image:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=85",
    icon: Mountain,
    terms: /adventure|nature|hiking|mountain|outdoor|desert/i,
  },
  {
    title: "Culture & heritage",
    subtitle: "Discover the local story",
    image:
      "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=900&q=85",
    icon: Compass,
    terms: /culture|heritage|history|temple|museum|architecture/i,
  },
];

function labelOf(key: string) {
  const cleaned = key
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

const friendlyLabels: Record<string, string> = {
  accommodation: "Where to Stay",
  "accommodation details": "Where to Stay",
  transport: "Getting Around",
  transportation: "Getting Around",
  food: "Food & Local Flavours",
  restaurants: "Food & Local Flavours",
  activities: "Things to Do",
  attractions: "Places to Explore",
  budget: "Budget & Expenses",
  "cost summary": "Budget Breakdown",
  "travel tips": "Tips for Your Journey",
  "packing list": "Packing Essentials",
  "weather alternatives": "Weather Backup Plans",
};

  return (
    friendlyLabels[cleaned] ??
    cleaned.replace(/\b\w/g, (letter) => letter.toUpperCase())
  );
}

function formatDate(value: string) {
  if (!value) return "Not set";
  const date = new Date(`${value.slice(0, 10)}T12:00:00`);

  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
}

function textOf(value: unknown): string {
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);

  if (Array.isArray(value)) {
    return value.map(textOf).filter(Boolean).join(" · ");
  }

  if (value && typeof value === "object") {
    return Object.entries(value as Record<string, unknown>)
      .map(([key, item]) => `${labelOf(key)}: ${textOf(item)}`)
      .filter((item) => !item.endsWith(": "))
      .join("\n");
  }

  return "";
}

function getSummary(itinerary: Record<string, unknown> | null) {
  if (!itinerary) return "";

  const entry = Object.entries(itinerary).find(([key]) =>
    /trip_summary|summary|overview|introduction/i.test(key)
  );

  return entry ? textOf(entry[1]) : "";
}

function cleanSummary(value: string) {
  return value
    .replace(/https?:\/\/\S+/gi, "")
    .replace(/\b(search_score|source_url|raw_content|metadata)\s*[:=][^\n,]*/gi, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function getSectionIcon(key: string) {
  const value = key.toLowerCase();

  if (/accommodation|hotel|stay|lodging/.test(value)) return Hotel;
  if (/transport|arrival|departure|transfer/.test(value)) return Car;
  if (/food|restaurant|dining/.test(value)) return Utensils;
  if (/budget|cost|expense/.test(value)) return Wallet;
  if (/day|schedule|itinerary|activity/.test(value)) return CalendarDays;
  if (/destination|place|area/.test(value)) return MapPin;

  return Compass;
}

function getHighlights(interests: string[]) {
  const chosen = photos.filter((photo) =>
    interests.some((interest) => photo.terms.test(interest))
  );

  const results = [...chosen];

  for (const photo of photos) {
    if (results.length >= 3) break;
    if (!results.some((item) => item.title === photo.title)) {
      results.push(photo);
    }
  }

  return results.slice(0, 3);
}

function isBlank(value: unknown): boolean {
  return (
    value === null ||
    value === undefined ||
    value === "" ||
    (Array.isArray(value) && value.length === 0)
  );
}

function normalizeKey(key: string) {
  return key
    .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
    .replace(/[\s-]+/g, "_")
    .toLowerCase();
}



function getTimeSlot(
  item: Record<string, unknown>,
  sourceKey = ""
): "Morning" | "Afternoon" | "Evening" | null {
  const text = [
    sourceKey,
    ...Object.entries(item)
      .filter(([key]) =>
  /time|period|slot|session|schedule|part_of_day/i.test(
    normalizeKey(key)
  )
)
      .map(([, value]) =>
        typeof value === "string" ? value : ""
      ),
  ]
    .join(" ")
    .toLowerCase();

  // Prefer explicit time-of-day labels.
  if (/\b(early morning|morning|breakfast|sunrise)\b/.test(text)) {
    return "Morning";
  }

  if (/\b(afternoon|lunch|midday|noon)\b/.test(text)) {
    return "Afternoon";
  }

  if (/\b(evening|sunset|dinner|night|nightlife)\b/.test(text)) {
    return "Evening";
  }

  // Recognize 12-hour and 24-hour times.
  const timeMatch = text.match(
  /\b(\d{1,2})(?::(\d{2}))?\s*(am|pm)\b|\b([01]?\d|2[0-3]):([0-5]\d)\b/
);

if (!timeMatch) return null;

let hour: number;
const minute = Number(timeMatch[2] ?? timeMatch[5] ?? 0);
if (minute >= 60) return null;

if (timeMatch[3]) {
  hour = Number(timeMatch[1]);

  if (hour < 1 || hour > 12) return null;

  if (timeMatch[3] === "am") {
    hour = hour === 12 ? 0 : hour;
  } else {
    hour = hour === 12 ? 12 : hour + 12;
  }
} else {
  hour = Number(timeMatch[4]);
}

if (hour < 12) return "Morning";
if (hour < 17) return "Afternoon";
return "Evening";
}

function VisualValue({ value }: { value: unknown }) {
  if (isBlank(value)) return null;

  if (typeof value === "string" || typeof value === "number") {
    return (
      <p className="whitespace-pre-line text-sm leading-6 text-slate-600">
        {String(value)}
      </p>
    );
  }

  if (typeof value === "boolean") {
    return (
      <p className="text-sm text-slate-600">
        {value ? "Yes" : "No"}
      </p>
    );
  }

  if (Array.isArray(value)) {
    return (
      <div className="space-y-2">
        {value.map((item, index) => (
          <div
            key={index}
            className="flex items-start gap-2 text-sm text-slate-600"
          >
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-600" />
            <div className="min-w-0 flex-1">
              <VisualValue value={item} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>).filter(
      ([, item]) => !isBlank(item)
    );

    return (
      <div className="grid gap-3 sm:grid-cols-2">
        {entries.map(([key, item]) => (
          <div key={key} className="rounded-xl bg-[#f7f8ff] p-3">
            <p className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-400">
              {labelOf(key)}
            </p>
            <VisualValue value={item} />
          </div>
        ))}
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
  const [expanded, setExpanded] = useState<string[]>([]);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const tripId = params.id as string;

  useEffect(() => {
    if (!authLoading && !user) router.replace("/login");
  }, [authLoading, user, router]);

  useEffect(() => {
  if (authLoading || !user || !tripId) return;

    let cancelled = false;

    async function fetchTrip() {
      try {
        const token = localStorage.getItem("voyageai_access_token");

        if (!token) {
          router.replace("/login");
          return;
        }

        const response = await fetch(`${API_URL}/trip/${tripId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.detail || "Failed to load trip");
        }

        if (!cancelled) setTrip(data);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to load your trip."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchTrip();

    return () => {
      cancelled = true;
    };
  }, [authLoading, user, tripId, router]);

  if (authLoading || loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f9ff]">
        <div className="text-center">
          <Loader2 size={32} className="mx-auto animate-spin text-indigo-700" />
          <p className="mt-4 font-semibold text-slate-800">
            Preparing your adventure...
          </p>
        </div>
      </main>
    );
  }

  if (error || !trip) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f9ff] px-4">
        <div className="text-center">
          <p className="text-5xl">🗺️</p>
          <h1 className="mt-4 text-2xl font-bold text-slate-900">
            Trip not found
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            {error || "We couldn't find this trip."}
          </p>
          <button
            onClick={() => router.push("/dashboard")}
            className="mt-5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-3 font-semibold text-white shadow-lg shadow-indigo-900/10 transition hover:-translate-y-0.5 hover:from-indigo-700 hover:to-purple-700"
          >
            Back to dashboard
          </button>
        </div>
      </main>
    );
  }

  const itinerary =
  trip.itinerary &&
  typeof trip.itinerary === "object" &&
  "itinerary" in trip.itinerary &&
  trip.itinerary.itinerary &&
  typeof trip.itinerary.itinerary === "object"
    ? trip.itinerary.itinerary as Record<string, unknown>
    : trip.itinerary as Record<string, unknown> | null;
  const summary = cleanSummary(getSummary(itinerary));
  const highlights = getHighlights(trip.interests || []);

  const sections = itinerary
    ? Object.entries(itinerary).filter(
        ([key, value]) =>
          !/^(destination|start_date|end_date|trip_summary|summary)$/i.test(key) &&
          !isBlank(value)
      )
    : [];

  
const dayKeyPattern =
  /^(days|daily_itinerary|day_by_day|itinerary_days|daily_plan|travel_schedule|day_plans|itinerary_by_day)$/;

const daysEntry = itinerary
  ? Object.entries(itinerary).find(([key, value]) => {
      const normalizedKey = normalizeKey(key);

      return (
        dayKeyPattern.test(normalizedKey) &&
        value !== null &&
        typeof value === "object" &&
        Object.keys(value).length > 0
      );
    })
  : undefined;
  const rawDays = daysEntry?.[1];
  
const dayItems: Record<string, unknown>[] = Array.isArray(rawDays)
  ? rawDays.map((item, index) =>
      item && typeof item === "object" && !Array.isArray(item)
        ? (item as Record<string, unknown>)
        : { day_label: `Day ${index + 1}`, activities: item }
    )
  : rawDays && typeof rawDays === "object"
    ? Object.entries(rawDays as Record<string, unknown>).map(
        ([key, value]) =>
          value && typeof value === "object" && !Array.isArray(value)
            ? { day_label: key, ...(value as Record<string, unknown>) }
            : { day_label: key, activities: value }
      )
    : [];
    console.log("Itinerary data:", JSON.stringify(itinerary, null, 2));
console.log("Matched days entry:", daysEntry);
console.log("Raw days:", rawDays);
console.log("Parsed day count:", dayItems.length);

  const costEntry = itinerary
    ? Object.entries(itinerary).find(([key]) => /cost_summary|budget_breakdown|budget_summary|expenses/i.test(key))
    : undefined;
  const costData = costEntry?.[1] && typeof costEntry[1] === "object"
    ? costEntry[1] as Record<string, unknown>
    : {};
  const moneyValue = (value: unknown) => {
    const raw = typeof value === "number" ? value : Number(String(value ?? "").replace(/[^0-9.]/g, ""));
    return Number.isFinite(raw) ? raw : null;
  };
  const estimatedTotal = moneyValue(
    Object.entries(costData).find(([key]) => /estimated_total|total_cost|total_estimated_cost/i.test(key))?.[1]
  );
  const budgetAmount = Number(trip.budget) || 0;
  const displayTotal = estimatedTotal ?? moneyValue(
    Object.entries(costData).find(([key]) => /total/i.test(key) && !/shortfall/i.test(key))?.[1]
  );
   const remainingBudget =
  displayTotal !== null && displayTotal !== undefined
    ? budgetAmount - displayTotal
    : null;
  const budgetPercent = displayTotal && budgetAmount > 0
    ? Math.min(100, Math.round((budgetAmount / displayTotal) * 100))
    : 100;

  const compact = (value: unknown, max = 135): string => {
    const result = textOf(value).replace(/\s+/g, " ").trim();
    return result.length > max ? `${result.slice(0, max - 1).trimEnd()}…` : result;
  };
  const field = (item: Record<string, unknown>, pattern: RegExp) =>
  Object.entries(item).find(
    ([key, value]) =>
      pattern.test(normalizeKey(key)) && !isBlank(value)
  )?.[1];

  const start = new Date(`${trip.start_date.slice(0, 10)}T12:00:00`);
  const end = new Date(`${trip.end_date.slice(0, 10)}T12:00:00`);
  const days =
    !Number.isNaN(start.getTime()) && !Number.isNaN(end.getTime())
      ? Math.max(1, Math.round((end.getTime() - start.getTime()) / 86400000) + 1)
      : null;

  return (
    <main className="min-h-screen bg-[#f7f9ff] px-4 py-5 text-slate-900 sm:px-7 sm:py-8">
      <div className="mx-auto max-w-6xl">
        <nav className="mb-5 flex items-center justify-between">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-indigo-50"
          >
            <ArrowLeft size={17} />
            Dashboard
          </button>

          <div className="flex items-center gap-2 font-bold text-indigo-950">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white">
              <Compass size={19} />
            </span>
            VoyageAI
          </div>
        </nav>

        {/* Destination hero */}
        <section className="relative min-h-[300px] overflow-hidden rounded-[2rem] bg-[#312e81] sm:min-h-[360px]">
          <img
            src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=2000&q=90"
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-45"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1e1b4b]/95 via-[#312e81]/70 to-transparent" />

          <div className="relative flex min-h-[300px] flex-col justify-end p-6 sm:min-h-[360px] sm:p-10">
            <div className="mb-4 flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-2 text-xs font-semibold text-white backdrop-blur-sm">
              <Sparkles size={14} />
              YOUR NEXT ADVENTURE
            </div>

            <h1 className="max-w-3xl text-4xl font-black tracking-tight text-white sm:text-6xl">
              {trip.destination}
            </h1>

            <p className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-white/85 sm:text-base">
              <CalendarDays size={17} />
              {formatDate(trip.start_date)} – {formatDate(trip.end_date)}
              {days && <span>· {days} days</span>}
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {(trip.interests || []).map((interest) => (
                <span
                  key={interest}
                  className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* AI-generated travel overview */}
{summary && (
  <section className="mt-6 rounded-3xl border border-indigo-100 bg-white p-6 shadow-sm sm:p-8">
    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-indigo-700">
      <Sparkles size={15} />
      Your AI travel overview
    </div>

    <h2 className="mt-3 text-2xl font-black tracking-tight text-indigo-950">
      Your {trip.destination} travel overview
    </h2>

    <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-600">
      {summary}
    </p>

    <p className="mt-5 text-xs leading-5 text-slate-400">
      Travel details, prices, and opening times are estimates. Verify them before booking.
    </p>
  </section>
)}

        {/* Compact overview */}
        <section className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-3">
          <div className="flex items-center gap-3 rounded-2xl border border-indigo-100 bg-white p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700">
              <Wallet size={19} />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-slate-400">Total budget</p>
              <p className="truncate font-bold text-slate-900">
                ₹{Number(trip.budget).toLocaleString("en-IN")}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-indigo-100 bg-white p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
              <Compass size={19} />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-slate-400">Travel style</p>
              <p className="truncate font-bold capitalize text-slate-900">
                {trip.travel_style}
              </p>
            </div>
          </div>

          <div className="col-span-2 flex items-center gap-3 rounded-2xl border border-indigo-100 bg-white p-4 lg:col-span-1">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700">
              <MapPin size={19} />
            </div>
            <div>
              <p className="text-xs text-slate-400">Your destination</p>
              <p className="font-bold text-slate-900">{trip.destination}</p>
            </div>
          </div>
        </section>

        {/* Picture-first highlights */}
        <section className="mt-8">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-700">MADE FOR YOU</p>
              <h2 className="mt-1 text-2xl font-black tracking-tight">Your trip highlights</h2>
            </div>
            <Camera size={21} className="text-slate-400" />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {highlights.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.title} className="group relative h-48 overflow-hidden rounded-3xl bg-indigo-100 sm:h-56">
                  <img src={item.image} alt={item.title} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-5 text-white">
                    <Icon size={21} className="mb-2" />
                    <h3 className="text-xl font-bold">{item.title}</h3>
                    <p className="mt-1 text-sm text-white/80">{item.subtitle}</p>
                  </div>
                </article>
              );
            })}
          </div>
          <p className="mt-2 text-xs text-slate-400">Inspiration imagery. Confirm specific venues and opening details before visiting.</p>
        </section>

        {/* Budget at a glance */}
        <section className="mt-9 rounded-3xl border border-indigo-100 bg-white p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-700">BUDGET SNAPSHOT</p>
              <h2 className="mt-1 text-xl font-black">Keep your trip on track</h2>
            </div>
            {displayTotal !== null && displayTotal !== undefined && displayTotal > budgetAmount && (
              <span className="rounded-full bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-700">Over budget</span>
            )}
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-[#f7f8ff] p-4">
              <p className="text-sm text-slate-500">Your budget</p>
              <p className="mt-1 text-2xl font-black text-slate-900">₹{budgetAmount.toLocaleString("en-IN")}</p>
            </div>
            <div className="rounded-2xl bg-[#f7f8ff] p-4">
              <p className="text-sm text-slate-500">Estimated trip cost</p>
              <p className="mt-1 text-2xl font-black text-slate-900">
                {displayTotal !== null && displayTotal !== undefined ? `₹${displayTotal.toLocaleString("en-IN")}` : "Not provided"}
              </p>
            </div>
          </div>
          {displayTotal !== null && displayTotal > 0 && (
  <div className="mt-4">
    <div className="mb-2 flex justify-between text-xs text-slate-500">
      <span>Budget usage</span>
      <span>
        {Math.round((displayTotal / Math.max(budgetAmount, 1)) * 100)}%
      </span>
    </div>

    <div className="h-2.5 overflow-hidden rounded-full bg-indigo-100">
      <div
        className={`h-full rounded-full transition-all ${
          displayTotal > budgetAmount ? "bg-amber-500" : "bg-indigo-600"
        }`}
        style={{
          width: `${Math.min(
            100,
            Math.round((displayTotal / Math.max(budgetAmount, 1)) * 100)
          )}%`,
        }}
      />
    </div>

    <div
      className={`mt-3 rounded-xl p-3 text-sm font-semibold ${
        displayTotal > budgetAmount
          ? "bg-amber-50 text-amber-800"
          : "bg-indigo-50 text-indigo-800"
      }`}
    >
      {displayTotal > budgetAmount
        ? `₹${(displayTotal - budgetAmount).toLocaleString("en-IN")} over budget — consider adjusting your plan.`
        : `₹${(budgetAmount - displayTotal).toLocaleString("en-IN")} remaining in your budget.`}
    </div>
  </div>
)}
          
          {Object.keys(costData).length > 0 && (
            <details className="mt-4 rounded-xl border border-indigo-100 p-3">
              <summary className="cursor-pointer text-sm font-semibold text-indigo-800">See cost breakdown</summary>
              <div className="mt-3"><VisualValue value={costData} /></div>
            </details>
          )}
        </section>

        {/* Day-by-day visual itinerary */}
        <section className="mt-10">
          <div className="mb-5">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-700">YOUR TRAVEL PLAN</p>
            <h2 className="mt-1 text-2xl font-black tracking-tight">The adventure, day by day</h2>
            <p className="mt-1 text-sm text-slate-500">Photos first, only the details you need.</p>
            {dayItems.length > 1 && (
  <div className="mt-5 flex gap-2 overflow-x-auto pb-2">
    <button
      onClick={() => setSelectedDay(null)}
      className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
        selectedDay === null
          ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
          : "border border-indigo-100 bg-white text-slate-600 hover:bg-indigo-50"
      }`}
    >
      All days
    </button>

    {dayItems.map((day, index) => {
      const date = field(day, /date/i);

      return (
        <button
          key={index}
          onClick={() => setSelectedDay(index)}
          className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
            selectedDay === index
              ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
              : "border border-indigo-100 bg-white text-slate-600 hover:bg-indigo-50"
          }`}
        >
          Day {index + 1}
          {date ? ` · ${formatDate(String(date)).split(" ").slice(0, 2).join(" ")}` : ""}
        </button>
      );
    })}
  </div>
)}
          </div>

          {dayItems.length > 0 ? (
            <div className="space-y-5">
              {dayItems
  .map((day, index) => ({ day, index }))
  .filter(({ index }) => selectedDay === null || selectedDay === index)
  .map(({ day, index }) => {
                const date = field(day, /date/i);
                const title = field(day, /title|theme|name|day_label/i) ?? `Day ${index + 1}`;
                const dayActivities = Object.entries(day).filter(([key, value]) =>
                  /morning|afternoon|evening|activity|activities|schedule|events/i.test(key) && !isBlank(value)
                );
                const fallbackActivities = dayActivities.length ? dayActivities : Object.entries(day).filter(([key, value]) =>
                  !/date|title|theme|name|day_label|meal|weather|daily_cost|notes/i.test(key) && !isBlank(value)
                );
                const groupedActivities = [
  { title: "Morning", icon: "🌅", items: [] as [string, unknown][] },
  { title: "Afternoon", icon: "☀️", items: [] as [string, unknown][] },
  { title: "Evening", icon: "🌆", items: [] as [string, unknown][] },
  { title: "Unscheduled", icon: "📍", items: [] as [string, unknown][] },
];



fallbackActivities.forEach(([slot, activity]) => {
  const activityObject =
    activity && typeof activity === "object" && !Array.isArray(activity)
      ? (activity as Record<string, unknown>)
      : { activity };

  const normalizedSlot = normalizeKey(slot);

  let timeSlot: "Morning" | "Afternoon" | "Evening" | null = null;

  if (normalizedSlot.includes("morning")) {
    timeSlot = "Morning";
  } else if (normalizedSlot.includes("afternoon")) {
    timeSlot = "Afternoon";
  } else if (normalizedSlot.includes("evening")) {
    timeSlot = "Evening";
  } else {
    timeSlot = getTimeSlot(activityObject, slot);
  }

  const group = groupedActivities.find(
    (item) => item.title === timeSlot
  );

  (group ?? groupedActivities[3]).items.push([slot, activity]);
});

const visibleGroups = groupedActivities.filter(
  (group) => group.items.length > 0
);
                return (
                  <article key={`${String(title)}-${index}`} className="overflow-hidden rounded-3xl border border-indigo-100 bg-white shadow-sm shadow-indigo-950/[0.03]">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-indigo-50 px-5 py-4 sm:px-6">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-indigo-700">DAY {index + 1}{date ? ` · ${formatDate(String(date))}` : ""}</p>
                        <h3 className="mt-1 text-lg font-bold text-slate-900">{textOf(title)}</h3>
                      </div>
                      <span className="rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700">{fallbackActivities.length || 0} planned stops</span>
                    </div>
                    
<div className="space-y-5 p-4 sm:p-5">
  {visibleGroups.map((group) => (
    <section key={group.title}>
      <div className="mb-3 flex items-center gap-2">
        <span className="text-lg">{group.icon}</span>
        <h4 className="text-sm font-bold text-indigo-950">
          {group.title}
        </h4>
        <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-700">
          {group.items.length}
        </span>
      </div>

      <div className="grid gap-0 md:grid-cols-2">
        {group.items.map(([slot, activity], activityIndex) => {
          const activityObject =
            activity && typeof activity === "object" && !Array.isArray(activity)
              ? activity as Record<string, unknown>
              : { activity };

          const activityName =
  field(activityObject, /activity|title|name|description|event/i) ??
  (typeof activity === "string" || typeof activity === "number"
    ? activity
    : null) ??
  "Activity details unavailable";
          const location = field(
  activityObject,
  /^(location|place|venue|address|area)$/i
);

const duration = field(
  activityObject,
  /^(duration|estimated_duration|time_required|hours)$/i
);

const cost = field(
  activityObject,
  /^(estimated_cost|activity_cost|cost|price|budget)$/i
);

const description = field(
  activityObject,
  /^(notes|description|details|why|summary)$/i
);
          const image = /food|meal|lunch|dinner|breakfast/i.test(slot)
            ? photos[1].image
            : /nature|adventure|park|desert|garden/i.test(
                `${slot} ${textOf(activityName)}`
              )
              ? photos[2].image
              : /culture|heritage|fort|palace|museum|temple|market/i.test(
                  `${slot} ${textOf(activityName)}`
                )
                ? photos[3].image
                : photos[0].image;

          return (
            <div
              key={`${group.title}-${slot}-${activityIndex}`}
              className={`relative flex min-w-0 gap-2.5 p-3 sm:gap-4 sm:p-4 ${
  activityIndex % 2 === 0 ? "md:border-r md:border-indigo-50" : ""
} ${activityIndex > 1 ? "border-t border-indigo-50" : ""}`}
            >
              <div className="absolute left-1 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full border-2 border-indigo-500 bg-white" />
              <div className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-indigo-50 sm:h-28 sm:w-32">
                <img
                  src={image}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="min-w-0 flex-1">
                <h5 className="line-clamp-2 min-w-0 break-words text-sm font-bold leading-5 text-slate-900 [overflow-wrap:anywhere] sm:text-base">
  {compact(activityName, 75)}
</h5>

          <p className="mt-1 flex min-w-0 items-start gap-1 text-xs text-slate-500">
  <MapPin size={12} className="mt-0.5 shrink-0" />
  <span className="min-w-0 break-words [overflow-wrap:anywhere]">
    {typeof location === "string" || typeof location === "number"
      ? String(location).trim() || "Location to be confirmed"
      : "Location to be confirmed"}
  </span>
</p>

                <div className="mt-2 flex flex-wrap gap-2">
                  {(typeof duration === "string" || typeof duration === "number") &&
                    String(duration).trim() !== "" && (
                      <span className="rounded-full bg-indigo-50 px-2 py-1 text-[11px] font-medium text-indigo-700">
                        {compact(String(duration), 24)}
                      </span>
                    )}

                  {cost !== undefined &&
  cost !== null &&
  String(cost).trim() !== "" && (
                    <span className="rounded-full bg-violet-50 px-2 py-1 text-[11px] font-medium text-violet-700">
                      ₹{moneyValue(cost)?.toLocaleString("en-IN") ?? compact(cost, 20)}
                    </span>
                  )}
                </div>

                {typeof description === "string" && description.trim() !== "" && (
                  <details className="mt-2">
                    <summary className="cursor-pointer text-xs font-semibold text-indigo-700">
                      More details
                    </summary>
                    <p className="mt-1 min-w-0 break-words text-xs leading-5 text-slate-500 [overflow-wrap:anywhere]">
  {compact(description, 320)}
</p>
                  </details>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  ))}
</div>
                    {Object.entries(day).some(([key, value]) => /meal_suggestions|weather_alternative|daily_cost|notes/i.test(key) && !isBlank(value)) && (
                      <details className="border-t border-indigo-50 px-5 py-3 sm:px-6">
                        <summary className="cursor-pointer text-sm font-semibold text-indigo-700">Meals, weather & day notes</summary>
                        <div className="mt-3 space-y-4">
  {Object.entries(day)
    .filter(([key, value]) =>
      /meal_suggestions|weather_alternative|daily_cost|notes/i.test(key) &&
      !isBlank(value)
    )
    .map(([key, value]) => (
      <div key={key} className="rounded-2xl border border-indigo-100 bg-white p-4 shadow-sm">
        <h4 className="mb-3 font-semibold text-indigo-700">
          {key.toLowerCase().includes("meal") ? "🍽️ Meal Suggestions" :
           key.toLowerCase().includes("weather") ? "🌦️ Weather Alternatives" :
           key.toLowerCase().includes("cost") ? "💰 Daily Budget" : "📝 Notes"}
        </h4>
        {key.toLowerCase().includes("meal") ? (
  <div className="grid gap-3 sm:grid-cols-3">
    {[
      { name: "Breakfast", icon: "🍳", color: "bg-amber-50" },
      { name: "Lunch", icon: "🍱", color: "bg-emerald-50" },
      { name: "Dinner", icon: "🍽️", color: "bg-violet-50" },
    ].map((meal) => {
      const meals = value as Record<string, unknown>;
      const mealValue = Object.entries(meals).find(([mealKey]) =>
        mealKey.toLowerCase().includes(meal.name.toLowerCase())
      )?.[1];

      return (
        <div key={meal.name} className={`rounded-xl ${meal.color} p-3`}>
          <div className="mb-2 text-xl">{meal.icon}</div>
          <p className="mb-1 text-sm font-bold text-slate-700">
            {meal.name}
          </p>
          {mealValue ? (
            <VisualValue value={mealValue} />
          ) : (
            <p className="text-xs text-slate-400">No suggestion available</p>
          )}
        </div>
      );
    })}
  </div>
) : (
  <VisualValue value={value} />
)}
      </div>
    ))}
</div>
                      </details>
                    )}
                  </article>
                );
              })}
            </div>
          
) : (
  <div className="overflow-hidden rounded-3xl border border-indigo-100 bg-white p-6 sm:p-9">
    <div className="mx-auto max-w-lg text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 text-3xl">
        🗺️
      </div>

      <h3 className="mt-5 text-xl font-bold text-slate-900">
        Your daily adventure is taking shape
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        A day-by-day plan isn't available for this trip yet. Your trip
        details and any additional information are still available below.
      </p>

      <div className="mt-5 flex flex-wrap justify-center gap-2 text-xs font-medium text-indigo-800">
        <span className="rounded-full bg-indigo-50 px-3 py-2">
          📍 Destination details
        </span>
        <span className="rounded-full bg-purple-50 px-3 py-2">
          🧳 Travel information
        </span>
      </div>
    </div>
  </div>
)}
        </section>

        {/* Secondary information stays tucked away */}
        <section className="mt-10">
          <div className="mb-4">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-700">THE EXTRAS</p>
            <h2 className="mt-1 text-2xl font-black tracking-tight">Helpful details</h2>
            <p className="mt-1 text-sm text-slate-500">Transport, accommodation, food tips and agent notes, when available.</p>
          </div>
          <div className="space-y-3">
            {sections
  .filter(([key]) => {
    const normalizedKey = normalizeKey(key);

    return (
      !/^(days|daily_itinerary|day_by_day|itinerary_days|day_plans|daily_plan|travel_schedule|itinerary_by_day|cost_summary|budget_breakdown|budget_summary)$/.test(normalizedKey) &&
      !/^(review|progress|agent_results|agent_progress|agent_review|review_results|progress_updates)$/.test(normalizedKey)
    );
  })
  .map(([key, value]) => {
              const Icon = getSectionIcon(key);
              const isOpen = expanded.includes(key);
              const preview = compact(textOf(value).replace(/[_{}[\]"]/g, " "), 100);
              return (
                <article key={key} className="overflow-hidden rounded-2xl border border-indigo-100 bg-white">
                  <button onClick={() => setExpanded((current) => current.includes(key) ? current.filter((item) => item !== key) : [...current, key])} aria-expanded={isOpen} className="flex w-full items-center gap-3 p-4 text-left sm:p-5">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700"><Icon size={20} /></div>
                    <div className="min-w-0 flex-1"><h3 className="font-bold text-slate-900">{labelOf(key)}</h3><p className="mt-1 line-clamp-1 text-xs text-slate-500">{preview || "View details"}</p></div>
                    <ChevronDown size={19} className={`shrink-0 text-slate-400 transition ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                  {isOpen && <div className="border-t border-indigo-50 px-4 py-5 sm:px-6"><VisualValue value={value} /></div>}
                </article>
              );
            })}
          </div>
        </section>

        <footer className="mt-12 flex flex-col gap-3 border-t border-indigo-100 py-7 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-bold text-indigo-950">
              Made for the way you travel.
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Your next chapter starts somewhere new.
            </p>
          </div>

          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-900/10 transition hover:-translate-y-0.5 hover:from-indigo-700 hover:to-purple-700"
          >
            <ArrowLeft size={16} />
            Back to dashboard
          </button>
        </footer>
      </div>
    </main>
  );
}