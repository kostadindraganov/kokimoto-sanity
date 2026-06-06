/* ============================================================
   article.jsx — single blog post / field note detail
   ============================================================ */

function slugify(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

/* derive the sidebar facets from the live post collection */
function useBlogFacets() {
  return useMemo(() => {
    const cats = {};
    const tags = {};
    const arch = {};
    POSTS.forEach((p) => {
      cats[p.category] = (cats[p.category] || 0) + 1;
      p.tags.forEach((t) => { tags[t] = (tags[t] || 0) + 1; });
      const d = new Date(p.date + "T00:00:00");
      const key = d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
      arch[key] = (arch[key] || 0) + 1;
    });
    const categories = Object.entries(cats).sort((a, b) => b[1] - a[1]);
    const allTags = Object.keys(tags).sort();
    const recent = [...POSTS].sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 5);
    const archives = Object.entries(arch); // already date-desc from POSTS order
    return { categories, allTags, recent, archives };
  }, []);
}

const ARTICLE_TOC = [
  { id: "sec-problem", label: "The problem" },
  { id: "sec-changed", label: "What I changed" },
  { id: "sec-keep", label: "What I'd keep" },
];

/* sticky right rail for the article: meta, TOC, search, taxonomy, recent */
function ArticleSidebar({ post, go }) {
  const { categories, allTags, recent, archives } = useBlogFacets();
  const [q, setQ] = useState("");
  const [active, setActive] = useState(ARTICLE_TOC[0].id);

  // scroll-spy: highlight the section currently in view
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    let io;
    const attach = () => {
      const els = ARTICLE_TOC.map((t) => document.getElementById(t.id)).filter(Boolean);
      if (els.length === 0) return false;
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); });
        },
        { rootMargin: "-80px 0px -65% 0px", threshold: 0 }
      );
      els.forEach((el) => io.observe(el));
      return true;
    };
    // the body streams in, so retry until headings exist
    let tries = 0;
    const id = setInterval(() => { if (attach() || ++tries > 40) clearInterval(id); }, 250);
    return () => { clearInterval(id); io && io.disconnect(); };
  }, [post.id]);

  const jump = (e, id) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top, behavior: "smooth" });
  };

  const search = (e) => {
    e.preventDefault();
    window.__blogSeed = { q: q.trim(), cat: "All" };
    go("blog");
  };
  const openCat = (c) => { window.__blogSeed = { q: "", cat: c }; go("blog"); };
  const openTag = (t) => { window.__blogSeed = { q: t, cat: "All" }; go("blog"); };

  return (
    <div className="aside-stack">
      {/* post meta */}
      <div className="aside-card">
        <div className="aside-grid2">
          <div>
            <div className="aside-k">reading time</div>
            <div className="aside-v acc">{post.read}</div>
          </div>
          <div>
            <div className="aside-k">category</div>
            <div className="aside-v">{post.category}</div>
          </div>
        </div>
        <div className="aside-k" style={{ marginTop: 14 }}>tags</div>
        <div className="aside-tags" style={{ marginTop: 7 }}>
          {post.tags.map((t) => <button key={t} className="aside-tag on" onClick={() => openTag(t)}>#{t}</button>)}
        </div>
      </div>

      {/* on this page */}
      <div className="aside-card">
        <div className="aside-head">on this page</div>
        <nav className="aside-toc">
          {ARTICLE_TOC.map((t) => (
            <a key={t.id} href={"#" + t.id} className={"aside-toc-link" + (active === t.id ? " active" : "")} onClick={(e) => jump(e, t.id)}>
              <span className="dot" />{t.label}
            </a>
          ))}
        </nav>
      </div>

      {/* search */}
      <div className="aside-card">
        <div className="aside-head">search</div>
        <form className="aside-search" onSubmit={search}>
          <span className="pfx">/</span>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="search field notes…" aria-label="Search posts" />
        </form>
      </div>

      {/* categories */}
      <div className="aside-card">
        <div className="aside-head">categories</div>
        <ul className="aside-list">
          {categories.map(([c, n]) => (
            <li key={c}><button onClick={() => openCat(c)}><span>{c}</span><span className="ct">{n}</span></button></li>
          ))}
        </ul>
      </div>

      {/* tags */}
      <div className="aside-card">
        <div className="aside-head">tags</div>
        <div className="aside-tags">
          {allTags.map((t) => <button key={t} className="aside-tag" onClick={() => openTag(t)}>#{t}</button>)}
        </div>
      </div>

      {/* recent posts */}
      <div className="aside-card">
        <div className="aside-head">recent posts</div>
        <ul className="aside-recent">
          {recent.map((p) => (
            <li key={p.id}>
              <a href={"#blog/" + p.id} onClick={(e) => { e.preventDefault(); go("blog/" + p.id); }}>
                <span className="rt">{p.title}</span>
                <span className="rd tnum">{fmtDate(p.date)}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* archives */}
      <div className="aside-card">
        <div className="aside-head">archives</div>
        <ul className="aside-list">
          {archives.map(([m, n]) => (
            <li key={m}><button onClick={() => go("blog")}><span>{m}</span><span className="ct">{n}</span></button></li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* templated long-form body, populated from post metadata.
   (placeholder copy — swap for real article content per post) */
function ArticleBody({ post, figs = [] }) {
  return (
    <div className="prose">
      <p className="lede">{post.summary}</p>

      <p>
        This note is written the way I actually work — pragmatic, measured, and biased toward
        what survives contact with production. The short version: the interesting decisions in
        {" "}<strong>{post.category.toLowerCase()}</strong> are rarely about the technology itself.
        They're about where you choose to absorb complexity, and where you refuse to.
      </p>

      <h3 id="sec-problem"><span className="hash">##</span>The problem</h3>
      <p>
        Most teams reach for the sophisticated answer before they've earned it. The failure mode
        isn't using the wrong tool — it's adopting power you can't yet operate. I've watched
        otherwise-sharp groups pay a recurring tax on abstractions that solved a problem they
        didn't have, while the problem they <em>did</em> have quietly compounded.
      </p>
      <div className="callout">
        <p>Rule of thumb: complexity you add is a loan. You'll service the interest on every
        change, every onboarding, and every incident — forever. Borrow deliberately.</p>
      </div>

      {figs[0] && (
        <figure className="article-fig">
          <div className="article-fig-frame">
            <img src={figs[0].src} alt="" loading="lazy" />
            <div className="article-fig-scan" />
          </div>
          <figcaption><span className="acc">fig.1</span> {figs[0].cap}</figcaption>
        </figure>
      )}

      <h3 id="sec-changed"><span className="hash">##</span>What I changed</h3>
      <p>
        The lever was making the system legible. Once the moving parts were named, typed, and
        observable, the team could reason about change instead of fearing it. A representative
        slice of the work:
      </p>
      <div className="codeblock">
        <div className="ch"><span className="lights"><i /><i /><i /></span><span>~/notes/{slugify(post.title)}.sh</span></div>
        <pre>
{`$ `}<span className="kw">git</span>{` log --oneline -3
`}<span className="nm">8bd01d8</span>{` `}<span className="st">refactor</span>{`: extract command handlers, make them idempotent
`}<span className="nm">3f9a210</span>{` `}<span className="st">feat</span>{`: add read-model projection + replay
`}<span className="nm">c10e4d7</span>{` `}<span className="st">chore</span>{`: instrument hot path with traces
`}<span className="cmt"># result: change became cheap, incidents became boring</span>
        </pre>
      </div>
      <ul>
        <li>Drew a hard line between commands (intent) and effects (consequence).</li>
        <li>Made every state transition observable before optimising any of them.</li>
        <li>Wrote the test that would have caught last quarter's incident — then the code.</li>
        <li>Deleted more than I added. Twice.</li>
      </ul>

      {figs[1] && (
        <figure className="article-fig">
          <div className="article-fig-frame">
            <img src={figs[1].src} alt="" loading="lazy" />
            <div className="article-fig-scan" />
          </div>
          <figcaption><span className="acc">fig.2</span> {figs[1].cap}</figcaption>
        </figure>
      )}

      <h3 id="sec-keep"><span className="hash">##</span>What I'd keep</h3>
      <p>
        If you take one thing from this: optimise for the cost of the <em>next</em> change, not
        the elegance of the current one. The teams that ship calmly aren't smarter — they've just
        made their systems cheap to change and easy to watch. Everything else is downstream of that.
      </p>
      <p className="muted" style={{ fontSize: 13.5 }}>
        — written between deploys. Reach me at <code>{SITE.email}</code> if you want to argue about any of it.
      </p>
    </div>
  );
}

function ArticlePage({ animate, onComplete, go, id }) {
  const idx = Math.max(0, POSTS.findIndex((p) => p.id === id));
  const post = POSTS[idx] || POSTS[0];
  const prev = POSTS[idx - 1];
  const next = POSTS[idx + 1];

  // hero = the post's own cover; inline figures pulled from the project gallery,
  // chosen deterministically per-post so each note varies
  const GALLERY = [
    { src: "project-images/atlas-console.svg",     cap: "the console, mid-refactor — commands split from effects" },
    { src: "project-images/ledger-core.svg",       cap: "read-model projection replayed from the event log" },
    { src: "project-images/northwind-edge.svg",    cap: "latency before / after the edge migration" },
    { src: "project-images/promptforge.svg",       cap: "the instrumentation that made the hot path legible" },
    { src: "project-images/relay-automation.svg",  cap: "the pipeline once every transition became observable" },
    { src: "project-images/fieldnotes-cms.svg",    cap: "the surface that shipped, traced end to end" },
  ];
  const hero = { src: "project-images/posts/" + post.id + ".svg", cap: post.title };
  const figs = [GALLERY[idx % GALLERY.length], GALLERY[(idx + 2) % GALLERY.length]];

  const steps = useMemo(() => [
    { kind: "node", delay: 140, gap: 0, node: (
      <button className="crumb" onClick={() => go("blog")}>
        <span className="ar">←</span> cd ../blog
      </button>
    ) },
    { kind: "node", delay: 180, gap: 26, node: (
      <div>
        <div className="amast">
          <span className="cat">{post.category}</span>
          <span className="faint">·</span>
          <span className="faint tnum">{fmtDate(post.date)}</span>
          <span className="faint">·</span>
          <span className="faint">{post.read} read</span>
        </div>
        <h1 className="h-display" style={{ fontSize: "clamp(28px,5vw,48px)", marginTop: 14, lineHeight: 1.05, maxWidth: "20ch" }}>{post.title}</h1>
        <div className="row gap-10" style={{ marginTop: 18 }}>
          <span className="mark" style={{ width: 30, height: 30, fontSize: 14 }}>k</span>
          <span><span style={{ color: "var(--ink)" }}>Kostadin Draganov</span><span className="faint" style={{ display: "block", fontSize: 12 }}>Senior · AI-Native Engineer</span></span>
        </div>
      </div>
    ) },
    { kind: "prompt", segments: shellPrompt("cat ./blog/" + slugify(post.title) + ".md"), gap: 30 },
    { kind: "tools", label: "generating cover image", actions: [
      "Sampling palette from post", "Compositing diagram layers", "Rendering 1600×800 cover", "Encoding + optimizing",
    ] },
    { kind: "think", duration: 1000 },
    { kind: "node", delay: 240, gap: 24, node: (
      <figure className="article-hero">
        <img src={hero.src} alt="" loading="lazy" />
        <div className="article-hero-scan" />
        <div className="article-hero-glow" />
        <figcaption className="article-hero-cap"><span className="acc">▸</span> {hero.cap}</figcaption>
      </figure>
    ) },
    { kind: "tools", label: "running tools", actions: [
      "Resolving article", "Rendering markdown", "Computing reading time", "Linking references",
    ] },
    { kind: "node", delay: 320, node: <ArticleBody post={post} figs={figs} /> },

    { kind: "node", delay: 160, gap: 44, node: (
      <div>
        <div className="chips" style={{ marginBottom: 28 }}>{post.tags.map((t) => <span key={t} className="chip">#{t}</span>)}</div>
        <SecHead idx="—" title="more notes" />
        <div className="pager">
          {prev ? (
            <a className="prev" href={"#blog/" + prev.id} onClick={(e) => { e.preventDefault(); go("blog/" + prev.id); }}>
              <span className="pk"><span className="ar">←</span> previous</span>
              <span className="pt">{prev.title}</span>
            </a>
          ) : <span className="prev empty" />}
          {next ? (
            <a className="next" href={"#blog/" + next.id} onClick={(e) => { e.preventDefault(); go("blog/" + next.id); }}>
              <span className="pk">next <span className="ar">→</span></span>
              <span className="pt">{next.title}</span>
            </a>
          ) : <span className="next empty" />}
        </div>
        <div style={{ marginTop: 22 }}>
          <CmdBtn cmd="tail" flag="./blog" onClick={() => go("blog")} />
        </div>
      </div>
    ) },
  ], [id]);

  return (
    <div className="page">
      <div className="article-layout">
        <div className="article-main">
          <Stream steps={steps} animate={animate} onComplete={onComplete} />
        </div>
        <aside className="article-aside">
          <ArticleSidebar post={post} go={go} />
        </aside>
      </div>
    </div>
  );
}

Object.assign(window, { ArticlePage, ArticleBody, ArticleSidebar, slugify });
