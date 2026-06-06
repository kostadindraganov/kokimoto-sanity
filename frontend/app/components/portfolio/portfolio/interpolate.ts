/**
 * Replaces `{token}` placeholders in CMS-authored label strings with real values,
 * e.g. interpolate("{n} matches · cycle {m}/{max}", {n: 6, m: 1, max: 2}).
 * Unknown tokens are left untouched.
 */
export function interpolate(
  template: string | null | undefined,
  tokens: Record<string, string | number>,
): string {
  if (!template) return ''
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in tokens ? String(tokens[key]) : match,
  )
}

/** Strips the protocol from a URL for terminal-style display ("github.com/x/y"). */
export function displayUrl(url: string | null | undefined): string {
  if (!url) return ''
  return url.replace(/^https?:\/\//, '').replace(/\/$/, '')
}

/** Ensures a stored URL (possibly protocol-less) is a valid href. */
export function hrefUrl(url: string | null | undefined): string {
  if (!url) return ''
  return /^https?:\/\//.test(url) ? url : `https://${url}`
}

/** Template-verbatim short commit hash derived from a stable id/slug. */
export function shortHash(id: string): string {
  let h = 0
  for (const c of id) h = (h * 31 + c.charCodeAt(0)) >>> 0
  return h.toString(16).padStart(7, '0').slice(0, 7)
}
