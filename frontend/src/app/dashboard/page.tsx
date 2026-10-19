
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Compass,
  Globe2,
  LogOut,
  MapPin,
  PlaneTakeoff,
  Search,
  Sparkles,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

const destinations = [
  {
    name: "Bali",
    country: "Indonesia",
    category: "Beach",
    description: "Tropical escapes & hidden waterfalls",
    days: "5–7 days",
    image:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=900&q=85",
  },
  {
    name: "Swiss Alps",
    country: "Switzerland",
    category: "Nature",
    description: "Mountain views & peaceful villages",
    days: "6–8 days",
    image:
      "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=900&q=85",
  },
  {
    name: "Kyoto",
    country: "Japan",
    category: "Culture",
    description: "Ancient temples & quiet streets",
    days: "4–6 days",
    image:
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=900&q=85",
  },
  {
    name: "Santorini",
    country: "Greece",
    category: "Beach",
    description: "Whitewashed villages & blue seas",
    days: "3–5 days",
    image:
      "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?auto=format&fit=crop&w=900&q=85",
  },
];

const categories = ["All", "Beach", "Nature", "Culture"];

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [user, loading, router]);

  const filteredDestinations = useMemo(() => {
    const query = search.trim().toLowerCase();

    return destinations.filter((destination) => {
      const matchesCategory =
        category === "All" || destination.category === category;

      const matchesSearch =
        !query ||
        `${destination.name} ${destination.country} ${destination.category}`
          .toLowerCase()
          .includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [search, category]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f8f8f6]">
        <div className="flex items-center gap-3 text-sm text-stone-500">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-stone-200 border-t-emerald-700" />
          Preparing your next adventure...
        </div>
      </main>
    );
  }

  if (!user) return null;

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  const planDestination = (destination?: string) => {
    const url = destination
      ? `/plan?destination=${encodeURIComponent(destination)}`
      : "/plan";

    router.push(url);
  };

  return (
    <main className="min-h-screen bg-[#f8f8f6] text-[#202923]">
      {/* NAVIGATION */}
      <header className="sticky top-0 z-30 border-b border-stone-200/80 bg-[#f8f8f6]/95 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-12">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-3"
            aria-label="VoyageAI home"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#174c3b] text-white">
              <Compass size={22} />
            </span>
            <span className="text-xl font-bold tracking-tight">
              Voyage<span className="text-[#368467]">AI</span>
            </span>
          </button>

          <nav className="hidden items-center gap-8 md:flex">
            <button className="text-sm font-semibold text-[#245b45]">
              Discover
            </button>
            <button
              onClick={() => router.push("/plan")}
              className="text-sm text-stone-500 transition hover:text-[#245b45]"
            >
              Plan a trip
            </button>
            <button
              onClick={() => router.push("/trips")}
              className="text-sm text-stone-500 transition hover:text-[#245b45]"
            >
              My journeys
            </button>
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold">{user.name}</p>
              <p className="text-xs text-stone-500">Your travel space</p>
            </div>
            <button
              onClick={handleLogout}
              aria-label="Log out"
              title="Log out"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-stone-200 bg-white text-stone-500 transition hover:border-red-200 hover:text-red-600"
            >
              <LogOut size={17} />
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1440px] px-5 pb-16 pt-7 sm:px-8 lg:px-12 lg:pt-10">
        {/* HERO */}
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative isolate flex min-h-[440px] items-end overflow-hidden rounded-[28px] bg-[#193d31] sm:min-h-[490px] lg:min-h-[510px]"
        >
          <div
            className="absolute inset-0 -z-20 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=2200&q=90')",
            }}
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#102b24]/90 via-[#102b24]/55 to-transparent" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#102b24]/45 via-transparent to-black/10" />

          <div className="w-full p-7 pb-9 sm:p-10 sm:pb-12 lg:p-16 lg:pb-14">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-medium tracking-wide text-white backdrop-blur-md sm:text-sm">
              <Sparkles size={15} />
              YOUR NEXT CHAPTER STARTS HERE
            </div>

            <h1 className="max-w-3xl text-4xl font-semibold leading-[1.12] tracking-tight text-white sm:text-5xl lg:text-7xl">
              The world is
              <br />
              waiting for <span className="italic text-[#bce4c6]">you.</span>
            </h1>

            <p className="mt-5 max-w-lg text-sm leading-7 text-white/80 sm:text-base">
              Hey {user.name}, where will your curiosity take you?
              Discover new places and turn your travel dreams into
              thoughtfully planned journeys.
            </p>

            <button
              onClick={() => planDestination()}
              className="mt-8 inline-flex items-center gap-3 rounded-full bg-[#d7f0d9] px-6 py-3.5 text-sm font-bold text-[#183d2e] transition hover:-translate-y-0.5 hover:bg-white"
            >
              <PlaneTakeoff size={18} />
              Plan my next trip
              <ArrowRight size={17} />
            </button>

            <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-white/75 sm:text-sm">
              <span className="flex items-center gap-2">
                <Globe2 size={16} />
                Discover the extraordinary
              </span>
              <span className="flex items-center gap-2">
                <Sparkles size={16} />
                Your journey, your way
              </span>
            </div>
          </div>
        </motion.section>

        {/* SEARCH AND DESTINATIONS */}
        <section className="mt-12 sm:mt-16">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#438267]">
                A little inspiration
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
                Where to next?
              </h2>
              <p className="mt-2 text-sm leading-6 text-stone-500">
                A few places worth dreaming about.
              </p>
            </div>

            <label className="flex w-full items-center gap-3 rounded-2xl border border-stone-200 bg-white px-4 py-3.5 md:max-w-[330px]">
              <Search size={18} className="shrink-0 text-stone-400" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search destinations..."
                className="w-full bg-transparent text-sm outline-none placeholder:text-stone-400"
                aria-label="Search destinations"
              />
            </label>
          </div>

          {/* FILTERS */}
          <div className="mt-6 flex flex-wrap gap-2">
            {categories.map((item) => (
              <button
                key={item}
                onClick={() => setCategory(item)}
                className={`rounded-full px-5 py-2.5 text-sm font-medium transition ${
                  category === item
                    ? "bg-[#214d3b] text-white"
                    : "border border-stone-200 bg-white text-stone-600 hover:border-[#8db6a0]"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          {/* DESTINATION CARDS */}
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {filteredDestinations.map((destination, index) => (
              <motion.article
                key={destination.name}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: index * 0.06 }}
                className="group overflow-hidden rounded-[24px] border border-stone-200/80 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-stone-900/5"
              >
                <div className="relative h-[235px] overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition duration-700 group-hover:scale-105"
                    style={{
                      backgroundImage: `url('${destination.image}')`,
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />

                  <span className="absolute left-4 top-4 rounded-full border border-white/30 bg-black/20 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md">
                    {destination.category}
                  </span>

                  <button
                    onClick={() => planDestination(destination.name)}
                    aria-label={`Plan a trip to ${destination.name}`}
                    className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#214d3b] transition hover:scale-110"
                  >
                    <ArrowUpRight size={19} />
                  </button>

                  <div className="absolute bottom-4 left-4 right-14 text-white">
                    <h3 className="text-2xl font-semibold">
                      {destination.name}
                    </h3>
                    <p className="mt-1 flex items-center gap-1.5 text-xs text-white/85">
                      <MapPin size={13} />
                      {destination.country}
                    </p>
                  </div>
                </div>

                <div className="p-5">
                  <p className="min-h-10 text-sm leading-5 text-stone-500">
                    {destination.description}
                  </p>
                  <div className="mt-4 flex items-center justify-between border-t border-stone-100 pt-4">
                    <span className="flex items-center gap-1.5 text-xs text-stone-500">
                      <CalendarDays size={14} />
                      {destination.days}
                    </span>
                    <button
                      onClick={() => planDestination(destination.name)}
                      className="text-xs font-bold text-[#347456] transition hover:text-[#183d2e]"
                    >
                      Plan trip
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          {filteredDestinations.length === 0 && (
            <div className="mt-6 rounded-3xl border border-dashed border-stone-300 bg-white p-10 text-center">
              <Compass className="mx-auto text-stone-400" size={30} />
              <h3 className="mt-4 font-semibold">No matches just yet</h3>
              <p className="mt-2 text-sm text-stone-500">
                Try another search or choose a different category.
              </p>
              <button
                onClick={() => {
                  setSearch("");
                  setCategory("All");
                }}
                className="mt-4 text-sm font-semibold text-[#347456]"
              >
                Clear filters
              </button>
            </div>
          )}
        </section>

        {/* MY JOURNEYS */}
        <section className="mt-14 grid gap-6 lg:mt-20 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="rounded-[26px] border border-stone-200 bg-white p-7 sm:p-9">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#438267]">
                  Your travel journal
                </p>
                <h2 className="mt-2 text-2xl font-semibold">
                  My journeys
                </h2>
                <p className="mt-2 max-w-md text-sm leading-6 text-stone-500">
                  Every great adventure begins with an idea. Your saved
                  trips will have a home here.
                </p>
              </div>
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#edf5ee] text-[#347456]">
                <Compass size={23} />
              </div>
            </div>

            <div className="mt-7 rounded-2xl border border-dashed border-stone-300 bg-[#fafbf8] px-5 py-8 text-center">
              <MapPin className="mx-auto text-[#619278]" size={25} />
              <h3 className="mt-3 font-semibold">
                Your story starts with a destination
              </h3>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-stone-500">
                Start planning your first trip. Once saved trips are
                connected, they can appear in this space.
              </p>
              <button
                onClick={() => router.push("/trips")}
                className="mt-5 inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-5 py-2.5 text-sm font-semibold transition hover:border-[#8db6a0]"
              >
                View my trips <ArrowRight size={16} />
              </button>
            </div>
          </div>

          <div className="relative isolate overflow-hidden rounded-[26px] bg-[#214d3b] p-7 text-white sm:p-9">
            <div
              className="absolute inset-0 -z-10 bg-cover bg-center opacity-20"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=80')",
              }}
            />
            <Sparkles size={24} className="text-[#c8e8c9]" />
            <h2 className="mt-5 text-2xl font-semibold leading-snug">
              Not sure where to go?
            </h2>
            <p className="mt-3 text-sm leading-7 text-white/75">
              Start with your interests, your budget and the feeling
              you want from your next adventure.
            </p>
            <button
              onClick={() => router.push("/plan")}
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#d7f0d9] px-5 py-3 text-sm font-bold text-[#183d2e] transition hover:bg-white"
            >
              Find my next adventure <ArrowRight size={16} />
            </button>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="mt-14 flex flex-col justify-between gap-3 border-t border-stone-200 pt-6 text-xs text-stone-400 sm:flex-row sm:items-center">
          <span className="font-semibold tracking-wide">
            VoyageAI · Travel a little differently.
          </span>
          <span>Made for the journeys you haven't taken yet.</span>
        </footer>
      </div>
    </main>
  );
}
