/* ============================================================
   data.jsx — content model (mirrors the EmDash collections)
   ============================================================ */

const SITE = {
  name: "Kostadin Draganov",
  handle: "kostadin@portfolio",
  headline: "Senior Software Developer · AI-Native Engineer",
  shortBio:
    "15+ years building production software with Node.js, Vue.js, React, Next.js, full-stack systems, architecture, automation, and AI engineering workflows.",
  email: "kostadin@draganov.dev",
  github: "github.com/kdraganov",
  linkedin: "linkedin.com/in/kdraganov",
  location: "Sofia, BG · remote",
  availability: "available for selected collaborations",
  cv: "cv.pdf",
};

const NAV = [
  { label: "home", href: "home", command: "/home" },
  { label: "portfolio", href: "portfolio", command: "/portfolio" },
  { label: "about", href: "about", command: "/about" },
  { label: "blog", href: "blog", command: "/blog" },
  { label: "contact", href: "contact", command: "/contact" },
];

const METRICS = [
  { n: "15", u: "+", l: "years in production" },
  { n: "40", u: "+", l: "systems shipped" },
  { n: "9", u: "", l: "years team lead / architect" },
  { n: "100", u: "%", l: "JavaScript ecosystem" },
];

const PROJECTS = [
  {
    id: "ledger-core",
    title: "Ledger Core",
    commit: "feat: real-time double-entry engine",
    tags: ["fullstack", "architecture", "backend"],
    role: "Principal engineer · architecture & delivery",
    problem:
      "A fintech scale-up was losing reconciliation accuracy as transaction volume crossed 8M/day on a monolith that coupled ledgering to billing.",
    solution:
      "Re-architected the core into an event-sourced double-entry engine with idempotent command handlers, a read-model projection layer, and zero-downtime migrations.",
    stack: ["Node.js", "TypeScript", "PostgreSQL", "Kafka", "gRPC"],
    impact: ["reconciliation drift → 0", "p99 write latency −68%", "8M → 30M tx/day headroom"],
    status: "live",
    repo: "github.com/kdraganov/ledger-core",
    live: "ledger.example.com",
  },
  {
    id: "atlas-console",
    title: "Atlas Console",
    commit: "feat: operator console for fleet automation",
    tags: ["frontend", "fullstack"],
    role: "Tech lead · frontend architecture",
    problem:
      "Field operators managed 2,000+ edge devices through five disconnected dashboards with no shared state or audit trail.",
    solution:
      "Unified them into a single Vue 3 console with a command-driven UX, optimistic mutations over a typed API, and a replayable action log.",
    stack: ["Vue 3", "Pinia", "Vite", "Node.js", "WebSocket"],
    impact: ["task time −54%", "5 tools → 1", "full audit replay"],
    status: "shipped",
    repo: "github.com/kdraganov/atlas-console",
    live: "",
  },
  {
    id: "promptforge",
    title: "PromptForge",
    commit: "feat: evaluation harness for LLM pipelines",
    tags: ["ai", "fullstack", "backend"],
    role: "Founding engineer · AI systems",
    problem:
      "An AI team shipped prompt changes blind — no regression signal, no cost ceiling, no way to compare model versions on real traffic.",
    solution:
      "Built an evaluation harness with versioned prompt sets, golden datasets, LLM-as-judge scoring, and a cost/latency budget gate wired into CI.",
    stack: ["Next.js", "TypeScript", "Python", "Postgres", "Redis"],
    impact: ["eval coverage 0 → 92%", "prompt regressions caught pre-merge", "−31% token spend"],
    status: "live",
    repo: "github.com/kdraganov/promptforge",
    live: "promptforge.example.com",
  },
  {
    id: "northwind-edge",
    title: "Northwind Edge",
    commit: "perf: edge-rendered storefront",
    tags: ["frontend", "fullstack", "architecture"],
    role: "Consulting architect",
    problem:
      "A retail platform's Black-Friday traffic melted an SSR fleet; TTFB spiked to 2.4s and conversion fell with every 100ms.",
    solution:
      "Moved rendering to the edge with streaming React Server Components, a stale-while-revalidate cache mesh, and per-route islands.",
    stack: ["Next.js", "React", "Edge Runtime", "Redis", "Cloudflare"],
    impact: ["TTFB 2.4s → 180ms", "peak RPS ×6", "conversion +11%"],
    status: "shipped",
    repo: "github.com/kdraganov/northwind-edge",
    live: "",
  },
  {
    id: "relay-automation",
    title: "Relay",
    commit: "feat: internal automation platform",
    tags: ["backend", "ai", "architecture"],
    role: "Staff engineer · platform",
    problem:
      "Ops ran 200+ brittle cron scripts across three repos. Failures were silent and nobody owned the dependency graph.",
    solution:
      "Designed a typed workflow runtime with a DAG scheduler, ret..ry/backoff semantics, an AI-assisted incident summarizer, and a single observability plane.",
    stack: ["Node.js", "TypeScript", "Temporal", "OpenTelemetry"],
    impact: ["200 scripts → 1 platform", "MTTR −73%", "on-call pages −60%"],
    status: "live",
    repo: "github.com/kdraganov/relay",
    live: "",
  },
  {
    id: "fieldnotes-cms",
    title: "Field Notes CMS",
    commit: "chore: headless content layer",
    tags: ["fullstack", "frontend"],
    role: "Solo · design & build",
    problem:
      "Wanted a writing surface that treated engineering notes as a queryable, versioned dataset — not WordPress.",
    solution:
      "A headless, git-backed content layer with typed schemas, a CLI, and an Astro front-end. This very portfolio runs on it.",
    stack: ["Astro", "TypeScript", "MDX", "SQLite"],
    impact: ["publish in <10s", "typed content", "fully portable"],
    status: "active",
    repo: "github.com/kdraganov/fieldnotes",
    live: "",
  },
];

// fix typo above without scattering edits
PROJECTS.find((p) => p.id === "relay-automation").solution =
  "Designed a typed workflow runtime with a DAG scheduler, retry/backoff semantics, an AI-assisted incident summarizer, and a single observability plane.";

const FLAGS = [
  { flag: "--all", tag: "all" },
  { flag: "--frontend", tag: "frontend" },
  { flag: "--backend", tag: "backend" },
  { flag: "--ai", tag: "ai" },
  { flag: "--fullstack", tag: "fullstack" },
  { flag: "--architecture", tag: "architecture" },
];

const POSTS = [
  {
    id: "p1",
    title: "The eval harness is the product",
    summary:
      "Why I treat LLM evaluation infrastructure as a first-class system, not a notebook — and the four signals every AI pipeline should gate on.",
    date: "2026-05-18",
    category: "AI Native",
    tags: ["evals", "llm", "ci"],
    read: "8 min",
    featured: true,
  },
  {
    id: "p2",
    title: "Event sourcing without the cult",
    summary: "A pragmatic take on when double-entry / event-sourced models earn their complexity — and when they don't.",
    date: "2026-05-04",
    category: "Architecture",
    tags: ["event-sourcing", "postgres"],
    read: "11 min",
  },
  {
    id: "p3",
    title: "Vue 3 at console scale",
    summary: "State, command UX, and optimistic mutations for operator tools that real people use eight hours a day.",
    date: "2026-04-21",
    category: "Vue.js",
    tags: ["vue", "pinia", "ux"],
    read: "7 min",
  },
  {
    id: "p4",
    title: "RSC streaming, measured",
    summary: "TTFB numbers from moving a retail storefront to the edge, and the cache-mesh design that made it hold.",
    date: "2026-04-09",
    category: "Next.js",
    tags: ["rsc", "edge", "perf"],
    read: "9 min",
  },
  {
    id: "p5",
    title: "Field note: AI-native code review",
    summary: "The review loop I actually run now — agent drafts, I arbitrate. What got faster, what got worse.",
    date: "2026-03-27",
    category: "AI Native",
    tags: ["workflow", "agents"],
    read: "5 min",
  },
  {
    id: "p6",
    title: "Refactoring is a delivery skill",
    summary: "Fifteen years in, the highest-leverage thing I do is make change cheap. A taxonomy of safe refactors.",
    date: "2026-03-12",
    category: "Engineering",
    tags: ["refactoring", "delivery"],
    read: "10 min",
  },
  {
    id: "p7",
    title: "Node.js worker pools, revisited",
    summary: "When threads beat processes, and a benchmark that surprised me on a CPU-bound parsing job.",
    date: "2026-02-28",
    category: "Node.js",
    tags: ["node", "perf"],
    read: "6 min",
  },
  {
    id: "p8",
    title: "Reading the room: 2026 framework notes",
    summary: "A field survey — what I'm reaching for by default this year and why the defaults changed.",
    date: "2026-02-10",
    category: "News",
    tags: ["frameworks"],
    read: "4 min",
  },
];

const CATEGORIES = [
  "All", "Engineering", "AI Native", "Node.js", "Vue.js", "React", "Next.js", "Architecture", "News",
];

const VALUES = {
  "engineering-values.json": [
    { k: "maintainability", v: "code is read 10× more than written" },
    { k: "delivery", v: "shipped & observed beats perfect & pending" },
    { k: "refactoring", v: "make change cheap, continuously" },
    { k: "pragmatism", v: "match complexity to the actual problem" },
    { k: "product-minded", v: "the system exists to serve users" },
    { k: "ai-native", v: "agents draft, engineers arbitrate" },
  ],
};

const TIMELINE = [
  {
    yr: "2021 — now",
    role: "Principal / Staff Engineer",
    co: "Independent · fintech, AI platforms, retail",
    body: "Architecture, delivery leadership, and AI-native platform work for teams scaling production systems. Event-sourced ledgers, evaluation infrastructure, edge rendering.",
    lit: true,
  },
  {
    yr: "2016 — 2021",
    role: "Tech Lead · Frontend & Full-stack",
    co: "Product companies (operator tooling, SaaS)",
    body: "Led front-end architecture for operator consoles and dashboards on Vue and React; owned design-systems, performance budgets, and team mentoring.",
  },
  {
    yr: "2011 — 2016",
    role: "Full-stack Engineer",
    co: "Agencies & early-stage startups",
    body: "Shipped across the JavaScript stack as it matured — Node.js services, SPA front-ends, build tooling. Where the 10,000 hours came from.",
  },
];

Object.assign(window, {
  SITE, NAV, METRICS, PROJECTS, FLAGS, POSTS, CATEGORIES, VALUES, TIMELINE,
});
