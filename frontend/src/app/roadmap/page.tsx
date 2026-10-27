
"use client";

import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  Rocket,
  Sparkles,
} from "lucide-react";

const roadmap = [
  {
    phase: "01",
    title: "Core Platform",
    status: "completed",
    description: "The foundation of VoyageAI and its main travel-planning workflow.",
    items: [
      "User authentication",
      "Travel dashboard",
      "Trip creation and itinerary viewing",
      "My Journeys and trip deletion",
    ],
  },
  {
    phase: "02",
    title: "AI-Powered Planning",
    status: "in-progress",
    description: "Building an intelligent, coordinated travel-planning experience.",
    items: [
      "Specialized travel-planning agents",
      "Destination and place research",
      "Budget-aware itinerary planning",
      "Itinerary review and validation",
    ],
  },
  {
    phase: "03",
    title: "A Better Travel Experience",
    status: "planned",
    description: "Making trip discovery and itinerary management more useful.",
    items: [
      "Save and favourite destinations",
      "Itinerary editing and customization",
      "Improved search and filtering",
      "Weather and local recommendations",
    ],
  },
  {
    phase: "04",
    title: "Future Enhancements",
    status: "planned",
    description: "Ideas for future versions of the platform.",
    items: [
      "Collaborative trip planning",
      "Trip sharing and export",
      "Smarter travel-time optimization",
      "More personalized recommendations",
    ],
  },
];

const statusConfig = {
  completed: {
    label: "Completed",
    Icon: CheckCircle2,
    className: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  },
  "in-progress": {
    label: "In progress",
    Icon: Clock3,
    className: "bg-amber-50 text-amber-700 ring-amber-200",
  },
  planned: {
    label: "Planned",
    Icon: Sparkles,
    className: "bg-indigo-50 text-indigo-700 ring-indigo-200",
  },
};

export default function RoadmapPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#f7f9ff] via-white to-purple-50 px-6 py-12 text-slate-800">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/dashboard"
          className="mb-10 inline-flex items-center gap-2 text-sm font-medium text-indigo-600 transition hover:text-purple-700"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>

        <div className="mb-12">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white px-4 py-2 text-sm font-medium text-indigo-700 shadow-sm">
            <Rocket size={16} />
            The VoyageAI Roadmap
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Building the future of{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              travel planning.
            </span>
          </h1>

          <p className="mt-5 max-w-2xl leading-7 text-slate-600">
            Follow the journey as VoyageAI grows into a smarter,
            more personalized travel-planning platform. These milestones
            describe the project direction and may change as development
            progresses.
          </p>
        </div>

        <div className="space-y-6">
          {roadmap.map((phase) => {
            const status =
              statusConfig[phase.status as keyof typeof statusConfig];
            const StatusIcon = status.Icon;

            return (
              <section
                key={phase.phase}
                className="rounded-2xl border border-indigo-100 bg-white p-6 shadow-sm transition hover:shadow-md sm:p-8"
              >
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                  <div>
                    <p className="text-sm font-semibold tracking-widest text-indigo-500">
                      PHASE {phase.phase}
                    </p>
                    <h2 className="mt-2 text-2xl font-bold text-slate-900">
                      {phase.title}
                    </h2>
                    <p className="mt-2 max-w-2xl leading-7 text-slate-600">
                      {phase.description}
                    </p>
                  </div>

                  <span
                    className={`inline-flex w-fit shrink-0 items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ${status.className}`}
                  >
                    <StatusIcon size={14} />
                    {status.label}
                  </span>
                </div>

                <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                  {phase.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 text-sm leading-6 text-slate-600"
                    >
                      <span className="mt-1 text-indigo-500">
                        <CheckCircle2 size={16} />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>

        <div className="mt-8 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white sm:p-8">
          <h2 className="text-xl font-bold">Have an idea for VoyageAI?</h2>
          <p className="mt-2 text-sm leading-6 text-indigo-100">
            The roadmap is a work in progress. New ideas and priorities
            can shape what gets built next.
          </p>
        </div>
      </div>
    </main>
  );
}
