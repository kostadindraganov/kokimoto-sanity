/* ============================================================
   project.jsx — single portfolio project / deployment detail
   ============================================================ */

function buildLog(p) {
  const lines = [
    ["$ ", "kw:open", " ./portfolio/" + p.id],
    ["", "cmt:# cloning repository " + (p.repo || p.id)],
    ["✓ ", "st:resolved", " manifest · stack [" + p.stack.length + "]"],
    ["✓ ", "st:installed", " dependencies"],
    ["▸ ", "nm:build", " production bundle"],
    ["✓ ", "st:passed", " test suite · coverage nominal"],
    ["✓ ", "st:deployed", " status=" + p.status],
  ];
  return lines;
}

function LogPanel({ p }) {
  return (
    <div className="codeblock">
      <div className="ch"><span className="lights"><i /><i /><i /></span><span>deploy.log — {p.id}</span><span style={{ marginLeft: "auto", color: "var(--green)" }}>exit 0</span></div>
      <pre>
{`$ `}<span className="kw">open</span>{` ./portfolio/${p.id}
`}<span className="cmt"># cloning ${p.repo || "repository"}</span>{`
`}<span className="st">✓ resolved</span>{`  manifest · stack[${p.stack.length}]
`}<span className="st">✓ installed</span>{` dependencies
`}<span className="nm">▸ build</span>{`     production bundle … done
`}<span className="st">✓ passed</span>{`    test suite
`}<span className="st">✓ deployed</span>{`  status=${p.status}`}
      </pre>
    </div>
  );
}

function Field({ k, children }) {
  return (
    <div className="field" style={{ gridTemplateColumns: "104px 1fr" }}>
      <span className="fk">{k}</span>
      <span className="fv">{children}</span>
    </div>
  );
}

function ProjectPage({ animate, onComplete, go, id }) {
  const idx = Math.max(0, PROJECTS.findIndex((p) => p.id === id));
  const p = PROJECTS[idx] || PROJECTS[0];
  const prev = PROJECTS[idx - 1];
  const next = PROJECTS[idx + 1];

  const steps = useMemo(() => [
    { kind: "node", delay: 140, gap: 0, node: (
      <button className="crumb" onClick={() => go("portfolio")}>
        <span className="ar">←</span> cd ../portfolio
      </button>
    ) },
    { kind: "node", delay: 180, gap: 26, node: (
      <div>
        <div className="row gap-10 metarow" style={{ flexWrap: "wrap", fontSize: 12 }}>
          <span className="commit tnum acc">{shortHash(p.id)}</span>
          <span className="faint">{p.commit}</span>
          <span style={{ marginLeft: "auto" }}><Pill status={p.status} /></span>
        </div>
        <h1 className="h-display" style={{ fontSize: "clamp(30px,5.5vw,52px)", marginTop: 14 }}>{p.title}</h1>
        <div className="role" style={{ fontSize: 13.5, color: "var(--ink-3)", marginTop: 6 }}>{p.role}</div>
        <div className="chips" style={{ marginTop: 14 }}>{p.tags.map((t) => <span key={t} className="acc" style={{ fontSize: 12 }}>--{t}</span>)}</div>
      </div>
    ) },
    { kind: "prompt", segments: shellPrompt("open ./portfolio/" + p.id), gap: 30 },
    { kind: "think", duration: 1000 },
    { kind: "tools", label: "running tools", actions: [
      "Cloning repository", "Reading manifest", "Resolving build status", "Computing impact deltas",
    ] },

    { kind: "node", delay: 280, node: <LogPanel p={p} /> },

    { kind: "node", delay: 200, gap: 40, node: <SecHead idx="01" title="brief" /> },
    { kind: "node", delay: 240, node: (
      <div className="panel" style={{ background: "var(--bg-1)" }}>
        <div className="panel-body" style={{ paddingTop: 6, paddingBottom: 6 }}>
          <Field k="# problem">{p.problem}</Field>
          <Field k="+ solution">{p.solution}</Field>
          <Field k="$ stack"><span className="chips">{p.stack.map((s) => <span key={s} className="chip">{s}</span>)}</span></Field>
          <Field k="@ role">{p.role}</Field>
        </div>
      </div>
    ) },

    { kind: "node", delay: 160, gap: 40, node: <SecHead idx="02" title="impact" /> },
    { kind: "node", delay: 240, node: (
      <div className="grid cols-3">
        {p.impact.map((im, i) => (
          <div key={i} className="metric">
            <div className="diff" style={{ fontSize: 14 }}><span className="add">+ </span><span style={{ color: "var(--ink)" }}>{im}</span></div>
          </div>
        ))}
      </div>
    ) },

    { kind: "node", delay: 160, gap: 40, node: <SecHead idx="03" title="interface" /> },
    { kind: "node", delay: 240, node: (
      <div className="grid cols-2">
        <div className="ph" style={{ aspectRatio: "16 / 10" }}>screenshot · {p.title} — primary view</div>
        <div className="ph" style={{ aspectRatio: "16 / 10" }}>screenshot · {p.title} — detail</div>
      </div>
    ) },

    { kind: "node", delay: 200, gap: 40, node: (
      <div className="row wrap gap-10">
        {p.repo && <CmdBtn cmd="git clone" sub={p.repo} primary href={"https://" + p.repo} />}
        {p.live && <CmdBtn cmd="open" flag="--live" sub={p.live} href={"https://" + p.live} />}
      </div>
    ) },

    { kind: "node", delay: 160, gap: 44, node: (
      <div>
        <SecHead idx="—" title="more work" />
        <div className="pager">
          {prev ? (
            <a className="prev" href={"#portfolio/" + prev.id} onClick={(e) => { e.preventDefault(); go("portfolio/" + prev.id); }}>
              <span className="pk"><span className="ar">←</span> previous</span>
              <span className="pt">{prev.title}</span>
            </a>
          ) : <span className="prev empty" />}
          {next ? (
            <a className="next" href={"#portfolio/" + next.id} onClick={(e) => { e.preventDefault(); go("portfolio/" + next.id); }}>
              <span className="pk">next <span className="ar">→</span></span>
              <span className="pt">{next.title}</span>
            </a>
          ) : <span className="next empty" />}
        </div>
        <div style={{ marginTop: 22 }}>
          <CmdBtn cmd="ls" flag="./portfolio" onClick={() => go("portfolio")} />
        </div>
      </div>
    ) },
  ], [id]);

  return (
    <div className="page">
      <Stream steps={steps} animate={animate} onComplete={onComplete} />
    </div>
  );
}

Object.assign(window, { ProjectPage, LogPanel });
