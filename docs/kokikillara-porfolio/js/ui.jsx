/* ============================================================
   ui.jsx — small shared presentational helpers
   ============================================================ */

function SecHead({ idx, title }) {
  return (
    <div className="sec-head">
      {idx && <span className="idx tnum">{idx}</span>}
      <h2>{title}</h2>
      <span className="rule" />
    </div>
  );
}

function Metric({ n, u, l }) {
  return (
    <div className="metric">
      <div className="n tnum">{n}<span className="u">{u}</span></div>
      <div className="l">{l}</div>
    </div>
  );
}

function StatLine({ k, v }) {
  return (
    <div className="statline">
      <span className="k">{k}</span>
      <span className="dots" />
      <span className="v">{v}</span>
    </div>
  );
}

function Pill({ status }) {
  const label = { live: "live", shipped: "shipped", active: "in progress", archived: "archived" }[status] || status;
  return <span className={"pill " + status}>{label}</span>;
}

/* CTA command button */
function CmdBtn({ cmd, flag, sub, onClick, primary, href, download }) {
  const inner = (
    <>
      <span className="car">›</span>
      <span><span className="cmd">{cmd}</span>{flag && <span className="acc"> {flag}</span>}</span>
      {sub && <span className="meta">{sub}</span>}
    </>
  );
  if (href) {
    const extra = download
      ? { download: typeof download === "string" ? download : true }
      : { target: "_blank", rel: "noreferrer" };
    return <a className={"btn" + (primary ? " primary" : "")} href={href} {...extra}>{inner}</a>;
  }
  return <button className={"btn" + (primary ? " primary" : "")} onClick={onClick}>{inner}</button>;
}

Object.assign(window, { SecHead, Metric, StatLine, Pill, CmdBtn });
