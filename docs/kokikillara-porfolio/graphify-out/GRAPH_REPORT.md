# Graph Report - docs/kokikillara-porfolio  (2026-06-06)

## Corpus Check
- 96 files · ~235,976 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 207 nodes · 208 edges · 37 communities detected
- Extraction: 90% EXTRACTED · 10% INFERRED · 0% AMBIGUOUS · INFERRED: 20 edges (avg confidence: 0.82)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Site Structure & Content|Site Structure & Content]]
- [[_COMMUNITY_Design System & Theming|Design System & Theming]]
- [[_COMMUNITY_Contact & Streaming|Contact & Streaming]]
- [[_COMMUNITY_Interactive Animations|Interactive Animations]]
- [[_COMMUNITY_Settings Panel|Settings Panel]]
- [[_COMMUNITY_App Core Logic|App Core Logic]]
- [[_COMMUNITY_ASCII Grid Renderer|ASCII Grid Renderer]]
- [[_COMMUNITY_Canvas Animation|Canvas Animation]]
- [[_COMMUNITY_React Rendering|React Rendering]]
- [[_COMMUNITY_Portfolio Gallery|Portfolio Gallery]]
- [[_COMMUNITY_Blog Display|Blog Display]]
- [[_COMMUNITY_UI Components|UI Components]]
- [[_COMMUNITY_Article Layout|Article Layout]]
- [[_COMMUNITY_ASCII Effects|ASCII Effects]]
- [[_COMMUNITY_Project Page|Project Page]]
- [[_COMMUNITY_Shell Interface|Shell Interface]]
- [[_COMMUNITY_Hero Effect|Hero Effect]]
- [[_COMMUNITY_Home Section|Home Section]]
- [[_COMMUNITY_About Section|About Section]]
- [[_COMMUNITY_Data Processing|Data Processing]]
- [[_COMMUNITY_Theme Provider|Theme Provider]]
- [[_COMMUNITY_Page Utils|Page Utils]]
- [[_COMMUNITY_Animation Utils|Animation Utils]]
- [[_COMMUNITY_Blog Features|Blog Features]]
- [[_COMMUNITY_Helper Functions|Helper Functions]]
- [[_COMMUNITY_Canvas Utils|Canvas Utils]]
- [[_COMMUNITY_Layout Components|Layout Components]]
- [[_COMMUNITY_Gallery Utils|Gallery Utils]]
- [[_COMMUNITY_SVG Diagram|SVG Diagram]]
- [[_COMMUNITY_Blog Images|Blog Images]]
- [[_COMMUNITY_UI Photos|UI Photos]]
- [[_COMMUNITY_Project Logos|Project Logos]]
- [[_COMMUNITY_Blog Visuals|Blog Visuals]]
- [[_COMMUNITY_Design Docs|Design Docs]]
- [[_COMMUNITY_Screenshot Gallery|Screenshot Gallery]]
- [[_COMMUNITY_Product Images|Product Images]]
- [[_COMMUNITY_Portrait Photo|Portrait Photo]]

## God Nodes (most connected - your core abstractions)
1. `Signature Interactions` - 11 edges
2. `Kostadin Draganov Portfolio` - 7 edges
3. `startEffect()` - 5 edges
4. `Component Vocabulary` - 5 edges
5. `Streaming Pages Animation` - 5 edges
6. `runAsciiReveal()` - 4 edges
7. `init()` - 4 edges
8. `Typography System` - 4 edges
9. `BentoCard()` - 3 edges
10. `App()` - 3 edges

## Surprising Connections (you probably didn't know these)
- `Sidebar with Tag Categories` --implements--> `Component Vocabulary`  [INFERRED]
  docs/kokikillara-porfolio/screenshots/01-sidebar-cats.png → docs/kokikillara-porfolio/DESIGN.md
- `Hover Test Interaction` --conceptually_related_to--> `Signature Interactions`  [INFERRED]
  docs/kokikillara-porfolio/screenshots/01-hover-test.png → docs/kokikillara-porfolio/DESIGN.md
- `About Page Timeline and Values` --implements--> `Streaming Pages Animation`  [INFERRED]
  docs/kokikillara-porfolio/screenshots/01-about-square.png → docs/kokikillara-porfolio/DESIGN.md
- `Blog Index with Recent Posts` --implements--> `Streaming Pages Animation`  [INFERRED]
  docs/kokikillara-porfolio/screenshots/verify1.png → docs/kokikillara-porfolio/DESIGN.md
- `Generation Sequence Timeline` --implements--> `Streaming Pages Animation`  [INFERRED]
  docs/kokikillara-porfolio/screenshots/02-gen-seq.png → docs/kokikillara-porfolio/DESIGN.md

## Hyperedges (group relationships)
- **blog_publication_system** — kostadin_draganov, blog_section, blog_categories, blog_tags [INFERRED]
- **project_showcase_workflow** — kokimoto_portfolio, portfolio_section, portfolio_projects, sidebar_ui [INFERRED]
- **responsive_design_implementation** — kokimoto_portfolio, mobile_layout, sidebar_ui, hover_interactions [INFERRED]

## Communities

### Community 0 - "Site Structure & Content"
Cohesion: 0.11
Nodes (26): About Section, ASCII Art Hero, Blog Categories, Field note: AI-native code review, The eval harness is the product, Event sourcing without the cult, Reading the room: 2026 framework notes, Node.js worker pools, revisited (+18 more)

### Community 1 - "Design System & Theming"
Cohesion: 0.1
Nodes (22): Ask Console REPL, Color System, Component Vocabulary, JetBrains Mono Font, .panel Component, Kostadin Draganov Portfolio, .prompt Component, CLI Metaphor Rationale (+14 more)

### Community 2 - "Contact & Streaming"
Cohesion: 0.11
Nodes (2): ContactForm(), shellPrompt()

### Community 3 - "Interactive Animations"
Cohesion: 0.14
Nodes (15): ASCII Reveal Effect, Bento Portfolio Grid, Blog Post Preview, Bootloader Animation, Command Palette, Hero ASCII Canvas, Mobile Console Drawer, ASCII Interactive Effect Rationale (+7 more)

### Community 4 - "Settings Panel"
Cohesion: 0.14
Nodes (0): 

### Community 5 - "App Core Logic"
Cohesion: 0.22
Nodes (4): App(), AskConsole(), prefersReduced(), useTweaks()

### Community 6 - "ASCII Grid Renderer"
Cohesion: 0.36
Nodes (6): animateCells(), imageToAsciiGrid(), onLoaded(), prepareCanvas(), shuffleArray(), startEffect()

### Community 7 - "Canvas Animation"
Cohesion: 0.43
Nodes (6): animationLoop(), init(), renderFrame(), sampleLogoIntoCells(), setupCanvas(), updatePhysics()

### Community 8 - "React Rendering"
Cohesion: 0.25
Nodes (8): Content Model, Streaming Animation Rationale, React 18 + Babel Standalone, Generation Sequence Timeline, About Page Timeline and Values, Blog Index with Recent Posts, Single Page App Architecture, Streaming Pages Animation

### Community 9 - "Portfolio Gallery"
Cohesion: 0.38
Nodes (3): BentoCard(), shortHash(), useScrollReveal()

### Community 10 - "Blog Display"
Cohesion: 0.4
Nodes (2): FeaturedPost(), fmtDate()

### Community 11 - "UI Components"
Cohesion: 0.33
Nodes (0): 

### Community 12 - "Article Layout"
Cohesion: 0.47
Nodes (4): ArticleBody(), ArticleSidebar(), slugify(), useBlogFacets()

### Community 13 - "ASCII Effects"
Cohesion: 0.53
Nodes (4): _palette(), runAsciiReveal(), _shuffle(), _toAsciiGrid()

### Community 14 - "Project Page"
Cohesion: 0.4
Nodes (0): 

### Community 15 - "Shell Interface"
Cohesion: 0.4
Nodes (0): 

### Community 16 - "Hero Effect"
Cohesion: 0.5
Nodes (0): 

### Community 17 - "Home Section"
Cohesion: 0.5
Nodes (0): 

### Community 18 - "About Section"
Cohesion: 0.67
Nodes (0): 

### Community 19 - "Data Processing"
Cohesion: 1.0
Nodes (0): 

### Community 20 - "Theme Provider"
Cohesion: 1.0
Nodes (0): 

### Community 21 - "Page Utils"
Cohesion: 1.0
Nodes (2): Ledger Core, Event Sourcing Append

### Community 22 - "Animation Utils"
Cohesion: 1.0
Nodes (2): Eval Coverage - 92%, PromptForge

### Community 23 - "Blog Features"
Cohesion: 1.0
Nodes (2): Northwind Edge, Streaming 180ms TTFB

### Community 24 - "Helper Functions"
Cohesion: 1.0
Nodes (2): Atlas Console, Operator Console v3

### Community 25 - "Canvas Utils"
Cohesion: 1.0
Nodes (2): Make Change Cheap - Taxonomy, Relay Automation

### Community 26 - "Layout Components"
Cohesion: 1.0
Nodes (0): 

### Community 27 - "Gallery Utils"
Cohesion: 1.0
Nodes (0): 

### Community 28 - "SVG Diagram"
Cohesion: 1.0
Nodes (1): Spacing, Radius, and Motion

### Community 29 - "Blog Images"
Cohesion: 1.0
Nodes (1): Tweaks Panel Controls

### Community 30 - "UI Photos"
Cohesion: 1.0
Nodes (1): Professional Presence

### Community 31 - "Project Logos"
Cohesion: 1.0
Nodes (1): Portrait photograph

### Community 32 - "Blog Visuals"
Cohesion: 1.0
Nodes (1): Glass cosmetic container

### Community 33 - "Design Docs"
Cohesion: 1.0
Nodes (1): Human eye close-up

### Community 34 - "Screenshot Gallery"
Cohesion: 1.0
Nodes (1): Hair texture back view

### Community 35 - "Product Images"
Cohesion: 1.0
Nodes (1): FieldNotes CMS

### Community 36 - "Portrait Photo"
Cohesion: 1.0
Nodes (1): Agent Drafts - AI-Native Review

## Knowledge Gaps
- **24 isolated node(s):** `JetBrains Mono Font`, `Space Grotesk Font`, `Spacing, Radius, and Motion`, `Token Meter`, `.tool Component` (+19 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Data Processing`** (2 nodes): `HeroAscii()`, `hero-ascii.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Theme Provider`** (2 nodes): `BootLoader()`, `bootloader.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Page Utils`** (2 nodes): `Ledger Core`, `Event Sourcing Append`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Animation Utils`** (2 nodes): `Eval Coverage - 92%`, `PromptForge`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Blog Features`** (2 nodes): `Northwind Edge`, `Streaming 180ms TTFB`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Helper Functions`** (2 nodes): `Atlas Console`, `Operator Console v3`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Canvas Utils`** (2 nodes): `Make Change Cheap - Taxonomy`, `Relay Automation`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Layout Components`** (1 nodes): `data.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Gallery Utils`** (1 nodes): `DESIGN.md`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `SVG Diagram`** (1 nodes): `Spacing, Radius, and Motion`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Blog Images`** (1 nodes): `Tweaks Panel Controls`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `UI Photos`** (1 nodes): `Professional Presence`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Project Logos`** (1 nodes): `Portrait photograph`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Blog Visuals`** (1 nodes): `Glass cosmetic container`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Design Docs`** (1 nodes): `Human eye close-up`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Screenshot Gallery`** (1 nodes): `Hair texture back view`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Product Images`** (1 nodes): `FieldNotes CMS`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Portrait Photo`** (1 nodes): `Agent Drafts - AI-Native Review`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Signature Interactions` connect `Interactive Animations` to `React Rendering`, `Design System & Theming`?**
  _High betweenness centrality (0.030) - this node is a cross-community bridge._
- **Why does `Kostadin Draganov Portfolio` connect `Design System & Theming` to `React Rendering`, `Interactive Animations`?**
  _High betweenness centrality (0.028) - this node is a cross-community bridge._
- **Why does `prefersReduced()` connect `App Core Logic` to `Contact & Streaming`?**
  _High betweenness centrality (0.023) - this node is a cross-community bridge._
- **What connects `JetBrains Mono Font`, `Space Grotesk Font`, `Spacing, Radius, and Motion` to the rest of the system?**
  _24 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Site Structure & Content` be split into smaller, more focused modules?**
  _Cohesion score 0.11 - nodes in this community are weakly interconnected._
- **Should `Design System & Theming` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Should `Contact & Streaming` be split into smaller, more focused modules?**
  _Cohesion score 0.11 - nodes in this community are weakly interconnected._