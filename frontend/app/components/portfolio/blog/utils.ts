export function fmtDate(d: string): string {
  const dt = new Date(d + 'T00:00:00')
  return dt.toLocaleDateString('en-US', {year: 'numeric', month: 'short', day: '2-digit'})
}

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

/** Compute reading time from word count (185 wpm) */
export function computeReadTime(wordCount: number): number {
  return Math.ceil(wordCount / 185)
}

/** Format reading time as "N min read" */
export function formatReadTime(minutes: number): string {
  return `${minutes} min read`
}

/** Count words in portable text body array */
export function countWordsInBody(body: unknown[] | null | undefined): number {
  if (!Array.isArray(body)) return 0
  let count = 0
  for (const block of body) {
    if (
      block &&
      typeof block === 'object' &&
      '_type' in block &&
      (block as {_type: string})._type === 'block'
    ) {
      const children = (block as {children?: unknown[]}).children
      if (Array.isArray(children)) {
        for (const span of children) {
          if (span && typeof span === 'object' && 'text' in span) {
            const text = (span as {text: string}).text
            if (typeof text === 'string') {
              count += text.trim().split(/\s+/).filter(Boolean).length
            }
          }
        }
      }
    }
  }
  return count
}

/** Extract h2/h3 headings from portable text body for TOC */
export function extractHeadings(
  body: unknown[] | null | undefined,
): Array<{id: string; label: string; level: 'h2' | 'h3'}> {
  if (!Array.isArray(body)) return []
  const headings: Array<{id: string; label: string; level: 'h2' | 'h3'}> = []
  for (const block of body) {
    if (
      block &&
      typeof block === 'object' &&
      '_type' in block &&
      (block as {_type: string})._type === 'block'
    ) {
      const style = (block as {style?: string}).style
      if (style === 'h2' || style === 'h3') {
        const children = (block as {children?: unknown[]}).children
        let text = ''
        if (Array.isArray(children)) {
          for (const span of children) {
            if (span && typeof span === 'object' && 'text' in span) {
              text += (span as {text: string}).text
            }
          }
        }
        if (text.trim()) {
          headings.push({id: slugify(text), label: text.trim(), level: style})
        }
      }
    }
  }
  return headings
}
