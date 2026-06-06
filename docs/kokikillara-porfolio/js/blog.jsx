/* ============================================================
   blog.jsx — streaming field-notes / engineering feed
   ============================================================ */

function fmtDate(d) {
  const dt = new Date(d + "T00:00:00");
  return dt.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "2-digit" });
}

function FeaturedPost({ p, onOpen }) {
  return (
    <div className="panel feat">
      <div className="panel-head">
        <span className="lights"><i /><i /><i /></span>
        <span className="title">~/blog</span>
        <span className="meta">pinned</span>
      </div>
      <div className="panel-body feat-body">
        <div className="feat-text">
          <div className="row gap-10 metarow" style={{ fontSize: 11.5, marginBottom: 14, flexWrap: "wrap" }}>
            <span className="acc">{p.category}</span>
            <span className="faint">·</span>
            <span className="faint tnum">{fmtDate(p.date)}</span>
            <span className="faint">·</span>
            <span className="faint">{p.read}</span>
          </div>
          <h3 className="h-display" style={{ fontSize: "clamp(22px,3.4vw,32px)", lineHeight: 1.08 }}>{p.title}</h3>
          <p className="hero-bio" style={{ marginTop: 12, maxWidth: "62ch" }}>{p.summary}</p>
          <div className="row wrap gap-8" style={{ marginTop: 16 }}>
            <span className="chips">{p.tags.map((t) => <span key={t} className="chip">#{t}</span>)}</span>
          </div>
          <div style={{ marginTop: 20 }}>
            <CmdBtn cmd="read" flag="article" primary onClick={onOpen} />
          </div>
        </div>
        <div className="feat-cover" aria-hidden="true">
          <img src={"project-images/posts/" + p.id + ".svg"} alt="" loading="lazy" />
          <div className="feat-cover-scan" />
          <div className="feat-cover-glow" />
        </div>
      </div>
    </div>
  );
}

const BLOG_INITIAL = 10;
const BLOG_STEP = 5;
const BLOG_MAX = 80;

function BlogBoard({ go }) {
  const seed = (typeof window !== "undefined" && window.__blogSeed) || null;
  if (typeof window !== "undefined") window.__blogSeed = null;
  const [q, setQ] = useState(seed ? seed.q : "");
  const [cat, setCat] = useState(seed ? seed.cat : "All");
  const [preview, setPreview] = useState(null); // { id, x, y }
  const [count, setCount] = useState(BLOG_INITIAL);
  const sentinelRef = useRef(null);
  const featured = useMemo(() => POSTS.find((p) => p.featured), []);

  const baseList = useMemo(() => {
    const s = q.trim().toLowerCase();
    return POSTS.filter((p) => !p.featured)
      .filter((p) => cat === "All" || p.category === cat)
      .filter((p) => !s || (p.title + " " + p.summary + " " + p.tags.join(" ")).toLowerCase().includes(s));
  }, [q, cat]);

  // reset when filter / search changes
  useEffect(() => { setCount(BLOG_INITIAL); }, [q, cat]);

  // expand baseList into a cycling feed up to `count`
  const list = useMemo(() => {
    if (baseList.length === 0) return [];
    const out = [];
    let cycle = 0;
    while (out.length < count && out.length < BLOG_MAX) {
      for (const p of baseList) {
        if (out.length >= count) break;
        out.push({ ...p, _cycle: cycle, _key: p.id + "@" + cycle });
        if (out.length >= BLOG_MAX) break;
      }
      cycle++;
    }
    return out;
  }, [baseList, count]);

  // sentinel observer — load more when nearing the bottom
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    if (list.length >= BLOG_MAX) return;
    if (typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setCount((c) => Math.min(BLOG_MAX, c + BLOG_STEP));
          }
        }
      },
      { rootMargin: "0px 0px 500px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [list.length, count]);

  const atMax = list.length >= BLOG_MAX || count > baseList.length * 12; // soft cap
  const showingCycle = baseList.length ? Math.ceil(list.length / baseList.length) : 0;

  return (
    <div className="blog-board">
      <FeaturedPost p={featured} onOpen={() => go("blog/" + featured.id)} />

      <div className="row wrap gap-10" style={{ margin: "26px 0 4px", alignItems: "center" }}>
        <div className="field-prefix" style={{ flex: "1 1 240px", maxWidth: 360 }}>
          <span className="pfx">/</span>
          <input className="tinput" placeholder="search field notes…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search posts" />
        </div>
      </div>

      <div className="row wrap gap-8" style={{ margin: "16px 0 8px" }}>
        {CATEGORIES.map((c) => (
          <button key={c} className={"flag" + (cat === c ? " on" : "")} onClick={() => setCat(c)}>{c}</button>
        ))}
      </div>

      <div className="row" style={{ justifyContent: "space-between", margin: "20px 0 4px", alignItems: "baseline" }}>
        <SecHead idx="02" title="log stream" />
        <span className="faint" style={{ fontSize: 12, whiteSpace: "nowrap" }}>
          {list.length} loaded {baseList.length > 0 && <> · cycle {showingCycle}</>}
        </span>
      </div>

      <div key={cat + q} className="post-list">
        {baseList.length === 0 && <div className="faint" style={{ padding: "24px 0" }}>// no entries match — clear the filter or search again</div>}
        {list.map((p, i) => (
          <button
            key={p._key || p.id}
            className="post-row reveal"
            style={{ animationDelay: ((i % BLOG_INITIAL) * 45) + "ms", width: "100%", background: "none", border: 0, borderBottom: "1px solid var(--line-soft)", textAlign: "left", cursor: "pointer" }}
            onClick={() => go("blog/" + p.id)}
            onMouseEnter={(e) => setPreview({ id: p.id, x: e.clientX, y: e.clientY })}
            onMouseMove={(e) => setPreview((cur) => (cur && cur.id === p.id ? { ...cur, x: e.clientX, y: e.clientY } : cur))}
            onMouseLeave={() => setPreview(null)}
          >
            <span className="pdate">{fmtDate(p.date)}</span>
            <span>
              <h4>{p.title}</h4>
              <p className="psum">{p.summary}</p>
              <span className="pmeta" style={{ marginTop: 8 }}>
                <span className="cat">{p.category}</span>
                <span>·</span>
                <span>{p.tags.map((t) => "#" + t).join(" ")}</span>
              </span>
            </span>
            <span className="read">{p.read} ↗</span>
          </button>
        ))}
      </div>

      {baseList.length > 0 && (
        <div ref={sentinelRef} className="bento-sentinel" aria-live="polite" style={{ minHeight: 64 }}>
          {atMax ? (
            <span className="bento-sentinel-end">
              <span className="bs-dot">●</span> end of feed · {list.length} entries
            </span>
          ) : (
            <span className="bento-sentinel-loading">
              <Spinner />
              <span>loading next {BLOG_STEP} entries…</span>
              <span className="bs-meta">·</span>
              <span className="bs-meta">{list.length}/{Math.min(BLOG_MAX, count + BLOG_STEP)}</span>
            </span>
          )}
        </div>
      )}

      <PostHoverPreview preview={preview} />

      <div className="row gap-10 metarow" style={{ marginTop: 24, color: "var(--ink-4)", fontSize: 12.5, flexWrap: "wrap" }}>
        <span>// archive</span>
        <span className="faint">{POSTS.length} unique entries · 2026</span>
        <span className="faint">· rss available</span>
      </div>
    </div>
  );
}

/* cursor-following preview tile for blog rows */
function PostHoverPreview({ preview }) {
  const [coarse, setCoarse] = useState(false);
  useEffect(() => {
    try { setCoarse(window.matchMedia && window.matchMedia("(pointer: coarse)").matches); } catch {}
  }, []);
  if (!preview || coarse) return null;
  const W = 248, H = 168, GAP = 20;
  const vw = window.innerWidth, vh = window.innerHeight;
  // sit just to the right of the cursor; flip left near the right edge
  let left = preview.x + GAP;
  if (left + W + 12 > vw) left = preview.x - W - GAP;
  left = Math.min(vw - W - 12, Math.max(12, left));
  // vertically centred on the cursor, kept on-screen
  const top = Math.min(vh - H - 12, Math.max(12, preview.y - H / 2));
  return (
    <div key={preview.id} className="post-preview" style={{ left, top, width: W, height: H }}>
      <img src={"project-images/posts/" + preview.id + ".svg"} alt="" />
      <div className="post-preview-scan" />
    </div>
  );
}

function BlogPage({ animate, onComplete, go }) {
  const steps = useMemo(() => [
    { kind: "node", delay: 160, gap: 0, node: (
      <div>
        <div className="eyebrow">/blog</div>
        <h1 className="h-display" style={{ fontSize: "clamp(28px,5vw,46px)", marginTop: 12 }}>Field notes</h1>
        <p className="hero-bio" style={{ marginTop: 10 }}>
          Engineering intelligence feed — articles, AI-native notes, framework observations, and the occasional update.
        </p>
      </div>
    ) },
    { kind: "prompt", segments: shellPrompt("tail -f ./blog", "--latest"), gap: 28 },
    { kind: "think", duration: 1000 },
    { kind: "tools", label: "running tools", actions: [
      "Opening content layer", "Sorting by published_at", "Computing reading time", "Streaming entries",
    ] },
    { kind: "node", delay: 300, node: <BlogBoard go={go} /> },
  ], [go]);

  return (
    <div className="page">
      <Stream steps={steps} animate={animate} onComplete={onComplete} />
    </div>
  );
}

Object.assign(window, { BlogPage, BlogBoard, FeaturedPost, PostHoverPreview, fmtDate });
