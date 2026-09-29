"use client";

import { motion } from "framer-motion";
import { Quote, Sparkles } from "lucide-react";

const testimonials = [
  {
    quote:
      "It felt like having a travel planner, budget expert, and local guide working together.",
    tag: "Multi-Agent Planning",
  },
  {
    quote:
      "Watching each AI agent complete its task made the whole planning process feel transparent and trustworthy.",
    tag: "Live Progress",
  },
  {
    quote:
      "The itinerary adapted instantly to different travel styles without feeling generic.",
    tag: "Personalization",
  },
  {
    quote:
      "Instead of opening ten different tabs, everything came together in one seamless experience.",
    tag: "One Place, Everything",
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="relative overflow-hidden bg-[#050816] py-24">
      {/* Background Glow */}
      <div className="absolute inset-0">
        <div className="absolute left-1/4 top-16 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute bottom-10 right-1/4 h-72 w-72 rounded-full bg-purple-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-blue-300 backdrop-blur-md">
            <Sparkles size={16} />
            Sample Experiences
          </div>

          <h2 className="mt-6 text-4xl font-bold text-white md:text-5xl">
            What Using Voyage AI Feels Like
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-400">
            These sample experiences illustrate the kind of planning experience
            Voyage AI is designed to deliver.
          </p>
        </motion.div>

        {/* Testimonial Cards */}
        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {testimonials.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.12 }}
              whileHover={{ y: -6, scale: 1.02 }}
              className="group rounded-3xl border border-white/10 bg-white/5 p-7 backdrop-blur-xl transition-all duration-300 hover:border-blue-400/40 hover:shadow-[0_0_35px_rgba(59,130,246,.18)]"
            >
              <div className="flex items-center justify-between">
                <Quote className="text-blue-400" size={28} />

                <span className="rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1 text-xs text-blue-300">
                  Sample Experience
                </span>
              </div>

              <p className="mt-6 text-lg leading-relaxed text-slate-200">
                “{item.quote}”
              </p>

              <div className="mt-8 h-px bg-gradient-to-r from-blue-500/40 to-transparent" />

              <p className="mt-4 text-sm font-medium text-slate-400">
                {item.tag}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Bottom Highlight */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mx-auto mt-16 max-w-3xl rounded-3xl border border-blue-500/20 bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-8 text-center backdrop-blur-xl"
        >
          <h3 className="text-2xl font-bold text-white">
            Designed to Feel Like a Team, Not Just a Chatbot
          </h3>

          <p className="mt-3 text-slate-300">
            Every recommendation is intended to combine destination research,
            budgeting, food discovery, transportation planning, and itinerary
            validation into one coordinated travel experience.
          </p>
        </motion.div>
      </div>
    </section>
  );
}