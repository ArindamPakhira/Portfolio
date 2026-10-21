'use client'

import { useEffect, useRef } from 'react'
import { profile } from '../../data/profile'
import MagneticButton from '../../components/MagneticButton/MagneticButton'
import { GithubIcon, LinkedinIcon } from '../../components/Icons'
import './Hero.css'

const { hero } = profile

// Splits a word into letters so each one can animate on its own
function Word({ text, offset = 0 }) {
  return (
    <span className="hero-line" aria-hidden="true">
      {text.split('').map((c, i) => (
        <span key={i} className="ch" style={{ '--i': i + offset }}>
          {c}
        </span>
      ))}
    </span>
  )
}

export default function Hero({ ready }) {
  const rootRef = useRef(null)

  // 1) Letters get heavier as the cursor gets close (desktop only).
  // 2) A soft glow trails the pointer.
  useEffect(() => {
    const root = rootRef.current
    if (!root || window.matchMedia('(hover: none)').matches) return
    const chars = root.querySelectorAll('.ch')
    const RADIUS = 220 // px of influence
    const MIN = 580 // resting font weight
    const MAX = 760 // heaviest font weight
    let mx = 0
    let my = 0
    let raf = 0

    const update = () => {
      raf = 0
      chars.forEach((el) => {
        const r = el.getBoundingClientRect()
        const d = Math.hypot(mx - (r.left + r.width / 2), my - (r.top + r.height / 2))
        el.style.fontWeight = Math.round(MIN + (MAX - MIN) * Math.max(0, 1 - d / RADIUS))
      })
    }
    const move = (e) => {
      mx = e.clientX
      my = e.clientY
      const b = root.getBoundingClientRect()
      root.style.setProperty('--gx', `${mx - b.left}px`)
      root.style.setProperty('--gy', `${my - b.top}px`)
      if (!raf) raf = requestAnimationFrame(update)
    }
    const leave = () => chars.forEach((el) => (el.style.fontWeight = ''))

    window.addEventListener('mousemove', move)
    document.documentElement.addEventListener('mouseleave', leave)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', move)
      document.documentElement.removeEventListener('mouseleave', leave)
    }
  }, [])

  // Scroll parallax: one cheap listener writes --p (0 to 1); CSS does the rest
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    let raf = 0
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        const p = Math.min(1, Math.max(0, window.scrollY / (root.offsetHeight * 0.85)))
        root.style.setProperty('--p', p.toFixed(3))
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <section id="home" ref={rootRef} className={`hero ${ready ? 'is-ready' : ''}`}>
      <div className="hero-glow" aria-hidden="true" />
      <div className="hero-orb" aria-hidden="true" />

      {/* Added 'hero-split' to divide left and right */}
      <div className="container hero-inner hero-split">
        
        {/* LEFT SIDE: All your text content */}
        <div className="hero-left">
          <p className="hero-status">
            <span className="pulse" />
            {profile.availability}
          </p>

          <p className="hero-hi">{hero.greeting}</p>
          <h1 className="hero-title" aria-label={profile.name}>
            <Word text={profile.firstName} />
            <Word text={profile.lastName} offset={profile.firstName.length} />
          </h1>

          <p className="hero-role">{hero.role}</p>
          <ul className="hero-tech" aria-label="Main technologies">
            {hero.tech.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
          {/* <p className="hero-tag">{hero.tagline}</p> */}

          <div className="hero-cta">
            <MagneticButton href="#projects">{hero.ctaPrimary}</MagneticButton>
            <MagneticButton href="#contact" variant="ghost">
              {hero.ctaSecondary}
            </MagneticButton>
            <div className="hero-social">
              <a href={profile.socials.github} target="_blank" rel="noreferrer" aria-label="GitHub" data-cursor="GitHub">
                <GithubIcon />
              </a>
              <a href={profile.socials.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" data-cursor="LinkedIn">
                <LinkedinIcon />
              </a>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: Your Photo */}
        <div className="hero-right">
          <img 
            src="/image/Own.png" 
            alt="Arindam Pakhira" 
            className="hero-img" 
          />
        </div>

      </div>

      <a className="hero-scroll" href="#about" aria-label="Scroll to About">
        <span className="hero-scroll-line" />
        scroll
      </a>
    </section>
  )
}
