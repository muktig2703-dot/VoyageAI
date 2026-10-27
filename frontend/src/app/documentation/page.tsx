
"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  BookOpen,
  Boxes,
  Check,
  ChevronRight,
  Code2,
  Compass,
  Database,
  FileText,
  GitBranch,
  Layers3,
  Menu,
  Server,
  Workflow,
  X,
} from "lucide-react";

const sections = [
  { id: "overview", label: "Overview", icon: BookOpen },
  { id: "installation", label: "Installation & Setup", icon: Code2 },
  { id: "capabilities", label: "Core Capabilities", icon: Compass },
  { id: "architecture", label: "System Architecture", icon: Workflow },
  { id: "technology", label: "Technology Stack", icon: Layers3 },
  { id: "api-reference", label: "API Reference", icon: Code2 },
  { id: "project-structure", label: "Project Structure", icon: Boxes },
];

const technologies = [
  {
    name: "Next.js & React",
    category: "Frontend",
    description: "Application interface and client-side navigation.",
    icon: Layers3,
  },
  {
    name: "FastAPI & Python",
    category: "Backend",
    description: "API endpoints and application logic.",
    icon: Server,
  },
  {
    name: "PostgreSQL",
    category: "Database",
    description: "Persistent storage for application data.",
    icon: Database,
  },
  {
    name: "LangGraph & LLMs",
    category: "AI Orchestration",
    description: "Coordination of specialized planning agents.",
    icon: Workflow,
  },
];

const architecture = [
  {
    number: "01",
    title: "User Input",
    description:
      "Travel preferences, destination, dates, budget, and interests.",
  },
  {
    number: "02",
    title: "API Layer",
    description:
      "FastAPI receives requests and coordinates application services.",
  },
  {
    number: "03",
    title: "Agent Workflow",
    description:
      "Specialized agents contribute destination, accommodation, transport, food, activity, and budget information.",
  },
  {
    number: "04",
    title: "Review & Persistence",
    description:
      "Planning results can be reviewed and stored for retrieval, depending on the configured workflow.",
  },
];

export default function DocumentationPage() {
  const [activeSection, setActiveSection] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  function navigateToSection(id: string) {
    setActiveSection(id);
    setSidebarOpen(false);
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  return (
    <div className="min-h-screen bg-white text-slate-800">
      {/* Top navigation */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between gap-4 px-5 sm:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <Link
              href="/dashboard"
              aria-label="Back to VoyageAI dashboard"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-sm"
            >
              <Compass size={19} />
            </Link>

            <div className="flex min-w-0 items-center gap-3">
              <span className="truncate text-base font-bold tracking-tight text-slate-900">
                VoyageAI
              </span>
              <span className="hidden h-5 w-px bg-slate-200 sm:block" />
              <span className="hidden truncate text-sm text-slate-500 sm:block">
                Documentation
              </span>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <a
              href="https://github.com/muktig2703-dot/VoyageAI"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 sm:inline-flex"
            >
              <GitBranch size={16} />
              Repository
              <ArrowUpRight size={14} />
            </a>

            <Link
              href="/dashboard"
              className="hidden items-center gap-2 rounded-lg bg-indigo-600 px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 sm:inline-flex"
            >
              Dashboard
              <ArrowUpRight size={15} />
            </Link>

            <button
              type="button"
              aria-label={sidebarOpen ? "Close navigation" : "Open navigation"}
              aria-expanded={sidebarOpen}
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 lg:hidden"
            >
              {sidebarOpen ? <X size={19} /> : <Menu size={19} />}
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1600px]">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? "block" : "hidden"
          } fixed inset-x-0 bottom-0 top-16 z-30 overflow-y-auto border-r border-slate-200 bg-white px-5 py-7 lg:sticky lg:top-16 lg:block lg:h-[calc(100vh-4rem)] lg:w-64 lg:shrink-0`}
        >
          <Link
            href="/dashboard"
            className="mb-8 inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-indigo-600"
          >
            <ArrowLeft size={15} />
            Back to dashboard
          </Link>

          <p className="mb-3 px-3 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
            Documentation
          </p>

          <nav aria-label="Documentation sections" className="space-y-1">
            {sections.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => navigateToSection(id)}
                aria-current={activeSection === id ? "location" : undefined}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition ${
                  activeSection === id
                    ? "bg-indigo-50 font-semibold text-indigo-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Icon size={17} className="shrink-0" />
                <span>{label}</span>
                {activeSection === id && (
                  <ChevronRight size={15} className="ml-auto" />
                )}
              </button>
            ))}
          </nav>

          <div className="mt-10 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
              <FileText size={16} className="text-indigo-600" />
              Project resources
            </div>
            <p className="mt-2 text-xs leading-5 text-slate-500">
              Explore the source code or review the project development plan.
            </p>
            <div className="mt-3 space-y-2">
              <a
                href="https://github.com/muktig2703-dot/VoyageAI"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between text-sm font-medium text-indigo-700 hover:text-indigo-900"
              >
                GitHub repository <ArrowUpRight size={14} />
              </a>
              <Link
                href="/roadmap"
                className="flex items-center justify-between text-sm font-medium text-indigo-700 hover:text-indigo-900"
              >
                Project roadmap <ArrowUpRight size={14} />
              </Link>
              <Link
                href="/faqs"
                className="flex items-center justify-between text-sm font-medium text-indigo-700 hover:text-indigo-900"
              >
                FAQs <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>
        </aside>

        {/* Documentation content */}
        <main className="min-w-0 flex-1 px-5 py-10 sm:px-8 lg:px-14 lg:py-14">
          <div className="mx-auto max-w-4xl">
            <div className="mb-6 flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500">
              <span>Documentation</span>
              <ChevronRight size={13} />
              <span className="text-indigo-700">Overview</span>
            </div>

            <section id="overview" className="scroll-mt-24 border-b border-slate-200 pb-10">
              <div className="mb-5 inline-flex items-center gap-2 rounded-md border border-indigo-100 bg-indigo-50 px-2.5 py-1.5 text-xs font-semibold text-indigo-700">
                <BookOpen size={14} />
                PROJECT DOCUMENTATION
              </div>

              <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
                VoyageAI Documentation
              </h1>

              <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
                Technical documentation for VoyageAI, an AI-powered travel
                planning platform designed to coordinate travel research,
                itinerary generation, and budget-aware planning.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href="#architecture"
                  onClick={() => setActiveSection("architecture")}
                  className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
                >
                  Explore architecture <ArrowUpRight size={15} />
                </a>
                <a
                  href="#api-reference"
                  onClick={() => setActiveSection("api-reference")}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  API reference <Code2 size={15} />
                </a>
              </div>

              <div className="mt-9 grid gap-4 sm:grid-cols-3">
                {[
                  { label: "Application", value: "VoyageAI" },
                  { label: "Backend framework", value: "FastAPI" },
                  { label: "Database", value: "PostgreSQL" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-xl border border-slate-200 bg-white p-4"
                  >
                    <p className="text-xs font-medium text-slate-500">
                      {item.label}
                    </p>
                    <p className="mt-1.5 font-semibold text-slate-900">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            
            <section
              id="installation"
              className="scroll-mt-24 border-b border-slate-200 py-10"
            >
              <SectionHeading
                eyebrow="GETTING STARTED"
                title="Installation & Setup"
                description="Follow these steps to configure and run VoyageAI in your local development environment."
              />

              <div className="mt-6 space-y-6">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                  <h3 className="font-semibold text-slate-900">
                    Prerequisites
                  </h3>
                  <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-600">
                    <li>Node.js and npm for the frontend.</li>
                    <li>Python for the FastAPI backend.</li>
                    <li>PostgreSQL for persistent data storage.</li>
                    <li>Required environment variables and API credentials.</li>
                  </ul>
                </div>

                <div className="rounded-xl border border-slate-200 p-5">
                  <h3 className="font-semibold text-slate-900">
                    1. Clone the repository
                  </h3>
                  <pre className="mt-3 overflow-x-auto rounded-lg bg-slate-950 p-4 text-sm text-slate-100">
                    <code>{`git clone https://github.com/muktig2703-dot/VoyageAI.git
cd VoyageAI`}</code>
                  </pre>
                </div>

                <div className="rounded-xl border border-slate-200 p-5">
                  <h3 className="font-semibold text-slate-900">
                    2. Install frontend dependencies
                  </h3>
                  <pre className="mt-3 overflow-x-auto rounded-lg bg-slate-950 p-4 text-sm text-slate-100">
                    <code>{`cd frontend
npm install`}</code>
                  </pre>
                </div>

                <div className="rounded-xl border border-slate-200 p-5">
                  <h3 className="font-semibold text-slate-900">
                    3. Start the frontend
                  </h3>
                  <pre className="mt-3 overflow-x-auto rounded-lg bg-slate-950 p-4 text-sm text-slate-100">
                    <code>{`npm run dev`}</code>
                  </pre>
                  <p className="mt-3 text-sm text-slate-600">
                    Open http://localhost:3000 in your browser.
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 p-5">
                  <h3 className="font-semibold text-slate-900">
                    4. Configure and run the backend
                  </h3>
                  <pre className="mt-3 overflow-x-auto rounded-lg bg-slate-950 p-4 text-sm text-slate-100">
                    <code>{`cd backend
python -m venv venv
venv\\Scripts\\activate
pip install -r requirements.txt`}</code>
                  </pre>
                  <p className="mt-4 text-sm leading-6 text-slate-600">
                    Create a .env file inside the backend directory.
                    Configure DATABASE_URL and JWT_SECRET_KEY, plus
                    any external API keys required by your features.
                  </p>
                  <pre className="mt-3 overflow-x-auto rounded-lg bg-slate-950 p-4 text-sm text-slate-100">
                    <code>{`uvicorn app.main:app --reload`}</code>
                  </pre>
                  <p className="mt-3 text-sm text-slate-600">
                    API documentation: http://127.0.0.1:8000/docs
                  </p>
                </div>
              </div>
            </section>

            <section
              id="capabilities"
              className="scroll-mt-24 border-b border-slate-200 py-10"
            >
              <SectionHeading
                eyebrow="01 / PRODUCT"
                title="Core capabilities"
                description="The platform is designed around a coordinated travel-planning workflow."
              />

              <div className="mt-6 divide-y divide-slate-200 rounded-xl border border-slate-200">
                {[
                  {
                    title: "Personalized trip inputs",
                    text: "Capture destination, travel dates, budget, travel style, and interests to inform planning.",
                  },
                  {
                    title: "Specialized planning agents",
                    text: "Organize travel research across destinations, accommodation, transport, food, activities, and budgeting.",
                  },
                  {
                    title: "Orchestrated planning",
                    text: "Coordinate agent outputs through a workflow designed to assemble a consistent itinerary.",
                  },
                  {
                    title: "Trip management",
                    text: "Provide authenticated access to saved trips and their associated itinerary data.",
                  },
                ].map((item) => (
                  <div key={item.title} className="flex gap-4 p-5">
                    <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                      <Check size={15} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-sm leading-6 text-slate-600">
                        {item.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section
              id="architecture"
              className="scroll-mt-24 border-b border-slate-200 py-10"
            >
              <SectionHeading
                eyebrow="02 / DESIGN"
                title="System architecture"
                description="A high-level view of the main application layers and their responsibilities."
              />

              <div className="mt-7 space-y-3">
                {architecture.map((item, index) => (
                  <div
                    key={item.number}
                    className="relative flex gap-4 rounded-xl border border-slate-200 p-5 sm:gap-5"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-sm font-bold text-indigo-700">
                      {item.number}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-slate-900">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-sm leading-6 text-slate-600">
                        {item.description}
                      </p>
                    </div>
                    {index < architecture.length - 1 && (
                      <ChevronRight
                        size={16}
                        className="absolute -bottom-5 left-8 z-10 rotate-90 text-slate-400"
                      />
                    )}
                  </div>
                ))}
              </div>

              <p className="mt-4 text-xs leading-5 text-slate-500">
                This is a conceptual architecture overview. Exact data flow
                and persistence behaviour depend on the current implementation.
              </p>
            </section>

            <section
              id="technology"
              className="scroll-mt-24 border-b border-slate-200 py-10"
            >
              <SectionHeading
                eyebrow="03 / ENGINEERING"
                title="Technology stack"
                description="The primary technologies used by the application."
              />

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {technologies.map(({ name, category, description, icon: Icon }) => (
                  <div
                    key={name}
                    className="rounded-xl border border-slate-200 p-5 transition hover:border-indigo-200 hover:shadow-sm"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                      <Icon size={20} />
                    </div>
                    <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-indigo-600">
                      {category}
                    </p>
                    <h3 className="mt-1 font-semibold text-slate-900">
                      {name}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {description}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section
              id="api-reference"
              className="scroll-mt-24 border-b border-slate-200 py-10"
            >
              <SectionHeading
                eyebrow="04 / INTEGRATION"
                title="API reference"
                description="Use the running FastAPI application's OpenAPI documentation to verify request schemas and responses."
              />

              <div className="mt-6 overflow-hidden rounded-xl border border-slate-200">
                <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-4 py-3">
                  <Code2 size={16} className="text-indigo-600" />
                  <span className="text-sm font-semibold text-slate-800">
                    Available documented routes
                  </span>
                </div>

                <div className="divide-y divide-slate-200">
                  {[
                    {
                      method: "GET",
                      path: "/health",
                      description: "Service health check.",
                      color: "text-emerald-700 bg-emerald-50",
                    },
                    {
                      method: "POST",
                      path: "/trip",
                      description: "Submit a trip-planning request.",
                      color: "text-indigo-700 bg-indigo-50",
                    },
                    {
                      method: "GET",
                      path: "/trip/{trip_id}",
                      description: "Retrieve a trip by its identifier.",
                      color: "text-indigo-700 bg-indigo-50",
                    },
                  ].map((route) => (
                    <div
                      key={`${route.method}-${route.path}`}
                      className="flex flex-col gap-2 px-4 py-4 sm:flex-row sm:items-center"
                    >
                      <span
                        className={`w-fit rounded-md px-2 py-1 font-mono text-[11px] font-bold ${route.color}`}
                      >
                        {route.method}
                      </span>
                      <code className="break-all text-sm font-semibold text-slate-800 sm:min-w-48">
                        {route.path}
                      </code>
                      <p className="text-sm text-slate-500">
                        {route.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
                <p className="text-sm leading-6 text-amber-900">
                  <strong>Important:</strong> These routes are a starting
                  reference. Authentication requirements, request models,
                  response schemas, and any additional routes should be
                  confirmed against the running backend.
                </p>
              </div>

              <div className="mt-5 rounded-xl border border-slate-200 p-5">
                <h3 className="font-semibold text-slate-900">
                  Interactive API documentation
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Start the backend locally and open its Swagger UI to inspect
                  the authoritative endpoint definitions.
                </p>
                <div className="mt-4 rounded-lg bg-slate-950 px-4 py-3">
                  <code className="text-sm text-slate-100">
                    http://127.0.0.1:8000/docs
                  </code>
                </div>
                <p className="mt-3 text-xs leading-5 text-slate-500">
                  This address is for local development. It is not a public
                  API URL.
                </p>
              </div>
            </section>

            <section
              id="project-structure"
              className="scroll-mt-24 py-10"
            >
              <SectionHeading
                eyebrow="05 / CODEBASE"
                title="Project structure"
                description="A simplified overview of the frontend and backend responsibilities."
              />

              <div className="mt-6 overflow-x-auto rounded-xl border border-slate-200 bg-slate-950 p-5">
                <pre className="text-sm leading-7 text-slate-200">
                  <code>{`VoyageAI/
├── frontend/
│   ├── src/app/       # Application routes and pages
│   └── components/    # Reusable interface components
│
└── backend/
    └── app/
        ├── routes/    # API route handlers
        ├── agents/    # Planning agents and orchestration
        ├── services/  # External service integrations
        └── models/    # Application data models`}</code>
                </pre>
              </div>

              <p className="mt-4 text-sm leading-6 text-slate-500">
                This is an illustrative structure based on the known project
                layout. Confirm exact filenames and module locations in the
                repository before using it as a file-by-file reference.
              </p>

              <div className="mt-8 rounded-xl border border-slate-200 p-5 sm:p-6">
                <h3 className="font-semibold text-slate-900">
                  Further resources
                </h3>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Link
                    href="/roadmap"
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                  >
                    Project roadmap <ArrowUpRight size={14} />
                  </Link>
                  <Link
                    href="/faqs"
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                  >
                    Frequently asked questions <ArrowUpRight size={14} />
                  </Link>
                  <a
                    href="https://github.com/muktig2703-dot/VoyageAI"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                  >
                    Source repository <ArrowUpRight size={14} />
                  </a>
                </div>
              </div>
            </section>

            <footer className="mt-6 border-t border-slate-200 py-6 text-xs leading-5 text-slate-500">
              VoyageAI Documentation · Technical reference for the project.
              Keep implementation details and API schemas aligned with the
              current source code.
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-indigo-600">
        {eyebrow}
      </p>
      <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
        {title}
      </h2>
      <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
        {description}
      </p>
    </div>
  );
}