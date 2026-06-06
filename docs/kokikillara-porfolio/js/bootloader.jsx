/* ============================================================
   bootloader.jsx — terminal boot screen (initial load only)
   ============================================================ */

function BootLoader({ onDone }) {
  const LINES = useMemo(() => [
    "mount /profile.md",
    "load runtime · node v22.3",
    "index ./portfolio · " + PROJECTS.length + " systems",
    "start field-notes feed · " + POSTS.length + " entries",
    "warm ai-native workflows",
    "establish secure session",
  ], []);
  const N = LINES.length;
  const [cur, setCur] = useState(0);
  const [exit, setExit] = useState(false);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  useEffect(() => {
    let t;
    if (cur < N) {
      t = setTimeout(() => setCur((c) => c + 1), 240 + Math.random() * 150);
    } else {
      t = setTimeout(() => {
        setExit(true);
        setTimeout(() => doneRef.current && doneRef.current(), 560);
      }, 520);
    }
    return () => clearTimeout(t);
  }, [cur, N]);

  const pct = Math.round((Math.min(cur, N) / N) * 100);
  const shown = LINES.slice(0, cur < N ? cur + 1 : N);

  return (
    <div className={"boot" + (exit ? " exit" : "")} role="status" aria-label="Loading">
      <div className="boot-inner">
        <div className="boot-brand">
          <span className="mark">k</span>
          <span className="bt"><b>kostadin</b>.os</span>
          <span className="ver">v2026.5 · session boot</span>
        </div>
        <div className="boot-log">
          {shown.map((l, i) => {
            const done = cur >= N || i < cur;
            const running = cur < N && i === cur;
            return (
              <div key={i} className={"boot-line" + (done ? " ok" : "")}>
                <span className="tag">{done ? "[ ok ]" : running ? <Spinner /> : <span className="br">[ ·· ]</span>}</span>
                <span>{l}</span>
              </div>
            );
          })}
        </div>
        <div className="boot-bar"><div className="fill" style={{ width: pct + "%" }} /></div>
        <div className="boot-foot">
          <span>{cur >= N ? <span className="boot-ready">▸ ready — launching console</span> : "booting session…"}</span>
          <span className="pct tnum">{pct}%</span>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { BootLoader });
