'use client'

/* ============================================================
   ShellChrome — client coordinator for the shell chrome.
   Mounts TopBar + CommandPalette + MobileConsole and owns the
   mobile drawer open state. The palette manages its own open
   state (Ctrl/Cmd+K hotkey + PALETTE_EVENT dispatched by
   TopBar / MobileConsole), so no palette state lives here.
   ============================================================ */

import {useCallback, useState} from 'react'

import type {PortfolioNavItem} from '../types'
import {CommandPalette} from './CommandPalette'
import {MobileConsole} from './MobileConsole'
import {TopBar} from './TopBar'

export function ShellChrome({
  handle,
  navItems,
  availabilityStatus,
  availabilityTitle,
  email,
  github,
  linkedin,
}: {
  /** e.g. "kostadin@portfolio" */
  handle: string
  navItems: PortfolioNavItem[]
  availabilityStatus: boolean
  availabilityTitle?: string
  email?: string
  /** Without protocol, e.g. "github.com/kdraganov" */
  github?: string
  /** Without protocol, e.g. "linkedin.com/in/kdraganov" */
  linkedin?: string
}) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const openMobile = useCallback(() => setMobileOpen(true), [])
  const closeMobile = useCallback(() => setMobileOpen(false), [])

  return (
    <>
      <TopBar
        handle={handle}
        navItems={navItems}
        availabilityStatus={availabilityStatus}
        availabilityTitle={availabilityTitle}
        onMobile={openMobile}
      />
      <CommandPalette
        navItems={navItems}
        handle={handle}
        email={email}
        github={github}
        linkedin={linkedin}
      />
      <MobileConsole
        navItems={navItems}
        isOpen={mobileOpen}
        onClose={closeMobile}
        handle={handle}
        email={email}
        github={github}
        linkedin={linkedin}
      />
    </>
  )
}

export default ShellChrome
