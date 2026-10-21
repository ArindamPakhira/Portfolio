'use client'

import { useEffect, useRef, useState } from 'react'
import { introScene } from '../../data/profile'
import { createStage } from './stage'
import { speakLine, wait } from './voice'
import PortraitFallback from './PortraitFallback'
import './IntroScene.css'

/*
  Second animation, recreated from the reference video: a terracotta studio with a standing desk,
  the presenter walks up to the desk, gestures at the monitors, explains, then greets the visitor.
  The text of your Hero sits on the left, the photo / profile panel on the right.

  App mounts this under the opening animation (its exit reveals this stage) but the scene only
  PLAYS when `play` is true, i.e. after the opening animation has completely finished.

  Every way out goes through leave(): timeline finished, Skip Animation, any scroll / swipe / key.
  leave() stops the render loop, speech, audio and video, removes all listeners, tells App to jump to
  the About section, plays a short glitch dissolve (like the reference) and App then unmounts it.
*/

const SCROLL_KEYS = ['Escape', 'ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'End', 'Home', ' ']
const GLITCH_MS = 700

export default function IntroScene({ play, onLeaving, onDone }) {
  const rootRef = useRef(null)
  const stageRef = useRef(null)
  const canvasRef = useRef(null)
  const videoRef = useRef(null)
  const audioRef = useRef(null)
  const skipRef = useRef(null)
  const dispRef = useRef(null)
  const apiRef = useRef({}) // leave / toggleSound, set by the playback effect
  const stageApi = useRef(null)
  const timeRef = useRef(0)
  const cb = useRef({ onLeaving, onDone })
  cb.current = { onLeaving, onDone }

  const [panelOn, setPanelOn] = useState(false)
  const [leaving, setLeaving] = useState(false)
  const [photoOk, setPhotoOk] = useState(true)
  const [caption, setCaption] = useState('')
  const [hearing, setHearing] = useState(false)
  const [soundHint, setSoundHint] = useState(false)
  const [canSound, setCanSound] = useState(false)
  const hearingRef = useRef(false)

  const cfg = introScene
  const video = cfg.video
  const useVideo = Boolean(video && (video.webm || video.mp4))
  const wantedMode = cfg.voice.audioSrc ? 'audio' : useVideo ? 'video' : cfg.voice.enabled ? 'tts' : 'none'

  useEffect(() => {
    setCanSound(wantedMode === 'audio' || wantedMode === 'video' || (wantedMode === 'tts' && 'speechSynthesis' in window))
  }, [wantedMode])

  // Stage: create once, keep it sized to the stage box, redraw on resize / accent change
  useEffect(() => {
    const canvas = canvasRef.current
    const st = createStage(canvas, { showScene: !useVideo })
    stageApi.current = st
    const fit = () => {
      const r = stageRef.current.getBoundingClientRect()
      st.resize({ x: r.left, y: r.top, w: r.width, h: r.height })
      st.draw(timeRef.current, cfg.duration / 1000)
    }
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(canvas)
    ro.observe(stageRef.current)
    return () => {
      ro.disconnect()
      stageApi.current = null
    }
  }, [useVideo, cfg.duration])

  // Playback: one rAF loop, one leave() path, everything cleaned up in one place
  useEffect(() => {
    if (!play) return
    const st = stageApi.current
    const vid = videoRef.current
    const aud = audioRef.current
    const root = rootRef.current
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const D = cfg.duration / 1000
    const lines = cfg.lines
    // browsers without speech support simply get captions
    const mode = wantedMode === 'tts' && !('speechSynthesis' in window) ? 'none' : wantedMode
    const setHear = (v) => {
      hearingRef.current = v
      setHearing(v)
    }
    let raf = 0
    let glitchRaf = 0
    let start = 0
    let last = 0
    let ended = false
    let talking = false
    let scriptDone = false
    let muted = false
    let lineShown = -1
    let touchY = null
    let touchX = null
    const timers = []
    const runId = { v: 0 }

    const showLine = (i) => {
      if (i === lineShown) return
      lineShown = i
      setCaption(i >= 0 ? lines[i].text : '')
    }
    const stopMedia = () => {
      runId.v += 1
      if ('speechSynthesis' in window) window.speechSynthesis.cancel()
      if (vid) {
        vid.pause()
        vid.querySelectorAll('source').forEach((s) => s.removeAttribute('src'))
        vid.removeAttribute('src')
        vid.load()
      }
      if (aud) {
        aud.pause()
        aud.removeAttribute('src')
        aud.load()
      }
      talking = false
    }
    const removeListeners = () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('keydown', onKey)
    }
    const leave = (reason) => {
      if (ended) return
      ended = true
      cancelAnimationFrame(raf)
      removeListeners()
      stopMedia()
      cb.current.onLeaving(reason) // App jumps to the About section behind this overlay
      setLeaving(true)
      setHear(false)
      // glitch dissolve: horizontal slices smear sideways, like the reference transition
      const t0 = performance.now()
      const glitch = (now) => {
        const k = Math.min(1, (now - t0) / GLITCH_MS)
        if (dispRef.current) dispRef.current.setAttribute('scale', String(Math.round(k * k * 220)))
        root.style.opacity = String(1 - k * k)
        root.style.filter = `url(#scene-glitch) blur(${(k * 5).toFixed(1)}px)`
        if (k < 1) glitchRaf = requestAnimationFrame(glitch)
      }
      if (reason === 'reduced') root.style.opacity = '0'
      else glitchRaf = requestAnimationFrame(glitch)
      timers.push(setTimeout(() => cb.current.onDone(), reason === 'reduced' ? 0 : GLITCH_MS + 60))
    }

    const onWheel = () => leave('scroll')
    const onTouchStart = (e) => {
      touchY = e.touches[0].clientY
      touchX = e.touches[0].clientX
    }
    const onTouchMove = (e) => {
      if (touchY === null) return leave('scroll')
      if (Math.abs(e.touches[0].clientY - touchY) > 8 || Math.abs(e.touches[0].clientX - touchX) > 8) leave('scroll')
    }
    const onKey = (e) => {
      if (SCROLL_KEYS.includes(e.key)) leave('scroll')
    }

    if (reduce) {
      leave('reduced') // no animation for people who asked for less motion: straight to the site
      return () => {
        ended = true
        timers.forEach(clearTimeout)
      }
    }

    // ----- voice
    const runTts = async (fromStart) => {
      const id = ++runId.v
      const alive = () => runId.v === id && !ended
      window.speechSynthesis.cancel()
      let voiceOk = true
      for (let i = 0; i < lines.length; i++) {
        if (!alive()) return
        const wantAt = start + lines[i].at * 1000
        const now = performance.now()
        if (fromStart && wantAt > now) await wait(wantAt - now)
        if (!alive()) return
        showLine(i)
        talking = true
        let res = 'silent'
        if (voiceOk && !muted) {
          setHear(true)
          res = await speakLine(lines[i].text, cfg.voice)
          if (!alive()) return
          if (res === 'blocked') {
            voiceOk = false
            window.speechSynthesis.cancel()
            setSoundHint(true)
          }
        }
        if (res !== 'ok') {
          setHear(false)
          await wait(Math.max(1500, lines[i].text.length * 55)) // no sound: hold the line long enough to read
          if (!alive()) return
        }
        talking = false
        await wait(350)
      }
      if (alive()) {
        setHear(false)
        showLine(-1)
        scriptDone = true
      }
    }
    const runTimed = () => {
      // audio file / video soundtrack / silent: captions follow the scene clock
      const total = lines[lines.length - 1].at + 3
      apiRef.current.tick = (t) => {
        let idx = -1
        lines.forEach((l, i) => {
          if (t >= l.at) idx = i
        })
        showLine(t > total ? -1 : idx)
        talking = idx >= 0 && t <= total && !muted
        if (t > total && mode !== 'video') scriptDone = true
      }
    }
    const playMedia = async (el) => {
      try {
        el.muted = false
        await el.play()
        setHear(true)
      } catch {
        try {
          el.muted = true
          await el.play()
        } catch {
          /* ignore */
        }
        setSoundHint(true)
      }
    }

    apiRef.current.leave = leave
    apiRef.current.toggleSound = () => {
      if (mode === 'tts') {
        if (hearingRef.current) {
          muted = true
          window.speechSynthesis.cancel()
          setHear(false)
        } else {
          muted = false
          setSoundHint(false)
          showLine(-1)
          runTts(false) // a click gives the browser permission to play sound
        }
        return
      }
      const el = mode === 'video' ? vid : aud
      if (!el) return
      if (!el.paused && !el.muted) {
        el.muted = true
        muted = true
        setHear(false)
      } else {
        muted = false
        el.muted = false
        if (mode === 'audio') el.currentTime = Math.max(0, timeRef.current - cfg.voice.startAt / 1000)
        el.play().then(() => setHear(true)).catch(() => {})
        setSoundHint(false)
      }
    }

    const frame = (now) => {
      if (ended || !st) return
      if (!start) {
        start = now
        last = now
        if (mode === 'tts') runTts(true)
        else {
          runTimed()
          if (mode === 'video' && vid) playMedia(vid)
          if (mode === 'audio' && aud) {
            aud.src = cfg.voice.audioSrc
            timers.push(setTimeout(() => !ended && playMedia(aud), cfg.voice.startAt))
          }
        }
      }
      const t = (now - start) / 1000
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      timeRef.current = t
      if (apiRef.current.tick) apiRef.current.tick(t)
      st.update(dt, t, talking)
      st.draw(t, D)
      // finish once the minimum length has passed AND the script (voice or captions) is done
      const videoEnded = mode === 'video' && vid && vid.ended
      if ((t >= D && scriptDone) || videoEnded || t > D + 40) leave('done')
      else raf = requestAnimationFrame(frame)
    }

    window.addEventListener('wheel', onWheel, { passive: true })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    window.addEventListener('keydown', onKey)
    timers.push(setTimeout(() => setPanelOn(true), cfg.panelAt))
    if (skipRef.current) skipRef.current.focus({ preventScroll: true })
    raf = requestAnimationFrame(frame)

    return () => {
      ended = true
      cancelAnimationFrame(raf)
      cancelAnimationFrame(glitchRaf)
      removeListeners()
      stopMedia()
      timers.forEach(clearTimeout)
      apiRef.current = {}
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [play])

  const { panel, copy } = cfg

  return (
    <div
      ref={rootRef}
      className={`scene ${leaving ? 'is-leaving' : ''} ${panelOn ? 'has-panel' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label="Introduction animation"
    >
      <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: 'absolute' }}>
        <filter id="scene-glitch" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.002 0.14" numOctaves="1" seed="4" result="n" />
          <feDisplacementMap ref={dispRef} in="SourceGraphic" in2="n" scale="0" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>

      <canvas ref={canvasRef} className="scene-canvas" aria-hidden="true" />
      <div className="scene-scrim" aria-hidden="true" />

      <div ref={stageRef} className="scene-stage">
        {useVideo && (
          <video ref={videoRef} className="scene-video" loop={false} playsInline preload="auto" poster={video.poster || undefined} aria-hidden="true">
            {video.webm && <source src={video.webm} type="video/webm" />}
            {video.mp4 && <source src={video.mp4} type="video/mp4" />}
          </video>
        )}
        <p className="scene-caption" aria-live="polite">
          {caption}
        </p>
      </div>
      {wantedMode === 'audio' && <audio ref={audioRef} preload="auto" />}

      <div className="scene-copy">
        <p className="scene-eyebrow">{copy.eyebrow}</p>
        <h2 className="scene-name">
          <span>{copy.firstName}</span>
          <span>{copy.lastName}</span>
        </h2>
        <p className="scene-headline">
          {copy.before} <em>{copy.accent}</em> {copy.after}
        </p>
        <p className="scene-text">{copy.text}</p>
      </div>

      <aside className="scene-panel" aria-label={`About ${copy.firstName} ${copy.lastName}`}>
        <div className="scene-portrait">
          {photoOk ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={cfg.portrait} alt={`Portrait of ${copy.firstName} ${copy.lastName}`} onError={() => setPhotoOk(false)} decoding="async" />
          ) : (
            <PortraitFallback />
          )}
          <span className="scene-scan" aria-hidden="true" />
        </div>
        <div className="scene-info">
          <p className="scene-role">{panel.role}</p>
          <p className="scene-summary">{panel.summary}</p>
        </div>
        <ul className="scene-skills" aria-label="Skills">
          {panel.skills.map((s, i) => (
            <li key={s} style={{ '--i': i }}>
              {s}
            </li>
          ))}
        </ul>
      </aside>

      <div className="scene-controls">
        {canSound && (
          <button type="button" className={`scene-btn ${soundHint ? 'is-hint' : ''}`} onClick={() => apiRef.current.toggleSound && apiRef.current.toggleSound()} aria-label={hearing ? 'Mute voice' : 'Hear the introduction'}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d={hearing ? 'M11 5 6 9H3v6h3l5 4V5zM15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13' : 'M11 5 6 9H3v6h3l5 4V5zM22 9l-6 6M16 9l6 6'} />
            </svg>
            <span>{hearing ? 'Mute' : 'Hear it'}</span>
          </button>
        )}
        <button ref={skipRef} type="button" className="scene-btn scene-skip" onClick={() => apiRef.current.leave && apiRef.current.leave('skip')}>
          <span>{cfg.skipLabel}</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 5l9 7-9 7V5zM19 5v14" />
          </svg>
        </button>
      </div>
      <p className="scene-hint" aria-hidden="true">
        <span className="hint-pointer">Scroll or press Esc to skip</span>
        <span className="hint-touch">Swipe to skip</span>
      </p>
    </div>
  )
}
