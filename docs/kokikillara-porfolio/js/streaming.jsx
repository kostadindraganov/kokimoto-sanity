/* ============================================================
   streaming.jsx — Claude-Code-style streaming engine
   Primitives: Spinner, Cursor, Typewriter, ToolUseBlock,
   LinesView, NodeView  +  <Stream> timeline orchestrator.
   ============================================================ */
const { useState, useEffect, useRef, useMemo, useCallback } = React;

const BRAILLE = ["⠋","⠙","⠹","⠸","⠼","⠴","⠦","⠧","⠇","⠏"];

function prefersReduced() {
  return typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/* session tracking so the boot animation runs once per session.
   We use an in-memory Set (not sessionStorage) so a real page refresh
   re-runs both the boot loader and the home-page streaming reveal.
   Navigating page-to-page within the same load still remembers
   what's been seen, so going home → blog → home doesn't replay. */
const _bootSeen = new Set();
function bootSeen(key) { return _bootSeen.has(key); }
function markBoot(key) { _bootSeen.add(key); }
function clearAllBoots() { _bootSeen.clear(); }

/* ---------- Cursor ---------- */
function Cursor({ thin }) {
  return <span className={"cursor" + (thin ? " thin" : "")} aria-hidden="true" />;
}

/* ---------- Spinner (braille) ---------- */
function Spinner() {
  const [f, setF] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setF((x) => (x + 1) % BRAILLE.length), 80);
    return () => clearInterval(id);
  }, []);
  return <span className="spin">{BRAILLE[f]}</span>;
}

/* ---------- Typewriter (multi-segment, colored) ---------- */
function Typewriter({ segments, speed = 16, onDone }) {
  const chars = useMemo(() => {
    const out = [];
    segments.forEach((s) => { for (const ch of s.t) out.push({ ch, c: s.c }); });
    return out;
  }, [segments]);
  const [n, setN] = useState(0);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;
  useEffect(() => {
    let i = 0, t;
    const tick = () => {
      i++; setN(i);
      if (i < chars.length) t = setTimeout(tick, speed + Math.random() * speed);
      else if (doneRef.current) doneRef.current();
    };
    t = setTimeout(tick, speed);
    return () => clearTimeout(t);
  }, [chars]);
  const shown = chars.slice(0, n);
  // group consecutive same-color chars
  const groups = [];
  shown.forEach((c) => {
    const last = groups[groups.length - 1];
    if (last && last.c === c.c) last.t += c.ch;
    else groups.push({ c: c.c, t: c.ch });
  });
  return (
    <span>
      {groups.map((g, i) => <span key={i} className={g.c || ""}>{g.t}</span>)}
      {n < chars.length && <Cursor />}
    </span>
  );
}

function StaticPrompt({ segments }) {
  return <span>{segments.map((s, i) => <span key={i} className={s.c || ""}>{s.t}</span>)}</span>;
}

/* ---------- Prompt line ---------- */
function PromptView({ segments, state, onDone }) {
  return (
    <div className="prompt">
      {state === "active"
        ? <Typewriter segments={segments} speed={16} onDone={onDone} />
        : <StaticPrompt segments={segments} />}
    </div>
  );
}

/* ---------- Tool-use block ---------- */
function ToolUseBlock({ label, actions, state, onDone }) {
  const animate = state === "active";
  const [running, setRunning] = useState(animate ? 0 : actions.length);
  const [collapsed, setCollapsed] = useState(!animate);
  const [open, setOpen] = useState(false); // user expand override
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    if (!animate) return;
    let idx = 0, t;
    const step = () => {
      idx++; setRunning(idx);
      if (idx < actions.length) {
        t = setTimeout(step, 180 + Math.random() * 140);
      } else {
        t = setTimeout(() => { setCollapsed(true); if (doneRef.current) doneRef.current(); }, 280);
      }
    };
    t = setTimeout(step, 220);
    return () => clearTimeout(t);
  }, [animate, actions.length]);

  const showList = !collapsed || open;
  const ms = useMemo(() => actions.map(() => (120 + Math.floor(Math.random() * 900))), [actions]);

  return (
    <div className="tool reveal">
      <button className={"tool-head" + (showList ? " open" : "")}
        onClick={() => (collapsed ? setOpen((o) => !o) : null)}
        aria-expanded={showList}>
        <span className="bullet">●</span>
        <span>{collapsed ? `${actions.length} tool uses` : (label || "running tools")}</span>
        {collapsed && <span className="chev">›</span>}
      </button>
      {showList && (
        <div className="tool-list">
          {actions.map((a, i) => {
            const done = i < running;
            const run = i === running && animate;
            return (
              <div key={i} className={"tool-line" + (done ? " done" : run ? " run" : "")}>
                <span className="ic">{done ? "✓" : run ? <Spinner /> : "·"}</span>
                <span>{a}</span>
                {done && <span className="ms">{ms[i]}ms</span>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ---------- Lines view (reveal line-by-line) ---------- */
function LinesView({ lines, state, onDone, chunk = 55 }) {
  const animate = state === "active";
  const [k, setK] = useState(animate ? 0 : lines.length);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;
  useEffect(() => {
    if (!animate) return;
    let i = 0, t;
    const tick = () => {
      i++; setK(i);
      if (i < lines.length) t = setTimeout(tick, chunk + Math.random() * 25);
      else if (doneRef.current) doneRef.current();
    };
    t = setTimeout(tick, chunk);
    return () => clearTimeout(t);
  }, [animate]);
  return (
    <div className="out">
      {lines.slice(0, k).map((ln, i) => (
        <div key={i} className="ln reveal">
          {ln}
          {animate && i === k - 1 && k < lines.length && <Cursor thin />}
        </div>
      ))}
    </div>
  );
}

/* ---------- Node view (custom JSX body, reveal + advance) ---------- */
function NodeView({ node, state, onDone, delay = 360 }) {
  const animate = state === "active";
  const doneRef = useRef(onDone);
  doneRef.current = onDone;
  useEffect(() => {
    if (!animate) return;
    const t = setTimeout(() => doneRef.current && doneRef.current(), delay);
    return () => clearTimeout(t);
  }, [animate]);
  return <div className={animate ? "reveal" : ""}>{node}</div>;
}

/* ---------- Thinking view (Claude-Code-style pause before responding) ---------- */
const THINK_PHRASES = ["Thinking", "Pondering", "Synthesizing", "Composing", "Reasoning"];
function ThinkingView({ state, onDone, duration = 1000 }) {
  const animate = state === "active";
  const [phrase, setPhrase] = useState(0);
  const [t0] = useState(() => performance.now());
  const [now, setNow] = useState(0);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    if (!animate) return;
    const swap = setInterval(() => setPhrase((p) => (p + 1) % THINK_PHRASES.length), 280);
    const tick = setInterval(() => setNow(performance.now()), 60);
    const done = setTimeout(() => doneRef.current && doneRef.current(), duration);
    return () => { clearInterval(swap); clearInterval(tick); clearTimeout(done); };
  }, [animate, duration]);

  if (!animate) return null;
  const sec = Math.max(0.1, Math.min(duration / 1000, (now - t0) / 1000));
  return (
    <div className="think" role="status" aria-live="polite">
      <span className="think-glyph">✻</span>
      <span className="think-label">{THINK_PHRASES[phrase]}…</span>
      <span className="think-meta tnum">({sec.toFixed(1)}s · esc to interrupt)</span>
    </div>
  );
}

/* ---------- <Stream> timeline orchestrator ---------- */
function Stream({ steps, animate, onComplete, showMeter = true }) {
  const [active, setActive] = useState(animate ? 0 : steps.length);
  const completedRef = useRef(false);
  const [tokens, setTokens] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const startRef = useRef(null);

  useEffect(() => {
    if (!animate) { setActive(steps.length); }
  }, [animate, steps.length]);

  const advance = useCallback(() => {
    setActive((a) => {
      const n = a + 1;
      if (n >= steps.length && !completedRef.current) {
        completedRef.current = true;
        if (onComplete) setTimeout(onComplete, 0);
      }
      return n;
    });
  }, [steps.length, onComplete]);

  // if not animating, fire complete once
  useEffect(() => {
    if (!animate && !completedRef.current) {
      completedRef.current = true;
      if (onComplete) onComplete();
    }
  }, []);

  // token meter — increments while stream is active, freezes when settled
  useEffect(() => {
    if (!animate) return;
    if (startRef.current == null) startRef.current = performance.now();
    if (active >= steps.length) return;
    let last = performance.now();
    const id = setInterval(() => {
      const now = performance.now();
      const dt = (now - last) / 1000;
      last = now;
      setTokens((t) => t + Math.max(1, Math.floor(36 * dt + Math.random() * 6)));
      setElapsed((now - startRef.current) / 1000);
    }, 70);
    return () => clearInterval(id);
  }, [animate, active, steps.length]);

  const streaming = animate && active < steps.length;

  return (
    <div className="stream">
      {steps.map((s, i) => {
        if (i > active) return null;
        const state = i < active ? "settled" : (animate ? "active" : "settled");
        const wrap = (child) => (
          <div key={s.id || i} style={{ marginTop: i === 0 ? 0 : (s.gap != null ? s.gap : 18) }}>{child}</div>
        );
        if (s.kind === "prompt") return wrap(<PromptView segments={s.segments} state={state} onDone={advance} />);
        if (s.kind === "tools") return wrap(<ToolUseBlock label={s.label} actions={s.actions} state={state} onDone={advance} />);
        if (s.kind === "lines") return wrap(<LinesView lines={s.lines} state={state} onDone={advance} chunk={s.chunk} />);
        if (s.kind === "node") return wrap(<NodeView node={s.node} state={state} onDone={advance} delay={s.delay} />);
        if (s.kind === "think") return wrap(<ThinkingView state={state} onDone={advance} duration={s.duration || 1000} />);
        return null;
      })}
      {showMeter && (streaming || (animate && tokens > 0)) && (
        <div className={"stream-meter" + (streaming ? " live" : " settled")}>
          <span className="spin">{streaming ? "✻" : "✓"}</span>
          <span className="lbl">{streaming ? "streaming" : "complete"}</span>
          <span className="sep">·</span>
          <span className="tnum">{tokens.toLocaleString()}</span>
          <span className="unit">tokens</span>
          <span className="sep">·</span>
          <span className="tnum">{elapsed.toFixed(1)}s</span>
        </div>
      )}
    </div>
  );
}

/* ---------- helper: build a shell prompt segment list ---------- */
function shellPrompt(cmd, flag) {
  const segs = [
    { t: SITE.handle, c: "who" },
    { t: ":", c: "pct" },
    { t: "~", c: "path" },
    { t: " % ", c: "pct" },
    { t: cmd, c: "cmd" },
  ];
  if (flag) segs.push({ t: " " + flag, c: "flag" });
  return segs;
}

Object.assign(window, {
  Spinner, Cursor, Typewriter, StaticPrompt, PromptView,
  ToolUseBlock, LinesView, NodeView, ThinkingView, Stream,
  prefersReduced, bootSeen, markBoot, clearAllBoots, shellPrompt, BRAILLE,
});
