"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPinned, Utensils, Waves, Mountain, Crown } from "lucide-react";

type Mode = "Beach" | "Adventure" | "Food" | "Luxury";

const data: Record<
  Mode,
  {
    emoji: string;
    title: string;
    subtitle: string;
    days: string[];
    icon: any;
    color: string;
  }
> = {
  Beach: {
    emoji: "🏖️",
    title: "Goa Escape",
    subtitle: "Relax by the ocean",
    icon: Waves,
    color: "from-cyan-500 to-blue-500",
    days: [
      "Beach brunch at Calangute",
      "Sunset at Vagator",
      "Night at Purple Martini",
    ],
  },
  Adventure: {
    emoji: "🏔️",
    title: "Bali Adventure",
    subtitle: "Thrill meets nature",
    icon: Mountain,
    color: "from-green-500 to-emerald-600",
    days: [
      "ATV through rice fields",
      "Waterfall trekking",
      "Volcano sunrise hike",
    ],
  },
  Food: {
    emoji: "🍜",
    title: "Tokyo Food Tour",
    subtitle: "Taste the city",
    icon: Utensils,
    color: "from-orange-500 to-red-500",
    days: [
      "Sushi breakfast",
      "Ramen crawl",
      "Street food at Shibuya",
    ],
  },
  Luxury: {
    emoji: "✨",
    title: "Dubai Luxury",
    subtitle: "Premium experiences",
    icon: Crown,
    color: "from-purple-500 to-pink-500",
    days: [
      "Burj Khalifa lounge",
      "Private yacht cruise",
      "Desert dinner experience",
    ],
  },
};

export default function InteractivePreview() {
  const [selected, setSelected] = useState<Mode>("Beach");

  const trip = data[selected];
  const Icon = trip.icon;

  return (
    <section id="preview" className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-600">
            Interactive Preview
          </p>

          <h2 className="mt-4 text-4xl font-bold text-slate-900 md:text-5xl">
            See Your Trip Change Instantly
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-600">
            Tap a travel style and watch Voyage AI instantly reshape your
            itinerary—just like a real AI travel planner.
          </p>
        </motion.div>

        {/* Chips */}
        <div className="mt-12 flex flex-wrap justify-center gap-4">
          {(Object.keys(data) as Mode[]).map((item) => (
            <button
              key={item}
              onClick={() => setSelected(item)}
              className={`rounded-full px-6 py-3 font-medium transition-all duration-300 ${
                selected === item
                  ? `bg-gradient-to-r ${data[item].color} text-white shadow-lg scale-105`
                  : "border border-slate-300 bg-white text-slate-700 hover:border-blue-400 hover:text-blue-600"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {/* Preview */}
        <div className="mt-16 flex justify-center">
          <motion.div
            layout
            className="w-full max-w-md rounded-[36px] border border-slate-200 bg-white p-6 shadow-[0_25px_80px_rgba(15,23,42,.12)]"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={selected}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.35 }}
              >
                <div
                  className={`inline-flex rounded-full bg-gradient-to-r ${trip.color} p-3 text-white`}
                >
                  <Icon size={22} />
                </div>

                <h3 className="mt-5 text-3xl font-bold text-slate-900">
                  {trip.emoji} {trip.title}
                </h3>

                <p className="mt-2 text-slate-500">{trip.subtitle}</p>

                <div className="mt-8 space-y-4">
                  {trip.days.map((day, index) => (
                    <motion.div
                      key={day}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.12 }}
                      className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4"
                    >
                      <MapPinned className="text-blue-500" size={18} />
                      <span className="text-slate-700">{day}</span>
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  layout
                  className={`mt-8 rounded-2xl bg-gradient-to-r ${trip.color} p-4 text-white`}
                >
                  <p className="text-sm opacity-90">AI Confidence</p>

                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-2xl font-bold">98%</span>
                    <span className="text-sm">Optimized ✨</span>
                  </div>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}