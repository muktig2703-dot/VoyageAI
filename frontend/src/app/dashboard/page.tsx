"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { m, motion, number } from "framer-motion";
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
    packageType: "Honeymoon",
    price: 54999,
    hotelCatgory: 5,
    themes: ["Beach", "Adventure", "Romantic"],
    description: "Tropical escapes & hidden waterfalls",
    days: "5–7 days",
    image:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=900&q=85",
  },
  {
    name: "Swiss Alps",
    country: "Switzerland",
    category: "Nature",
    packageType: "Experiences",
    price: 89999,
    hotelCategory: 5,
    themes: ["Nature", "Adventure", "Relaxation"],
    description: "Mountain views & peaceful villages",
    days: "6–8 days",
    image:
      "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=900&q=85",
  },
  {
    name: "Kyoto",
    country: "Japan",
    category: "Culture",
    packageType: "Experiences",
    price: 74999,
    hotelCategory: 4,
    themes: ["Culture", "Nature", "Food"],
    description: "Ancient temples & quiet streets",
    days: "4–6 days",
    image:
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=900&q=85",
  },
  {
    name: "Santorini",
    country: "Greece",
    category: "Beach",
    packageType: "Honeymoon",
    price: 69999,
    hotelCategory: 5,
    themes: ["Beach", "Romantic", "Relaxation"],
    description: "Whitewashed villages & blue seas",
    days: "3–5 days",
    image:
      "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?auto=format&fit=crop&w=900&q=85",
  },
  
  {
    name: "Rajasthan Explorer",
    country: "India",
    category: "Culture",
    packageType: "Indian Group Tours",
    price: 18999,
    hotelCategory: 3,
    themes: ["Culture", "Adventure", "Food"],
    description: "Royal palaces, colorful markets & desert adventures",
    days: "5–6 days",
    image:
      "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=1200",
  },
  {
    name: "Goa Coastal Escape",
    country: "India",
    category: "Beach",
    packageType: "Weekend Getaways",
    price: 12999,
    hotelCategory: 3,
    themes: ["Beach", "Relaxation", "Food"],
    description: "Golden beaches, sunset views & relaxed coastal vibes",
    days: "2–3 days",
    image:
      "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1200",
  },
  {
    name: "Kerala Road Trip",
    country: "India",
    category: "Nature",
    packageType: "Bus Tours",
    price: 15999,
    hotelCategory: 4,
    themes: ["Nature", "Adventure", "Relaxation"],
    description: "Lush green landscapes, backwaters & scenic journeys",
    days: "4–5 days",
    image:
      "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1200",
  },

];

const categories = [
  "All Packages",
  "Indian Group Tours",
  "Experiences",
  "Honeymoon",
  "Bus Tours",
  "Weekend Getaways",
];

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Packages");
  const [sortBy, setSortBy] = useState("popular");
  const [maxBudget, setMaxBudget] = useState("any");
  const [maxDuration, setMaxDuration] = useState("any");
  const [hotelCategory, setHotelCategory] = useState("any");
  const [selectedTheme, setSelectedTheme] = useState("any");

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [user, loading, router]);

  

const filteredDestinations = useMemo(() => {
  const query = search.trim().toLowerCase();

  const filtered = destinations.filter((destination) => {
    const matchesCategory =
      category === "All Packages" ||
      destination.packageType === category;

    const matchesSearch =
      !query ||
      `${destination.name} ${destination.country} ${destination.category} ${destination.packageType}`
        .toLowerCase()
        .includes(query);

    const matchesBudget =
  maxBudget === "any" ||
  destination.price <= Number(maxBudget);
  const durationRange = destination.days
  .split("–")
  .map((day) => parseInt(day, 10));

const longestDuration = durationRange[durationRange.length - 1];

const matchesDuration =
  maxDuration === "any" ||
  longestDuration <= Number(maxDuration);

const matchesHotel =
  hotelCategory === "any" ||
  destination.hotelCategory === Number(hotelCategory);

const matchesTheme =
  selectedTheme === "any" ||
  destination.themes.includes(selectedTheme);

return (
  matchesCategory &&
  matchesSearch &&
  matchesBudget &&
  matchesDuration &&
  matchesHotel &&
  matchesTheme
);
  });

  if (sortBy === "price-low") {
    return [...filtered].sort((a, b) => a.price - b.price);
  }

  if (sortBy === "price-high") {
    return [...filtered].sort((a, b) => b.price - a.price);
  }

  if (sortBy === "duration-short") {
    return [...filtered].sort(
      (a, b) =>
        parseInt(a.days.split("–")[0]) -
        parseInt(b.days.split("–")[0])
    );
  }

  if (sortBy === "duration-long") {
    return [...filtered].sort(
      (a, b) =>
        parseInt(b.days.split("–")[1]) -
        parseInt(a.days.split("–")[1])
    );
  }

  return filtered;
}, [search, category, sortBy, maxBudget, maxDuration, hotelCategory, selectedTheme]);


  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f9ff]">
        <div className="flex items-center gap-3 text-sm text-slate-500">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-100 border-t-indigo-600" />
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
    <main className="min-h-screen bg-[#f7f9ff] text-slate-900">
      {/* NAVIGATION */}
      <header className="sticky top-0 z-30 border-b border-indigo-100/80 bg-[#f7f9ff]/95 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-12">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-3"
            aria-label="VoyageAI home"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/20">
              <Compass size={22} />
            </span>
            <span className="text-xl font-bold tracking-tight">
              Voyage<span className="text-indigo-600">AI</span>
            </span>
          </button>

          <nav className="hidden items-center gap-8 md:flex">
            <button className="text-sm font-semibold text-indigo-600">
              Discover
            </button>
            <button
              onClick={() => router.push("/plan")}
              className="text-sm text-slate-500 transition hover:text-indigo-600"
            >
              Plan a trip
            </button>
            <button
              onClick={() => router.push("/trips")}
              className="text-sm text-slate-500 transition hover:text-indigo-600"
            >
              My journeys
            </button>
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold">{user.name}</p>
              <p className="text-xs text-slate-500">Your travel space</p>
            </div>
            <button
              onClick={handleLogout}
              aria-label="Log out"
              title="Log out"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-indigo-100 bg-white text-slate-500 transition hover:border-red-200 hover:text-red-600"
            >
              <LogOut size={17} />
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1440px] px-5 pb-16 pt-7 sm:px-8 lg:px-12 lg:pt-10">
        {/* HERO */}
        
{/* TRAVEL CATEGORY NAVIGATION */}
<nav className="mb-7 overflow-x-auto rounded-2xl border border-indigo-100 bg-white p-2 shadow-sm">
  <div className="flex min-w-max items-center gap-2">
    {[
      { label: "Last Minute Deals", icon: "⏰" },
      { label: "Honeymoon", icon: "💜" },
      { label: "Offer Zone", icon: "🏷️" },
      { label: "Group Tour Packages", icon: "👥" },
      { label: "Pilgrimage", icon: "🛕" },
    ].map((item) => (
      <button
        key={item.label}
        onClick={() => {
          if (item.label === "Honeymoon") {
  setCategory("Honeymoon");
  document.getElementById("destinations")?.scrollIntoView({
    behavior: "smooth",
  });
} else {
            document.getElementById("destinations")?.scrollIntoView({
              behavior: "smooth",
            });
          }
        }}
        className="rounded-xl px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-indigo-50 hover:text-indigo-700"
      >
        <span className="mr-2" aria-hidden="true">
          {item.icon}
        </span>
        {item.label}
      </button>
    ))}
  </div>
</nav>
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative isolate flex min-h-[440px] items-end overflow-hidden rounded-[28px] bg-gradient-to-br from-[#172554] via-[#312e81] to-[#581c87] sm:min-h-[490px] lg:min-h-[510px]"
        >
          <div
            className="absolute inset-0 -z-20 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=2200&q=90')",
            }}
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#171641]/90 via-[#312e81]/55 to-transparent" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#171641]/45 via-transparent to-black/10" />

          <div className="w-full p-7 pb-9 sm:p-10 sm:pb-12 lg:p-16 lg:pb-14">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-medium tracking-wide text-white backdrop-blur-md sm:text-sm">
              <Sparkles size={15} />
              YOUR NEXT CHAPTER STARTS HERE
            </div>

            <h1 className="max-w-3xl text-4xl font-semibold leading-[1.12] tracking-tight text-white sm:text-5xl lg:text-7xl">
              The world is
              <br />
              waiting for <span className="italic text-indigo-200">you.</span>
            </h1>

            <p className="mt-5 max-w-lg text-sm leading-7 text-white/80 sm:text-base">
              Hey {user.name}, where will your curiosity take you?
              Discover new places and turn your travel dreams into
              thoughtfully planned journeys.
            </p>

            <button
              onClick={() => planDestination()}
              className="mt-8 inline-flex items-center gap-3 rounded-full bg-white px-6 py-3.5 text-sm font-bold text-indigo-700 shadow-lg shadow-indigo-950/20 transition hover:-translate-y-0.5 hover:bg-indigo-50"
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
        <section id="destinations" className="mt-12 scroll-mt-28 sm:mt-16">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">
                A little inspiration
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
                Where to next?
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                A few places worth dreaming about.
              </p>
            </div>

            <label className="flex w-full items-center gap-3 rounded-2xl border border-indigo-100 bg-white px-4 py-3.5 transition focus-within:border-indigo-300 focus-within:ring-4 focus-within:ring-indigo-500/10 md:max-w-[330px]">
              <Search size={18} className="shrink-0 text-slate-400" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search destinations..."
                className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                aria-label="Search destinations"
              />
            </label>
          </div>
 {/* PACKAGE CONTROLS */}
<div className="mt-6 flex flex-wrap items-end gap-3">    
{/* SORTING */}
<div className="flex flex-wrap items-center gap-2">
  <p className="text-sm text-slate-500">
    Showing{" "}
    <span className="font-semibold text-slate-800">
      {filteredDestinations.length}
    </span>{" "}
    packages
  </p>

  <label className="flex items-center gap-3 self-start rounded-xl border border-indigo-100 bg-white px-4 py-3 sm:self-auto">
    <span className="whitespace-nowrap text-sm font-medium text-slate-600">
      Sort by
    </span>

    <select
      value={sortBy}
      onChange={(event) => setSortBy(event.target.value)}
      className="max-w-[210px] bg-transparent text-sm font-semibold text-indigo-700 outline-none"
      aria-label="Sort packages"
    >
      <option value="popular">Popular</option>
      <option value="price-low">Price: Low to High</option>
      <option value="price-high">Price: High to Low</option>
      <option value="duration-short">Shortest Duration</option>
      <option value="duration-long">Longest Duration</option>
    </select>
  </label>
</div>

{/* BUDGET FILTER */}
<div className="flex flex-wrap items-center gap-2">
  <label
    htmlFor="budget-filter"
    className="text-sm font-semibold text-slate-600"
  >
    Budget per person
  </label>

  <select
    id="budget-filter"
    value={maxBudget}
    onChange={(event) => setMaxBudget(event.target.value)}
    className="rounded-xl border border-indigo-100 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-indigo-300"
  >
    <option value="any">Any budget</option>
    <option value="15000">Up to ₹15,000</option>
    <option value="25000">Up to ₹25,000</option>
    <option value="50000">Up to ₹50,000</option>
    <option value="75000">Up to ₹75,000</option>
    <option value="100000">Up to ₹1,00,000</option>
  </select>

  {maxBudget !== "any" && (
    <button
      onClick={() => setMaxBudget("any")}
      className="text-sm font-medium text-indigo-600 hover:text-purple-700"
    >
      Clear budget
    </button>
  )}
</div>

{/* DURATION FILTER */}
<div className="flex flex-wrap items-center gap-2">
  <label
    htmlFor="duration-filter"
    className="text-sm font-semibold text-slate-600"
  >
    Duration
  </label>

  <select
    id="duration-filter"
    value={maxDuration}
    onChange={(event) => setMaxDuration(event.target.value)}
    className="rounded-xl border border-indigo-100 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-indigo-300"
  >
    <option value="any">Any duration</option>
    <option value="3">Up to 3 days</option>
    <option value="5">Up to 5 days</option>
    <option value="7">Up to 7 days</option>
    <option value="10">Up to 10 days</option>
  </select>

  {maxDuration !== "any" && (
    <button
      onClick={() => setMaxDuration("any")}
      className="text-sm font-medium text-indigo-600 hover:text-purple-700"
    >
      Clear duration
    </button>
  )}
</div>

{/* HOTEL CATEGORY FILTER */}
<div className="flex flex-wrap items-center gap-2">
  <label
    htmlFor="hotel-filter"
    className="text-sm font-semibold text-slate-600"
  >
    Hotel category
  </label>

  <select
    id="hotel-filter"
    value={hotelCategory}
    onChange={(event) => setHotelCategory(event.target.value)}
    className="rounded-xl border border-indigo-100 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-indigo-300"
  >
    <option value="any">Any category</option>
    <option value="3">3-star hotels</option>
    <option value="4">4-star hotels</option>
    <option value="5">5-star hotels</option>
  </select>

  {hotelCategory !== "any" && (
    <button
      onClick={() => setHotelCategory("any")}
      className="text-sm font-medium text-indigo-600 hover:text-purple-700"
    >
      Clear hotel
    </button>
  )}
</div>

{/* TRAVEL THEMES FILTER */}
<div className="flex flex-wrap items-center gap-2">
  <label
    htmlFor="theme-filter"
    className="text-sm font-semibold text-slate-600"
  >
    Travel themes
  </label>

  <select
    id="theme-filter"
    value={selectedTheme}
    onChange={(event) => setSelectedTheme(event.target.value)}
    className="rounded-xl border border-indigo-100 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-indigo-300"
  >
    <option value="any">All themes</option>
    <option value="Beach">Beach</option>
    <option value="Adventure">Adventure</option>
    <option value="Culture">Culture</option>
    <option value="Nature">Nature</option>
    <option value="Romantic">Romantic</option>
    <option value="Relaxation">Relaxation</option>
    <option value="Food">Food</option>
  </select>

  {selectedTheme !== "any" && (
    <button
      onClick={() => setSelectedTheme("any")}
      className="text-sm font-medium text-indigo-600 hover:text-purple-700"
    >
      Clear theme
    </button>
  )}
</div>
</div>

          {/* FILTERS */}
          <div className="mt-6 flex flex-wrap gap-2">
            {categories.map((item) => (
              <button
                key={item}
                onClick={() => setCategory(item)}
                className={`rounded-full px-5 py-2.5 text-sm font-medium transition ${
                  category === item
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/20"
                    : "border border-indigo-100 bg-white text-slate-600 hover:border-indigo-300 hover:text-indigo-700"
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
                className="group overflow-hidden rounded-[24px] border border-indigo-100/80 bg-white transition duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-950/5"
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
                    className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white text-indigo-700 transition hover:scale-110 hover:bg-indigo-50"
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
                  <p className="min-h-10 text-sm leading-5 text-slate-500">
                    {destination.description}
                  </p>
                  <div className="mt-4 flex items-center justify-between border-t border-indigo-50 pt-4">
                    <span className="flex items-center gap-1.5 text-xs text-slate-500">
                      <CalendarDays size={14} />
                      {destination.days}
                    </span>
                    <button
                      onClick={() => planDestination(destination.name)}
                      className="text-xs font-bold text-indigo-600 transition hover:text-purple-700"
                    >
                      Plan trip
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          {filteredDestinations.length === 0 && (
            <div className="mt-6 rounded-3xl border border-dashed border-indigo-200 bg-white p-10 text-center">
              <Compass className="mx-auto text-indigo-300" size={30} />
              <h3 className="mt-4 font-semibold">No matches just yet</h3>
              <p className="mt-2 text-sm text-slate-500">
                Try another search or choose a different category.
              </p>
              <button
                onClick={() => {
                  setSearch("");
                  setCategory("All Packages");
                }}
                className="mt-4 text-sm font-semibold text-indigo-600 transition hover:text-purple-700"
              >
                Clear filters
              </button>
            </div>
          )}
        </section>

        {/* MY JOURNEYS */}
        <section className="mt-14 grid gap-6 lg:mt-20 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="rounded-[26px] border border-indigo-100 bg-white p-7 sm:p-9">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">
                  Your travel journal
                </p>
                <h2 className="mt-2 text-2xl font-semibold">
                  My journeys
                </h2>
                <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                  Every great adventure begins with an idea. Your saved
                  trips will have a home here.
                </p>
              </div>
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                <Compass size={23} />
              </div>
            </div>

            <div className="mt-7 rounded-2xl border border-dashed border-indigo-200 bg-[#fafaff] px-5 py-8 text-center">
              <MapPin className="mx-auto text-indigo-400" size={25} />
              <h3 className="mt-3 font-semibold">
                Your story starts with a destination
              </h3>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
                Start planning your first trip. Once saved trips are
                connected, they can appear in this space.
              </p>
              <button
                onClick={() => router.push("/trips")}
                className="mt-5 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white px-5 py-2.5 text-sm font-semibold transition hover:border-indigo-300 hover:text-indigo-700"
              >
                View my trips <ArrowRight size={16} />
              </button>
            </div>
          </div>

          <div className="relative isolate overflow-hidden rounded-[26px] bg-gradient-to-br from-[#172554] via-[#312e81] to-[#581c87] p-7 text-white sm:p-9">
            <div
              className="absolute inset-0 -z-10 bg-cover bg-center opacity-20"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=80')",
              }}
            />
            <Sparkles size={24} className="text-indigo-200" />
            <h2 className="mt-5 text-2xl font-semibold leading-snug">
              Not sure where to go?
            </h2>
            <p className="mt-3 text-sm leading-7 text-white/75">
              Start with your interests, your budget and the feeling
              you want from your next adventure.
            </p>
            <button
              onClick={() => router.push("/plan")}
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-indigo-700 transition hover:bg-indigo-50"
            >
              Find my next adventure <ArrowRight size={16} />
            </button>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="mt-14 flex flex-col justify-between gap-3 border-t border-indigo-100 pt-6 text-xs text-slate-400 sm:flex-row sm:items-center">
          <span className="font-semibold tracking-wide">
            VoyageAI · Travel a little differently.
          </span>
          <span>Made for the journeys you haven't taken yet.</span>
        </footer>
      </div>
    </main>
  );
}