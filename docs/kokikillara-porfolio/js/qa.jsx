/* ============================================================
   qa.jsx — loads data/qa.json (Claude-Code-style Q&A console
   knowledge base) and exposes a keyword matcher.
   ============================================================ */

/* minimal fallback so the console never hard-fails if the
   JSON can't be fetched (e.g. opened from file://) */
const QA_FALLBACK = {
  suggestions: ["What's your experience?", "What's your stack?", "Are you available?"],
  entries: [
    { id: "experience", k: ["experience", "years", "background"], a: ["15+ years building production software across the JavaScript ecosystem — most of the last decade leading architecture and delivery."] },
    { id: "contact", k: ["contact", "email", "reach", "hire", "available"], a: ["Reach Kostadin at kostadin@draganov.dev, or run the connect command."], action: { cmd: "connect", flag: "--with Kostadin", route: "contact" } },
  ],
  fallback: ["I don't have a note on that yet — try `help`, or ask about experience, stack, projects, or availability."],
};

window.QA = QA_FALLBACK;
window.QA_READY = fetch("data/qa.json")
  .then((r) => { if (!r.ok) throw new Error("no qa.json"); return r.json(); })
  .then((d) => { window.QA = d; return d; })
  .catch(() => QA_FALLBACK);

/* keyword matcher — returns the best entry, or a fallback answer */
function kwMatch(input, kw) {
  // phrases, dotted, hyphenated or symbolic keywords → substring;
  // plain words → word-boundary (so "ai" ≠ "available", "hi" ≠ "hire")
  if (!/^[a-z0-9]+$/.test(kw)) return input.includes(kw);
  const re = new RegExp("\\b" + kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\b");
  return re.test(input);
}

function matchQA(qa, raw) {
  const input = (raw || "").toLowerCase().trim();
  if (!input) return null;
  let best = null, bestScore = 0;
  (qa.entries || []).forEach((e) => {
    let score = 0;
    (e.k || []).forEach((kw) => {
      if (kwMatch(input, kw)) score += (kw.split(/[ \-]/).length * 2) + kw.length * 0.04 + 1;
    });
    if (score > bestScore) { bestScore = score; best = e; }
  });
  if (best && bestScore > 0) return { id: best.id, lines: best.a, action: best.action, matched: true };
  return { id: "fallback", lines: qa.fallback || ["No note on that."], matched: false };
}

/* flavour tool actions shown before an answer streams */
const QA_TOOLS = [
  ["Searching field notes", "Matching intent", "Composing reply"],
  ["Indexing profile.md", "Ranking answers", "Streaming response"],
  ["Reading knowledge base", "Resolving context"],
  ["Grepping ./notes", "Scoring relevance", "Drafting"],
];
function qaTools() { return QA_TOOLS[Math.floor(Math.random() * QA_TOOLS.length)]; }

Object.assign(window, { matchQA, qaTools, QA_FALLBACK });
