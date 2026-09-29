
"use client";

import { motion } from "framer-motion";
import {
  Bot,
  CloudSun,
  Utensils,
  Wallet,
  ShieldCheck,
  Loader2,
  CircleCheck,
} from "lucide-react";

export type AgentStatus = "waiting" | "running" | "completed";

export interface Agent {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  status: AgentStatus;
}

interface Props {
  agents: Agent[];
}

export default function AgentProgress({ agents }: Props) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-10">
      {agents.map((agent, index) => {
        const Icon = agent.icon;

        return (
          <motion.div
            key={agent.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            className={`rounded-2xl p-5 border backdrop-blur-xl transition-all duration-500 ${
              agent.status === "running"
                ? "bg-blue-500/15 border-blue-400 shadow-[0_0_30px_rgba(59,130,246,.35)]"
                : agent.status === "completed"
                ? "bg-green-500/10 border-green-400 shadow-[0_0_20px_rgba(34,197,94,.25)]"
                : "bg-slate-900/60 border-white/10"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`p-3 rounded-xl ${
                    agent.status === "running"
                      ? "bg-blue-500/20"
                      : agent.status === "completed"
                      ? "bg-green-500/20"
                      : "bg-white/10"
                  }`}
                >
                  <Icon size={22} />
                </div>

                <div>
                  <h3 className="font-semibold text-white">{agent.name}</h3>
                  <p className="text-xs text-gray-300">
                    {agent.description}
                  </p>
                </div>
              </div>

              {agent.status === "running" && (
                <Loader2 className="animate-spin text-blue-300" size={20} />
              )}

              {agent.status === "completed" && (
                <CircleCheck className="text-green-400" size={22} />
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

// Export icons for Hero.tsx
export const AgentIcons = {
  destination: Bot,
  weather: CloudSun,
  food: Utensils,
  budget: Wallet,
  critic: ShieldCheck,
};