/* ============================================================
   shell.jsx — TopBar, StatusBar, CommandPalette, MobileConsole
   ============================================================ */

/* ---------------- Top system bar ---------------- */
function TopBar({ route, go, onPalette, onMobile }) {
  return (
    <header className="topbar">
      <div className="shell-inner topbar-row">
        <a className="brand" href="#" onClick={(e) => { e.preventDefault(); go("home"); }}>
          <span className="mark">k</span>
          <b>kostadin</b>
          <span className="sep domain">@</span>
          <span className="domain">portfolio</span>
        </a>

        <nav className="nav" aria-label="Primary">
          {NAV.map((n) => (
            <button key={n.href}
              className={"nav-item" + (route === n.href ? " active" : "")}
              aria-current={route === n.href ? "page" : undefined}
              onClick={() => go(n.href)}>
              <span className="slash">/</span>{n.label}
            </button>
          ))}
        </nav>

        <div className="topbar-right">
          <button className="kbd-hint" onClick={onPalette} aria-label="Open command palette">
            <span>run</span><span className="kbd">Ctrl</span><span className="kbd">K</span>
          </button>
          <span className="avail" title={SITE.availability}>
            <span className="dot" /><span className="lbl">available</span>
          </span>
          <button className="burger" onClick={onMobile} aria-label="Open navigation console" aria-haspopup="dialog">
            <span /><span /><span />
          </button>
        </div>
      </div>
    </header>
  );
}

/* ---------------- Bottom status bar ---------------- */
function StatusBar({ route }) {
  const branch = "main";
  // token meter mapped to scroll depth — 23k at the top, 140k at the bottom
  const [tokens, setTokens] = useState(23000);
  useEffect(() => {
    let raf = 0;
    const compute = () => {
      raf = 0;
      const doc = document.documentElement;
      const max = (doc.scrollHeight - window.innerHeight) || 1;
      const p = Math.min(1, Math.max(0, window.scrollY / max));
      setTokens(Math.round(23000 + p * (140000 - 23000)));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(compute); };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    compute();
    // page height grows as content streams in — keep the mapping in sync
    const id = setInterval(compute, 700);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
      clearInterval(id);
    };
  }, [route]);
  return (
    <footer className="statusbar">
      <div className="shell-inner statusbar-row">
        <span className="seg"><span className="branch">⎇ {branch}</span></span>
        <span className="seg hide-sm"><span className="ok">●</span> <b>ready</b></span>
        <span className="seg">~/<b>{route}</b></span>
        <span className="spacer" />
        <span className="seg token-meter" title="context tokens">
          <span className="tok-think">ultrathink</span>
          <span className="tok-glyph">✦</span>
          <span className="tok-num tnum">{tokens.toLocaleString()}</span>
          <span className="tok-unit">tokens</span>
        </span>
        <span className="seg">{SITE.location}</span>
      </div>
    </footer>
  );
}

/* ---------------- Command palette ---------------- */
function CommandPalette({ open, onClose, go, onNewSession }) {
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const inputRef = useRef(null);
  const scrimRef = useRef(null);

  const commands = useMemo(() => {
    const navCmds = NAV.map((n) => ({
      group: "navigate", icon: "›", label: n.command, sub: "page",
      run: () => { go(n.href); onClose(); },
    }));
    const actions = [
      { group: "actions", icon: "↻", label: "new session", sub: "replay streaming", run: () => { onNewSession(); onClose(); } },
      { group: "actions", icon: "@", label: "copy email", sub: SITE.email, run: () => { navigator.clipboard && navigator.clipboard.writeText(SITE.email); onClose(); } },
      { group: "links", icon: "↗", label: "open github", sub: SITE.github, run: () => { window.open("https://" + SITE.github, "_blank"); onClose(); } },
      { group: "links", icon: "↗", label: "open linkedin", sub: SITE.linkedin, run: () => { window.open("https://" + SITE.linkedin, "_blank"); onClose(); } },
    ];
    return [...navCmds, ...actions];
  }, [go, onClose, onNewSession]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return commands;
    return commands.filter((c) => (c.label + " " + c.sub + " " + c.group).toLowerCase().includes(s));
  }, [q, commands]);

  useEffect(() => { if (open) { setQ(""); setSel(0); setTimeout(() => inputRef.current && inputRef.current.focus(), 30); } }, [open]);
  useEffect(() => { setSel(0); }, [q]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") { e.preventDefault(); onClose(); }
      else if (e.key === "ArrowDown") { e.preventDefault(); setSel((s) => Math.min(s + 1, filtered.length - 1)); }
      else if (e.key === "ArrowUp") { e.preventDefault(); setSel((s) => Math.max(s - 1, 0)); }
      else if (e.key === "Enter") { e.preventDefault(); filtered[sel] && filtered[sel].run(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, filtered, sel, onClose]);

  if (!open) return null;

  let lastGroup = null;
  return (
    <div className="cmdk-scrim" ref={scrimRef}
      onMouseDown={(e) => { if (e.target === scrimRef.current) onClose(); }}
      role="dialog" aria-modal="true" aria-label="Command palette">
      <div className="cmdk">
        <div className="cmdk-input-row">
          <span className="who">{SITE.handle} ~ %</span>
          <input ref={inputRef} className="cmdk-input" value={q} placeholder="type a command…"
            onChange={(e) => setQ(e.target.value)} aria-label="Command input" />
        </div>
        <div className="cmdk-list">
          {filtered.length === 0 && <div className="cmdk-group">no matches — try /home, github, email</div>}
          {filtered.map((c, i) => {
            const head = c.group !== lastGroup ? c.group : null;
            lastGroup = c.group;
            return (
              <React.Fragment key={c.label + i}>
                {head && <div className="cmdk-group">{head}</div>}
                <div className={"cmdk-row" + (i === sel ? " sel" : "")}
                  onMouseEnter={() => setSel(i)} onClick={() => c.run()}>
                  <span className="ic">{c.icon}</span>
                  <span>{c.label}</span>
                  <span className="sub">{c.sub}</span>
                </div>
              </React.Fragment>
            );
          })}
        </div>
        <div className="cmdk-foot">
          <span><span className="k">↑↓</span> navigate</span>
          <span><span className="k">↵</span> run</span>
          <span><span className="k">esc</span> close</span>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Mobile console drawer ---------------- */
function MobileConsole({ open, onClose, route, go, onPalette, onNewSession }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    const first = ref.current && ref.current.querySelector("button");
    first && first.focus();
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <>
      <div className="mcon-scrim" onClick={onClose} />
      <div className="mcon" ref={ref} role="dialog" aria-modal="true" aria-label="Navigation console">
        <div className="mcon-head">
          <span className="brand">
            <span className="mark">k</span>
            <b>kostadin</b>
          </span>
          <button className="mcon-close" onClick={onClose} aria-label="Close navigation">×</button>
        </div>
        <div className="mcon-prompt">
          <span className="who" style={{ color: "var(--green)" }}>{SITE.handle}</span>
          <span style={{ color: "var(--ink-4)" }}>~ %</span>
          <span style={{ color: "var(--ink)" }}>nav</span>
          <Cursor />
        </div>
        <div className="mcon-list">
          {NAV.map((n) => (
            <button key={n.href}
              className={"mcon-item" + (route === n.href ? " active" : "")}
              onClick={() => { go(n.href); onClose(); }}>
              <span className="slash">/</span><span>{n.label}</span>
              <span className="ic">↵</span>
            </button>
          ))}
        </div>
        <div className="mcon-actions">
          {onPalette && (
            <button className="mcon-action" onClick={() => { onClose(); setTimeout(onPalette, 60); }}>
              <span className="ic">⌘</span>
              <span className="lbl">run command</span>
              <span className="kbd">Ctrl</span><span className="kbd">K</span>
            </button>
          )}
          {onNewSession && (
            <button className="mcon-action" onClick={() => { onNewSession(); onClose(); }}>
              <span className="ic">↻</span>
              <span className="lbl">new session</span>
              <span className="sub">replay stream</span>
            </button>
          )}
        </div>
        <div className="mcon-foot">
          <a href={"mailto:" + SITE.email}>{SITE.email}</a>
          <a href={"https://" + SITE.github} target="_blank" rel="noreferrer">github ↗</a>
          <a href={"https://" + SITE.linkedin} target="_blank" rel="noreferrer">linkedin ↗</a>
        </div>
      </div>
    </>
  );
}

Object.assign(window, { TopBar, StatusBar, CommandPalette, MobileConsole });
