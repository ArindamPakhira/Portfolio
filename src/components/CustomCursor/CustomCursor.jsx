'use client'

import { useEffect, useRef } from 'react'
import './CustomCursor.css'

// Add data-cursor="Label" to any element to show a label inside the cursor on hover.
export default function CustomCursor() {
  const dot = useRef(null)
  const ring = useRef(null)
  const label = useRef(null)

  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    document.body.classList.add('has-custom-cursor')

    let mx = -100
    let my = -100
    let rx = -100
    let ry = -100
    let raf = 0

    const onMove = (e) => {
      mx = e.clientX
      my = e.clientY
      if (dot.current) {
        dot.current.style.transform = `translate(${mx}px, ${my}px)`
      }
    }
    
    const loop = () => {
      rx += (mx - rx) * 0.16
      ry += (my - ry) * 0.16
      if (ring.current) {
        ring.current.style.transform = `translate(${rx}px, ${ry}px)`
      }
      raf = requestAnimationFrame(loop)
    }
    
    const onOver = (e) => {
      const withLabel = e.target.closest('[data-cursor]')
      const clickable = e.target.closest('a, button, input, textarea, [role="button"]')
      
      if (ring.current) {
        ring.current.classList.toggle('is-hover', Boolean(clickable || withLabel))
        ring.current.classList.toggle('has-label', Boolean(withLabel && withLabel.dataset.cursor))
      }
      if (label.current) {
        label.current.textContent = withLabel ? withLabel.dataset.cursor : ''
      }
    }
    
    const onDown = () => {
      if (ring.current) ring.current.classList.add('is-down')
    }
    
    const onUp = () => {
      if (ring.current) ring.current.classList.remove('is-down')
    }
    
    const onLeave = () => {
      if (dot.current) dot.current.style.opacity = 0
      if (ring.current) ring.current.style.opacity = 0
    }
    
    const onEnter = () => {
      if (dot.current) dot.current.style.opacity = 1
      if (ring.current) ring.current.style.opacity = 1
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseover', onOver)
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)
    document.documentElement.addEventListener('mouseleave', onLeave)
    document.documentElement.addEventListener('mouseenter', onEnter)
    raf = requestAnimationFrame(loop)

    return () => {
      document.body.classList.remove('has-custom-cursor')
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseover', onOver)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
      document.documentElement.removeEventListener('mouseleave', onLeave)
      document.documentElement.removeEventListener('mouseenter', onEnter)
    }
  }, [])

  return (
    <>
      <div ref={dot} className="cursor-dot" aria-hidden="true" />
      <div ref={ring} className="cursor-ring" aria-hidden="true">
        <span ref={label} className="cursor-label" />
      </div>
    </>
  )
}