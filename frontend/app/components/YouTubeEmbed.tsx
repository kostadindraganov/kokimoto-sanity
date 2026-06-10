/** Extract the 11-char video ID from any common YouTube URL shape. */
function youTubeId(url: string): string | null {
  try {
    const u = new URL(url)
    const host = u.hostname.replace(/^www\./, '')
    if (host === 'youtu.be') return u.pathname.split('/').filter(Boolean)[0] ?? null
    if (host.endsWith('youtube.com') || host.endsWith('youtube-nocookie.com')) {
      if (u.pathname === '/watch') return u.searchParams.get('v')
      const [seg, id] = u.pathname.split('/').filter(Boolean) // /embed/ID, /shorts/ID
      if (seg === 'embed' || seg === 'shorts' || seg === 'live') return id ?? null
    }
    return null
  } catch {
    return null
  }
}

/** Renders a YouTube embed from a `youTube` Portable Text block. */
export default function YouTubeEmbed({url}: {url?: string | null}) {
  const id = url ? youTubeId(url) : null
  if (!id) return null
  return (
    <div className="yt-embed">
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${id}`}
        title="YouTube video player"
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    </div>
  )
}
