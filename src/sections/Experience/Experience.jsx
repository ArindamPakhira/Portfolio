'use client'

import { useEffect, useRef, useState } from 'react'
import { experience } from '../../data/experience'
import useTilt from '../../hooks/useTilt'
import Reveal from '../../components/Reveal/Reveal'
import SplitText from '../../components/SplitText/SplitText'
import './Experience.css'

function TimelineItem({ item, lit }) {
  const ref = useTilt(3)
  return (
    <li className={`tl-item ${lit ? 'is-lit' : ''}`}>
      <span className="tl-dot" aria-hidden="true" />
      <Reveal variant="up">
        <div ref={ref} className="tilt tl-card">
          <div className="tl-top">
            <span className={`tl-type ${item.type}`}>{item.type === 'work' ? 'Work' : 'Education'}</span>
            <span className="tl-period">{item.period}</span>
          </div>
          <h3>{item.role}</h3>
          <p className="tl-org">{item.org}</p>
          <ul className="tl-points">
            {item.points.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
          <ul className="tags">
            {item.tech.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>
      </Reveal>
    </li>
  )
}

export default function Experience() {
  const listRef = useRef(null)
  const [progress, setProgress] = useState(0)
  const [litCount, setLitCount] = useState(0)

  // The vertical line draws itself as you scroll, lighting each dot it reaches
  useEffect(() => {
    const onScroll = () => {
      const el = listRef.current
      if (!el) return
      const vh = window.innerHeight
      const r = el.getBoundingClientRect()
      setProgress(Math.min(1, Math.max(0, (vh * 0.6 - r.top) / r.height)))
      let n = 0
      el.querySelectorAll('.tl-item').forEach((it) => {
        if (it.getBoundingClientRect().top < vh * 0.65) n++
      })
      setLitCount(n)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <section id="experience" className="section experience">
      <div className="container">
        <div className="section-head">
          <h2>
            <SplitText text="Experience" />
          </h2>
          <Reveal as="p">Where I have worked and studied, newest first.</Reveal>
        </div>

        <div className="timeline">
          <div className="tl-line" aria-hidden="true">
            <span style={{ transform: `scaleY(${progress})` }} />
          </div>
          <ol ref={listRef} className="tl-list">
            {experience.map((item, i) => (
              <TimelineItem key={item.role} item={item} lit={i < litCount} />
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
