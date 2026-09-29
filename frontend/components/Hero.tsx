"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  Bot,
  CloudSun,
  MapPinned,
  ShieldCheck,
  Plane,
} from "lucide-react";

export default function Hero() {
  return (
    <section id="home" className="relative min-h-screen overflow-hidden pt-40">
      {/* Background */}
      <div className="absolute inset-0">
        <Image
          src="/hero-bg.jpg"
          alt="Santorini"
          fill
          priority
          className="object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/65 to-slate-900/40" />
      </div>

      {/* Dotted Flight Path */}
<svg
  className="absolute inset-0 z-0 pointer-events-none"
  viewBox="0 0 1200 800"
  preserveAspectRatio="none"
>
  <path
    d="M620 220 C760 120 930 120 1085 255"
    stroke="white"
    strokeWidth="3"
    strokeDasharray="8 10"
    strokeLinecap="round"
    fill="none"
    opacity="0.85"
  />
</svg>

{/* Animated Plane */}
<motion.div
  animate={{
    x: [0, 30, 0],
    y: [0, -12, 0],
    rotate: [8, 12, 8],
  }}
  transition={{
    repeat: Infinity,
    duration: 8,
    ease: "easeInOut",
  }}
  className="absolute right-[72px] top-[235px] z-20 text-white"
>
  <Plane size={44} />
</motion.div>

      {/* Main Content */}
      <div className="relative z-10 mx-auto grid min-h-screen max-w-7xl items-center gap-12 px-6 py-16 lg:grid-cols-2">
        {/* LEFT */}
        <motion.div
          initial={{ opacity: 0, x: -35 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 shadow-2xl">
              <Plane size={36} className="rotate-45 text-white" />
            </div>

            <h1 className="text-5xl font-black text-slate-900 md:text-7xl">
              Voyage
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AI
              </span>
            </h1>
          </div>

          <p className="mt-5 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-lg font-semibold text-transparent md:text-2xl">
            AI-POWERED. PERSONALLY YOURS.
          </p>

          <div className="mt-10">
            <h2 className="text-4xl font-bold leading-tight text-slate-900 md:text-5xl">
              Your AI Travel Team
            </h2>

            <h2 className="mt-2 text-4xl font-bold leading-tight md:text-5xl">
              <span className="text-blue-600">Plans.</span>{" "}
              <span className="text-cyan-500">Optimizes.</span>{" "}
              <span className="text-purple-600">Perfects.</span>
            </h2>
          </div>

          <div className="mt-8 h-1 w-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-600" />

          <div className="mt-10 grid grid-cols-2 gap-6 text-slate-800">
            <Feature icon={Bot} text="Multi-Agent Planning" />
            <Feature icon={CloudSun} text="Real-Time Insights" />
            <Feature icon={MapPinned} text="Smart Itinerary" />
            <Feature icon={ShieldCheck} text="Budget Optimizer" />
          </div>

          <motion.button id="start-planning"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="mt-10 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 font-semibold text-white shadow-2xl"
          >
            Start Planning →
          </motion.button>
        </motion.div>

        {/* RIGHT */}
        <motion.div
          initial={{ opacity: 0, x: 35 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="relative flex justify-center"
        >
          {/* Phone */}
          <div className="relative h-[640px] w-[320px] overflow-hidden rounded-[40px] border border-white/20 bg-slate-950 shadow-[0_0_70px_rgba(59,130,246,.25)]">
            <div className="absolute left-1/2 top-0 h-6 w-32 -translate-x-1/2 rounded-b-2xl bg-black" />

            <div className="p-6 text-white">
              <p className="text-sm text-gray-400">Your Trip to</p>

              <h3 className="mt-1 text-3xl font-bold">Bali ✨</h3>

              <p className="mt-2 text-sm text-gray-400">
                12–18 Oct • 6 Days • ₹60,000
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {["Beach", "Adventure", "Culture"].map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-8 space-y-4">
                <TimelineCard
                  day="Day 1"
                  title="Arrival & Relax"
                  image="/bali1.avif"
                />

                <TimelineCard
                  day="Day 2"
                  title="Explore Ubud"
                  image="/bali2.jpg"
                />

                <TimelineCard
                  day="Day 3"
                  title="Adventure Day"
                  image="/bali3.webp"
                />
              </div>
            </div>
          </div>

          {/* Budget */}
          <FloatingCard className="-right-10 top-20">
            <h3 className="text-sm font-semibold text-white">Budget Overview</h3>

            <div className="mt-3 flex justify-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-full border-[10px] border-purple-500">
                <span className="text-sm font-bold text-white">₹59K</span>
              </div>
            </div>

            <p className="mt-2 text-center text-xs text-gray-300">
              of ₹60,000
            </p>
          </FloatingCard>

          {/* Weather */}
          <FloatingCard className="-right-12 top-[340px]">
            <h3 className="text-sm font-semibold text-white">Weather</h3>

            <div className="mt-3 flex items-center gap-3">
              <CloudSun className="text-yellow-400" size={28} />

              <div>
                <p className="font-bold text-white">28°C</p>
                <p className="text-xs text-gray-300">Partly Cloudy</p>
              </div>
            </div>
          </FloatingCard>

          {/* AI Team */}
          <FloatingCard className="-right-16 bottom-8">
            <h3 className="text-sm font-semibold text-white">AI Team</h3>

            <div className="mt-3 flex gap-3">
              <Bot className="text-cyan-400" />
              <CloudSun className="text-purple-400" />
              <MapPinned className="text-pink-400" />
            </div>
          </FloatingCard>
        </motion.div>
      </div>
    </section>
  );
}

type FeatureProps = {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  text: string;
};

function Feature({ icon: Icon, text }: FeatureProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/70 shadow-lg backdrop-blur-md">
        <Icon size={22} className="text-purple-600" />
      </div>

      <span className="font-medium">{text}</span>
    </div>
  );
}

type TimelineCardProps = {
  day: string;
  title: string;
  image: string;
};

function TimelineCard({ day, title, image }: TimelineCardProps) {
  return (
    <div className="flex gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
      <Image
        src={image}
        alt={title}
        width={70}
        height={70}
        className="rounded-xl object-cover"
      />

      <div>
        <p className="text-xs text-blue-400">{day}</p>
        <p className="font-semibold text-white">{title}</p>
      </div>
    </div>
  );
}

type FloatingCardProps = {
  children: React.ReactNode;
  className?: string;
};

function FloatingCard({ children, className = "" }: FloatingCardProps) {
  return (
    <motion.div
      animate={{ y: [0, -8, 0] }}
      transition={{ repeat: Infinity, duration: 5 }}
      className={`absolute w-44 rounded-2xl border border-white/10 bg-slate-900/80 p-4 backdrop-blur-xl ${className}`}
    >
      {children}
    </motion.div>
  );
}