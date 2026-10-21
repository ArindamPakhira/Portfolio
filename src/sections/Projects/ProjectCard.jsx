'use client'

import Image from 'next/image'
import useTilt from '../../hooks/useTilt'
import Reveal from '../../components/Reveal/Reveal'
import { GithubIcon, ExternalIcon } from '../../components/Icons'

export default function ProjectCard({ project }) {
  const ref = useTilt(5)
  const { title, description, technologies, github, live, image, glyph, category, featured } = project

  return (
    <Reveal className="project-reveal">
      <article ref={ref} className={`tilt project-card ${featured ? 'is-featured' : ''}`}>
        <div className="project-visual">
          {image ? (
            <Image
              src={image}
              alt={`${title} preview`}
              fill
              sizes="(max-width: 800px) 100vw, (max-width: 1200px) 50vw, 600px"
            />
          ) : (
            <span className="project-glyph" aria-hidden="true">
              {glyph || title.slice(0, 2)}
            </span>
          )}
          <span className="project-cat">{category}</span>
          {featured && <span className="project-cat project-star">Featured</span>}
        </div>
        <div className="project-body">
          <h3>{title}</h3>
          <p>{description}</p>
          <ul className="tags">
            {technologies.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
          <div className="project-links">
            {github && (
              <a href={github} target="_blank" rel="noreferrer" data-cursor="Open">
                <GithubIcon width={18} height={18} /> Code
              </a>
            )}
            {live && (
              <a href={live} target="_blank" rel="noreferrer" data-cursor="Open">
                <ExternalIcon width={18} height={18} /> Live demo
              </a>
            )}
          </div>
        </div>
      </article>
    </Reveal>
  )
}
