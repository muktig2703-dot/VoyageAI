
"use client";
import {
  getSavedPackages,
  toggleSavedPackage,
  getBookmarkedPackages,
  toggleBookmarkedPackage,
  type SavedPackage,
} from "../../lib/savedPackages";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Compass, Heart, Bookmark, Sparkles } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import SupportWidget from "../../components/SupportWidget";
export default function MyJourneysPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [savedPackages, setSavedPackages] = useState<SavedPackage[]>([]);
  const [bookmarkedPackages, setBookmarkedPackages] = useState<SavedPackage[]>([]);
  const [activeTab, setActiveTab] = useState<"favourites" | "saved">("favourites");
  const displayedPackages =
  activeTab === "favourites" ? savedPackages : bookmarkedPackages;

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  useEffect(() => {
  if (!loading && user) {
    const userKey = user.email || user.name;

    setSavedPackages(getSavedPackages(userKey));
    setBookmarkedPackages(getBookmarkedPackages(userKey));
  }
}, [loading, user]);

  if (loading || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f9ff]">
        <p className="font-medium text-indigo-700">
          Preparing your journeys...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f9ff] px-4 py-6 text-slate-900 sm:px-8 sm:py-10">
      <div className="mx-auto max-w-6xl">
        <nav className="mb-10 flex items-center justify-between">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-indigo-50"
          >
            <ArrowLeft size={17} />
            Dashboard
          </button>

          <div className="flex items-center gap-2 font-bold text-indigo-950">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white">
              <Compass size={21} />
            </span>
            VoyageAI
          </div>
        </nav>

        <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#1e1b4b] via-[#4338ca] to-[#7e22ce] px-6 py-10 text-white sm:px-10 sm:py-14">
          <div className="relative z-10 max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-2 text-xs font-semibold">
              <Sparkles size={14} />
              YOUR TRAVEL COLLECTION
            </span>

            <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl">
              My Journeys
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-7 text-indigo-100 sm:text-base">
              Keep your favourite destinations close. Save packages you love
              and come back whenever you are ready for your next adventure.
            </p>
          </div>

          <Heart
            size={150}
            strokeWidth={0.8}
            className="absolute -bottom-8 -right-5 rotate-12 text-white/10 sm:right-8"
          />
        </section>

        <section className="mt-8">
          
<div className="flex flex-wrap gap-3">
  <button
    onClick={() => setActiveTab("favourites")}
    className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold shadow-sm transition ${
      activeTab === "favourites"
        ? "border-indigo-200 bg-white text-indigo-800"
        : "border-indigo-100 bg-white/60 text-slate-500 hover:bg-white"
    }`}
  >
    <Heart size={18} />
    Favourites
    <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs">
      {savedPackages.length}
    </span>
  </button>

  <button
    onClick={() => setActiveTab("saved")}
    className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold shadow-sm transition ${
      activeTab === "saved"
        ? "border-indigo-200 bg-white text-indigo-800"
        : "border-indigo-100 bg-white/60 text-slate-500 hover:bg-white"
    }`}
  >
    <Bookmark size={18} />
    Saved packages
    <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs">
      {bookmarkedPackages.length}
    </span>
  </button>
</div>

          
{displayedPackages.length === 0 ? (
  <div className="mt-6 rounded-3xl border border-indigo-100 bg-white px-6 py-12 text-center shadow-sm sm:px-10 sm:py-16">
    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-700">
      <Heart size={30} />
    </div>

    <h2 className="mt-5 text-xl font-bold text-slate-900 sm:text-2xl">
      Your next favourite is waiting
    </h2>

    <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
      Browse our destinations and save the packages that catch your eye.
      They will have a home here.
    </p>

    <button
      onClick={() => router.push("/dashboard")}
      className="mt-6 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5"
    >
      Explore packages
    </button>
  </div>
) : (
  <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
    {displayedPackages.map((destination) => (
      <article
        key={destination.name}
        className="overflow-hidden rounded-3xl border border-indigo-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
      >
        <div className="relative h-52">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('${destination.image}')`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

          <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-indigo-700">
            {destination.category}
          </span>

          
<button
  onClick={() => {
    const userKey = user.email || user.name;

    if (activeTab === "favourites") {
      const updated = toggleSavedPackage(userKey, destination);
      setSavedPackages(updated);
    } else {
      const updated = toggleBookmarkedPackage(userKey, destination);
      setBookmarkedPackages(updated);
    }
  }}
  aria-label={`Remove ${destination.name} from ${
    activeTab === "favourites" ? "favourites" : "saved packages"
  }`}
  title={
    activeTab === "favourites"
      ? "Remove from favourites"
      : "Remove from saved packages"
  }
  className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white text-purple-600 shadow-sm transition hover:scale-110"
>
  {activeTab === "favourites" ? (
    <Heart size={19} fill="currentColor" />
  ) : (
    <Bookmark size={19} fill="currentColor" />
  )}
</button>

          <div className="absolute bottom-4 left-4 text-white">
            <h2 className="text-xl font-bold">{destination.name}</h2>
            <p className="text-sm text-white/85">{destination.country}</p>
          </div>
        </div>

        <div className="p-5">
          <p className="line-clamp-2 text-sm leading-6 text-slate-600">
            {destination.description}
          </p>

          <div className="mt-4 flex items-end justify-between gap-3">
            <div>
              <p className="text-xs text-slate-500">Starting from</p>
              <p className="text-lg font-bold text-indigo-700">
                ₹{destination.price.toLocaleString("en-IN")}
              </p>
            </div>
            <span className="text-xs text-slate-500">
              {destination.days}
            </span>
          </div>

          
<button
  onClick={() => {
    if (activeTab === "favourites") {
      router.push("/dashboard");
    } else {
      router.push(
        `/plan?destination=${encodeURIComponent(destination.name)}`
      );
    }
  }}
  className={`mt-4 w-full rounded-xl py-2.5 text-sm font-semibold transition ${
    activeTab === "favourites"
      ? "border border-indigo-200 text-indigo-700 hover:bg-indigo-50"
      : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:opacity-90"
  }`}
>
  {activeTab === "favourites"
    ? "Explore destination"
    : "Plan this trip"}
</button>
        </div>
      </article>
    ))}
  </div>
)}
        </section>

        <footer className="mt-12 border-t border-indigo-100 py-6 text-center text-xs text-slate-400">
          Made for the way you travel. ✨
        </footer>
      </div>
      <SupportWidget />
    </main>
  );
}