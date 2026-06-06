'use client'

import {useEffect, useState} from 'react'

const BRAILLE = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']

/** Braille spinner — ported verbatim from the template's streaming.jsx */
export function Spinner() {
  const [f, setF] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setF((x) => (x + 1) % BRAILLE.length), 80)
    return () => clearInterval(id)
  }, [])
  return <span className="spin">{BRAILLE[f]}</span>
}
