export interface QaEntry {
  _id: string
  title: string
  keywords: string[]
  answer: string[]
  action?: {
    cmd?: string
    flag?: string
    route?: string
  }
}

export interface MatchResult {
  id: string
  lines: string[]
  action?: QaEntry['action']
  matched: boolean
}

/* phrases, dotted, hyphenated or symbolic keywords → substring;
   plain words → word-boundary (so "ai" ≠ "available", "hi" ≠ "hire") */
function kwMatch(input: string, kw: string): boolean {
  if (!/^[a-z0-9]+$/.test(kw)) return input.includes(kw)
  const re = new RegExp('\\b' + kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b')
  return re.test(input)
}

export function matchQA(
  entries: QaEntry[],
  fallback: string[],
  raw: string,
): MatchResult {
  const input = (raw || '').toLowerCase().trim()
  if (!input) return {id: 'fallback', lines: fallback || ['No note on that.'], matched: false}
  let best: QaEntry | null = null
  let bestScore = 0
  entries.forEach((e) => {
    let score = 0
    ;(e.keywords || []).forEach((kw) => {
      if (kwMatch(input, kw)) score += (kw.split(/[ \-]/).length * 2) + kw.length * 0.04 + 1
    })
    if (score > bestScore) {
      bestScore = score
      best = e
    }
  })
  if (best && bestScore > 0) {
    return {id: (best as QaEntry).title, lines: (best as QaEntry).answer, action: (best as QaEntry).action, matched: true}
  }
  return {id: 'fallback', lines: fallback || ['No note on that.'], matched: false}
}
