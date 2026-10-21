'use client'

import { useEffect, useState } from 'react'
import { profile } from '../../data/profile'
import { skillGroups } from '../../data/skills'
import useInView from '../../hooks/useInView'
import useTilt from '../../hooks/useTilt'
import Reveal from '../../components/Reveal/Reveal'
import SplitText from '../../components/SplitText/SplitText'
import './About.css'

function CountUp({ to, run }) {
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!run) return
    const start = performance.now()
    let raf = 0
    const tick = (now) => {
      const t = Math.min(1, (now - start) / 1600)
      setN(Math.round(to * (1 - Math.pow(1 - t, 3))))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [run, to])
  return <>{n}</>
}

const str = (v) => <span className="c-s">{`"${v}"`}</span>

export default function About() {
  const tilt = useTilt(5)
  const [codeRef, codeIn] = useInView({ threshold: 0.3 })
  const [statsRef, statsIn] = useInView({ threshold: 0.4 })
  const c = profile.card

  const techCount = new Set(skillGroups.flatMap((g) => g.items)).size
  const stats = [{ value: techCount, label: 'Technologies in my toolkit' }, ...profile.stats]

  // Each entry is one line of the animated code card
  const lines = [
    { i: 0, n: <><span className="c-k">const</span> <span className="c-v">developer</span> = {'{'}</> },
    { i: 1, n: <><span className="c-p">name</span>: {str(c.name)},</> },
    { i: 1, n: <><span className="c-p">degree</span>: {str(c.degree)},</> },
    {
      i: 1,
      n: (
        <>
          <span className="c-p">stack</span>: [
          {c.stack.map((s, k) => (
            <span key={s}>
              {str(s)}
              {k < c.stack.length - 1 ? ', ' : ''}
            </span>
          ))}
          ],
        </>
      ),
    },
    { i: 1, n: <><span className="c-p">focus</span>: {str(c.focus)},</> },
    { i: 1, n: <><span className="c-p">openToWork</span>: <span className="c-b">{String(c.openToWork)}</span>,</> },
    { i: 0, n: <>{'};'}<span className="caret" /></> },
  ]

  return (
    <section id="about" className="section about">
      <div className="container">
        <div className="section-head">
          <h2>
            <SplitText text="About me" />
          </h2>
        </div>

        <div className="about-grid">
          <div className="about-text">
            {profile.about.map((para, i) => (
              <Reveal key={i} as="p" delay={i * 120}>
                {para}
              </Reveal>
            ))}
            <Reveal delay={360} className="edu">
              <strong>{profile.education.degree}</strong>
              <span>{profile.education.school}</span>
            </Reveal>
          </div>

          <Reveal variant="right" className="about-code-wrap">
            <div ref={tilt} className="tilt code-card">
              <div className="code-bar">
                <span /> <span /> <span />
                <em>developer.js</em>
              </div>
              <pre ref={codeRef} className={`code-body ${codeIn ? 'is-in' : ''}`}>
                {lines.map((l, k) => (
                  <div key={k} className="code-line" style={{ '--i': k, paddingLeft: `${l.i * 1.6}rem` }}>
                    {l.n}
                  </div>
                ))}
              </pre>
            </div>
          </Reveal>
        </div>

        <div ref={statsRef} className="stats">
          {stats.map((s, i) => (
            <Reveal key={s.label} variant="up" delay={i * 100} className="stat">
              <span className="stat-num gradient-text">
                <CountUp to={s.value} run={statsIn} />
              </span>
              <span className="stat-label">{s.label}</span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
