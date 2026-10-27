
"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, ChevronDown, CircleHelp, MessageCircle } from "lucide-react";

const faqs = [
  {
    category: "Getting Started",
    question: "What is VoyageAI?",
    answer:
      "VoyageAI is an AI-powered travel planning application designed to help users organize personalized trips based on their destination, travel dates, budget, and interests.",
  },
  {
    category: "Getting Started",
    question: "How do I plan a trip?",
    answer:
      "Sign in to your account, open the trip planner, and enter your destination, dates, budget, and preferences. The available planning features will help you build your itinerary.",
  },
  {
    category: "AI & Planning",
    question: "How does the AI travel planner work?",
    answer:
      "VoyageAI is designed around specialized agents for areas such as destinations, accommodation, transport, food, activities, and budgeting. An orchestration workflow coordinates their work.",
  },
  {
    category: "AI & Planning",
    question: "Can I trust every AI recommendation?",
    answer:
      "AI-generated information can be incomplete or outdated. Check important details such as opening hours, transport schedules, prices, and booking conditions before travelling.",
  },
  {
    category: "Budget",
    question: "Can I plan a trip within my budget?",
    answer:
      "You can provide a budget as part of your trip preferences. Recommendations and estimates depend on the information available and the planning features currently implemented.",
  },
  {
    category: "Trips",
    question: "Where can I find my saved trips?",
    answer:
      "Open My Journeys from your dashboard to view trips associated with your account.",
  },
  {
    category: "Trips",
    question: "Can I delete a trip?",
    answer:
      "If the trip appears in My Journeys, use its delete option and confirm the action when prompted.",
  },
  {
    category: "Privacy",
    question: "Is my itinerary guaranteed to be accurate?",
    answer:
      "No itinerary can be guaranteed to be accurate. Treat generated plans as suggestions and independently verify bookings, costs, travel times, and local conditions.",
  },
];

export default function FAQsPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = [
    "All",
    ...Array.from(new Set(faqs.map((faq) => faq.category))),
  ];

  const filteredFAQs =
    activeCategory === "All"
      ? faqs
      : faqs.filter((faq) => faq.category === activeCategory);

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#f7f9ff] via-white to-purple-50 px-6 py-12 text-slate-800">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/dashboard"
          className="mb-10 inline-flex items-center gap-2 text-sm font-medium text-indigo-600 transition hover:text-purple-700"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>

        <header className="mb-10 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white px-4 py-2 text-sm font-medium text-indigo-700 shadow-sm">
            <CircleHelp size={16} />
            Help Centre
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Frequently asked{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              questions.
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl leading-7 text-slate-600">
            Have questions about planning your next adventure? Find answers
            about VoyageAI, AI-powered planning, budgets, and managing trips.
          </p>
        </header>

        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => {
                setActiveCategory(category);
                setOpenIndex(null);
              }}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                activeCategory === category
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                  : "border border-indigo-100 bg-white text-slate-600 hover:border-indigo-300 hover:text-indigo-700"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {filteredFAQs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <section
                key={faq.question}
                className="overflow-hidden rounded-2xl border border-indigo-100 bg-white shadow-sm transition hover:shadow-md"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 p-5 text-left sm:p-6"
                >
                  <span className="font-semibold text-slate-900">
                    {faq.question}
                  </span>
                  <ChevronDown
                    size={20}
                    className={`shrink-0 text-indigo-600 transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-6 sm:px-6">
                    <p className="border-t border-indigo-50 pt-4 text-sm leading-7 text-slate-600">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </section>
            );
          })}
        </div>

        <section className="mt-10 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white sm:p-8">
          <div className="flex items-start gap-4">
            <MessageCircle size={26} className="mt-1 shrink-0" />
            <div>
              <h2 className="text-xl font-bold">Still have questions?</h2>
              <p className="mt-2 text-sm leading-6 text-indigo-100">
                Check the project documentation for more information about
                VoyageAI and its technology.
              </p>
              <Link
                href="/documentation"
                className="mt-4 inline-flex items-center rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-50"
              >
                Read Documentation
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
