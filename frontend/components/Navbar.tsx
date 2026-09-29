"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Plane } from "lucide-react";

const links = [
  { name: "Home", href: "#home" },
  { name: "Trusted By", href: "#trusted-by" },
  { name: "How It Works", href: "#how-it-works" },
  { name: "AI Team", href: "#ai-team" },
  { name: "Preview", href: "#preview" },
  { name: "Testimonials", href: "#testimonials" },
  { name: "Contact", href: "#footer" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const handleClick = (href: string) => {
    setOpen(false);

    const element = document.querySelector(href);

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4">
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-7xl rounded-2xl border border-white/30 bg-white/80 backdrop-blur-xl shadow-xl"
      >
        <div className="flex items-center justify-between px-6 py-4">
          {/* Logo */}
          <button
            onClick={() => handleClick("#home")}
            className="flex items-center gap-3"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
              <Plane size={20} className="rotate-45 text-white" />
            </div>

            <h1 className="text-2xl font-black text-slate-900">
              Voyage
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AI
              </span>
            </h1>
          </button>

          {/* Desktop Links */}
          <div className="hidden items-center gap-7 lg:flex">
            {links.map((link) => (
              <button
                key={link.name}
                onClick={() => handleClick(link.href)}
                className="text-sm font-bold text-slate-900 transition hover:text-blue-600"
              >
                {link.name}
              </button>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden lg:block">
            <button
              onClick={() => handleClick("#start-planning")}
              className="rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:scale-105"
            >
              Start Planning
            </button>
          </div>

          {/* Mobile Menu */}
          <button
            onClick={() => setOpen(!open)}
            className="text-slate-900 lg:hidden"
          >
            {open ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-slate-200 lg:hidden"
            >
              <div className="flex flex-col gap-4 p-5">
                {links.map((link) => (
                  <button
                    key={link.name}
                    onClick={() => handleClick(link.href)}
                    className="text-left font-semibold text-slate-900 transition hover:text-blue-600"
                  >
                    {link.name}
                  </button>
                ))}

                <button
                  onClick={() => handleClick("#start-planning")}
                  className="mt-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-5 py-3 font-semibold text-white"
                >
                  Start Planning
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </header>
  );
}