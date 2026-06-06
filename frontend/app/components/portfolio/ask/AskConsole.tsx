'use client'

/* ============================================================
   AskConsole — typed placeholder.
   The Contact + AskConsole workstream owns the real implementation
   (ported kwMatch scorer, REPL transcript, scrambling placeholder)
   and will replace this file wholesale. The prop contract below is
   shared with the home/about mounts.
   ============================================================ */

export interface QaAction {
  cmd?: string | null
  flag?: string | null
  route?: string | null
}

export interface QaEntry {
  _id: string
  title: string
  keywords: string[]
  answer: string[]
  action?: QaAction | null
}

export interface AskConsoleSettings {
  enabled?: boolean | null
  heading?: string | null
  description?: string | null
  placeholder?: string | null
  emptyMessage?: string | null
  suggestions?: string[] | null
  fallback?: string[] | null
}

export default function AskConsole({
  entries,
  settings,
}: {
  entries: QaEntry[]
  settings: AskConsoleSettings | null
}) {
  // placeholder: props are part of the shared contract, consumed by the real impl
  void entries
  void settings
  return <div className="ask-console">{/* TODO: implemented by Contact workstream */}</div>
}
