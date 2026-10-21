'use client'

import { useEffect, useRef } from 'react'
import Navbar from './components/Navbar/Navbar'
import Hero from './sections/Hero/Hero'
import About from './sections/About/About'
import Skills from './sections/Skills/Skills'
import Projects from './sections/Projects/Projects'
import Experience from './sections/Experience/Experience'
import Contact from './sections/Contact/Contact'

// The real site. It is mounted (and fully loaded) behind the intro,
// but hidden and inert until the intro starts its exit.
export default function Portfolio({ hidden, ready }) {
  const mainRef = useRef(null)

  useEffect(() => {
    if (mainRef.current) mainRef.current.inert = hidden
  }, [hidden])

  return (
    <>
      <Navbar ready={ready} />
      <main ref={mainRef} className={`portfolio ${hidden ? 'is-hidden' : ''}`}>
        <Hero ready={ready} />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Contact />
      </main>
    </>
  )
}
