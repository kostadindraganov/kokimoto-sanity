/* ============================================================
   portfolio.jsx — selected work as a bento grid with
   scroll-reveal animation
   ============================================================ */

function shortHash(id) {
  let h = 0; for (const c of id) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return h.toString(16).padStart(7, "0").slice(0, 7);
}

/* asymmetric bento sizes — applied positionally so the grid stays balanced.
   When the user filters, projects fall back to "m" (1-wide, 1-tall) so the
   layout still tiles cleanly with fewer items. */
const BENTO_SIZES_FULL = ["xl", "wide", "tall", "s", "wide", "s"];

function useScrollReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") { el.classList.add("in"); return; }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

function BentoCard({ p, size, idx, go }) {
  const ref = useScrollReveal();
  const tone = ["a", "b", "c", "d", "e", "f"][idx % 6];
  // split into chars (with non-breaking-space for spaces) so we can stagger reveal
  const titleChars = useMemo(() => Array.from(p.title), [p.title]);
  return (
    <article
      ref={ref}
      className={"bento bento-" + size + " bento-tone-" + tone}
      style={{ "--i": idx, "--delay": (idx * 70) + "ms" }}
      onClick={() => go("portfolio/" + p.id)}
    >
      <div className="bento-art">
        <div className="bento-art-inner">
          <img className="bento-img" src={"project-images/" + p.id + ".svg"} alt={p.title + " cover"} loading="lazy" />
          <div className="bento-art-scan" aria-hidden="true" />
          <div className="bento-art-glow" aria-hidden="true" />
        </div>
      </div>

      <div className="bento-meta">
        <div className="bento-head" data-r="0">
          <span className="commit tnum">{shortHash(p.id)}</span>
          <span className="bento-status"><Pill status={p.status} /></span>
        </div>

        <h3 className="bento-title" aria-label={p.title} data-r="1">
          {titleChars.map((ch, i) => (
            <span key={i} className="bento-ch" style={{ "--ci": i }}>{ch === " " ? "\u00A0" : ch}</span>
          ))}
          <span className="bento-title-cursor" aria-hidden="true">▍</span>
        </h3>

        <div className="bento-commit" data-r="2">
          <span className="acc">◇</span>
          <span className="bento-commit-msg">{p.commit}</span>
        </div>

        {(size === "xl" || size === "tall") && (
          <p className="bento-problem" data-r="3">{p.problem}</p>
        )}

        <div className="bento-foot" data-r="4">
          <div className="bento-tags">
            {p.tags.slice(0, size === "s" ? 2 : 3).map((t, ti) => (
              <span key={t} className="bento-tag" style={{ "--ti": ti }}>#{t}</span>
            ))}
          </div>
          <span className="bento-cta" aria-hidden="true">
            <span className="bento-cta-label">open</span>
            <span className="bento-cta-line" />
            <span className="bento-cta-arr">→</span>
          </span>
        </div>
      </div>
    </article>
  );
}

function BentoGrid({ projects, gridKey }) {
  return (
    <div className="bento-grid" key={gridKey}>
      {projects.map((p, i) => {
        const fullIdx = PROJECTS.findIndex((x) => x.id === p.id);
        const size = BENTO_SIZES_FULL[fullIdx % BENTO_SIZES_FULL.length] || "m";
        return <BentoCard key={p._key || p.id} p={p} size={size} idx={i} go={window.__go} />;
      })}
    </div>
  );
}

const INFINITE_MAX_PAGES = 8;

function PortfolioBoard({ go }) {
  const [active, setActive] = useState("all");
  const [pages, setPages] = useState(1);
  const sentinelRef = useRef(null);
  window.__go = go;

  const baseList = useMemo(
    () => (active === "all" ? PROJECTS : PROJECTS.filter((p) => p.tags.includes(active))),
    [active]
  );

  // reset paging when filter changes
  useEffect(() => { setPages(1); }, [active]);

  // expand into cycles for the infinite feed
  const expandedList = useMemo(() => {
    if (baseList.length === 0) return [];
    const out = [];
    for (let pg = 0; pg < pages; pg++) {
      for (const p of baseList) out.push({ ...p, _page: pg, _key: p.id + "@" + pg });
    }
    return out;
  }, [baseList, pages]);

  // observe the sentinel — when it nears the viewport, load another cycle
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    if (pages >= INFINITE_MAX_PAGES) return;
    if (typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setPages((p) => Math.min(INFINITE_MAX_PAGES, p + 1));
          }
        }
      },
      { rootMargin: "0px 0px 600px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [pages, baseList.length]);

  const atMax = pages >= INFINITE_MAX_PAGES;

  return (
    <div>
      <div className="row wrap gap-8 portfolio-filter">
        <span className="faint" style={{ fontSize: 12, alignSelf: "center", marginRight: 4 }}>filter:</span>
        {FLAGS.map((f) => (
          <button key={f.tag} className={"flag" + (active === f.tag ? " on" : "")} onClick={() => setActive(f.tag)}>
            <span className="dd">›</span>{f.flag}
          </button>
        ))}
        <span className="faint" style={{ fontSize: 12, alignSelf: "center", marginLeft: 4, whiteSpace: "nowrap" }}>
          {baseList.length} {baseList.length === 1 ? "match" : "matches"} · cycle {pages}/{INFINITE_MAX_PAGES}
        </span>
      </div>

      <BentoGrid projects={expandedList} gridKey={active} />

      <div ref={sentinelRef} className="bento-sentinel" aria-live="polite">
        {atMax ? (
          <span className="bento-sentinel-end">
            <span className="bs-dot">●</span> end of feed · {expandedList.length} cards rendered
          </span>
        ) : (
          <span className="bento-sentinel-loading">
            <Spinner />
            <span>streaming next cycle…</span>
            <span className="bs-meta">page {pages + 1}</span>
          </span>
        )}
      </div>
    </div>
  );
}

function PortfolioPage({ animate, onComplete, go }) {
  const steps = useMemo(() => [
    { kind: "node", delay: 160, gap: 0, node: (
      <div>
        <div className="eyebrow">/portfolio</div>
        <h1 className="h-display" style={{ fontSize: "clamp(28px,5vw,46px)", marginTop: 12 }}>Selected work</h1>
        <p className="hero-bio" style={{ marginTop: 10 }}>
          Each project is a deployment record — problem, solution, stack, and measured impact. Tap a tile for the full diff.
        </p>
      </div>
    ) },
    { kind: "prompt", segments: shellPrompt("ls ./portfolio"), gap: 28 },
    { kind: "think", duration: 900 },
    { kind: "tools", label: "running tools", actions: [
      "Scanning repositories", "Reading deploy logs", "Resolving build status", "Computing impact deltas",
    ] },
    { kind: "node", delay: 300, node: <PortfolioBoard go={go} /> },
  ], [go]);

  return (
    <div className="page">
      <Stream steps={steps} animate={animate} onComplete={onComplete} />
    </div>
  );
}

Object.assign(window, { PortfolioPage, BentoCard, BentoGrid, PortfolioBoard, shortHash });
