'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { projects } from '../../data/projects'
import Reveal from '../../components/Reveal/Reveal'
import SplitText from '../../components/SplitText/SplitText'
import ProjectCard from './ProjectCard'
import './Projects.css'

const categories = ['All', ...new Set(projects.map((p) => p.category))]

export default function Projects() {
  const [filter, setFilter] = useState('All')
  const list = filter === 'All' ? projects : projects.filter((p) => p.category === filter)

  return (
    <section id="projects" className="section projects">
      <div className="container">
        <div className="section-head">
          <h2>
            <SplitText text="Selected projects" />
          </h2>
          <Reveal as="p">Things I have built. Filter by the kind of work you care about.</Reveal>
        </div>

        <div className="filters" role="group" aria-label="Filter projects">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              aria-pressed={filter === c}
              className={filter === c ? 'is-active' : ''}
              onClick={() => setFilter(c)}
            >
              {c}
            </button>
          ))}
        </div>

        <motion.div layout className="projects-grid">
          <AnimatePresence mode="popLayout">
            {list.map((p) => (
              <motion.div
                layout
                key={p.id}
                className={`project-slot ${p.featured ? 'is-featured' : ''}`}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                <ProjectCard project={p} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}
