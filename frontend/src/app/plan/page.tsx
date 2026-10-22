"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  ChevronDown,
  Compass,
  Globe2,
  Heart,
  Loader2,
  MapPin,
  Minus,
  Plus,
  Sparkles,
  Wallet,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import SupportWidget from "../../components/SupportWidget";

const destinationOptions = [
  {
    name: "Goa",
    country: "India",
    category: "Beach escape",
    image:
      "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=900&q=85",
  },
  {
    name: "Goa Coastal Escape",
    country: "India",
    category: "Weekend getaway",
    image:
      "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=900&q=85",
  },
  {
    name: "Manali",
    country: "India",
    category: "Mountain retreat",
    image:
      "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=900&q=85",
  },
  {
    name: "Jaipur",
    country: "India",
    category: "Culture & heritage",
    image:
      "https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=900&q=85",
  },
  {
    name: "Rajasthan Explorer",
    country: "India",
    category: "Indian group tour",
    image:
      "https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=900&q=85",
  },
  {
    name: "Kerala Road Trip",
    country: "India",
    category: "Nature & road trip",
    image:
      "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=900&q=85",
  },
  {
    name: "Bali",
    country: "Indonesia",
    category: "Tropical getaway",
    image:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=900&q=85",
  },
  {
    name: "Swiss Alps",
    country: "Switzerland",
    category: "Nature & adventure",
    image:
      "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=900&q=85",
  },
  {
    name: "Kyoto",
    country: "Japan",
    category: "Culture & heritage",
    image:
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=900&q=85",
  },
  {
    name: "Santorini",
    country: "Greece",
    category: "Romantic beach escape",
    image:
      "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?auto=format&fit=crop&w=900&q=85",
  },
];

const travelStyles = [
  {
    value: "budget",
    title: "Budget",
    description: "More experiences, less spending",
    emoji: "🎒",
  },
  {
    value: "balanced",
    title: "Balanced",
    description: "Comfort and value together",
    emoji: "🌿",
  },
  {
    value: "comfort",
    title: "Comfort",
    description: "A little extra ease",
    emoji: "☁️",
  },
  {
    value: "luxury",
    title: "Luxury",
    description: "Make it unforgettable",
    emoji: "✨",
  },
];

const interestOptions = [
  { name: "Beaches", emoji: "🏖️" },
  { name: "Food", emoji: "🍜" },
  { name: "Culture", emoji: "🏛️" },
  { name: "Adventure", emoji: "🧗" },
  { name: "Nature", emoji: "🌲" },
  { name: "Nightlife", emoji: "🌃" },
  { name: "Shopping", emoji: "🛍️" },
  { name: "History", emoji: "🏺" },
];

function localDateString(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDate(value: string) {
  if (!value) return "Choose a date";

  return new Date(`${value}T12:00:00`).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function PlanPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading } = useAuth();

  const today = localDateString(new Date());

  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [budget, setBudget] = useState("20000");
  const [travelers, setTravelers] = useState(1);
  const [travelStyle, setTravelStyle] = useState("balanced");
  const [interests, setInterests] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  useEffect(() => {
    const requestedDestination = searchParams.get("destination");
    if (requestedDestination) {
      setDestination(requestedDestination);
    }
  }, [searchParams]);

  const matchingDestinations = useMemo(() => {
    const query = destination.trim().toLowerCase();

    if (!query) return destinationOptions;

    return destinationOptions.filter((item) =>
      `${item.name} ${item.country} ${item.category}`
        .toLowerCase()
        .includes(query)
    );
  }, [destination]);

  const tripDays = useMemo(() => {
    if (!startDate || !endDate || endDate < startDate) return 0;

    const start = new Date(`${startDate}T12:00:00`).getTime();
    const end = new Date(`${endDate}T12:00:00`).getTime();

    return Math.floor((end - start) / 86_400_000) + 1;
  }, [startDate, endDate]);

  const toggleInterest = (interest: string) => {
    setInterests((current) =>
      current.includes(interest)
        ? current.filter((item) => item !== interest)
        : [...current, interest]
    );
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");

    if (!user) {
      router.push("/login");
      return;
    }

    if (startDate < today) {
      setErrorMessage("Choose today or a future date for your trip.");
      return;
    }

    if (!endDate || endDate < startDate) {
      setErrorMessage("Your return date must be on or after your start date.");
      return;
    }

    if (!Number.isFinite(Number(budget)) || Number(budget) <= 0) {
      setErrorMessage("Enter a budget greater than zero.");
      return;
    }

    if (interests.length === 0) {
      setErrorMessage("Choose at least one interest for your trip.");
      return;
    }

    setSubmitting(true);

    try {
      const token = localStorage.getItem("voyageai_access_token");

      if (!token) {
        router.push("/login");
        return;
      }

      // This is the existing trip-generation API call.
      // Do not submit the form while testing the visual UI.
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/trip`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            destination: destination.trim(),
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
          data.detail || "We couldn't create your trip right now."
        );
      }

      router.push(`/trips/${data.id}`);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f9ff]">
        <Loader2 className="animate-spin text-[#4f46e5]" size={30} />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f9ff] text-[#0f172a]">
      <header className="sticky top-0 z-30 border-b border-indigo-100/80 bg-[#f7f9ff]/95 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-[1240px] items-center justify-between px-5 sm:px-8">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-3"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white">
              <Compass size={21} />
            </span>
            <span className="text-xl font-bold tracking-tight">
              Voyage<span className="text-violet-600">AI</span>
            </span>
          </button>

          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-[#312e81]"
          >
            <ArrowLeft size={17} />
            <span className="hidden sm:inline">Back to dashboard</span>
            <span className="sm:hidden">Back</span>
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-[1240px] px-5 pb-16 pt-8 sm:px-8 sm:pt-12">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mb-9 grid gap-8 lg:grid-cols-[1fr_0.72fr] lg:items-end"
        >
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#cddfd0] bg-[#eef2ff] px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-[#4f46e5]">
              <Sparkles size={15} />
              Your journey begins here
            </div>

            <h1 className="mt-5 max-w-2xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Let's plan something{" "}
              <span className="font-serif italic text-[#4f46e5]">
                wonderful.
              </span>
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-500 sm:text-base">
              Every memorable trip starts with a little curiosity.
              Tell us what you're dreaming of, and let's shape your next
              adventure around you.
            </p>
          </div>

          <div className="relative isolate hidden h-[205px] overflow-hidden rounded-[24px] bg-[#312e81] lg:block">
            <div
              className="absolute inset-0 -z-10 bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1100&q=85')",
              }}
            />
            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#312e81]/85 via-[#312e81]/35 to-transparent" />
            <div className="flex h-full max-w-xs flex-col justify-end p-6 text-white">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
                A world of possibilities
              </span>
              <p className="mt-2 text-2xl font-medium leading-snug">
                Your kind of trip.
                <br />
                Your kind of magic.
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid items-start gap-7 lg:grid-cols-[1fr_340px]">
          <form
            onSubmit={handleSubmit}
            className="rounded-[28px] border border-indigo-100 bg-white p-5 shadow-sm sm:p-8 lg:p-9"
          >
            {/* DESTINATION */}
            <section>
              <div className="mb-5 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#eef2ff] text-[#4f46e5]">
                  <MapPin size={20} />
                </span>
                <div>
                  <h2 className="font-semibold">Where to?</h2>
                  <p className="mt-0.5 text-xs text-slate-500">
                    Pick a destination or enter your own.
                  </p>
                </div>
              </div>

              <div className="relative">
                <input
                  value={destination}
                  onChange={(event) => {
                    setDestination(event.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => {
                    window.setTimeout(() => setShowSuggestions(false), 150);
                  }}
                  placeholder="A city, country or hidden gem..."
                  required
                  minLength={2}
                  maxLength={150}
                  autoComplete="off"
                  className="w-full rounded-2xl border border-indigo-100 bg-[#f8faff] px-4 py-4 pr-12 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#818cf8] focus:bg-white focus:ring-4 focus:ring-[#4f46e5]/5"
                />
                <ChevronDown
                  size={18}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                {showSuggestions && matchingDestinations.length > 0 && (
                  <div className="absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded-2xl border border-indigo-100 bg-white p-2 shadow-xl">
                    {matchingDestinations.map((item) => (
                      <button
                        key={item.name}
                        type="button"
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={() => {
                          setDestination(item.name);
                          setShowSuggestions(false);
                        }}
                        className="flex w-full items-center gap-3 rounded-xl p-2 text-left transition hover:bg-[#eef2ff]"
                      >
                        <div
                          className="h-12 w-14 shrink-0 rounded-lg bg-cover bg-center"
                          style={{ backgroundImage: `url('${item.image}')` }}
                        />
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-semibold">
                            {item.name}
                          </span>
                          <span className="mt-1 block text-xs text-slate-500">
                            {item.country} · {item.category}
                          </span>
                        </span>
                        <ArrowRight size={16} className="text-slate-400" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {["Goa", "Manali", "Jaipur", "Bali"].map((place) => (
                  <button
                    key={place}
                    type="button"
                    onClick={() => setDestination(place)}
                    className={`rounded-full border px-3.5 py-2 text-xs font-medium transition ${
                      destination === place
                        ? "border-[#4f46e5] bg-[#eef2ff] text-[#4338ca]"
                        : "border-indigo-100 text-slate-500 hover:border-[#a5b4fc] hover:text-[#4338ca]"
                    }`}
                  >
                    {place}
                  </button>
                ))}
              </div>
            </section>

            <div className="my-8 border-t border-indigo-50" />

            {/* DATES */}
            <section>
              <div className="mb-5 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#eef2ff] text-[#4f46e5]">
                  <CalendarDays size={20} />
                </span>
                <div>
                  <h2 className="font-semibold">When are we going?</h2>
                  <p className="mt-0.5 text-xs text-slate-500">
                    Choose your travel dates.
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-xs font-semibold text-slate-600">
                    DEPARTURE
                  </span>
                  <input
                    type="date"
                    value={startDate}
                    min={today}
                    onChange={(event) => {
                      const nextStart = event.target.value;
                      setStartDate(nextStart);
                      if (endDate && endDate < nextStart) setEndDate("");
                    }}
                    required
                    className="w-full rounded-2xl border border-indigo-100 bg-[#f8faff] px-4 py-3.5 text-sm outline-none focus:border-[#818cf8] focus:ring-4 focus:ring-[#4f46e5]/5"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-xs font-semibold text-slate-600">
                    RETURN
                  </span>
                  <input
                    type="date"
                    value={endDate}
                    min={startDate || today}
                    onChange={(event) => setEndDate(event.target.value)}
                    required
                    className="w-full rounded-2xl border border-indigo-100 bg-[#f8faff] px-4 py-3.5 text-sm outline-none focus:border-[#818cf8] focus:ring-4 focus:ring-[#4f46e5]/5"
                  />
                </label>
              </div>

              {tripDays > 0 && (
                <p className="mt-3 flex items-center gap-2 text-xs text-[#4f46e5]">
                  <Check size={14} />
                  {tripDays} {tripDays === 1 ? "day" : "days"} planned
                </p>
              )}
            </section>

            <div className="my-8 border-t border-indigo-50" />

            {/* BUDGET + TRAVELERS */}
            <section>
              <div className="mb-5 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#eef2ff] text-[#4f46e5]">
                  <Wallet size={20} />
                </span>
                <div>
                  <h2 className="font-semibold">Make it yours</h2>
                  <p className="mt-0.5 text-xs text-slate-500">
                    Set your budget and travel group.
                  </p>
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-xs font-semibold text-slate-600">
                    TOTAL BUDGET (₹)
                  </span>
                  <div className="flex items-center rounded-2xl border border-indigo-100 bg-[#f8faff] px-4 focus-within:border-[#818cf8] focus-within:ring-4 focus-within:ring-[#4f46e5]/5">
                    <span className="text-sm text-slate-500">₹</span>
                    <input
                      type="number"
                      min="1"
                      max="100000000"
                      value={budget}
                      onChange={(event) => setBudget(event.target.value)}
                      placeholder="20000"
                      required
                      className="w-full bg-transparent px-3 py-3.5 text-sm outline-none"
                    />
                  </div>
                  <span className="mt-2 block text-xs text-slate-400">
                    Enter the total trip budget.
                  </span>
                </label>

                <div>
                  <span className="mb-2 block text-xs font-semibold text-slate-600">
                    TRAVELERS
                  </span>
                  <div className="flex items-center justify-between rounded-2xl border border-indigo-100 bg-[#f8faff] px-3 py-2">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-[#4f46e5] shadow-sm">
                        <Heart size={17} />
                      </span>
                      <span>
                        <span className="block text-sm font-semibold">
                          {travelers} {travelers === 1 ? "traveler" : "travelers"}
                        </span>
                        <span className="mt-0.5 block text-xs text-slate-500">
                          Who's coming along?
                        </span>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={travelers <= 1}
                        onClick={() => setTravelers((count) => Math.max(1, count - 1))}
                        aria-label="Remove traveler"
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-indigo-100 bg-white transition hover:border-[#818cf8] disabled:opacity-40"
                      >
                        <Minus size={15} />
                      </button>
                      <button
                        type="button"
                        disabled={travelers >= 20}
                        onClick={() => setTravelers((count) => Math.min(20, count + 1))}
                        aria-label="Add traveler"
                        className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white transition hover:from-indigo-700 hover:to-purple-700 disabled:opacity-40"
                      >
                        <Plus size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <div className="my-8 border-t border-indigo-50" />

            {/* TRAVEL STYLE */}
            <section>
              <div className="mb-5">
                <h2 className="font-semibold">What's your travel vibe?</h2>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  There's no wrong way to explore the world.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {travelStyles.map((style) => {
                  const selected = travelStyle === style.value;

                  return (
                    <button
                      key={style.value}
                      type="button"
                      onClick={() => setTravelStyle(style.value)}
                      aria-pressed={selected}
                      className={`flex items-start gap-3 rounded-2xl border p-4 text-left transition ${
                        selected
                          ? "border-[#4f46e5] bg-[#eef2ff] ring-2 ring-[#4f46e5]/10"
                          : "border-indigo-100 bg-white hover:border-[#c7d2fe]"
                      }`}
                    >
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-xl shadow-sm">
                        {style.emoji}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-semibold">
                          {style.title}
                        </span>
                        <span className="mt-1 block text-xs leading-5 text-slate-500">
                          {style.description}
                        </span>
                      </span>
                      <span
                        className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                          selected
                            ? "border-[#4f46e5] bg-[#4f46e5] text-white"
                            : "border-stone-300 text-transparent"
                        }`}
                      >
                        <Check size={12} />
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>

            <div className="my-8 border-t border-indigo-50" />

            {/* INTERESTS */}
            <section>
              <div className="mb-5">
                <h2 className="font-semibold">What makes a trip memorable?</h2>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Pick the things you'd love to experience. Choose at least one.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {interestOptions.map((interest) => {
                  const selected = interests.includes(interest.name);

                  return (
                    <button
                      key={interest.name}
                      type="button"
                      onClick={() => toggleInterest(interest.name)}
                      aria-pressed={selected}
                      className={`flex items-center gap-2.5 rounded-xl border px-3 py-3 text-left text-sm font-medium transition ${
                        selected
                          ? "border-[#4f46e5] bg-[#eef2ff] text-[#4338ca]"
                          : "border-indigo-100 bg-white text-slate-600 hover:border-[#c7d2fe]"
                      }`}
                    >
                      <span className="text-lg">{interest.emoji}</span>
                      <span className="min-w-0 flex-1">{interest.name}</span>
                      {selected && (
                        <Check size={14} className="shrink-0 text-[#4f46e5]" />
                      )}
                    </button>
                  );
                })}
              </div>
            </section>

            {errorMessage && (
              <div
                role="alert"
                className="mt-7 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700"
              >
                {errorMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="mt-9 flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 font-semibold text-white shadow-lg shadow-indigo-600/15 transition hover:-translate-y-0.5 hover:from-indigo-700 hover:to-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <Loader2 size={19} className="animate-spin" />
                  Creating your trip...
                </>
              ) : (
                <>
                  <Sparkles size={19} />
                  Create my trip
                  <ArrowRight size={18} />
                </>
              )}
            </button>

            <p className="mt-4 text-center text-xs leading-5 text-slate-400">
              Your preferences help shape a trip around what matters to you.
            </p>
          </form>

          {/* LIVE SUMMARY */}
          <aside className="lg:sticky lg:top-[96px]">
            <div className="overflow-hidden rounded-[26px] border border-indigo-100 bg-white shadow-sm">
              <div className="relative h-[185px] overflow-hidden bg-[#312e81]">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-all duration-500"
                  style={{
                    backgroundImage: `url('${
                      destinationOptions.find(
                        (item) =>
                          item.name.toLowerCase() === destination.trim().toLowerCase()
                      )?.image ||
                      "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=900&q=85"
                    }')`,
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
                <div className="absolute bottom-4 left-5 right-5 text-white">
                  <p className="text-xs font-medium uppercase tracking-[0.16em] text-white/75">
                    YOUR TRIP PREVIEW
                  </p>
                  <h2 className="mt-1 text-2xl font-semibold">
                    {destination.trim() || "Your next adventure"}
                  </h2>
                </div>
              </div>

              <div className="p-5 sm:p-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">The little details</h3>
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#eef2ff] text-[#4f46e5]">
                    <Globe2 size={16} />
                  </span>
                </div>

                <div className="mt-5 space-y-4">
                  <div className="flex items-start gap-3">
                    <CalendarDays size={18} className="mt-0.5 text-[#4f46e5]" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-slate-500">Travel dates</p>
                      <p className="mt-1 text-sm font-medium">
                        {startDate ? formatDate(startDate) : "Departure date"}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {endDate ? `Until ${formatDate(endDate)}` : "Return date"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Wallet size={18} className="mt-0.5 text-[#4f46e5]" />
                    <div>
                      <p className="text-xs text-slate-500">Your budget</p>
                      <p className="mt-1 text-sm font-medium">
                        {budget && Number(budget) > 0
                          ? `₹${Number(budget).toLocaleString("en-IN")}`
                          : "Set your budget"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Heart size={18} className="mt-0.5 text-[#4f46e5]" />
                    <div>
                      <p className="text-xs text-slate-500">Travel style</p>
                      <p className="mt-1 text-sm font-medium capitalize">
                        {travelStyle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Compass size={18} className="mt-0.5 text-[#4f46e5]" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-slate-500">Your interests</p>
                      {interests.length > 0 ? (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {interests.map((interest) => (
                            <span
                              key={interest}
                              className="rounded-full bg-[#eef2ff] px-2.5 py-1 text-xs text-[#4338ca]"
                            >
                              {interest}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="mt-1 text-sm text-slate-400">
                          Choose what you love
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-6 rounded-2xl bg-[#eef2ff] p-4">
                  <div className="flex items-center gap-2 text-[#4f46e5]">
                    <Sparkles size={16} />
                    <span className="text-sm font-semibold">
                      Made around you
                    </span>
                  </div>
                  <p className="mt-2 text-xs leading-5 text-slate-600">
                    {tripDays > 0
                      ? `${tripDays} ${tripDays === 1 ? "day" : "days"} to explore, discover and make memories.`
                      : "Choose your dates and preferences to see your trip take shape."}
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-medium text-slate-500 transition hover:bg-white hover:text-[#312e81]"
            >
              <ArrowLeft size={16} />
              Save this for later
            </button>
          </aside>
        </div>

        <footer className="mt-12 border-t border-indigo-100 pt-6 text-center text-xs text-slate-400">
          VoyageAI · A little closer to your next adventure.
        </footer>
      </div>
      <SupportWidget />
    </main>
  );
}