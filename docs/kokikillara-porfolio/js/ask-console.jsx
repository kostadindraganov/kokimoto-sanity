/* ============================================================
   ask-console.jsx — interactive Claude-Code-style Q&A REPL
   Mounted on every page. Type a question → echo → tool-use
   block → streamed answer, sourced from data/qa.json.
   ============================================================ */

let __askUid = 0;

/* animated terminal placeholder — blinking cursor + yellow "Ask me something"
   that scrambles in left→right with bouncing letters + a brightness wave.
   Rendered only when the field is empty and unfocused. */
function AskPlaceholder({ text = "Ask me something" }) {
  const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz#%*+=:.";
  const [chars, setChars] = useState(() => text.split(""));
  useEffect(() => {
    let settle = null, loop = null;
    const scramble = () => {
      let frame = 0;
      clearInterval(settle);
      settle = setInterval(() => {
        frame++;
        const settled = frame / 2; // ~2 frames per locked-in letter → left→right resolve
        setChars(text.split("").map((ch, i) => {
          if (ch === " ") return " ";
          if (i < settled) return ch;
          return GLYPHS[(Math.random() * GLYPHS.length) | 0];
        }));
        if (settled >= text.length + 1) { clearInterval(settle); setChars(text.split("")); }
      }, 38);
    };
    scramble();
    loop = setInterval(scramble, 5200); // re-scramble periodically so it stays alive
    return () => { clearInterval(settle); clearInterval(loop); };
  }, [text]);
  return (
    <span className="ask-ph" aria-hidden="true">
      <span className="ask-ph-cursor">▍</span>
      <span className="ask-ph-text">
        {chars.map((ch, i) => (
          <span key={i} className="ask-ph-ch" style={{ animationDelay: (i * 55) + "ms" }}>
            {ch === " " ? "\u00A0" : ch}
          </span>
        ))}
      </span>
    </span>
  );
}

function AnswerStream({ entry, animate, onDone }) {
  const steps = useMemo(() => {
    const s = [];
    if (entry.tools) {
      // claude-code-style pause: ~3s "thinking" with a live token counter, then the tools + answer
      s.push({ kind: "think", duration: 3000, gap: 0 });
      s.push({ kind: "tools", label: "running tools", actions: entry.tools, gap: 14 });
    }
    s.push({
      kind: "lines", chunk: 38, gap: entry.tools ? 14 : 0,
      lines: entry.lines.map((l, i) => <span key={i}>{l}</span>),
    });
    if (entry.action) {
      s.push({
        kind: "node", delay: 140, node: (
          <div style={{ marginTop: 14 }}>
            <CmdBtn cmd={entry.action.cmd} flag={entry.action.flag} primary onClick={entry.go ? () => entry.go(entry.action.route) : undefined} />
          </div>
        ),
      });
    }
    return s;
  }, [entry]);
  return <Stream steps={steps} animate={animate} onComplete={onDone} />;
}

function AskConsole({ go, page }) {
  const reduce = prefersReduced();
  const [qa, setQa] = useState(window.QA);
  const [input, setInput] = useState("");
  const [entries, setEntries] = useState([]);
  const [focus, setFocus] = useState(false);
  const [hist, setHist] = useState([]);
  const [histIdx, setHistIdx] = useState(-1);
  const inputRef = useRef(null);

  useEffect(() => { window.QA_READY && window.QA_READY.then((d) => setQa(d)); }, []);

  const markDone = useCallback((uid) => {
    setEntries((es) => es.map((e) => (e.uid === uid ? { ...e, done: true } : e)));
    scrollBottom();
  }, []);

  const scrollBottom = () => {
    requestAnimationFrame(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" }));
  };

  const push = useCallback((q, lines, opts = {}) => {
    const uid = ++__askUid;
    setEntries((es) => [
      ...es,
      { uid, q, lines, action: opts.action, tools: opts.noTools ? null : qaTools(), done: false, go },
    ]);
    scrollBottom();
  }, [go]);

  const run = useCallback((raw) => {
    const text = (raw || "").trim();
    if (!text) return;
    setHist((h) => [text, ...h].slice(0, 40));
    setHistIdx(-1);
    setInput("");

    const lower = text.toLowerCase();
    if (lower === "clear" || lower === "cls") { setEntries([]); return; }
    if (lower === "ls" || lower === "ls ./" || lower === "ls .") {
      push(text, ["home/   portfolio/   about/   blog/   contact/"], { noTools: true });
      return;
    }
    const navMap = {
      "/home": "home", "/portfolio": "portfolio", "/about": "about", "/blog": "blog", "/contact": "contact",
      home: "home", portfolio: "portfolio", about: "about", blog: "blog", contact: "contact",
    };
    if (navMap[lower]) {
      push(text, ["→ opening /" + navMap[lower] + " …"], { noTools: true });
      setTimeout(() => go(navMap[lower]), 280);
      return;
    }
    const res = matchQA(qa, text);
    push(text, res.lines, { action: res.action });
  }, [qa, push, go]);

  const onKeyDown = (e) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setHistIdx((i) => { const n = Math.min(i + 1, hist.length - 1); if (hist[n] != null) setInput(hist[n]); return n; });
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setHistIdx((i) => { const n = Math.max(i - 1, -1); setInput(n === -1 ? "" : (hist[n] || "")); return n; });
    }
  };

  const suggestions = (qa.suggestions || []).slice(0, 6);

  return (
    <section className="ask-wrap" aria-label="Ask the console">
      <SecHead idx="»" title="ask the console" />
      <p className="muted" style={{ fontSize: 13, margin: "-6px 0 18px", maxWidth: "64ch" }}>
        A live session — type below and it answers like a Claude-Code CLI, from Kostadin's notes. Replies stream in above the prompt. Try a suggestion, or <code style={{ color: "var(--accent-2)" }}>help</code>.
      </p>

      {entries.length === 0 ? (
        <div className="qa-empty">// session listening — the prompt is at the bottom.</div>
      ) : (
        <div className="qa-transcript">
          {entries.map((e) => (
            <div key={e.uid} className="qa-entry">
              <div className="q-echo">
                <span className="who">{SITE.handle}</span>
                <span className="pct">:~ %</span>
                <span className="q">{e.q}</span>
              </div>
              <div className="qa-answer">
                <AnswerStream entry={e} animate={!e.done && !reduce} onDone={() => markDone(e.uid)} />
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="ask-dock">
        <div className="ask-suggest">
          {suggestions.map((s, i) => (
            <button key={i} className="s" onClick={() => run(s)}><span className="q">?</span>{s}</button>
          ))}
        </div>
        <form onSubmit={(e) => { e.preventDefault(); run(input); }}>
          <div className={"ask-input-row" + (focus ? " focus" : "")} onClick={() => inputRef.current && inputRef.current.focus()}>
            <span className="who">{SITE.handle}</span>
            <span className="pct">:~ %</span>
            <span className="ask-field">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                onFocus={() => setFocus(true)}
                onBlur={() => setFocus(false)}
                aria-label="Ask a question"
                autoComplete="off" autoCorrect="off" spellCheck="false"
              />
              {!focus && input.length === 0 && <AskPlaceholder text="Ask me something" />}
            </span>
            <span className="ret">↵</span>
          </div>
        </form>
      </div>
    </section>
  );
}

Object.assign(window, { AskConsole, AnswerStream, AskPlaceholder });
