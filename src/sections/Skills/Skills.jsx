'use client'

import { skillGroups } from '../../data/skills'
import useTilt from '../../hooks/useTilt'
import Reveal from '../../components/Reveal/Reveal'
import SplitText from '../../components/SplitText/SplitText'
import './Skills.css'

function SkillCard({ group, index }) {
  const ref = useTilt(5)
  return (
    <Reveal variant="zoom" delay={(index % 3) * 100} className={`skill-cell span-${group.span}`}>
      <article ref={ref} className="tilt skill-card">
        <h3>{group.title}</h3>
        <p>{group.blurb}</p>
        <ul className="chips">
          {group.items.map((item, i) => (
            <li key={item} style={{ '--i': i }}>
              {item}
            </li>
          ))}
        </ul>
      </article>
    </Reveal>
  )
}

function MarqueeRow({ items, reverse, speed }) {
  const track = (
    <div className="marquee-track" style={{ '--speed': `${speed}s` }}>
      {items.map((t) => (
        <span key={t} className="mq-item">
          {t}
        </span>
      ))}
    </div>
  )
  return (
    <div className={`marquee ${reverse ? 'reverse' : ''}`} aria-hidden="true">
      {track}
      {track}
    </div>
  )
}

export default function Skills() {
  const all = [...new Set(skillGroups.flatMap((g) => g.items))]
  const half = Math.ceil(all.length / 2)

  return (
    <section id="skills" className="section skills">
      <div className="container">
        <div className="section-head">
          <h2>
            <SplitText text="Skills" />
          </h2>
          <Reveal as="p">The tools I use to design, build and ship across web, mobile and backend.</Reveal>
        </div>
        <div className="skills-grid">
          {skillGroups.map((g, i) => (
            <SkillCard key={g.id} group={g} index={i} />
          ))}
        </div>
      </div>

      <div className="skills-marquee">
        <MarqueeRow items={all.slice(0, half)} speed={45} />
        <MarqueeRow items={all.slice(half)} reverse speed={55} />
      </div>
    </section>
  )
}
