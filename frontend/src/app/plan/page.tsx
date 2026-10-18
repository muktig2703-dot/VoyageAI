"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  MapPin,
  CalendarDays,
  Wallet,
  Users,
  Sparkles,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
export default function PlanPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [budget, setBudget] = useState("");
  const [travelers, setTravelers] = useState("1");
  const [travelStyle, setTravelStyle] = useState("balanced");
  const [interests, setInterests] = useState<string[]>([]);

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950">
        <Loader2 className="animate-spin text-blue-400" size={32} />
      </main>
    );
  }

  const toggleInterest = (interest: string) => {
    setInterests((current) =>
      current.includes(interest)
        ? current.filter((item) => item !== interest)
        : [...current, interest]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!user) {
    router.push("/login");
    return;
  }

  setSubmitting(true);

  try {
    const token = localStorage.getItem(
      "voyageai_access_token"
    );

    if (!token) {
      router.push("/login");
      return;
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/trip`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          destination,
          start_date: startDate,
          end_date: endDate,
          budget: Number(budget),
          travel_style: travelStyle,
          interests,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.detail || "Failed to generate trip"
      );
    }

    console.log("Trip created:", data);

    router.push(`/trips/${data.id}`);
  } catch (error) {
    console.error("Trip generation failed:", error);

    alert(
      error instanceof Error
        ? error.message
        : "Something went wrong while generating your trip."
    );
  } finally {
    setSubmitting(false);
  }
};

  const interestOptions = [
    "Beaches",
    "Food",
    "Culture",
    "Adventure",
    "Nature",
    "Nightlife",
    "Shopping",
    "History",
  ];

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="mb-10 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-300">
            <Sparkles size={16} />
            AI Trip Planner
          </div>

          <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
            Plan your next
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              {" "}adventure
            </span>
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-slate-400">
            Tell VoyageAI what you want from your trip and our AI agents
            will build a personalized itinerary for you.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-xl sm:p-8"
        >

          {/* Destination */}
          <div className="mb-8">
            <label className="mb-3 block text-sm font-semibold text-slate-200">
              Where do you want to go?
            </label>

            <div className="relative">
              <MapPin
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400"
              />

              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="e.g. Goa, Paris, Tokyo..."
                required
                className="w-full rounded-2xl border border-white/10 bg-white/[0.06] py-4 pl-12 pr-4 text-white outline-none transition placeholder:text-slate-500 focus:border-blue-500/60 focus:bg-white/[0.08]"
              />
            </div>
          </div>

          {/* Dates */}
          <div className="mb-8 grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-3 block text-sm font-semibold text-slate-200">
                Start date
              </label>

              <div className="relative">
                <CalendarDays
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400"
                />

                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.06] py-4 pl-12 pr-4 text-white outline-none focus:border-blue-500/60"
                />
              </div>
            </div>

            <div>
              <label className="mb-3 block text-sm font-semibold text-slate-200">
                End date
              </label>

              <div className="relative">
                <CalendarDays
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400"
                />

                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.06] py-4 pl-12 pr-4 text-white outline-none focus:border-blue-500/60"
                />
              </div>
            </div>
          </div>

          {/* Budget + Travelers */}
          <div className="mb-8 grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-3 block text-sm font-semibold text-slate-200">
                Budget
              </label>

              <div className="relative">
                <Wallet
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400"
                />

                <input
                  type="number"
                  min="0"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="e.g. 50000"
                  required
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.06] py-4 pl-12 pr-4 text-white outline-none placeholder:text-slate-500 focus:border-blue-500/60"
                />
              </div>
            </div>

            <div>
              <label className="mb-3 block text-sm font-semibold text-slate-200">
                Travelers
              </label>

              <div className="relative">
                <Users
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400"
                />

                <input
                  type="number"
                  min="1"
                  value={travelers}
                  onChange={(e) => setTravelers(e.target.value)}
                  required
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.06] py-4 pl-12 pr-4 text-white outline-none focus:border-blue-500/60"
                />
              </div>
            </div>
          </div>

          {/* Travel Style */}
          <div className="mb-8">
            <label className="mb-3 block text-sm font-semibold text-slate-200">
              Travel style
            </label>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                ["budget", "Budget"],
                ["balanced", "Balanced"],
                ["comfort", "Comfort"],
                ["luxury", "Luxury"],
              ].map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setTravelStyle(value)}
                  className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                    travelStyle === value
                      ? "border-blue-500 bg-blue-500/15 text-blue-300"
                      : "border-white/10 bg-white/[0.04] text-slate-400 hover:border-white/20 hover:text-white"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Interests */}
          <div className="mb-10">
            <label className="mb-3 block text-sm font-semibold text-slate-200">
              What are you interested in?
            </label>

            <div className="flex flex-wrap gap-3">
              {interestOptions.map((interest) => {
                const selected = interests.includes(interest);

                return (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                      selected
                        ? "border-purple-500 bg-purple-500/15 text-purple-300"
                        : "border-white/10 bg-white/[0.04] text-slate-400 hover:border-white/20 hover:text-white"
                    }`}
                  >
                    {interest}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 font-bold text-white shadow-xl transition hover:scale-[1.01] hover:shadow-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Preparing your trip...
              </>
            ) : (
              <>
                <Sparkles size={20} />
                Generate My Trip
                <ArrowRight
                  size={20}
                  className="transition-transform group-hover:translate-x-1"
                />
              </>
            )}
          </button>

        </form>
      </div>
    </main>
  );
}