"use client";

import { motion } from "framer-motion";
import { Bot, Globe, Sparkles, ShieldCheck } from "lucide-react";

const stats = [
  {
    value: "7",
    label: "AI Agents",
    icon: Bot,
    color: "from-cyan-400 to-blue-500",
  },
  {
    value: "50+",
    label: "Travel APIs",
    icon: Globe,
    color: "from-blue-500 to-indigo-500",
  },
  {
    value: "24/7",
    label: "Planning",
    icon: Sparkles,
    color: "from-purple-500 to-pink-500",
  },
  {
    value: "100%",
    label: "Validation",
    icon: ShieldCheck,
    color: "from-green-400 to-emerald-500",
  },
];

const technologies = [
  "Google Maps",
  "OpenWeather",
  "LangGraph",
  "FastAPI",
  "PostgreSQL",
  "Gemini AI",
];

export default function TrustedBy() {
  return (
    <section id="trusted-by" className="relative overflow-hidden bg-[#050816] py-24">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-20 top-10 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute bottom-10 right-20 h-72 w-72 rounded-full bg-purple-500/10 blur-3xl" />
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
          <p className="mb-3 font-semibold uppercase tracking-[0.35em] text-cyan-400">
            Trusted by Innovation
          </p>

          <h2 className="text-4xl font-black text-white md:text-5xl">
            Built with Modern AI Technologies
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg text-gray-400">
            VoyageAI combines multiple intelligent agents with real-world travel
            data to create smarter, personalized travel experiences.
          </p>
        </motion.div>

        {/* Stats */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;

            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group rounded-3xl border border-white/10 bg-white/5 p-7 backdrop-blur-xl"
              >
                <div
                  className={`inline-flex rounded-2xl bg-gradient-to-br ${stat.color} p-4 shadow-lg`}
                >
                  <Icon className="text-white" size={28} />
                </div>

                <h3 className="mt-6 text-4xl font-black text-white">
                  {stat.value}
                </h3>

                <p className="mt-2 text-gray-400">{stat.label}</p>

                <div className="mt-5 h-1 w-0 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 transition-all duration-500 group-hover:w-full" />
              </motion.div>
            );
          })}
        </div>

        {/* Tech Pills */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-16 flex flex-wrap justify-center gap-3"
        >
          {technologies.map((tech) => (
            <motion.span
              key={tech}
              whileHover={{ scale: 1.08 }}
              className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-gray-300 backdrop-blur-md"
            >
              {tech}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}