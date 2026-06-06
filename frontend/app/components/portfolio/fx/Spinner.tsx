'use client'

import {useEffect, useState} from 'react'

export const BRAILLE = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']

/** Braille spinner (template: streaming.jsx). */
export function Spinner() {
  const [f, setF] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setF((x) => (x + 1) % BRAILLE.length), 80)
    return () => clearInterval(id)
  }, [])
  return <span className="spin">{BRAILLE[f]}</span>
}

export default Spinner
