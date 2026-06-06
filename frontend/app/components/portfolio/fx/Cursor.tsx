'use client'

/** Blinking accent block cursor (template: streaming.jsx). */
export function Cursor({thin}: {thin?: boolean}) {
  return <span className={'cursor' + (thin ? ' thin' : '')} aria-hidden="true" />
}

export default Cursor
