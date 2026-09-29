"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Plane } from "lucide-react";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

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

  const handleLogin = () => {
    setOpen(false);
    router.push("/login");
  };

  const handleSignup = () => {
    setOpen(false);
    router.push("/signup");
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4">
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-7xl rounded-2xl border border-white/30 bg-white/80 shadow-xl backdrop-blur-xl"
      >
        <div className="flex items-center justify-between px-6 py-4">

          {/* Logo */}
          <button
            onClick={() => handleClick("#home")}
            className="flex items-center gap-3"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
              <Plane
                size={20}
                className="rotate-45 text-white"
              />
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

          {/* Desktop Auth Buttons */}
          <div className="hidden items-center gap-3 lg:flex">
            <button
              onClick={handleLogin}
              className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 transition hover:border-blue-500 hover:text-blue-600"
            >
              Log In
            </button>

            <button
              onClick={handleSignup}
              className="rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:scale-105"
            >
              Sign Up
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setOpen(!open)}
            className="text-slate-900 lg:hidden"
            aria-label="Toggle menu"
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

                {/* Navigation Links */}
                {links.map((link) => (
                  <button
                    key={link.name}
                    onClick={() => handleClick(link.href)}
                    className="text-left font-semibold text-slate-900 transition hover:text-blue-600"
                  >
                    {link.name}
                  </button>
                ))}

                {/* Mobile Auth Buttons */}
                <div className="mt-2 flex gap-3">
                  <button
                    onClick={handleLogin}
                    className="flex-1 rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-900 transition hover:border-blue-500 hover:text-blue-600"
                  >
                    Log In
                  </button>

                  <button
                    onClick={handleSignup}
                    className="flex-1 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-5 py-3 font-semibold text-white shadow-lg"
                  >
                    Sign Up
                  </button>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </header>
  );
}