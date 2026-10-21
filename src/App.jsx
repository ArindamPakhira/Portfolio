'use client'

import { useCallback, useEffect, useState } from 'react'
import { config } from './data/profile'
import { initTheme } from './hooks/useTheme'
import IntroAnimation from './components/IntroAnimation/IntroAnimation'
import CustomCursor from './components/CustomCursor/CustomCursor'
import GridBackground from './components/GridBackground/GridBackground'
import Portfolio from './Portfolio'

// Global styles load last, exactly as in the original build, so existing styling is unchanged
import './index.css'
import './App.css'

export default function App() {
  const [phase, setPhase] = useState(config.intro ? 'intro' : 'done')
  const [ready, setReady] = useState(false)

  const handleExit = useCallback(() => setPhase((p) => (p === 'intro' ? 'exit' : p)), [])
  const handleComplete = useCallback(() => setPhase('done'), [])

  // The site is revealed once the intro starts to leave
  const siteVisible = phase !== 'intro'

  // Sync the saved accent theme (the layout script already applied it before first paint)
  useEffect(() => {
    initTheme()
  }, [])

  // Always start at the top, and keep the page locked until the site is revealed
  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)
  }, [])
  
  useEffect(() => {
    document.body.style.overflow = siteVisible ? '' : 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [siteVisible])

  // Start the navbar and Hero entrance as the site is revealed
  useEffect(() => {
    if (!siteVisible) return
    let id = requestAnimationFrame(() => {
      id = requestAnimationFrame(() => setReady(true))
    })
    return () => cancelAnimationFrame(id)
  }, [siteVisible])

  return (
    <>
      {config.grid && <GridBackground />}
      {config.cursor && <CustomCursor />}
      {phase !== 'done' && <IntroAnimation onExit={handleExit} onComplete={handleComplete} />}
      <Portfolio hidden={!siteVisible} ready={ready} />
    </>
  )
}