"use client";

import { motion } from "framer-motion";
import {
  MapPinned,
  Bot,
  Sparkles,
  ShieldCheck,
  Plane,
} from "lucide-react";

const steps = [
  {
    id: "01",
    title: "Tell us your trip",
    description:
      "Enter your destination, dates, budget, and travel interests.",
    icon: MapPinned,
    color: "from-cyan-400 to-blue-500",
  },
  {
    id: "02",
    title: "AI Agents split the work",
    description:
      "Destination, weather, transport, food, and budget agents work together.",
    icon: Bot,
    color: "from-blue-500 to-indigo-500",
  },
  {
    id: "03",
    title: "Everything gets optimized",
    description:
      "Routes, spending, and recommendations are intelligently refined.",
    icon: Sparkles,
    color: "from-indigo-500 to-purple-500",
  },
  {
    id: "04",
    title: "Critic Agent validates",
    description:
      "The itinerary is checked for conflicts, unrealistic timing, and budget issues.",
    icon: ShieldCheck,
    color: "from-purple-500 to-pink-500",
  },
  {
    id: "05",
    title: "Your trip is ready",
    description:
      "Receive a polished, personalized itinerary grounded with live travel data.",
    icon: Plane,
    color: "from-pink-500 to-orange-400",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative overflow-hidden bg-white py-28">
      {/* Soft background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-10 top-20 h-64 w-64 rounded-full bg-cyan-100 blur-3xl" />
        <div className="absolute right-10 bottom-20 h-64 w-64 rounded-full bg-purple-100 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center"
        >
          <p className="mb-3 font-semibold uppercase tracking-[0.35em] text-cyan-500">
            How It Works
          </p>

          <h2 className="text-4xl font-black text-slate-900 md:text-5xl">
            Five Intelligent Agents.
            <br />
            One Perfect Trip.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-600">
            Instead of relying on a single chatbot, VoyageAI lets specialized AI
            agents collaborate, optimize, and validate every part of your journey.
          </p>
        </motion.div>

        {/* Desktop Timeline */}
        <div className="relative mt-20 hidden lg:block">
          {/* Animated path */}
          <svg
            className="absolute left-0 top-24 h-24 w-full"
            viewBox="0 0 1200 120"
            fill="none"
          >
            <motion.path
              d="M80 60 C250 10, 450 110, 620 60 C790 10, 980 110, 1120 60"
              stroke="url(#gradient)"
              strokeWidth="4"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 2 }}
            />

            <defs>
              <linearGradient id="gradient">
                <stop offset="0%" stopColor="#22d3ee" />
                <stop offset="50%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
            </defs>
          </svg>

          <div className="grid grid-cols-5 gap-6">
            {steps.map((step, index) => {
              const Icon = step.icon;

              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 }}
                  whileHover={{ y: -10 }}
                  className="relative z-10 rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-lg backdrop-blur-md"
                >
                  <div
                    className={`inline-flex rounded-2xl bg-gradient-to-br ${step.color} p-4 shadow-lg`}
                  >
                    <Icon className="text-white" size={28} />
                  </div>

                  <p className="mt-5 text-sm font-bold tracking-widest text-cyan-500">
                    STEP {step.id}
                  </p>

                  <h3 className="mt-2 text-xl font-bold text-slate-900">
                    {step.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {step.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Mobile Timeline */}
        <div className="relative mt-16 lg:hidden">
          <div className="absolute left-6 top-0 h-full w-[3px] rounded-full bg-gradient-to-b from-cyan-400 via-blue-500 to-purple-500" />

          <div className="space-y-10">
            {steps.map((step, index) => {
              const Icon = step.icon;

              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="relative pl-16"
                >
                  <div
                    className={`absolute left-0 top-0 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br ${step.color} shadow-lg`}
                  >
                    <Icon className="text-white" size={22} />
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-md">
                    <p className="text-xs font-bold tracking-widest text-cyan-500">
                      STEP {step.id}
                    </p>

                    <h3 className="mt-2 text-lg font-bold text-slate-900">
                      {step.title}
                    </h3>

                    <p className="mt-2 text-slate-600">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA strip */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-20 rounded-3xl border border-slate-200 bg-gradient-to-r from-cyan-50 via-white to-purple-50 p-8 text-center shadow-lg"
        >
          <div className="mx-auto flex w-fit items-center gap-3 rounded-full bg-white px-5 py-2 shadow-md">
            <Plane className="text-cyan-500" size={20} />
            <span className="font-semibold text-slate-700">
              From idea to itinerary in minutes
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}