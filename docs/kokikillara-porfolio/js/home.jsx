/* ============================================================
   home.jsx — live coding-session home page
   heroLayout tweak: "boot" (stacked terminal) | "split" (two-pane)
   ============================================================ */

function SystemCard() {
  return (
    <aside className="panel" style={{ alignSelf: "start" }}>
      <div className="panel-head">
        <span className="lights"><i /><i /><i /></span>
        <span className="title">~/system.card</span>
        <span className="meta">json</span>
      </div>
      <div className="panel-body">
        <div className="ph" style={{ aspectRatio: "1 / 1", marginBottom: 16 }}>portrait / headshot</div>
        <div className="row" style={{ justifyContent: "space-between", alignItems: "baseline" }}>
          <strong style={{ fontFamily: "var(--display)", fontSize: 17 }}>K. Draganov</strong>
          <span className="avail"><span className="dot" /><span style={{ fontSize: 11, color: "var(--ink-3)" }}>online</span></span>
        </div>
        <div className="muted" style={{ fontSize: 12.5, marginTop: 2 }}>Senior · AI-Native Engineer</div>
        <dl className="kv" style={{ marginTop: 16, gridTemplateColumns: "84px 1fr", fontSize: 12.5 }}>
          <dt>exp</dt><dd className="acc">15+ years</dd>
          <dt>stack</dt><dd>JS · Node · Vue · React</dd>
          <dt>tz</dt><dd>{SITE.location}</dd>
          <dt>status</dt><dd className="ok">{SITE.availability}</dd>
        </dl>
        <div className="row wrap gap-8" style={{ marginTop: 16 }}>
          <a className="flag" href={"https://" + SITE.github} target="_blank" rel="noreferrer">github ↗</a>
          <a className="flag" href={"https://" + SITE.linkedin} target="_blank" rel="noreferrer">linkedin ↗</a>
        </div>
      </div>
    </aside>
  );
}

function MiniWork({ p, go }) {
  return (
    <button className="proj" style={{ textAlign: "left", width: "100%", cursor: "pointer", background: "var(--bg-1)" }}
      onClick={() => go("portfolio/" + p.id)}>
      <div className="proj-head">
        <span className="commit">◇</span>
        <span className="commit commit-msg">{p.commit}</span>
        <span style={{ marginLeft: "auto" }}><Pill status={p.status} /></span>
      </div>
      <div className="proj-body" style={{ padding: "14px 16px" }}>
        <div className="row" style={{ justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
          <h3 style={{ fontSize: 17, margin: 0 }}>{p.title}</h3>
          <span className="faint" style={{ fontSize: 12 }}>{p.tags.map((t) => "#" + t).join(" ")}</span>
        </div>
        <p className="muted" style={{ fontSize: 13, margin: "8px 0 0", lineHeight: 1.55 }}>{p.problem}</p>
      </div>
    </button>
  );
}

function HomePage({ animate, onComplete, go, heroLayout }) {
  const [asciiDone, setAsciiDone] = useState(!animate);
  const [heroDone, setHeroDone] = useState(!animate);

  const heroSteps = useMemo(() => [
    { kind: "prompt", segments: shellPrompt("whoami") },
    { kind: "think", duration: 1000 },
    {
      kind: "tools", label: "running tools", actions: [
        "Reading profile.md", "Indexing selected work", "Checking AI-native workflow", "Fetching latest field notes",
      ],
    },
    {
      kind: "node", delay: 520, node: (
        <div>
          <h1 className="h-display hero-name">Kostadin Draganov</h1>
          <div className="hero-sub">Senior Software Developer · AI-Native Engineer</div>
          <p className="hero-bio">{SITE.shortBio}</p>
        </div>
      ),
    },
    {
      kind: "lines", chunk: 90, lines: [
        <><span className="ok">✓</span> experience loaded <span className="faint">· 15+ years in production</span></>,
        <><span className="ok">✓</span> projects indexed <span className="faint">· {PROJECTS.length} systems</span></>,
        <><span className="ok">✓</span> blog feed ready <span className="faint">· {POSTS.length} field notes</span></>,
        <><span className="warn">●</span> {SITE.availability}</>,
      ],
    },
  ], []);

  const featured = useMemo(() => PROJECTS.slice(0, 3), []);

  const restSteps = useMemo(() => [
    { kind: "node", delay: 200, gap: 0, node: <SecHead idx="01" title="selected work" /> },
    { kind: "prompt", segments: shellPrompt("head -n 3 ./portfolio", "--featured") },
    { kind: "think", duration: 3000 },
    {
      kind: "node", delay: 2000, node: (
        <div className="grid" style={{ marginTop: 4 }}>
          {featured.map((p) => <MiniWork key={p.id} p={p} go={go} />)}
        </div>
      ),
    },
    { kind: "node", delay: 160, gap: 52, node: <SecHead idx="02" title="at a glance" /> },
    { kind: "prompt", segments: shellPrompt("ls --stat ./profile") },
    { kind: "think", duration: 700 },
    {
      kind: "node", delay: 300, node: (
        <div className="grid cols-4" style={{ marginTop: 4 }}>
          {METRICS.map((m, i) => <Metric key={i} {...m} />)}
        </div>
      ),
    },
    { kind: "node", delay: 160, gap: 52, node: <SecHead idx="03" title="next steps" /> },
    { kind: "prompt", segments: shellPrompt("cat ./next-steps.md") },
    { kind: "think", duration: 800 },
    {
      kind: "node", delay: 200, node: (
        <div className="hero-cta" style={{ marginTop: 4 }}>
          <CmdBtn cmd="open" flag="./portfolio" primary onClick={() => go("portfolio")} />
          <CmdBtn cmd="read" flag="./about" onClick={() => go("about")} />
          <CmdBtn cmd="tail" flag="./blog" onClick={() => go("blog")} />
          <CmdBtn cmd="connect" flag="--with Kostadin" onClick={() => go("contact")} />
        </div>
      ),
    },
  ], [featured, go]);

  const heroBlock = (
    <div className="panel" style={{ background: "var(--bg-1)" }}>
      <div className="panel-head">
        <span className="lights"><i /><i /><i /></span>
        <span className="title">~/portfolio</span>
        <span className="meta">session · live</span>
      </div>
      <div className="panel-body hero-body">
        <div className="hero-stream">
          <Stream steps={heroSteps} animate={animate} onComplete={() => setHeroDone(true)} />
        </div>
        <aside className="hero-portrait" aria-hidden="true">
          <div className="hero-portrait-frame">
            <AsciiReveal src="project-images/portrait.jpg" alt="Kostadin Draganov" columns={40} />
            <div className="hero-portrait-scan" />
            <div className="hero-portrait-grain" />
          </div>
          <div className="hero-portrait-caption">
            <span className="hp-mark">▍</span>
            <span className="hp-name">k. draganov</span>
            <span className="hp-tag">// IRL.png</span>
          </div>
        </aside>
      </div>
    </div>
  );

  return (
    <div className="page">
      <HeroAscii word="KOKIMOTO" animate={animate} onDone={() => setAsciiDone(true)} />

      {asciiDone && (heroLayout === "split" ? (
        <div className="hero-split">
          {heroBlock}
          <div className="reveal hide-on-narrow"><SystemCard /></div>
        </div>
      ) : heroBlock)}

      <div style={{ marginTop: 40 }}>
        {heroDone && <Stream steps={restSteps} animate={animate} onComplete={onComplete} />}
      </div>
    </div>
  );
}

Object.assign(window, { HomePage, SystemCard, MiniWork });
