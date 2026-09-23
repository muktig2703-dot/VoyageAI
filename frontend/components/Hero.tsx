"use client";

import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="text-center py-20">
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-6xl font-bold"
      >
        VoyageAI ✈️
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-6 text-gray-400 max-w-xl mx-auto"
      >
        Multi-agent AI travel planner powered by real-time weather,
        maps, restaurants, budgeting and itinerary optimization.
      </motion.p>
    </section>
  );
}