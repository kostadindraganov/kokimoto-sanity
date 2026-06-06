interface ContactSidebarProps {
  availabilityHeading?: string | null
  availabilityText?: string | null
  resumeLabel?: string | null
  email?: string | null
  github?: string | null
  linkedin?: string | null
  cv?: string | null
  location?: string | null
  availabilityStatus?: boolean | null
  /** dataAttr from parent for visual editing */
  'data-sanity'?: string
}

export default function ContactSidebar({
  availabilityHeading,
  availabilityText,
  resumeLabel,
  email,
  github,
  linkedin,
  cv,
  location,
  availabilityStatus,
  'data-sanity': dataSanity,
}: ContactSidebarProps) {
  const links = [
    email
      ? {ic: '@', k: 'email', v: email, href: 'mailto:' + email}
      : null,
    github
      ? {ic: 'gh', k: 'github', v: github, href: 'https://' + github.replace(/^https?:\/\//, '')}
      : null,
    linkedin
      ? {ic: 'in', k: 'linkedin', v: linkedin, href: 'https://' + linkedin.replace(/^https?:\/\//, '')}
      : null,
  ].filter(Boolean) as {ic: string; k: string; v: string; href: string}[]

  return (
    <div className="stack gap-12" style={{alignSelf: 'start'}} data-sanity={dataSanity}>
      <div className="panel">
        <div className="panel-body" style={{padding: 16}}>
          <div className="row gap-10" style={{alignItems: 'center'}}>
            {availabilityStatus !== false && <span className="dot" />}
            <strong style={{fontFamily: 'var(--display)', fontSize: 15}}>
              {availabilityHeading ?? '● Available'}
            </strong>
          </div>
          {availabilityText && (
            <p className="muted" style={{fontSize: 13, margin: '10px 0 0', lineHeight: 1.55}}>
              {availabilityText}
            </p>
          )}
          {location && (
            <div className="faint" style={{fontSize: 12, marginTop: 10}}>
              {location}
            </div>
          )}
        </div>
      </div>
      {links.map((l) => (
        <a
          key={l.k}
          className="link-card"
          href={l.href}
          target={l.href.startsWith('http') ? '_blank' : undefined}
          rel="noreferrer"
        >
          <span className="lc-ic">{l.ic}</span>
          <span className="stack">
            <span className="lc-k">{l.k}</span>
            <span className="lc-v">{l.v}</span>
          </span>
          <span className="lc-arr">&#8599;</span>
        </a>
      ))}
      {cv && (
        <a className="link-card" href={cv} target="_blank" rel="noreferrer">
          <span className="lc-ic">&#8595;</span>
          <span className="stack">
            <span className="lc-k">{resumeLabel ?? 'resume'}</span>
            <span className="lc-v">download cv.pdf</span>
          </span>
          <span className="lc-arr">&#8599;</span>
        </a>
      )}
    </div>
  )
}
