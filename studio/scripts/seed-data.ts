/**
 * seed-data.ts — Typed transcription of ALL template content.
 * Sources: docs/kokikillara-porfolio/js/data.jsx, qa.json, home.jsx,
 *          shell.jsx, contact.jsx, blog.jsx, portfolio.jsx, project.jsx, about.jsx, article.jsx
 *
 * This file exports pure data — no Sanity client calls here.
 */

// ─── Types ───────────────────────────────────────────────────────────────────

export interface MetricData {
  value: string
  unit: string
  label: string
}

export interface TimelineData {
  years: string
  role: string
  company: string
  body: string
  current?: boolean
}

export interface ValueItemData {
  key: string
  value: string
}

export interface StackRowData {
  term: string
  items: string[]
}

export interface CtaCommandData {
  cmd: string
  flag?: string
  sub?: string
  primary?: boolean
  route?: string[]
}

export interface ProjectData {
  id: string
  title: string
  slug: string
  commit: string
  status: 'live' | 'shipped' | 'active' | 'archived'
  tags: string[]
  role: string
  problem: string
  solution: string
  stack: string[]
  impact: string[]
  repo?: string
  live?: string
  order: number
}

export interface PostData {
  id: string
  title: string
  slug: string
  summary: string
  date: string
  category: string
  tags: string[]
  readTime: number
  featured?: boolean
}

export interface TagData {
  title: string
  slug: string
}

export interface CategoryData {
  title: string
  slug: string
  description?: string
}

export interface QaActionData {
  cmd: string
  flag?: string
  route?: string[]
}

export interface QaEntryData {
  id: string
  title: string
  keywords: string[]
  answer: string[]
  action?: QaActionData
  enabled: boolean
}

// ─── Tags (from FLAGS in data.jsx + extras needed by posts) ──────────────────

export const tagsData: TagData[] = [
  { title: 'frontend', slug: 'frontend' },
  { title: 'backend', slug: 'backend' },
  { title: 'ai', slug: 'ai' },
  { title: 'fullstack', slug: 'fullstack' },
  { title: 'architecture', slug: 'architecture' },
  // extras from posts
  { title: 'evals', slug: 'evals' },
  { title: 'llm', slug: 'llm' },
  { title: 'ci', slug: 'ci' },
  { title: 'event-sourcing', slug: 'event-sourcing' },
  { title: 'postgres', slug: 'postgres' },
  { title: 'vue', slug: 'vue' },
  { title: 'pinia', slug: 'pinia' },
  { title: 'ux', slug: 'ux' },
  { title: 'rsc', slug: 'rsc' },
  { title: 'edge', slug: 'edge' },
  { title: 'perf', slug: 'perf' },
  { title: 'workflow', slug: 'workflow' },
  { title: 'agents', slug: 'agents' },
  { title: 'refactoring', slug: 'refactoring' },
  { title: 'delivery', slug: 'delivery' },
  { title: 'node', slug: 'node' },
  { title: 'frameworks', slug: 'frameworks' },
]

// ─── Categories (from CATEGORIES in data.jsx) ─────────────────────────────

export const categoriesData: CategoryData[] = [
  { title: 'Engineering', slug: 'engineering' },
  { title: 'AI Native', slug: 'ai-native' },
  { title: 'Node.js', slug: 'node-js' },
  { title: 'Vue.js', slug: 'vue-js' },
  { title: 'React', slug: 'react' },
  { title: 'Next.js', slug: 'next-js' },
  { title: 'Architecture', slug: 'architecture' },
  { title: 'News', slug: 'news' },
]

// ─── Projects (from PROJECTS in data.jsx) ─────────────────────────────────

export const projectsData: ProjectData[] = [
  {
    id: 'ledger-core',
    title: 'Ledger Core',
    slug: 'ledger-core',
    commit: 'feat: real-time double-entry engine',
    status: 'live',
    tags: ['fullstack', 'architecture', 'backend'],
    role: 'Principal engineer · architecture & delivery',
    problem:
      'A fintech scale-up was losing reconciliation accuracy as transaction volume crossed 8M/day on a monolith that coupled ledgering to billing.',
    solution:
      'Re-architected the core into an event-sourced double-entry engine with idempotent command handlers, a read-model projection layer, and zero-downtime migrations.',
    stack: ['Node.js', 'TypeScript', 'PostgreSQL', 'Kafka', 'gRPC'],
    impact: ['reconciliation drift → 0', 'p99 write latency −68%', '8M → 30M tx/day headroom'],
    repo: 'https://github.com/kdraganov/ledger-core',
    live: 'https://ledger.example.com',
    order: 1,
  },
  {
    id: 'atlas-console',
    title: 'Atlas Console',
    slug: 'atlas-console',
    commit: 'feat: operator console for fleet automation',
    status: 'shipped',
    tags: ['frontend', 'fullstack'],
    role: 'Tech lead · frontend architecture',
    problem:
      'Field operators managed 2,000+ edge devices through five disconnected dashboards with no shared state or audit trail.',
    solution:
      'Unified them into a single Vue 3 console with a command-driven UX, optimistic mutations over a typed API, and a replayable action log.',
    stack: ['Vue 3', 'Pinia', 'Vite', 'Node.js', 'WebSocket'],
    impact: ['task time −54%', '5 tools → 1', 'full audit replay'],
    repo: 'https://github.com/kdraganov/atlas-console',
    order: 2,
  },
  {
    id: 'promptforge',
    title: 'PromptForge',
    slug: 'promptforge',
    commit: 'feat: evaluation harness for LLM pipelines',
    status: 'live',
    tags: ['ai', 'fullstack', 'backend'],
    role: 'Founding engineer · AI systems',
    problem:
      'An AI team shipped prompt changes blind — no regression signal, no cost ceiling, no way to compare model versions on real traffic.',
    solution:
      'Built an evaluation harness with versioned prompt sets, golden datasets, LLM-as-judge scoring, and a cost/latency budget gate wired into CI.',
    stack: ['Next.js', 'TypeScript', 'Python', 'Postgres', 'Redis'],
    impact: ['eval coverage 0 → 92%', 'prompt regressions caught pre-merge', '−31% token spend'],
    repo: 'https://github.com/kdraganov/promptforge',
    live: 'https://promptforge.example.com',
    order: 3,
  },
  {
    id: 'northwind-edge',
    title: 'Northwind Edge',
    slug: 'northwind-edge',
    commit: 'perf: edge-rendered storefront',
    status: 'shipped',
    tags: ['frontend', 'fullstack', 'architecture'],
    role: 'Consulting architect',
    problem:
      "A retail platform's Black-Friday traffic melted an SSR fleet; TTFB spiked to 2.4s and conversion fell with every 100ms.",
    solution:
      'Moved rendering to the edge with streaming React Server Components, a stale-while-revalidate cache mesh, and per-route islands.',
    stack: ['Next.js', 'React', 'Edge Runtime', 'Redis', 'Cloudflare'],
    impact: ['TTFB 2.4s → 180ms', 'peak RPS ×6', 'conversion +11%'],
    repo: 'https://github.com/kdraganov/northwind-edge',
    order: 4,
  },
  {
    id: 'relay-automation',
    title: 'Relay',
    slug: 'relay-automation',
    commit: 'feat: internal automation platform',
    status: 'live',
    tags: ['backend', 'ai', 'architecture'],
    role: 'Staff engineer · platform',
    problem:
      'Ops ran 200+ brittle cron scripts across three repos. Failures were silent and nobody owned the dependency graph.',
    solution:
      'Designed a typed workflow runtime with a DAG scheduler, retry/backoff semantics, an AI-assisted incident summarizer, and a single observability plane.',
    stack: ['Node.js', 'TypeScript', 'Temporal', 'OpenTelemetry'],
    impact: ['200 scripts → 1 platform', 'MTTR −73%', 'on-call pages −60%'],
    repo: 'https://github.com/kdraganov/relay',
    order: 5,
  },
  {
    id: 'fieldnotes-cms',
    title: 'Field Notes CMS',
    slug: 'fieldnotes-cms',
    commit: 'chore: headless content layer',
    status: 'active',
    tags: ['fullstack', 'frontend'],
    role: 'Solo · design & build',
    problem:
      'Wanted a writing surface that treated engineering notes as a queryable, versioned dataset — not WordPress.',
    solution:
      'A headless, git-backed content layer with typed schemas, a CLI, and an Astro front-end. This very portfolio runs on it.',
    stack: ['Astro', 'TypeScript', 'MDX', 'SQLite'],
    impact: ['publish in <10s', 'typed content', 'fully portable'],
    repo: 'https://github.com/kdraganov/fieldnotes',
    order: 6,
  },
]

// ─── Posts (from POSTS in data.jsx) ──────────────────────────────────────────

export const postsData: PostData[] = [
  {
    id: 'p1',
    title: 'The eval harness is the product',
    slug: 'the-eval-harness-is-the-product',
    summary:
      'Why I treat LLM evaluation infrastructure as a first-class system, not a notebook — and the four signals every AI pipeline should gate on.',
    date: '2026-05-18',
    category: 'AI Native',
    tags: ['evals', 'llm', 'ci'],
    readTime: 8,
    featured: true,
  },
  {
    id: 'p2',
    title: 'Event sourcing without the cult',
    slug: 'event-sourcing-without-the-cult',
    summary:
      'A pragmatic take on when double-entry / event-sourced models earn their complexity — and when they don\'t.',
    date: '2026-05-04',
    category: 'Architecture',
    tags: ['event-sourcing', 'postgres'],
    readTime: 11,
  },
  {
    id: 'p3',
    title: 'Vue 3 at console scale',
    slug: 'vue-3-at-console-scale',
    summary: 'State, command UX, and optimistic mutations for operator tools that real people use eight hours a day.',
    date: '2026-04-21',
    category: 'Vue.js',
    tags: ['vue', 'pinia', 'ux'],
    readTime: 7,
  },
  {
    id: 'p4',
    title: 'RSC streaming, measured',
    slug: 'rsc-streaming-measured',
    summary: 'TTFB numbers from moving a retail storefront to the edge, and the cache-mesh design that made it hold.',
    date: '2026-04-09',
    category: 'Next.js',
    tags: ['rsc', 'edge', 'perf'],
    readTime: 9,
  },
  {
    id: 'p5',
    title: 'Field note: AI-native code review',
    slug: 'field-note-ai-native-code-review',
    summary: 'The review loop I actually run now — agent drafts, I arbitrate. What got faster, what got worse.',
    date: '2026-03-27',
    category: 'AI Native',
    tags: ['workflow', 'agents'],
    readTime: 5,
  },
  {
    id: 'p6',
    title: 'Refactoring is a delivery skill',
    slug: 'refactoring-is-a-delivery-skill',
    summary: 'Fifteen years in, the highest-leverage thing I do is make change cheap. A taxonomy of safe refactors.',
    date: '2026-03-12',
    category: 'Engineering',
    tags: ['refactoring', 'delivery'],
    readTime: 10,
  },
  {
    id: 'p7',
    title: 'Node.js worker pools, revisited',
    slug: 'nodejs-worker-pools-revisited',
    summary: 'When threads beat processes, and a benchmark that surprised me on a CPU-bound parsing job.',
    date: '2026-02-28',
    category: 'Node.js',
    tags: ['node', 'perf'],
    readTime: 6,
  },
  {
    id: 'p8',
    title: 'Reading the room: 2026 framework notes',
    slug: 'reading-the-room-2026-framework-notes',
    summary: 'A field survey — what I\'m reaching for by default this year and why the defaults changed.',
    date: '2026-02-10',
    category: 'News',
    tags: ['frameworks'],
    readTime: 4,
  },
]

// ─── QA Entries (from data/qa.json — all 31 entries) ─────────────────────────

export const qaEntriesData: QaEntryData[] = [
  {
    id: 'greeting',
    title: 'greeting',
    keywords: ['hi', 'hey', 'hello', 'yo', 'good morning', 'good evening', 'sup'],
    answer: [
      "Hey — Kostadin's console here.",
      "Ask me about his experience, stack, projects, writing, or availability. Type `help` for the menu.",
    ],
    enabled: true,
  },
  {
    id: 'help',
    title: 'help',
    keywords: ['help', 'menu', 'what can i ask', 'commands', 'options', '?'],
    answer: [
      'You can ask about, or type:',
      '  experience · stack · projects · ai · blog · availability · contact',
      '  ledger · atlas · promptforge · relay · northwind',
      'commands: /home /portfolio /about /blog /contact · ls · whoami · clear',
    ],
    enabled: true,
  },
  {
    id: 'experience',
    title: 'experience',
    keywords: ['experience', 'years', 'how long', 'background', 'senior', 'career', 'history'],
    answer: [
      '15+ years building and leading production software — almost all of it in the JavaScript ecosystem.',
      'Roughly the last 9 of those as a tech lead / architect: owning architecture, delivery, and team direction.',
      'The throughline is judgment — knowing when to add complexity and, more often, when to remove it.',
    ],
    enabled: true,
  },
  {
    id: 'stack',
    title: 'stack',
    keywords: ['stack', 'tech', 'technologies', 'tools', 'languages', 'what do you use', 'skills'],
    answer: [
      'Languages: TypeScript, JavaScript, SQL, some Python and Go.',
      'Backend: Node.js, gRPC, Kafka, Temporal, PostgreSQL, Redis.',
      'Frontend: Vue 3, React, Next.js, Astro, Vite, Pinia.',
      'AI-native: LLM pipelines, evals, agent workflows, RAG, prompt infrastructure.',
    ],
    action: { cmd: 'read', flag: './about', route: ['about'] },
    enabled: true,
  },
  {
    id: 'node',
    title: 'node',
    keywords: ['node', 'nodejs', 'node.js', 'backend', 'server', 'api'],
    answer: [
      'Node.js is home turf — services, APIs, workers, and the architecture around them.',
      'Recent: an event-sourced ledger doing 30M tx/day of headroom, and a typed workflow runtime replacing 200+ cron scripts.',
      'I care about idempotency, observability, and making the hot path boring.',
    ],
    enabled: true,
  },
  {
    id: 'vue',
    title: 'vue',
    keywords: ['vue', 'vue 3', 'pinia', 'vuejs'],
    answer: [
      'Vue 3 is my default for operator-grade UIs — dense consoles people use eight hours a day.',
      'Atlas Console is the flagship: five disconnected dashboards unified into one command-driven Vue app with a replayable action log.',
    ],
    enabled: true,
  },
  {
    id: 'react',
    title: 'react',
    keywords: ['react', 'next', 'next.js', 'nextjs', 'rsc', 'edge', 'frontend'],
    answer: [
      'React + Next.js for product surfaces and anything that benefits from server components.',
      'Northwind Edge moved a retail storefront to edge-rendered RSC — TTFB went 2.4s → 180ms and peak RPS ×6.',
    ],
    enabled: true,
  },
  {
    id: 'architecture',
    title: 'architecture',
    keywords: ['architecture', 'architect', 'design', 'scale', 'system', 'scalability', 'patterns'],
    answer: [
      'Architecture is most of what I do now: drawing the lines that let teams change systems without fear.',
      "Event sourcing when it earns its keep, boring CRUD when it doesn't. The skill is telling the difference.",
      'I optimise for the cost of the *next* change, not the elegance of the current one.',
    ],
    enabled: true,
  },
  {
    id: 'ai',
    title: 'ai',
    keywords: ['ai', 'ai-native', 'llm', 'agent', 'agents', 'evals', 'eval', 'machine learning', 'ml', 'claude', 'gpt', 'rag'],
    answer: [
      'AI-native means agents draft and engineers arbitrate — the loop, not the magic.',
      'I treat LLM evaluation as a first-class system: versioned prompts, golden datasets, LLM-as-judge scoring, and a cost/latency gate in CI.',
      'PromptForge is that idea shipped — eval coverage 0 → 92%, token spend −31%.',
    ],
    action: { cmd: 'open', flag: './portfolio/promptforge', route: ['portfolio', 'promptforge'] },
    enabled: true,
  },
  {
    id: 'ledger',
    title: 'ledger',
    keywords: ['ledger', 'ledger core', 'fintech', 'double entry', 'double-entry', 'reconciliation'],
    answer: [
      'Ledger Core — re-architected a fintech monolith into an event-sourced double-entry engine.',
      'Reconciliation drift → 0, p99 write latency −68%, and headroom from 8M to 30M tx/day.',
      'Role: principal engineer, owning architecture and delivery.',
    ],
    action: { cmd: 'open', flag: './portfolio/ledger-core', route: ['portfolio', 'ledger-core'] },
    enabled: true,
  },
  {
    id: 'atlas',
    title: 'atlas',
    keywords: ['atlas', 'atlas console', 'operator', 'fleet', 'dashboard', 'console'],
    answer: [
      'Atlas Console — unified five operator dashboards (2,000+ edge devices) into one Vue 3 command console.',
      'Task time −54%, full audit replay, optimistic mutations over a typed API.',
    ],
    action: { cmd: 'open', flag: './portfolio/atlas-console', route: ['portfolio', 'atlas-console'] },
    enabled: true,
  },
  {
    id: 'promptforge',
    title: 'promptforge',
    keywords: ['promptforge', 'prompt forge', 'evaluation harness', 'harness'],
    answer: [
      'PromptForge — an evaluation harness for LLM pipelines, wired into CI.',
      'Versioned prompt sets, golden datasets, LLM-as-judge scoring, and a cost/latency budget gate.',
      'Eval coverage 0 → 92%, prompt regressions caught pre-merge, −31% token spend.',
    ],
    action: { cmd: 'open', flag: './portfolio/promptforge', route: ['portfolio', 'promptforge'] },
    enabled: true,
  },
  {
    id: 'relay',
    title: 'relay',
    keywords: ['relay', 'automation', 'cron', 'workflow', 'platform', 'scheduler'],
    answer: [
      'Relay — replaced 200+ brittle cron scripts with a typed workflow runtime.',
      'DAG scheduler, retry/backoff, an AI-assisted incident summarizer, one observability plane. MTTR −73%, on-call pages −60%.',
    ],
    action: { cmd: 'open', flag: './portfolio/relay-automation', route: ['portfolio', 'relay-automation'] },
    enabled: true,
  },
  {
    id: 'northwind',
    title: 'northwind',
    keywords: ['northwind', 'edge', 'storefront', 'retail', 'performance', 'ttfb', 'black friday'],
    answer: [
      'Northwind Edge — moved a retail storefront to edge-rendered streaming RSC with a stale-while-revalidate cache mesh.',
      'TTFB 2.4s → 180ms, peak RPS ×6, conversion +11%.',
    ],
    action: { cmd: 'open', flag: './portfolio/northwind-edge', route: ['portfolio', 'northwind-edge'] },
    enabled: true,
  },
  {
    id: 'projects',
    title: 'projects',
    keywords: ['projects', 'work', 'portfolio', 'what have you built', 'case studies', 'examples', 'show me'],
    answer: [
      'Selected work, each a deployment record with measured impact:',
      '  ledger-core   · event-sourced double-entry engine',
      '  atlas-console · operator console for device fleets',
      '  promptforge   · evaluation harness for LLM pipelines',
      '  relay         · typed automation platform',
      '  northwind-edge· edge-rendered storefront',
    ],
    action: { cmd: 'open', flag: './portfolio', route: ['portfolio'] },
    enabled: true,
  },
  {
    id: 'blog',
    title: 'blog',
    keywords: ['blog', 'writing', 'notes', 'field notes', 'articles', 'posts', 'read'],
    answer: [
      'Field Notes — an engineering feed: AI-native notes, architecture takes, framework observations.',
      'Recent: "The eval harness is the product" and "Event sourcing without the cult".',
    ],
    action: { cmd: 'tail', flag: './blog', route: ['blog'] },
    enabled: true,
  },
  {
    id: 'availability',
    title: 'availability',
    keywords: ['available', 'availability', 'hire', 'hiring', 'freelance', 'contract', 'work together', 'open to', 'consulting', 'engagement'],
    answer: [
      'Status: available for selected collaborations.',
      'Best fit: architecture, full-stack delivery, and AI-native platform work.',
      'I take on a small number of engagements at a time so each one gets real attention.',
    ],
    action: { cmd: 'connect', flag: '--with Kostadin', route: ['contact'] },
    enabled: true,
  },
  {
    id: 'rates',
    title: 'rates',
    keywords: ['rate', 'rates', 'cost', 'price', 'pricing', 'budget', 'how much', 'fee'],
    answer: [
      "Rates depend on scope and engagement shape — let's talk about the problem first.",
      "Run `connect` and tell me what you're building; I'll come back with a clear proposal.",
    ],
    action: { cmd: 'connect', flag: '--with Kostadin', route: ['contact'] },
    enabled: true,
  },
  {
    id: 'contact',
    title: 'contact',
    keywords: ['contact', 'email', 'reach', 'get in touch', 'message', 'talk', 'connect', 'mail'],
    answer: [
      'Reach me at kostadin@draganov.dev — or run the connect command and I\'ll reply within a day or two.',
      'Also on github.com/kdraganov and linkedin.com/in/kdraganov.',
    ],
    action: { cmd: 'connect', flag: '--with Kostadin', route: ['contact'] },
    enabled: true,
  },
  {
    id: 'location',
    title: 'location',
    keywords: ['where', 'location', 'based', 'remote', 'timezone', 'country', 'city'],
    answer: ['Based in Sofia, Bulgaria — work remote across European and US-overlapping hours.'],
    enabled: true,
  },
  {
    id: 'who',
    title: 'who',
    keywords: ['who are you', 'whoami', 'about you', 'tell me about yourself', 'introduce'],
    answer: [
      'Kostadin Draganov — Senior Software Developer & AI-Native Engineer.',
      '15+ years shipping production software; the last stretch focused on architecture and AI-native platforms.',
    ],
    action: { cmd: 'read', flag: './about', route: ['about'] },
    enabled: true,
  },
  {
    id: 'process',
    title: 'process',
    keywords: ['how do you work', 'process', 'approach', 'method', 'ways of working', 'delivery'],
    answer: [
      'Make the system legible first — named, typed, observable. Then change becomes cheap and incidents become boring.',
      'Agents draft, I arbitrate. I delete more than I add. I write the test that would have caught the last incident.',
    ],
    enabled: true,
  },
  {
    id: 'team',
    title: 'team',
    keywords: ['team', 'lead', 'leadership', 'mentor', 'mentoring', 'manage', 'people'],
    answer: [
      '9+ years leading: front-end architecture, design systems, performance budgets, and mentoring.',
      'I lead by making the right thing the easy thing — good defaults, clear seams, fast feedback.',
    ],
    enabled: true,
  },
  {
    id: 'strengths',
    title: 'strengths',
    keywords: ['why hire', 'why you', 'strengths', 'good at', 'best at', 'superpower'],
    answer: [
      'Range with depth: I can own an architecture call, untangle a legacy module, or pair with an agent — and pick the right one.',
      'Senior teams hire me to make change cheap and delivery calm.',
    ],
    enabled: true,
  },
  {
    id: 'resume',
    title: 'resume',
    keywords: ['resume', 'cv', 'curriculum', 'download'],
    answer: ['CV is available — grab cv.pdf from the contact page, or ask me anything here directly.'],
    action: { cmd: 'connect', flag: '--with Kostadin', route: ['contact'] },
    enabled: true,
  },
  {
    id: 'links',
    title: 'links',
    keywords: ['github', 'linkedin', 'social', 'profile', 'links', 'repo'],
    answer: ['github.com/kdraganov · linkedin.com/in/kdraganov'],
    enabled: true,
  },
  {
    id: 'thanks',
    title: 'thanks',
    keywords: ['thanks', 'thank you', 'ty', 'cheers', 'appreciate'],
    answer: ['Anytime. Run `connect` whenever you want to take it further.'],
    enabled: true,
  },
]

// ─── Site Settings ────────────────────────────────────────────────────────────

export const siteSettingsData = {
  _id: 'siteSettings',
  _type: 'siteSettings',
  name: 'Kostadin Draganov',
  handle: 'kostadin@portfolio',
  headline: 'Senior Software Developer · AI-Native Engineer',
  shortBio:
    '15+ years building production software with Node.js, Vue.js, React, Next.js, full-stack systems, architecture, automation, and AI engineering workflows.',
  email: 'kostadin@draganov.dev',
  github: 'https://github.com/kdraganov',
  linkedin: 'https://linkedin.com/in/kdraganov',
  location: 'Sofia, BG · remote',
  availability: 'available for selected collaborations',
  availabilityStatus: true,
  theme: {
    accentColor: {
      _type: 'color',
      hex: '#db8c4e',
      alpha: 1,
      hsl: { _type: 'hslaColor', h: 27, s: 0.65, l: 0.58, a: 1 },
      hsv: { _type: 'hsvaColor', h: 27, s: 0.65, v: 0.86, a: 1 },
      rgb: { _type: 'rgbaColor', r: 219, g: 140, b: 78, a: 1 },
    },
    grain: true,
    heroLayout: 'boot' as const,
  },
  askConsole: {
    enabled: true,
    heading: 'ask the console',
    description: 'A live session — type below to query Kostadin like an agent.',
    placeholder: 'Ask me something',
    emptyMessage: 'session listening — the prompt is at the bottom',
    suggestions: [
      "What's your experience?",
      "What's your stack?",
      'Are you available?',
      'Tell me about Ledger Core',
      'How do you work with AI?',
      'How can I reach you?',
    ],
    fallback: [
      "I don't have a note on that yet.",
      "Try asking about experience, stack, a specific project, AI workflows, or availability — or type `help`.",
    ],
  },
  statusbar: {
    branchLabel: 'main',
    statusText: 'ready',
  },
  uiText: {
    notFoundTitle: '✗ route not found · exit 127',
    notFoundBody: 'The path you requested does not exist. Navigate using the menu above.',
    commandPalettePlaceholder: 'type a command…',
    mobileConsolePrompt: 'nav',
    newSessionLabel: 'new session',
    copyEmailLabel: 'copy email',
  },
  seo: {
    metaTitle: 'Kostadin Draganov — Senior Software Developer · AI-Native Engineer',
    metaDescription:
      '15+ years building production software. Node.js, Vue.js, React, Next.js, architecture, and AI engineering workflows.',
  },
}

// ─── Navigation ───────────────────────────────────────────────────────────────

export const navigationData = {
  _id: 'navigation',
  _type: 'navigation',
  items: [
    { label: 'home', command: '/home', route: 'home' },
    { label: 'portfolio', command: '/portfolio', route: 'portfolio' },
    { label: 'about', command: '/about', route: 'about' },
    { label: 'blog', command: '/blog', route: 'blog' },
    { label: 'contact', command: '/contact', route: 'contact' },
  ],
}

// ─── Home Page ────────────────────────────────────────────────────────────────

export const homePageData = {
  _id: 'homePage',
  _type: 'homePage',
  heroWord: 'KOKIMOTO',
  promptCommand: 'whoami',
  toolActions: [
    'Reading profile.md',
    'Indexing selected work',
    'Checking AI-native workflow',
    'Fetching latest field notes',
  ],
  successLines: [
    '✓ experience loaded · 15+ years in production',
    '✓ projects indexed · 6 systems',
    '✓ blog feed ready · 8 field notes',
    '● available for selected collaborations',
  ],
  portraitCaption: '▍ k. draganov // IRL.png',
  featuredHeading: 'selected work',
  metricsHeading: 'at a glance',
  metrics: [
    { value: '15', unit: '+', label: 'years in production' },
    { value: '40', unit: '+', label: 'systems shipped' },
    { value: '9', unit: '', label: 'years team lead / architect' },
    { value: '100', unit: '%', label: 'JavaScript ecosystem' },
  ],
  nextStepsHeading: 'next steps',
  nextSteps: [
    { cmd: 'open', flag: './portfolio', primary: true, route: ['portfolio'] },
    { cmd: 'read', flag: './about', route: ['about'] },
    { cmd: 'tail', flag: './blog', route: ['blog'] },
    { cmd: 'connect', flag: '--with Kostadin', route: ['contact'] },
  ],
  systemCard: {
    roleLine: 'Senior · AI-Native Engineer',
    kvRows: [
      { key: 'exp', value: '15+ years' },
      { key: 'stack', value: 'JS · Node · Vue · React' },
      { key: 'tz', value: 'Sofia, BG · remote' },
      { key: 'status', value: 'available for selected collaborations' },
    ],
  },
}

// ─── About Page ───────────────────────────────────────────────────────────────

export const aboutPageData = {
  _id: 'aboutPage',
  _type: 'aboutPage',
  eyebrow: '/about',
  heading: 'Session history',
  portraitCaption: '● online',
  bioParagraphs: [
    'I build and lead production software. Fifteen years in the JavaScript ecosystem — most of it spent making systems other engineers can change without fear.',
    'These days the work spans the stack: Node.js services and architecture on the back, Vue and React consoles on the front, and AI-native workflows threaded through both. I optimise for delivery, maintainability, and matching complexity to the actual problem.',
    "I'm equally comfortable owning an architecture decision, untangling a difficult module, or pairing with an agent to move faster. The constant is judgment — knowing which of those a situation calls for.",
  ],
  experiencePrompt: 'grep "experience" profile.md',
  timeline: [
    {
      years: '2021 — now',
      role: 'Principal / Staff Engineer',
      company: 'Independent · fintech, AI platforms, retail',
      body: 'Architecture, delivery leadership, and AI-native platform work for teams scaling production systems. Event-sourced ledgers, evaluation infrastructure, edge rendering.',
      current: true,
    },
    {
      years: '2016 — 2021',
      role: 'Tech Lead · Frontend & Full-stack',
      company: 'Product companies (operator tooling, SaaS)',
      body: 'Led front-end architecture for operator consoles and dashboards on Vue and React; owned design-systems, performance budgets, and team mentoring.',
      current: false,
    },
    {
      years: '2011 — 2016',
      role: 'Full-stack Engineer',
      company: 'Agencies & early-stage startups',
      body: 'Shipped across the JavaScript stack as it matured — Node.js services, SPA front-ends, build tooling. Where the 10,000 hours came from.',
      current: false,
    },
  ],
  valuesPrompt: 'inspect engineering-values.json',
  values: [
    { key: 'maintainability', value: 'code is read 10× more than written' },
    { key: 'delivery', value: 'shipped & observed beats perfect & pending' },
    { key: 'refactoring', value: 'make change cheap, continuously' },
    { key: 'pragmatism', value: 'match complexity to the actual problem' },
    { key: 'product-minded', value: 'the system exists to serve users' },
    { key: 'ai-native', value: 'agents draft, engineers arbitrate' },
  ],
  stackPrompt: 'ls -R ./stack',
  stackRows: [
    { term: 'languages', items: ['TypeScript', 'JavaScript', 'SQL', 'Python', 'Go'] },
    { term: 'backend / runtime', items: ['Node.js', 'gRPC', 'Kafka', 'Temporal', 'PostgreSQL', 'Redis'] },
    { term: 'frontend', items: ['Vue 3', 'React', 'Next.js', 'Astro', 'Vite', 'Pinia'] },
    { term: 'ai-native', items: ['LLM pipelines', 'evals', 'agent workflows', 'RAG', 'prompt infra'] },
    { term: 'practice', items: ['architecture', 'refactoring', 'observability', 'CI/CD', 'mentoring'] },
  ],
  ctas: [
    { cmd: 'download', flag: '--cv', sub: 'cv.pdf', primary: true, route: ['contact'] },
    { cmd: 'open', flag: './portfolio', route: ['portfolio'] },
    { cmd: 'connect', flag: '--with Kostadin', route: ['contact'] },
  ],
}

// ─── Portfolio Page ───────────────────────────────────────────────────────────

export const portfolioPageData = {
  _id: 'portfolioPage',
  _type: 'portfolioPage',
  eyebrow: '/portfolio',
  heading: 'Selected work',
  intro: 'Each project is a deployment record — problem, solution, stack, and measured impact. Tap a tile for the full diff.',
  filterLabel: 'filter:',
  matchesText: '{n} {n, plural, one {match} other {matches}} · cycle {m}/{max}',
  loadingText: 'streaming next cycle…',
  endText: 'end of feed · {n} cards rendered',
  detailLabels: {
    deployLogTitle: 'deploy.log',
    deployLogLines: [
      '$ open ./portfolio/{slug}',
      '# cloning {repo}',
      '✓ resolved  manifest · stack[{stackCount}]',
      '✓ installed dependencies',
      '▸ build     production bundle … done',
      '✓ passed    test suite',
      '✓ deployed  status={status}',
    ],
    briefHeading: 'brief',
    problemLabel: '# problem',
    solutionLabel: '+ solution',
    stackLabel: '$ stack',
    roleLabel: '@ role',
    impactHeading: 'impact',
    interfaceHeading: 'interface',
    cloneLabel: 'git clone',
    openLiveLabel: 'open live',
    backLabel: 'cd ../portfolio',
    prevLabel: 'previous',
    nextLabel: 'next',
    moreWorkHeading: 'more work',
  },
}

// ─── Blog Page ────────────────────────────────────────────────────────────────

export const blogPageData = {
  _id: 'blogPage',
  _type: 'blogPage',
  eyebrow: '/blog',
  heading: 'Field notes',
  intro: 'Engineering intelligence feed — articles, AI-native notes, framework observations, and the occasional update.',
  featuredPanelTitle: '~/blog',
  featuredBadge: 'pinned',
  readButtonLabel: 'read article',
  searchPlaceholder: '/search field notes…',
  noMatchesText: '// no entries match — clear the filter or search again',
  loadingText: 'loading next {n} entries…',
  endText: 'end of feed · {n} entries',
  archiveLabel: '// archive',
  archiveNote: '{n} unique entries · {year} · rss available',
  articleLabels: {
    tocHeading: 'on this page',
    searchHeading: 'search',
    categoriesHeading: 'categories',
    tagsHeading: 'tags',
    recentHeading: 'recent posts',
    archivesHeading: 'archives',
    readingTimeHeading: 'reading time',
    categoryHeading: 'category',
    moreNotesHeading: 'more notes',
    backLabel: 'cd ../blog',
    figCaptionPrefix: 'fig.',
    toolActionsGenerateCover: [
      'Sampling palette from post',
      'Compositing diagram layers',
      'Rendering 1600×800 cover',
      'Encoding + optimizing',
    ],
    toolActionsRunning: [
      'Resolving article',
      'Rendering markdown',
      'Computing reading time',
      'Linking references',
    ],
  },
}

// ─── Contact Page ─────────────────────────────────────────────────────────────

export const contactPageData = {
  _id: 'contactPage',
  _type: 'contactPage',
  eyebrow: '/contact',
  heading: 'Run the final command',
  intro: 'Tell me what you\'re building. The form validates like a terminal and replies in kind.',
  formTitle: '~/connect.sh',
  formBadge: '[stdin]',
  nameField: {
    label: '--name',
    placeholder: 'your name',
  },
  emailField: {
    label: '--email',
    placeholder: 'you@company.com',
  },
  messageField: {
    label: '--message',
    placeholder: 'what are you building? what do you need?',
  },
  submitLabel: 'run connect',
  formNote: '// validated on submit · no data leaves this prototype',
  validationMessages: {
    nameRequired: 'name is required',
    emailRequired: 'email is required',
    emailInvalid: 'invalid email format',
    messageRequired: 'message body is empty',
    messageTooShort: 'message too short (min 12 chars)',
  },
  successPanelTitle: 'connect — exit 0',
  successLines: [
    '✓ message queued · from {email}',
    '✓ connection request ready',
    '✓ response expected soon · within 1–2 business days',
  ],
  successGreeting: 'Thanks, {firstName}. I read every message myself.',
  sendAnotherLabel: '↻ send another',
  availabilityHeading: '● Available',
  availabilityText: 'Open to selected collaborations — architecture, full-stack delivery, and AI-native platform work.',
  resumeLabel: '↓ resume',
}
