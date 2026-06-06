/* ============================================================
   app.jsx — router, tweaks, shell composition, mount
   ============================================================ */
const { useState: useStateA, useEffect: useEffectA, useMemo: useMemoA, useCallback: useCallbackA } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "heroLayout": "boot",
  "accent": "#db8c4e",
  "grain": true
}/*EDITMODE-END*/;

const PAGES = {
  home: HomePage,
  portfolio: PortfolioPage,
  about: AboutPage,
  blog: BlogPage,
  contact: ContactPage,
};

function parseHash() {
  const raw = (typeof location !== "undefined" && location.hash.slice(1)) || "home";
  const [base, ...rest] = raw.split("/");
  const param = rest.join("/");
  return { base: PAGES[base] ? base : "home", param };
}

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const reduced = prefersReduced();

  const [loc, setLoc] = useStateA(parseHash);
  const { base, param } = loc;
  const route = base;
  const pageId = base + (param ? "/" + param : "");
  const [nonce, setNonce] = useStateA(0);
  const [palette, setPalette] = useStateA(false);
  const [mobile, setMobile] = useStateA(false);
  const [booting, setBooting] = useStateA(() => !reduced);
  const [readyKey, setReadyKey] = useStateA(null);

  /* hash routing */
  useEffectA(() => {
    const onHash = () => setLoc(parseHash());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const go = useCallbackA((r) => {
    setMobile(false);
    if (r === pageId) { window.scrollTo({ top: 0, behavior: "smooth" }); return; }
    if (location.hash.slice(1) !== r) location.hash = r;
    const [b, ...rest] = r.split("/");
    setLoc({ base: PAGES[b] ? b : "home", param: rest.join("/") });
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pageId]);

  const newSession = useCallbackA(() => {
    clearAllBoots();
    setNonce((n) => n + 1);
    setBooting(true);
    window.scrollTo({ top: 0 });
  }, []);

  /* command palette hotkey */
  useEffectA(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault(); setPalette((p) => !p);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /* apply tweaks */
  useEffectA(() => { document.documentElement.style.setProperty("--accent", t.accent); }, [t.accent]);
  useEffectA(() => { document.body.classList.toggle("no-grain", !t.grain); }, [t.grain]);

  /* safety net: in throttled/backgrounded render surfaces CSS animations pause,
     leaving opacity-based entrances stuck hidden. If the page wrapper's entrance
     (0.42s) hasn't advanced shortly after mount, force everything visible. */
  useEffectA(() => {
    const onVis = () => { if (document.hidden) document.body.classList.add("anim-settled"); };
    onVis();
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);
  useEffectA(() => {
    const t = setTimeout(() => {
      const p = document.querySelector(".page");
      if (p && parseFloat(getComputedStyle(p).opacity || "1") < 0.5) {
        document.body.classList.add("anim-settled");
      }
    }, 750);
    return () => clearTimeout(t);
  }, [pageId, nonce, booting]);

  const animate = useMemoA(() => !reduced && !booting && !bootSeen(pageId), [pageId, nonce, reduced, booting]);
  const Page = param && base === "blog" ? ArticlePage
    : param && base === "portfolio" ? ProjectPage
    : (PAGES[base] || HomePage);
  const pageKey = pageId + "#" + nonce + (booting ? ":b" : "");

  /* the Ask console appears only once THIS page's streaming finishes;
     keying on pageKey auto-resets the transcript on every page change */

  return (
    <div className="shell">
      {booting && <BootLoader onDone={() => setBooting(false)} />}
      <TopBar route={route} go={go} onPalette={() => setPalette(true)} onMobile={() => setMobile(true)} />

      <main className="main">
        <div className="shell-inner">
          {!booting && (
            <>
              <Page key={pageKey} animate={animate} onComplete={() => { markBoot(pageId); setReadyKey(pageKey); }} go={go} heroLayout={t.heroLayout} id={param} />
              {readyKey === pageKey && (base === "home" || base === "about") && !param && (
                <div className="reveal">
                  <AskConsole key={pageKey} go={go} page={base} />
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <StatusBar route={pageId} />

      <CommandPalette open={palette} onClose={() => setPalette(false)} go={go} onNewSession={newSession} />
      <MobileConsole open={mobile} onClose={() => setMobile(false)} route={route} go={go} onPalette={() => setPalette(true)} onNewSession={newSession} />

      <TweaksPanel>
        <TweakSection label="Hero layout" />
        <TweakRadio label="Layout" value={t.heroLayout} options={["boot", "split"]} onChange={(v) => setTweak("heroLayout", v)} />
        <TweakSection label="Accent" />
        <TweakColor label="Accent" value={t.accent}
          options={["#db8c4e", "#e7c277", "#8fb573", "#7f9ec2"]}
          onChange={(v) => setTweak("accent", v)} />
        <TweakSection label="Atmosphere" />
        <TweakToggle label="Film grain + vignette" value={t.grain} onChange={(v) => setTweak("grain", v)} />
        <TweakButton label="Replay streaming session" onClick={newSession} />
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
