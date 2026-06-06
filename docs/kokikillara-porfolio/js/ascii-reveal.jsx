/* ============================================================
   ascii-reveal.jsx — images decode in from scrambling ASCII art
   then crossfade to the real photo. Ported from the uploaded
   vanilla effect and adapted into a reusable React component,
   tuned to the warm-graphite terminal palette.
   ============================================================ */

const ASCII_CHARS = "........:::=+xX#0369";
const ASCII_FONT = 13;            // px, monospace cell
const _denseStart = ASCII_CHARS.lastIndexOf(".") + 1;
const _denseChars = ASCII_CHARS.slice(_denseStart).split("");

/* measure a monospace cell once */
const _mctx = document.createElement("canvas").getContext("2d");
_mctx.font = `${ASCII_FONT}px monospace`;
const ASCII_CW = Math.ceil(_mctx.measureText("M").width);
const ASCII_CH = ASCII_FONT;

function _palette() {
  const cs = getComputedStyle(document.documentElement);
  return {
    bg:     (cs.getPropertyValue("--bg-1") || "#100e0b").trim(),
    ink:    (cs.getPropertyValue("--ink-2") || "#b9b1a0").trim(),
    accent: (cs.getPropertyValue("--accent") || "#db8c4e").trim(),
  };
}

/* sample img (cropped to the container aspect, cover) → char + brightness grids */
function _toAsciiGrid(img, cols, rows) {
  const s = document.createElement("canvas");
  s.width = cols; s.height = rows;
  const sctx = s.getContext("2d");

  const nw = img.naturalWidth, nh = img.naturalHeight;
  if (nw && nh) {
    const imgAspect = nw / nh;
    const boxAspect = cols / rows * (ASCII_CW / ASCII_CH);
    let cx = 0, cy = 0, cw = nw, ch = nh;
    if (imgAspect > boxAspect) { cw = nh * boxAspect; cx = (nw - cw) / 2; }
    else { ch = nw / boxAspect; cy = (nh - ch) / 2; }
    sctx.drawImage(img, cx, cy, cw, ch, 0, 0, cols, rows);
  } else {
    // SVG / sizeless image — scale the whole thing to fill the sampling grid
    sctx.drawImage(img, 0, 0, cols, rows);
  }
  const { data } = sctx.getImageData(0, 0, cols, rows);

  const chars = [], bright = [];
  for (let r = 0; r < rows; r++) {
    const cr = [], br = [];
    for (let c = 0; c < cols; c++) {
      const i = (r * cols + c) * 4;
      const lum = (data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114) / 255;
      const idx = Math.min(ASCII_CHARS.length - 1, Math.floor((1 - lum) * ASCII_CHARS.length));
      cr.push(ASCII_CHARS[idx]); br.push(idx);
    }
    chars.push(cr); bright.push(br);
  }
  return { chars, bright };
}

function _shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* run the decode animation on a canvas; calls onDone when settled.
   returns a cleanup fn. */
function runAsciiReveal(canvas, img, opts, onDone) {
  const cols = opts.columns || 46;
  const box = opts.box || { w: 100, h: 125 };
  const rows = Math.max(8, Math.round(cols * (box.h / box.w) * (ASCII_CW / ASCII_CH)));
  let chars, bright;
  try {
    ({ chars, bright } = _toAsciiGrid(img, cols, rows));
  } catch (err) {
    // tainted canvas / unreadable image — skip the effect, just reveal
    onDone && onDone();
    return () => {};
  }
  const { bg, ink, accent } = _palette();

  const dpr = 2;
  canvas.width = cols * ASCII_CW * dpr;
  canvas.height = rows * ASCII_CH * dpr;
  const ctx = canvas.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, cols * ASCII_CW, rows * ASCII_CH);
  ctx.font = `${ASCII_CH}px monospace`;
  ctx.textBaseline = "top";

  const draw = (col, row, ch, color) => {
    ctx.fillStyle = bg;
    ctx.fillRect(col * ASCII_CW, row * ASCII_CH, ASCII_CW, ASCII_CH);
    ctx.fillStyle = color;
    ctx.fillText(ch, col * ASCII_CW, row * ASCII_CH);
  };

  const total = cols * rows;
  const denseIdx = _denseStart - 1;
  const state = new Array(total).fill(null);
  let settled = 0;
  const timers = [];
  let ticker = null;
  let done = false;

  const finish = () => { if (done) return; done = true; onDone && onDone(); };

  const order = _shuffle(Array.from({ length: total }, (_, i) => i));
  const APPEAR = opts.appearMs != null ? opts.appearMs : 1.3;
  const SCRAMBLE = opts.scramble != null ? opts.scramble : 5;
  const SCRAMBLE_MS = opts.scrambleMs != null ? opts.scrambleMs : 42;
  const stagger = opts.stagger || 0;

  order.forEach((cell, i) => {
    timers.push(setTimeout(() => {
      const row = Math.floor(cell / cols), col = cell % cols;
      const isDark = bright[row][col] > denseIdx;
      if (!isDark) {
        draw(col, row, chars[row][col], ink);
        state[cell] = 0; settled++;
        if (settled === total) finish();
      } else {
        draw(col, row, _denseChars[(Math.random() * _denseChars.length) | 0], accent);
        state[cell] = SCRAMBLE;
      }
    }, stagger + i * APPEAR));
  });

  ticker = setInterval(() => {
    let busy = false;
    for (let cell = 0; cell < total; cell++) {
      const rem = state[cell];
      if (rem === null || rem === 0) continue;
      busy = true;
      const row = Math.floor(cell / cols), col = cell % cols;
      if (rem === 1) {
        draw(col, row, chars[row][col], ink);
        state[cell] = 0; settled++;
        if (settled === total) finish();
      } else {
        draw(col, row, _denseChars[(Math.random() * _denseChars.length) | 0], accent);
        state[cell] = rem - 1;
      }
    }
    if (!busy && settled === total) clearInterval(ticker);
  }, SCRAMBLE_MS);

  return () => { timers.forEach(clearTimeout); ticker && clearInterval(ticker); };
}

/* React wrapper — drop in place of an <img>. The parent must be a
   positioning context (position: relative/absolute + overflow hidden),
   which all the image frames on this site already are. */
function AsciiReveal({ src, alt = "", columns = 46, className = "", imgClassName = "", style, loading = "lazy" }) {
  const canvasRef = useRef(null);
  const imgRef = useRef(null);
  const wrapRef = useRef(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    setRevealed(false);
    const img = imgRef.current, canvas = canvasRef.current, wrap = wrapRef.current;
    if (!img || !canvas) return;
    if (typeof prefersReduced === "function" && prefersReduced()) { setRevealed(true); return; }

    let cleanup = null, cancelled = false, poll = null;
    const start = () => {
      if (cancelled || canvas.width > 300) return; // already running
      const rect = wrap.getBoundingClientRect();
      const box = { w: rect.width || 100, h: rect.height || 125 };
      cleanup = runAsciiReveal(canvas, img, { columns, box, stagger: 0 }, () => {
        // hold the finished ASCII portrait a beat, then dissolve to the photo
        if (!cancelled) setTimeout(() => { if (!cancelled) setRevealed(true); }, 260);
      });
    };
    const ready = () => img.complete && img.naturalWidth > 0;
    img.loading = "eager"; // the effect needs the pixels — don't defer the load
    if (ready()) start();
    else {
      img.addEventListener("load", start);
      // 'load' may fire before the listener attaches (cached) — poll as a safety net
      poll = setInterval(() => { if (ready()) { clearInterval(poll); poll = null; start(); } }, 120);
    }

    return () => {
      cancelled = true;
      img.removeEventListener("load", start);
      poll && clearInterval(poll);
      cleanup && cleanup();
    };
  }, [src, columns]);

  return (
    <span ref={wrapRef} className={"ascii-reveal" + (revealed ? " revealed" : "") + (className ? " " + className : "")} style={style}>
      <img ref={imgRef} src={src} alt={alt} loading={loading} className={"ascii-reveal-img" + (imgClassName ? " " + imgClassName : "")} />
      <canvas ref={canvasRef} className="ascii-reveal-canvas" aria-hidden="true" />
    </span>
  );
}

Object.assign(window, { AsciiReveal, runAsciiReveal });
