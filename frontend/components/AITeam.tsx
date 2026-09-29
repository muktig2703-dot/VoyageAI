"use client";

import { motion } from "framer-motion";
import {
  Globe,
  CloudSun,
  Utensils,
  Wallet,
  Route,
  ShieldCheck,
} from "lucide-react";

const agents = [
  {
    name: "Destination Agent",
    icon: Globe,
    color: "from-cyan-400 to-blue-500",
    description:
      "Discovers destinations, attractions, seasonal highlights, and hidden gems tailored to your interests.",
  },
  {
    name: "Weather Agent",
    icon: CloudSun,
    color: "from-blue-500 to-indigo-500",
    description:
      "Checks live forecasts so your itinerary adapts to real weather conditions.",
  },
  {
    name: "Food Agent",
    icon: Utensils,
    color: "from-indigo-500 to-purple-500",
    description:
      "Finds authentic local restaurants, cafés, and must-try food experiences.",
  },
  {
    name: "Budget Agent",
    icon: Wallet,
    color: "from-purple-500 to-pink-500",
    description:
      "Optimizes spending across hotels, transport, food, and activities.",
  },
  {
    name: "Transport Agent",
    icon: Route,
    color: "from-pink-500 to-orange-400",
    description:
      "Plans efficient routes, travel times, and transportation options.",
  },
  {
    name: "Critic Agent",
    icon: ShieldCheck,
    color: "from-emerald-400 to-cyan-500",
    description:
      "Reviews the entire itinerary for conflicts, unrealistic timings, and budget issues before approval.",
  },
];

export default function AITeam() {
  return (
    <section id="ai-team" className="relative overflow-hidden bg-[#050816] py-28">
      {/* Background Glows */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-[-80px] top-20 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute right-[-60px] bottom-10 h-80 w-80 rounded-full bg-purple-500/10 blur-3xl" />
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
            Meet Your AI Team
          </p>

          <h2 className="text-4xl font-black text-white md:text-5xl">
            Six Specialists.
            <br />
            One Mission.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg text-gray-400">
            Every journey is powered by specialized AI agents that collaborate,
            communicate, and validate every decision before your itinerary is ready.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="mt-20 grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
          {agents.map((agent, index) => {
            const Icon = agent.icon;

            return (
              <motion.div
                key={agent.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                whileHover={{
                  y: -10,
                  scale: 1.02,
                }}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-7 backdrop-blur-xl"
              >
                {/* Glow on hover */}
                <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5" />
                </div>

                {/* Icon */}
                <div
                  className={`inline-flex rounded-2xl bg-gradient-to-br ${agent.color} p-4 shadow-lg`}
                >
                  <Icon size={30} className="text-white" />
                </div>

                {/* Title */}
                <h3 className="mt-6 text-2xl font-bold text-white">
                  {agent.name}
                </h3>

                {/* Description */}
                <p className="mt-4 leading-7 text-gray-400">
                  {agent.description}
                </p>

                {/* Bottom line */}
                <div className="mt-8 h-1 w-0 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 transition-all duration-500 group-hover:w-full" />
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Highlight */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-20 rounded-3xl border border-cyan-500/20 bg-gradient-to-r from-cyan-500/10 via-transparent to-purple-500/10 p-8 text-center backdrop-blur-xl"
        >
          <h3 className="text-2xl font-bold text-white">
            Collaboration is the Superpower
          </h3>

          <p className="mx-auto mt-3 max-w-3xl text-gray-400">
            Unlike a single chatbot, VoyageAI lets multiple intelligent agents
            work together simultaneously, combining research, optimization, and
            validation into one seamless travel planning experience.
          </p>
        </motion.div>
      </div>
    </section>
  );
}