'use client'

import { useEffect, useRef } from 'react'
import './GridBackground.css'

// Fine grid lines that light up around the cursor, plus two soft glows.
// One cheap pointer listener, no canvas, no continuous animation.
export default function GridBackground() {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el || window.matchMedia('(hover: none)').matches) return
    let raf = 0
    let x = 0
    let y = 0
    const apply = () => {
      raf = 0
      el.style.setProperty('--mx', `${x}px`)
      el.style.setProperty('--my', `${y}px`)
    }
    const move = (e) => {
      x = e.clientX
      y = e.clientY
      if (!raf) raf = requestAnimationFrame(apply)
    }
    window.addEventListener('pointermove', move, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', move)
    }
  }, [])

  return (
    <div ref={ref} className="gridbg" aria-hidden="true">
      <span className="gridbg-glow gridbg-glow-a" />
      <span className="gridbg-glow gridbg-glow-b" />
      <span className="gridbg-lines" />
      <span className="gridbg-lines gridbg-lines-lit" />
    </div>
  )
}
