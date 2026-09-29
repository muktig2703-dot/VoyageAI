"use client";

import { Bot, CloudSun, MapPinned, Wallet } from "lucide-react";

const stats = [
  { icon: Bot, label: "7 AI Agents" },
  { icon: CloudSun, label: "Live Weather" },
  { icon: MapPinned, label: "Real Places" },
  { icon: Wallet, label: "Budget Optimized" },
];

export default function Stats() {
  return (
    <section className="max-w-6xl mx-auto py-16">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((item, i) => (
          <div
            key={i}
            className="glass rounded-2xl p-6 text-center hover:scale-105 transition"
          >
            <item.icon className="mx-auto text-cyan-400 mb-3"/>
            <p className="font-semibold">{item.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}