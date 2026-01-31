export const projectsData = [
  {
    id: 1,
    title: "RedirIQ",
    slug: "rediriq",
    type: "full-stack",
    description: "Edge-optimized link resolution system with cache-first architecture, reducing redirect latency to ~1–2 seconds globally.",
    points: [
      "Deployed redirect handling at the edge using Cloudflare Workers, executing resolution closer to users and stabilizing global redirect latency at ~1–2 seconds.",
      "Designed a cache-first lookup flow with Redis + PostgreSQL in Node.js/Express, cutting database reads by ~60% and stabilizing response times for hot paths.",
      "Built deterministic route-based resolution with unique slug generation, cleanly separating redirect paths from application routes to avoid collisions and fallback errors.",
      "Implemented production-safe request handling with CORS, validation, and controlled redirects, deploying backend services on Railway for reliability.",
      "Developed a lightweight management UI using React, Tailwind CSS, and React Query to handle state, errors, and observability without over-fetching."
    ],
    tech: ["React", "Redis", "PostgreSQL", "Node.js", "Express", "TypeScript", "Tailwind CSS", "React Query", "Railway", "MongoDB", "Cloudflare"],
    image: "/projects/rediriq/rediriq.png",
    live: "https://rediriq.mehul.wiki/",
    github: "https://github.com/MehulKChaudhari/redirIQ",
    sequenceDiagram: `sequenceDiagram
    participant Client
    participant Backend
    participant Redis
    participant Postgres
    participant MongoDB

    %% Shorten URL
    Client->>Backend: POST /api/shorten (original URL)
    Backend->>Postgres: Save slug + original URL
    Backend->>Redis: Cache slug mapping
    Backend-->>Client: Return short slug

    %% Redirect
    Client->>Backend: GET /:slug
    Backend->>Redis: Check cache
    alt Slug found in Redis
        Redis-->>Backend: original URL
    else Slug not in Redis
        Backend->>Postgres: Get original URL
        Backend->>Redis: Cache slug
    end
    Backend-->>Client: 301 Redirect to original URL

    %% Get analytics
    Client->>Backend: GET /api/analytics/:slug
    Backend->>MongoDB: Fetch analytics data
    Backend-->>Client: Return stats`,
    hldDiagram: "/projects/rediriq/diagram.png"
  },
  {
    id: 2,
    title: "Decision X-Ray",
    slug: "decision-xray",
    type: "sdk",
    description: "Debugging for multi-step decision pipelines: when the final output is wrong, you want to see why at each step, not just what happened. The product is an npm package—you call it from your pipeline, it gives you structured step data; you send that to your own backend or file. The repo also has a demo: an Express API + Postgres + React dashboard that uses the SDK with a 4-step mock workflow so you can run it and see traces. POC / case study, not a shipped product.",
    headerNote: "WIP: researching a few questions and how to make it more reliable for AI systems output.",
    pointsSectionTitle: "Case study",
    points: [
      "The problem: You have a pipeline—e.g. LLM → search API → filters → ranking. When the final output is wrong, logs tell you what happened but not why. Which filter rejected this candidate? What was the actual value vs expected? I wanted to capture that.",
      "Core idea: The SDK is just functions that return plain objects. No HTTP, no DB, no framework. You call recordStep with inputs, outputs, and reasoning; you get back an object. Where it goes (your API, a file, a queue) is up to you. That keeps it testable and usable in Node, browser, or edge.",
      "What I built (POC): (1) SDK: TypeScript, zero runtime dependencies, published on npm. (2) Demo app: Express API that receives traces, Postgres + JSONB for step data, React + Vite dashboard to view execution → steps → evaluations. Demo uses mock data and a single workflow. Out of scope: production hardening, auth, real LLM/API calls.",
      "What it enables: Inspecting decision flow, seeing how a result was produced, debugging step-by-step. It does NOT yet: mark wrong outcomes, compare good vs bad runs, or surface root causes automatically.",
      "Key learnings: Modeling \"wrong\" outcomes is harder than modeling decisions—you need explicit expected vs actual. Decision debugging needs different abstractions than logging/tracing. Keeping the SDK as plain objects with zero persistence logic made it easy to test and plug into any backend.",
      "Future direction: Explicit outcome annotation (expected vs unexpected), error context, step relationships, execution comparison (diffing), tighter focus on non-deterministic systems (LLM/ranking). Goal is sharper debugging signal, not feature breadth."
    ],
    tech: ["TypeScript", "Node.js", "Express", "PostgreSQL", "JSONB", "React", "Vite", "Tailwind CSS", "npm"],
    techStackSections: [
      {
        label: "SDK (npm package)",
        items: ["TypeScript", "Zero runtime dependencies", "npm"]
      },
      {
        label: "Demo app (full-stack)",
        items: ["Node.js", "Express", "PostgreSQL", "JSONB", "React", "Vite", "Tailwind CSS", "Supabase", "Railway", "Cloudflare Pages"]
      }
    ],
    image: "/projects/decision-xray/cover.png",
    live: "https://www.npmjs.com/package/decision-xray",
    liveLabel: "View package",
    github: "https://github.com/mehulkchaudhari/decision-xray",
    sequenceDiagram: `flowchart LR
  App[Application Logic]
  SDK[Decision X-Ray SDK]
  API[Express API]
  DB[(PostgreSQL)]
  UI[Dashboard]

  App -->|recordStep| SDK
  SDK -->|plain objects| App
  App -->|POST /traces| API
  API -->|persist| DB
  UI -->|GET /executions| API
  API -->|query| DB
  DB -->|traces| UI`,
    flowSequenceDiagram: `sequenceDiagram
  participant Pipeline as Your pipeline
  participant SDK as decision-xray SDK
  participant API as Demo API
  participant DB as PostgreSQL
  participant UI as Dashboard

  Pipeline->>SDK: recordStep(inputs, outputs, reasoning)
  SDK-->>Pipeline: step object
  Pipeline->>API: POST /traces
  API->>DB: persist
  UI->>API: GET /executions
  API->>DB: query
  DB-->>API: traces
  API-->>UI: render`
  }
]

export const curatedProjects = projectsData.filter(project => project.id === 1 || project.id === 2)

