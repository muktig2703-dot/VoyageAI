"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Plane } from "lucide-react";

export default function FinalCTA() {
  return (
    <section id="cta" className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white py-28">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute left-20 top-20 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute bottom-10 right-20 h-72 w-72 rounded-full bg-purple-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-[40px] border border-slate-200 bg-white/80 p-12 text-center shadow-2xl backdrop-blur-xl md:p-20"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700">
            <Sparkles size={16} />
            Powered by Multi-Agent AI
          </div>

          {/* Heading */}
          <h2 className="mt-8 text-4xl font-bold text-slate-900 md:text-6xl">
            Stop Planning.
            <br />
            Start Exploring.
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600">
            Let Voyage AI coordinate destination research, budgeting,
            restaurants, transportation, weather insights, and itinerary
            optimization — all in one place.
          </p>

          {/* Buttons */}
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 font-semibold text-white shadow-xl"
            >
              Start Planning
              <ArrowRight size={18} />
            </motion.button>

            <button className="rounded-2xl border border-slate-300 px-8 py-4 font-semibold text-slate-700 transition hover:bg-slate-100">
              Explore Demo
            </button>
          </div>

          {/* Stats */}
          <div className="mt-16 grid gap-8 md:grid-cols-3">
            <div>
              <h3 className="text-3xl font-bold text-blue-600">5+</h3>
              <p className="mt-2 text-slate-600">
                Specialized AI Agents
              </p>
            </div>

            <div>
              <h3 className="text-3xl font-bold text-purple-600">Real-Time</h3>
              <p className="mt-2 text-slate-600">
                Travel Intelligence
              </p>
            </div>

            <div>
              <h3 className="text-3xl font-bold text-cyan-600">One Click</h3>
              <p className="mt-2 text-slate-600">
                Personalized Itinerary
              </p>
            </div>
          </div>

          {/* Floating Plane */}
          <motion.div
            animate={{
              x: [0, 20, 0],
              y: [0, -10, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 6,
            }}
            className="mt-12 flex justify-center"
          >
            <Plane
              size={42}
              className="rotate-45 text-blue-500"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}