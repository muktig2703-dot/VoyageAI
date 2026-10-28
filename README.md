# VoyageAI --- AI-Powered Multi-Agent Travel Planner

VoyageAI is an AI-assisted travel-planning application designed to help
users turn trip preferences into structured, personalized itineraries.
The project combines a Next.js frontend with a FastAPI backend,
PostgreSQL persistence, and a LangGraph-orchestrated set of AI agents
and external travel-data services.

The application brings together destination research, accommodation and
activity discovery, transport and food planning, budget estimation,
itinerary generation, and a critic/review step intended to identify
issues before an itinerary is returned. It also includes account
management, saved trips, co-traveller management, and a support
experience.

> **Project status:** This README documents the implementation reviewed
> in the project files. Some dashboard package listings and landing-page
> previews are static demonstration data, and a few frontend/backend
> contracts should be reconciled before production deployment. See
> [Known limitations and integration
> notes](#known-limitations-and-integration-notes).

## Table of contents

-   [Highlights](#highlights)
-   [System architecture](#system-architecture)
-   [Technology stack](#technology-stack)
-   [Repository structure](#repository-structure)
-   [Prerequisites](#prerequisites)
-   [Configuration](#configuration)
-   [Local development setup](#local-development-setup)
    -   [1. Clone the repository](#1-clone-the-repository)
    -   [2. Configure the backend](#2-configure-the-backend)
    -   [3. Configure the frontend](#3-configure-the-frontend)
-   [Running the application](#running-the-application)
-   [Application workflow](#application-workflow)
-   [API overview](#api-overview)
-   [Data and persistence](#data-and-persistence)
-   [External services](#external-services)
-   [Security considerations](#security-considerations)
-   [Validation and testing](#validation-and-testing)
-   [Known limitations and integration
    notes](#known-limitations-and-integration-notes)
-   [Deployment checklist](#deployment-checklist)
-   [Contributing](#contributing)
-   [License](#license)

## Highlights

-   **Multi-agent trip planning:** Specialized workflow nodes handle
    destination research, accommodation, transport, food, activities,
    budget, itinerary creation, and review.
-   **Workflow orchestration:** LangGraph coordinates the planning
    sequence and permits a limited revision pass when the critic
    identifies issues.
-   **Itinerary validation:** The backend reviews budget and schedule
    concerns and validates the generated itinerary before saving the
    trip.
-   **AI-assisted research:** Gemini is used for language-model
    reasoning; Google Places, OpenWeatherMap, and Tavily support place
    discovery, weather context, and web research.
-   **Account and session management:** Signup, login, profile access,
    password changes, JWT-based authentication, and active-session
    revocation are implemented in the backend.
-   **Trip management:** Authenticated users can create, list, inspect,
    and delete trips.
-   **Trip-detail experience:** The frontend presents trip dates,
    interests, budget summaries, cost breakdowns, day-by-day activities,
    and supporting notes when the backend response contains the relevant
    data.
-   **Saved packages and favourites:** The dashboard provides package
    search, filtering, sorting, favourites, and saved-package views.
    Saved packages and bookmarks currently use browser `localStorage`.
-   **Support tools:** The frontend includes authenticated support chat
    and a callback-request form.
-   **Responsive interface:** The Next.js UI uses Tailwind CSS, Framer
    Motion, and Lucide icons for responsive layouts and animated
    interactions.

## System architecture

``` text
┌───────────────────────────────────────────────────────────┐
│                     Next.js Frontend                      │
│ Landing · Auth · Dashboard · Planner · Trips · Support    │
└──────────────────────────────┬────────────────────────────┘
                               │ HTTP / JSON + Bearer JWT
                               ▼
┌───────────────────────────────────────────────────────────┐
│                       FastAPI API                         │
│ Auth · Trips · Profile · Sessions · Co-travellers         │
│ Support chat · Callback requests                          │
└───────────────┬──────────────────────────┬────────────────┘
                │                          │
                ▼                          ▼
┌──────────────────────────┐   ┌────────────────────────────┐
│ LangGraph planning flow  │   │ PostgreSQL + SQLAlchemy     │
│ Destination              │   │ Users, trips, sessions,     │
│ Accommodation            │   │ co-travellers, support,     │
│ Transport / Food         │   │ callback requests           │
│ Activities / Budget      │   └────────────────────────────┘
│ Itinerary / Critic       │
└──────────────┬───────────┘
               │
               ▼
┌───────────────────────────────────────────────────────────┐
│ External services                                         │
│ Google Gemini · Google Places · OpenWeatherMap · Tavily   │
└───────────────────────────────────────────────────────────┘
```

### Planning workflow

The backend's LangGraph workflow is organized around these stages:

1.  **Destination research** --- gathers destination context.
2.  **Accommodation research** --- finds or summarizes lodging options.
3.  **Transport planning** --- considers transportation details.
4.  **Food planning** --- gathers food and dining suggestions.
5.  **Activity planning** --- proposes activities and places to visit.
6.  **Budget analysis** --- estimates costs and evaluates the budget.
7.  **Itinerary generation** --- assembles the trip plan.
8.  **Critic/review** --- checks for budget, scheduling, and other
    critical issues.

The critic can route the workflow back to itinerary generation for a
limited revision attempt. The final response is validated and stored
with a status indicating whether it completed normally or still needs
review. The workflow uses generated AI content and external data; it
should not be treated as a guarantee that every price, opening time,
route, or booking detail is current.

## Technology stack

  -----------------------------------------------------------------------
  Area                                Technologies
  ----------------------------------- -----------------------------------
  Frontend framework                  Next.js, React, TypeScript

  Styling and UI                      Tailwind CSS 4, Framer Motion,
                                      Lucide React

  HTTP client                         Axios

  Backend framework                   FastAPI, Python

  Agent orchestration                 LangGraph

  Language model                      Google Gemini (`gemini-2.5-flash`
                                      in the reviewed implementation)

  Database                            PostgreSQL

  ORM                                 SQLAlchemy

  Authentication                      JWT, password hashing with `pwdlib`

  Place search                        Google Places API

  Weather                             OpenWeatherMap

  Web research                        Tavily
  -----------------------------------------------------------------------

## Repository structure

The following is a **logical overview** of the reviewed files. The exact
tree may contain additional files, and the repository includes both
`frontend/components/` and `frontend/src/components/`; check the actual
imports and TypeScript path aliases when maintaining the project.

``` text
VoyageAI/
├── backend/
│   ├── app/
│   │   ├── agents/
│   │   │   ├── accomodation.py
│   │   │   ├── activity.py
│   │   │   ├── budget.py
│   │   │   ├── critic.py
│   │   │   ├── destination.py
│   │   │   ├── food.py
│   │   │   ├── itinerary.py
│   │   │   ├── orchestrator.py
│   │   │   ├── transport.py
│   │   │   └── workflow.py
│   │   ├── routes/
│   │   │   ├── auth-related routes
│   │   │   ├── trips
│   │   │   ├── profile
│   │   │   ├── co-travellers
│   │   │   ├── support chat
│   │   │   └── callback
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── services/
│   │   ├── config.py
│   │   ├── database.py
│   │   ├── dependencies.py
│   │   ├── security.py
│   │   └── main.py
│   └── requirements.txt
└── frontend/
    ├── components/
    ├── src/
    │   ├── app/
    │   │   ├── dashboard/
    │   │   ├── documentation/
    │   │   ├── faqs/
    │   │   ├── login/
    │   │   ├── plan/
    │   │   ├── trips/
    │   │   │   └── [id]/
    │   │   ├── page.tsx
    │   │   ├── layout.tsx
    │   │   └── globals.css
    │   ├── components/
    │   ├── context/
    │   │   └── AuthContext.tsx
    │   ├── lib/
    │   │   └── savedPackages.ts
    │   ├── services/
    │   │   └── api.ts
    │   └── type/
    │       └── trip.ts
    ├── package.json
    └── ...
```

## Prerequisites

Install the following before running the application:

-   Python version compatible with the packages in
    `backend/requirements.txt`.
-   Node.js and npm compatible with the frontend's Next.js version.
-   PostgreSQL server and a database/user for VoyageAI.
-   API credentials for the external services you intend to use: Gemini,
    Google Places, OpenWeatherMap, and Tavily.
-   Git, if cloning the repository.

The exact supported Python and Node.js versions should be pinned by the
project before production use. Use the installed versions and dependency
constraints in the repository as the source of truth.

## Configuration

### Backend environment variables

Create `backend/.env` and configure the settings consumed by
`app/config.py`. A typical local configuration includes:

``` dotenv
APP_NAME=VoyageAI
DATABASE_URL=postgresql+psycopg://<DB_USER>:<DB_PASSWORD>@localhost:5432/<DB_NAME>

GEMINI_API_KEY=<YOUR_GEMINI_API_KEY>
GOOGLE_MAPS_API_KEY=<YOUR_GOOGLE_MAPS_API_KEY>
OPENWEATHER_API_KEY=<YOUR_OPENWEATHER_API_KEY>
TAVILY_API_KEY=<YOUR_TAVILY_API_KEY>

JWT_SECRET_KEY=<A_LONG_RANDOM_SECRET>
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

Use the database URL format supported by the installed PostgreSQL driver
and SQLAlchemy configuration. The placeholders above are examples:
replace them with your actual local database details. Do not commit
`.env` files or real credentials.

`APP_NAME` and the JWT settings have defaults in the reviewed
configuration. Keep a strong, unique `JWT_SECRET_KEY` outside source
control, especially outside development.

### Frontend environment variables

Create `frontend/.env.local`:

``` dotenv
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

Several frontend components use `NEXT_PUBLIC_API_URL`. However, the
shared Axios client in `src/services/api.ts` currently has a hardcoded
`http://127.0.0.1:8000` base URL, and the planner page uses the
environment variable without the same fallback used by some other pages.
For reliable environment-based configuration, standardize all API
requests on one shared base-URL setting before deployment.

Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser. Do
not place private API keys or secrets in frontend environment variables.

## Local development setup

### 1. Clone the repository

``` bash
git clone https://github.com/muktig2703-dot/VoyageAI.git
cd VoyageAI
```

If your local repository uses a different remote or directory name, use
the appropriate URL/path.

### 2. Configure the backend

From the repository root:

``` bash
cd backend
python -m venv venv
```

Activate the environment:

**Windows PowerShell / Command Prompt**

``` powershell
venv\Scripts\activate
```

**macOS / Linux**

``` bash
source venv/bin/activate
```

Install backend dependencies:

``` bash
python -m pip install --upgrade pip
pip install -r requirements.txt
```

Create a PostgreSQL database and configure `backend/.env` as described
above. Ensure the configured database is running and reachable before
starting FastAPI.

The reviewed application initializes SQLAlchemy tables with
`Base.metadata.create_all(...)` during startup. No migration workflow
was confirmed in the reviewed files. For ongoing schema changes and
production deployments, use a controlled migration tool such as Alembic
rather than relying solely on automatic table creation.

### 3. Configure the frontend

Open a second terminal at the repository root:

``` bash
cd frontend
npm install
```

Create `frontend/.env.local` with the API URL shown above. Then start
the Next.js development server:

``` bash
npm run dev
```

The package scripts also include:

``` bash
npm run build
npm run start
npm run lint
```

Run these from the `frontend/` directory.

## Running the application

Start the backend from `backend/` with its virtual environment
activated:

``` bash
uvicorn app.main:app --reload
```

By default, the backend is available at:

-   API root: `http://127.0.0.1:8000/`
-   Health endpoint: `http://127.0.0.1:8000/health`
-   Interactive API documentation: `http://127.0.0.1:8000/docs`
-   OpenAPI schema: `http://127.0.0.1:8000/openapi.json`

Start the frontend separately from `frontend/`:

``` bash
npm run dev
```

Open the local Next.js URL printed by the development server, usually
`http://localhost:3000`.

The backend CORS configuration reviewed for this project allows the
local frontend origins `http://localhost:3000` and
`http://127.0.0.1:3000`. Add the actual deployed frontend origin to the
production CORS configuration when deploying.

## Application workflow

1.  **Create an account or log in.** The frontend sends credentials to
    the authentication API and stores the returned access token in
    browser storage through the auth context.
2.  **Explore the dashboard.** Browse the current sample package
    catalogue, search destinations, filter by package type, budget,
    duration, hotel category, and theme, and sort the results.
3.  **Plan a trip.** Enter a destination, dates, budget, travel style,
    and interests.
4.  **Generate and review the itinerary.** The frontend submits the trip
    request to FastAPI. The backend orchestrates the agent workflow and
    persists the result.
5.  **View My Journeys.** Fetch saved trips from the backend, open a
    trip's detail page, or delete a trip.
6.  **Use support tools.** Authenticated users can send support-chat
    messages or submit a callback request.
7.  **Manage the account.** Profile, password, active sessions, and
    co-traveller features are exposed through backend routes.

Actual results depend on API credentials, external service quotas, model
availability, and the shape of the returned itinerary. Always verify
travel details independently before making reservations or purchases.

## API overview

The routes below summarize the reviewed backend implementation. Confirm
exact request/response schemas in the running OpenAPI documentation at
`/docs`.

  -------------------------------------------------------------------------------
  Method                  Endpoint                        Purpose
  ----------------------- ------------------------------- -----------------------
  `GET`                   `/`                             API root/status
                                                          information

  `GET`                   `/health`                       Health check

  `POST`                  `/auth/signup`                  Register a user

  `POST`                  `/auth/login`                   Authenticate and issue
                                                          an access token/session

  `GET`                   `/auth/me`                      Retrieve the
                                                          authenticated user

  `POST`                  `/auth/change-password`         Change the current
                                                          user's password

  `GET`                   `/auth/sessions`                List active/login
                                                          sessions

  `DELETE`                `/auth/sessions/{session_id}`   Revoke a session

  `POST`                  `/trip`                         Generate and save a
                                                          trip

  `GET`                   `/trips`                        List the current user's
                                                          trips

  `GET`                   `/trip/{trip_id}`               Retrieve a trip and
                                                          itinerary

  `DELETE`                `/trip/{trip_id}`               Delete a trip

  `GET`                   `/profile/me`                   Retrieve the user's
                                                          profile

  `PATCH`                 `/profile/me`                   Update the user's
                                                          profile

  `GET`                   `/co-travellers`                List co-travellers

  `POST`                  `/co-travellers`                Add a co-traveller

  `PATCH`                 `/co-travellers/{id}`           Update a co-traveller

  `DELETE`                `/co-travellers/{id}`           Remove a co-traveller

  `POST`                  `/support-chat/messages`        Send a support-chat
                                                          message

  `POST`                  `/callback`                     Submit a callback
                                                          request
  -------------------------------------------------------------------------------

Most user-specific routes require a bearer token:

``` http
Authorization: Bearer <ACCESS_TOKEN>
```

### Example trip request

The backend's reviewed `TripCreate` schema includes these fields:

``` json
{
  "destination": "Goa",
  "start_date": "2027-01-10",
  "end_date": "2027-01-14",
  "budget": 25000,
  "travel_style": "balanced",
  "interests": ["Beaches", "Food", "Culture"]
}
```

This is an illustrative request. The backend schema validates the
destination, dates, positive budget, travel style, and interests,
including date-order and past-date checks. Consult `/docs` for the
current exact schema.

## Data and persistence

PostgreSQL with SQLAlchemy is used for core application data, including
user accounts, trips, login sessions, co-travellers, support
conversations/messages, and callback requests.

Some frontend-only features are separate from this database persistence:

-   The dashboard's destination/package catalogue is hardcoded
    demonstration data.
-   Favourites and saved/bookmarked packages are stored in browser
    `localStorage`, scoped using a user key derived from the user's
    email or name.
-   Landing-page trip previews and sample testimonials are demonstration
    content, not live itinerary results or verified customer reviews.

Clearing browser storage or switching browsers/devices can therefore
remove or hide local favourites and saved packages; they are not
equivalent to backend-saved trips.

## External services

  -----------------------------------------------------------------------
  Service                 Role in the application Configuration
  ----------------------- ----------------------- -----------------------
  Google Gemini           Language-model          `GEMINI_API_KEY`
                          reasoning and           
                          generation in           
                          planning/support flows  

  Google Places           Place and business      `GOOGLE_MAPS_API_KEY`
                          discovery               

  OpenWeatherMap          Current weather         `OPENWEATHER_API_KEY`
                          context; city results   
                          are cached briefly in   
                          memory                  

  Tavily                  Web research for        `TAVILY_API_KEY`
                          destination/planning    
                          context                 

  PostgreSQL              Persistent relational   `DATABASE_URL`
                          application data        
  -----------------------------------------------------------------------

Availability and usage limits are controlled by the providers. Add
suitable timeout handling, retries, quota monitoring, and graceful
degradation for production workloads.

## Security considerations

-   Keep `.env`, API keys, database credentials, and JWT secrets out of
    version control.
-   Use HTTPS in deployed environments.
-   Configure CORS with only trusted production origins.
-   Use a long, random JWT secret and rotate credentials if they are
    exposed.
-   Keep dependencies patched and review dependency audit results.
-   Apply rate limits and abuse protection to authentication, trip
    generation, support, and callback endpoints.
-   Avoid logging secrets, access tokens, or personally identifiable
    trip data.
-   The reviewed frontend auth context stores the access token in
    `localStorage`; this is convenient but can expose tokens if a
    cross-site scripting (XSS) vulnerability occurs. Consider a
    carefully configured HttpOnly, Secure, SameSite cookie strategy for
    production.
-   The trip-detail page currently logs itinerary data to the browser
    console; remove or gate this diagnostic logging before release.
-   Ensure every database query that reads, updates, or deletes a trip
    verifies ownership by the authenticated user.
-   Treat generated itineraries, place data, weather, prices, opening
    hours, and travel times as estimates until independently confirmed.
-   Collect only the personal data needed for the feature, and document
    retention and deletion practices for account, support, and callback
    data.

## Validation and testing

The frontend package provides these scripts:

``` bash
npm run lint
npm run build
```

Run them from `frontend/`. Resolve lint/build issues before release.

For backend validation, run the service locally and inspect
`http://127.0.0.1:8000/docs`. Add or run automated tests for at least:

-   Signup, login, invalid credentials, token expiry, and revoked
    sessions.
-   Authorization and ownership checks for trips, co-travellers,
    profiles, and support conversations.
-   Trip request schema validation and invalid date/budget cases.
-   Agent failures, external API timeouts, quota/rate-limit responses,
    and malformed model output.
-   Budget arithmetic, date coverage, schedule conflicts, critic review,
    and revision behavior.
-   Database persistence and deletion behavior.
-   Frontend authentication redirects, planner submission, trip
    listing/detail rendering, and error/loading states.

Do not rely on a successful landing-page render alone as evidence that
trip generation or all integrations are working.

## Known limitations and integration notes

The following items were identified while reviewing the supplied
implementation and should be checked before presenting the project as
production-ready:

1.  **Planner payload mismatch:** The frontend planner sends a
    `travelers` field, while the reviewed backend `TripCreate` schema
    does not define it. Decide whether traveler count should be
    supported in the backend schema and planning workflow, or removed
    from the frontend request.
2.  **API base URL inconsistency:** Some pages use `NEXT_PUBLIC_API_URL`
    with a localhost fallback, the planner uses the variable without the
    same fallback, and the shared Axios client hardcodes
    `http://127.0.0.1:8000`. Standardize API configuration.
3.  **Local-only saved packages:** Favourites and saved/bookmarked
    packages use `localStorage`; they are not synchronized to PostgreSQL
    or across devices.
4.  **Static package data:** Dashboard packages, landing previews,
    weather examples, and sample itinerary cards are hardcoded
    demonstration content and should not be described as live inventory
    or live AI output.
5.  **Placeholder navigation/content:** Some landing-page CTAs, the
    forgot-password action, and some dashboard category shortcuts appear
    to be placeholders or scroll-only actions in the reviewed code.
    Verify each interaction before advertising it as implemented.
6.  **Sample testimonials and metrics:** The testimonials are labelled
    sample experiences. Marketing statistics such as agent counts, API
    counts, and validation percentages should not be presented as
    measured production metrics unless verified.
7.  **Trip details logging:** The trip detail page logs itinerary data
    to the browser console; remove this before production.
8.  **Frontend import layout:** Components exist under both
    `frontend/components/` and `frontend/src/components/`. Verify the
    actual project tree and TypeScript aliases to ensure imports are
    intentional and consistent.
9.  **Session logout behavior:** The frontend logout clears local client
    state/storage, while the backend exposes session-revocation
    endpoints. Decide whether logout should also revoke the server-side
    session.
10. **Database schema evolution:** The reviewed startup creates tables
    using SQLAlchemy metadata. A migration strategy is recommended for
    reliable upgrades.
11. **Router filename consistency:** The reviewed `main.py` import for
    the login-session router appeared to differ in spelling from the
    pasted router filename (`login_sessions` versus `login_sesion`).
    Verify the actual file name/import in the repository.
12. **Production resilience:** Add automated tests, structured
    observability, request limits, retries/timeouts, deployment-specific
    CORS, and operational monitoring before production use.

## Deployment checklist

-   [ ] Configure production PostgreSQL and apply database migrations.
-   [ ] Set all backend secrets through the hosting provider's secret
    manager.
-   [ ] Set the correct frontend API base URL and standardize all API
    clients.
-   [ ] Configure production CORS origins and HTTPS.
-   [ ] Confirm all external API keys, quotas, and billing settings.
-   [ ] Reconcile the `travelers` request/schema contract.
-   [ ] Remove console logging of itinerary data and review application
    logs for sensitive content.
-   [ ] Test authentication, session revocation, user ownership, and
    data deletion.
-   [ ] Run frontend lint/build and backend automated tests.
-   [ ] Confirm placeholder buttons/routes are either implemented or
    clearly marked as unavailable.
-   [ ] Document backup, recovery, monitoring, and incident-response
    procedures.
-   [ ] Independently verify travel information and communicate that
    generated plans are suggestions.

## Contributing

Contributions are welcome. A practical contribution workflow is:

1.  Create a feature branch.
2.  Keep changes focused and document relevant API or schema updates.
3.  Run frontend lint/build and applicable backend tests.
4.  Verify frontend/backend request contracts together.
5.  Open a pull request with a clear summary, testing notes, and
    screenshots where UI changes are involved.

For changes that affect trip generation, update the relevant
agent/workflow code, schemas, API behavior, and frontend expectations
together.

## License

No license file was confirmed in the reviewed project files. Until a
license is added to the repository, assume that reuse, redistribution,
and modification are subject to the applicable copyright restrictions.
Add a `LICENSE` file once the project owner has chosen the intended
license.