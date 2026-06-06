/* ============================================================
   about.jsx — terminal session history / execution trace
   ============================================================ */

const STACK = [
  { k: "languages", v: ["TypeScript", "JavaScript", "SQL", "Python", "Go"] },
  { k: "backend / runtime", v: ["Node.js", "gRPC", "Kafka", "Temporal", "PostgreSQL", "Redis"] },
  { k: "frontend", v: ["Vue 3", "React", "Next.js", "Astro", "Vite", "Pinia"] },
  { k: "ai-native", v: ["LLM pipelines", "evals", "agent workflows", "RAG", "prompt infra"] },
  { k: "practice", v: ["architecture", "refactoring", "observability", "CI/CD", "mentoring"] },
];

function ValuesJson() {
  const vals = VALUES["engineering-values.json"];
  return (
    <div className="panel" style={{ background: "var(--bg)" }}>
      <div className="panel-head">
        <span className="lights"><i /><i /><i /></span>
        <span className="title">engineering-values.json</span>
        <span className="meta">read-only</span>
      </div>
      <div className="panel-body" style={{ fontSize: 13.5, lineHeight: 1.9 }}>
        <div className="faint">{"{"}</div>
        {vals.map((v, i) => (
          <div key={v.k} style={{ paddingLeft: 22 }}>
            <span className="warn">"{v.k}"</span>
            <span className="faint">: </span>
            <span className="muted">"{v.v}"</span>
            <span className="faint">{i < vals.length - 1 ? "," : ""}</span>
          </div>
        ))}
        <div className="faint">{"}"}</div>
      </div>
    </div>
  );
}

function AboutPage({ animate, onComplete, go }) {
  const steps = useMemo(() => [
    { kind: "node", delay: 160, gap: 0, node: (
      <div className="about-hero">
        <div className="about-hero-text">
          <div className="eyebrow">/about</div>
          <h1 className="h-display" style={{ fontSize: "clamp(28px,5vw,46px)", marginTop: 12 }}>Session history</h1>
        </div>
        <figure className="about-portrait">
          <AsciiReveal src="project-images/portrait.jpg" alt="Kostadin Draganov" columns={30} />
          <span className="about-portrait-ring" aria-hidden="true" />
          <span className="about-portrait-dot" aria-hidden="true" />
          <figcaption className="about-portrait-cap">
            <span className="acc">●</span> online
          </figcaption>
        </figure>
      </div>
    ) },

    { kind: "prompt", segments: shellPrompt("cat about.md"), gap: 30 },
    { kind: "think", duration: 1000 },
    { kind: "lines", chunk: 70, lines: [
      <span className="muted">I build and lead production software. Fifteen years in the JavaScript ecosystem — most of it spent making systems other engineers can change without fear.</span>,
      <span className="muted" style={{ display: "block", marginTop: 12 }}>These days the work spans the stack: Node.js services and architecture on the back, Vue and React consoles on the front, and AI-native workflows threaded through both. I optimise for delivery, maintainability, and matching complexity to the actual problem.</span>,
      <span className="muted" style={{ display: "block", marginTop: 12 }}>I'm equally comfortable owning an architecture decision, untangling a difficult module, or pairing with an agent to move faster. The constant is judgment — knowing which of those a situation calls for.</span>,
    ] },

    { kind: "node", delay: 160, gap: 52, node: <SecHead idx="01" title="experience" /> },
    { kind: "prompt", segments: shellPrompt('grep "experience"', "profile.md") },
    { kind: "think", duration: 800 },
    { kind: "node", delay: 320, node: (
      <div className="trace" style={{ marginTop: 18 }}>
        {TIMELINE.map((t, i) => (
          <div key={i} className={"trace-item" + (t.lit ? " lit" : "")}>
            <div className="yr tnum">{t.yr}</div>
            <h4>{t.role}</h4>
            <div className="co">{t.co}</div>
            <p>{t.body}</p>
          </div>
        ))}
      </div>
    ) },

    { kind: "node", delay: 160, gap: 52, node: <SecHead idx="02" title="values" /> },
    { kind: "prompt", segments: shellPrompt("inspect engineering-values.json") },
    { kind: "think", duration: 700 },
    { kind: "node", delay: 300, node: <div style={{ marginTop: 14 }}><ValuesJson /></div> },

    { kind: "node", delay: 160, gap: 52, node: <SecHead idx="03" title="stack" /> },
    { kind: "prompt", segments: shellPrompt("ls -R ./stack") },
    { kind: "think", duration: 700 },
    { kind: "node", delay: 300, node: (
      <dl className="kv" style={{ marginTop: 14, gridTemplateColumns: "160px 1fr", rowGap: 14 }}>
        {STACK.map((s) => (
          <React.Fragment key={s.k}>
            <dt style={{ paddingTop: 4 }}>{s.k}</dt>
            <dd><span className="chips">{s.v.map((x) => <span key={x} className="chip">{x}</span>)}</span></dd>
          </React.Fragment>
        ))}
      </dl>
    ) },

    { kind: "node", delay: 200, gap: 52, node: (
      <div className="row wrap gap-10">
        <CmdBtn cmd="download" flag="--cv" sub={SITE.cv} primary href={SITE.cv} download />
        <CmdBtn cmd="open" flag="./portfolio" onClick={() => go("portfolio")} />
        <CmdBtn cmd="connect" flag="--with Kostadin" onClick={() => go("contact")} />
      </div>
    ) },
  ], [go]);

  return (
    <div className="page">
      <Stream steps={steps} animate={animate} onComplete={onComplete} />
    </div>
  );
}

Object.assign(window, { AboutPage, ValuesJson, STACK });
