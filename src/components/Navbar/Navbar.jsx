'use client'

import { useEffect, useState } from 'react'
import { config, profile, themes } from '../../data/profile'
import { applyTheme } from '../../hooks/useTheme'
import './Navbar.css'

const links = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact', label: 'Contact' },
]

function ThemeDots() {
  // Start from the default on both server and client; read the saved choice after mount
  const [current, setCurrent] = useState(config.defaultTheme)
  useEffect(() => {
    try {
      const saved = localStorage.getItem('theme')
      if (themes[saved]) setCurrent(saved)
    } catch {
      /* storage can be blocked; ignore */
    }
  }, [])
  const pick = (key) => {
    applyTheme(key)
    setCurrent(key)
  }
  return (
    <div className="theme-dots" role="group" aria-label="Accent colour">
      {Object.entries(themes).map(([key, t]) => (
        <button
          key={key}
          type="button"
          title={t.label}
          aria-label={`${t.label} theme`}
          aria-pressed={current === key}
          className={current === key ? 'is-active' : ''}
          style={{ background: `linear-gradient(135deg, ${t.a}, ${t.b})` }}
          onClick={() => pick(key)}
        />
      ))}
    </div>
  )
}

export default function Navbar({ ready }) {
  const [active, setActive] = useState('')
  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [progress, setProgress] = useState(0)

  // Scroll progress, hide on scroll down, show on scroll up
  useEffect(() => {
    let last = window.scrollY
    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        const y = window.scrollY
        const max = document.documentElement.scrollHeight - window.innerHeight
        setProgress(max > 0 ? y / max : 0)
        setScrolled(y > 40)
        setHidden(y > last && y > 240 && y - last < 600) // a big jump (e.g. to About) keeps the bar visible
        last = y
        ticking = false
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Highlight the link of the section that is in view
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' },
    )
    links.forEach((l) => {
      const el = document.getElementById(l.id)
      if (el) io.observe(el)
    })
    const hero = document.getElementById('home')
    if (hero) io.observe(hero)
    return () => io.disconnect()
  }, [])

  // Lock page scroll while the mobile menu is open
  useEffect(() => {
    if (!ready) return
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open, ready])

  const close = () => setOpen(false)

  return (
    <>
      <header
        className={`nav ${scrolled ? 'is-scrolled' : ''} ${hidden && !open ? 'is-hidden' : ''} ${ready ? 'is-ready' : ''}`}
      >
        <div className="nav-progress" style={{ transform: `scaleX(${progress})` }} />
        <div className="container nav-inner">
          <a href="#home" className="nav-logo" onClick={close} aria-label="Back to top">
            <span className="nav-mark">AP</span>
            <span className="nav-name">{profile.name}</span>
          </a>

          <nav className="nav-links" aria-label="Primary">
            {links.map((l) => (
              <a key={l.id} href={`#${l.id}`} className={active === l.id ? 'is-active' : ''}>
                {l.label}
              </a>
            ))}
          </nav>

          <div className="nav-right">
            <ThemeDots />
            <a href="#contact" className="nav-cta">
              Hire me
            </a>
            <button
              type="button"
              className={`nav-burger ${open ? 'is-open' : ''}`}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              onClick={() => setOpen((o) => !o)}
            >
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      <div className={`menu ${open ? 'is-open' : ''}`} aria-hidden={!open}>
        <nav className="menu-links" aria-label="Mobile">
          {links.map((l, i) => (
            <a key={l.id} href={`#${l.id}`} onClick={close} style={{ '--i': i }} tabIndex={open ? 0 : -1}>
              {l.label}
            </a>
          ))}
        </nav>
        <div className="menu-foot">
          <ThemeDots />
          <a href={`mailto:${profile.email}`}>{profile.email}</a>
        </div>
      </div>
    </>
  )
}
