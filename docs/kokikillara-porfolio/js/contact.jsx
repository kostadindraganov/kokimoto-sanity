/* ============================================================
   contact.jsx — contact as a final command
   ============================================================ */

function ContactForm() {
  const [vals, setVals] = useState({ name: "", email: "", message: "" });
  const [errs, setErrs] = useState({});
  const [sent, setSent] = useState(false);

  const set = (k) => (e) => setVals((v) => ({ ...v, [k]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!vals.name.trim()) e.name = "name is required";
    if (!vals.email.trim()) e.email = "email is required";
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(vals.email.trim())) e.email = "invalid email format";
    if (!vals.message.trim()) e.message = "message body is empty";
    else if (vals.message.trim().length < 12) e.message = "message too short (min 12 chars)";
    return e;
  };

  const submit = (ev) => {
    ev.preventDefault();
    const e = validate();
    setErrs(e);
    if (Object.keys(e).length === 0) setSent(true);
  };

  if (sent) {
    return (
      <div className="panel" style={{ background: "var(--bg-1)" }}>
        <div className="panel-head">
          <span className="lights"><i /><i /><i /></span>
          <span className="title">connect — exit 0</span>
          <span className="meta ok">success</span>
        </div>
        <div className="panel-body">
          <div className="prompt" style={{ marginBottom: 14 }}><StaticPrompt segments={shellPrompt("connect", "--with Kostadin")} /></div>
          <Stream animate={true} steps={[{ kind: "lines", chunk: 240, lines: [
            <><span className="ok">✓</span> message queued <span className="faint">· from {vals.email}</span></>,
            <><span className="ok">✓</span> connection request ready</>,
            <><span className="ok">✓</span> response expected soon <span className="faint">· within 1–2 business days</span></>,
            <span className="muted" style={{ display: "block", marginTop: 10 }}>Thanks, {vals.name.split(" ")[0] || "there"}. I read every message myself.</span>,
          ] }]} />
          <div style={{ marginTop: 18 }}>
            <button className="btn ghost" onClick={() => { setSent(false); setVals({ name: "", email: "", message: "" }); }}>
              <span className="car">↻</span> send another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form className="panel" style={{ background: "var(--bg-1)" }} onSubmit={submit} noValidate>
      <div className="panel-head">
        <span className="lights"><i /><i /><i /></span>
        <span className="title">~/connect.sh</span>
        <span className="meta">stdin</span>
      </div>
      <div className="panel-body">
        <div className="field-wrap">
          <label htmlFor="c-name">--name <span className="req">*</span></label>
          <input id="c-name" className="tinput" placeholder="your name" value={vals.name} onChange={set("name")} />
          {errs.name && <div className="field-err"><span>✗</span> {errs.name}</div>}
        </div>
        <div className="field-wrap">
          <label htmlFor="c-email">--email <span className="req">*</span></label>
          <input id="c-email" className="tinput" placeholder="you@company.com" value={vals.email} onChange={set("email")} />
          {errs.email && <div className="field-err"><span>✗</span> {errs.email}</div>}
        </div>
        <div className="field-wrap">
          <label htmlFor="c-msg">--message <span className="req">*</span></label>
          <textarea id="c-msg" className="tinput" placeholder="what are you building? what do you need?" value={vals.message} onChange={set("message")} />
          {errs.message && <div className="field-err"><span>✗</span> {errs.message}</div>}
        </div>
        <div className="row gap-12" style={{ marginTop: 4, justifyContent: "space-between", flexWrap: "wrap" }}>
          <span className="faint" style={{ fontSize: 12 }}>// validated on submit · no data leaves this prototype</span>
          <button className="btn primary" type="submit">
            <span className="car">›</span> run connect
          </button>
        </div>
      </div>
    </form>
  );
}

function ContactSidebar() {
  const links = [
    { ic: "@", k: "email", v: SITE.email, href: "mailto:" + SITE.email },
    { ic: "gh", k: "github", v: SITE.github, href: "https://" + SITE.github },
    { ic: "in", k: "linkedin", v: SITE.linkedin, href: "https://" + SITE.linkedin },
  ];
  return (
    <div className="stack gap-12" style={{ alignSelf: "start" }}>
      <div className="panel">
        <div className="panel-body" style={{ padding: 16 }}>
          <div className="row gap-10" style={{ alignItems: "center" }}>
            <span className="dot" />
            <strong style={{ fontFamily: "var(--display)", fontSize: 15 }}>Available</strong>
          </div>
          <p className="muted" style={{ fontSize: 13, margin: "10px 0 0", lineHeight: 1.55 }}>
            Open to selected collaborations — architecture, full-stack delivery, and AI-native platform work.
          </p>
          <div className="faint" style={{ fontSize: 12, marginTop: 10 }}>{SITE.location}</div>
        </div>
      </div>
      {links.map((l) => (
        <a key={l.k} className="link-card" href={l.href} target={l.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
          <span className="lc-ic">{l.ic}</span>
          <span className="stack">
            <span className="lc-k">{l.k}</span>
            <span className="lc-v">{l.v}</span>
          </span>
          <span className="lc-arr">↗</span>
        </a>
      ))}
      <a className="link-card" href={SITE.cv} target="_blank" rel="noreferrer">
        <span className="lc-ic">↓</span>
        <span className="stack"><span className="lc-k">resume</span><span className="lc-v">download cv.pdf</span></span>
        <span className="lc-arr">↗</span>
      </a>
    </div>
  );
}

function ContactPage({ animate, onComplete, go }) {
  const steps = useMemo(() => [
    { kind: "node", delay: 160, gap: 0, node: (
      <div>
        <div className="eyebrow">/contact</div>
        <h1 className="h-display" style={{ fontSize: "clamp(28px,5vw,46px)", marginTop: 12 }}>Run the final command</h1>
        <p className="hero-bio" style={{ marginTop: 10 }}>
          Tell me what you're building. The form validates like a terminal and replies in kind.
        </p>
      </div>
    ) },
    { kind: "prompt", segments: shellPrompt("connect", "--with Kostadin"), gap: 28 },
    { kind: "think", duration: 1000 },
    { kind: "node", delay: 320, node: (
      <div className="split-2" style={{ marginTop: 6 }}>
        <ContactForm />
        <ContactSidebar />
      </div>
    ) },
  ], []);

  return (
    <div className="page">
      <Stream steps={steps} animate={animate} onComplete={onComplete} />
    </div>
  );
}

Object.assign(window, { ContactPage, ContactForm, ContactSidebar });
