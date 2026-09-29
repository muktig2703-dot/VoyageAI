"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Compass,
  Globe2,
  LogOut,
  Map,
  Sparkles,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

export default function DashboardPage() {
  const router = useRouter();

  const {
    user,
    loading,
    logout,
  } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f9ff]">
        <div className="flex items-center gap-3 text-slate-500">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-indigo-600" />
          Loading your journey...
        </div>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  return (
    <main className="min-h-screen bg-[#f7f9ff] text-slate-900">

      {/* NAVBAR */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
              <Globe2 size={21} />
            </div>

            <span className="text-xl font-bold tracking-tight">
              VoyageAI
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <LogOut size={17} />
            Log out
          </button>
        </div>
      </header>

      {/* CONTENT */}
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">

        {/* GREETING */}
        <motion.section
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 p-8 text-white shadow-xl shadow-indigo-500/10 lg:p-12"
        >
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

          <div className="relative z-10 max-w-2xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-white/80">
              <Sparkles size={15} />
              Your AI travel team is ready
            </div>

            <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
              Welcome back,{" "}
              <span className="text-indigo-200">
                {user.name}
              </span>
              .
            </h1>

            <p className="mt-5 max-w-xl text-lg leading-8 text-white/70">
              Where would you like to go next? Tell VoyageAI
              what you want and we'll help turn it into a
              personalized journey.
            </p>

            <button
              onClick={() => router.push("/plan")}
              className="mt-8 flex items-center gap-2 rounded-2xl bg-white px-6 py-3.5 font-semibold text-indigo-700 shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
            >
              Start planning
              <ArrowRight size={18} />
            </button>
          </div>
        </motion.section>

        {/* QUICK ACTIONS */}
        <section className="mt-10">
          <h2 className="text-xl font-bold">
            What do you want to do?
          </h2>

          <div className="mt-5 grid gap-5 md:grid-cols-3">

            {/* PLAN */}
            <motion.button
              whileHover={{ y: -4 }}
              onClick={() => router.push("/plan")}
              className="group rounded-3xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:shadow-lg"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                <Compass size={23} />
              </div>

              <h3 className="mt-5 text-lg font-bold">
                Plan a new trip
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Tell your AI travel team where you want to
                go and what kind of experience you're after.
              </p>

              <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-indigo-600">
                Start planning
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />
              </div>
            </motion.button>

            {/* TRIPS */}
            <motion.button
              whileHover={{ y: -4 }}
              onClick={() => router.push("/trips")}
              className="group rounded-3xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:shadow-lg"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
                <Map size={23} />
              </div>

              <h3 className="mt-5 text-lg font-bold">
                My trips
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                View your saved journeys, itineraries and
                travel plans.
              </p>

              <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-purple-600">
                View trips
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />
              </div>
            </motion.button>

            {/* EXPLORE */}
            <motion.button
              whileHover={{ y: -4 }}
              className="group rounded-3xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:shadow-lg"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-600">
                <Globe2 size={23} />
              </div>

              <h3 className="mt-5 text-lg font-bold">
                Explore destinations
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Discover destinations and get inspiration
                for your next adventure.
              </p>

              <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-sky-600">
                Explore
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />
              </div>
            </motion.button>

          </div>
        </section>

        {/* EMPTY TRIPS STATE */}
        <section className="mt-10 rounded-3xl border border-dashed border-slate-300 bg-white/60 p-10 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
            <Map size={25} />
          </div>

          <h2 className="mt-5 text-xl font-bold">
            Your journeys will appear here
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            Once you create your first trip, your personalized
            itineraries will show up here.
          </p>

          <button
            onClick={() => router.push("/plan")}
            className="mt-6 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Create your first trip
          </button>
        </section>

      </div>
    </main>
  );
}