'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { intro, profile } from '../../data/profile'
import './IntroAnimation.css'


export default function IntroAnimation({ onExit, onComplete }) {
  const [stage, setStage] = useState('enter')
  const [reduce, setReduce] = useState(false)
  const timers = useRef([])
  const callbacks = useRef({ onExit, onComplete })
  callbacks.current = { onExit, onComplete }

  const exitMs = reduce ? 300 : intro.exit
  const total = intro.enter + intro.holdA + intro.fill + intro.holdB

  useEffect(() => {
    // Read the motion preference on the client, then build the timeline from it
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setReduce(reduce)
    const exitMs = reduce ? 300 : intro.exit
    const plan = reduce
      ? [['a', 0], ['exit', 1100]]
      : [
          ['a', intro.enter],
          ['fill', intro.enter + intro.holdA],
          ['b', intro.enter + intro.holdA + intro.fill],
          ['exit', total],
        ]
    const ids = plan.map(([name, at]) =>
      setTimeout(() => {
        setStage(name)
        if (name === 'exit') callbacks.current.onExit()
      }, at),
    )
    ids.push(setTimeout(() => callbacks.current.onComplete(), plan[plan.length - 1][1] + exitMs))
    timers.current = ids
    return () => ids.forEach(clearTimeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const skip = () => {
    timers.current.forEach(clearTimeout)
    setStage('exit')
    callbacks.current.onExit()
    timers.current = [setTimeout(() => callbacks.current.onComplete(), exitMs)]
  }

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && skip()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const leaving = stage === 'exit'
  const panelTransition = leaving
    ? { duration: reduce ? 0.01 : 0.9, ease: [0.76, 0, 0.24, 1], delay: reduce ? 0 : 0.1 }
    : { duration: reduce ? 0.01 : intro.enter / 1000 + 0.3, ease: [0.22, 1, 0.36, 1] }

  return (
    <div
      className="intro"
      data-stage={stage}
      style={{ '--exit': `${exitMs}ms`, '--total': `${total}ms` }}
      role="dialog"
      aria-modal="true"
      aria-label="Portfolio intro"
    >
      <div className="intro-curtain" />
      <div className="intro-bg" aria-hidden="true" />

      <motion.div
        className="intro-panel"
        initial={{ opacity: 0, scale: 0.86, y: 28 }}
        animate={{ opacity: leaving ? 0 : 1, scale: leaving ? 1.14 : 1, y: 0 }}
        transition={panelTransition}
      >
        <div className="intro-tilt">
          <div className="intro-frame" aria-hidden="true" />
          <div className="intro-inner">
            <div className="intro-grid" aria-hidden="true" />
            <div className="intro-sheet" aria-hidden="true" />

            <div className="intro-copy">
              <p className="intro-hello">{intro.hello}</p>
              <h2 className="intro-name">
                <span>{profile.firstName}</span>
                <span>{profile.lastName}</span>
              </h2>
            </div>
            <p className="intro-word word-a">{intro.wordA}</p>

            <p className="intro-word word-b">{intro.wordB}</p>
            <ul className="intro-tech">
              {profile.hero.tech.map((t, i) => (
                <li key={t} style={{ '--i': i }}>
                  {t}
                </li>
              ))}
            </ul>

            <div className="intro-progress" aria-hidden="true">
              <span />
            </div>
          </div>
        </div>
      </motion.div>

      <button type="button" className="intro-skip" onClick={skip}>
        Skip intro
      </button>
    </div>
  )
}
