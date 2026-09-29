"use client";

import {
  Plane,
  GitBranch,
  Link,
  Mail,
  ArrowUpRight,
} from "lucide-react";
import { motion } from "framer-motion";
export default function Footer() {
  return (
    <footer id="footer" className="relative overflow-hidden bg-[#030712] text-white">
      {/* Top Glow */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent" />

      {/* Background Blurs */}
      <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
      <div className="absolute -right-20 bottom-10 h-72 w-72 rounded-full bg-purple-500/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6 py-16">
        {/* Main Grid */}
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3">
              <motion.div
                animate={{
                  rotate: [45, 50, 45],
                  y: [0, -3, 0],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 5,
                }}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 shadow-[0_0_30px_rgba(59,130,246,.35)]"
              >
                <Plane size={22} className="rotate-45" />
              </motion.div>

              <h3 className="text-2xl font-black">
                Voyage
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  AI
                </span>
              </h3>
            </div>

            <p className="mt-5 text-sm leading-7 text-slate-400">
              Your multi-agent AI travel planner that researches, optimizes,
              validates, and builds personalized itineraries in one seamless
              experience.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-lg font-semibold">Product</h4>

            <ul className="mt-5 space-y-3 text-slate-400">
              {[
                "How it Works",
                "AI Agents",
                "Interactive Preview",
                "Trip Planner",
              ].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="group flex items-center gap-2 transition hover:text-white"
                  >
                    {item}
                    <ArrowUpRight
                      size={14}
                      className="opacity-0 transition group-hover:opacity-100"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-lg font-semibold">Resources</h4>

            <ul className="mt-5 space-y-3 text-slate-400">
              {[
                "Documentation",
                "GitHub",
                "Roadmap",
                "FAQs",
              ].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="group flex items-center gap-2 transition hover:text-white"
                  >
                    {item}
                    <ArrowUpRight
                      size={14}
                      className="opacity-0 transition group-hover:opacity-100"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-lg font-semibold">Connect</h4>

            <p className="mt-5 text-sm text-slate-400">
              Follow the journey as VoyageAI grows from a student project into
              a real AI travel platform.
            </p>

            <div className="mt-6 flex gap-3">
              {[
  { icon: GitBranch, label: "GitHub" },
  { icon: Link, label: "LinkedIn" },
  { icon: Mail, label: "Email" },
].map(({ icon: Icon, label }) => (
                <button
                  key={label}
                  className="rounded-xl border border-white/10 bg-white/5 p-3 transition hover:border-blue-400 hover:bg-blue-500/10"
                >
                  <Icon size={20} />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-10 h-px bg-white/10" />

        {/* Bottom */}
        <div className="flex flex-col items-center justify-between gap-4 text-sm text-slate-500 md:flex-row">
          <p>© 2026 VoyageAI. Built with Next.js, FastAPI & AI Agents.</p>

          <p className="flex items-center gap-2">
            Made by
            <span className="font-semibold text-white">Mukti</span>
          </p>
        </div>
      </div>
    </footer>
  );
}