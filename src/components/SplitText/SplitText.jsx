'use client'

import useInView from '../../hooks/useInView'
import './SplitText.css'

// Headline that rises word by word when scrolled into view.
// Use inside a heading:  <h2><SplitText text="About me" /></h2>
// accentFrom: index of the first word that should use the accent colour.
export default function SplitText({ text, as: Tag = 'span', className = '', delay = 0, accentFrom = -1 }) {
  const [ref, inView] = useInView({ threshold: 0.3 })
  const words = text.split(' ')
  return (
    <Tag ref={ref} className={`split ${inView ? 'is-in' : ''} ${className}`}>
      <span className="sr-only">{text}</span>
      {words.map((w, i) => (
        <span key={i} aria-hidden="true">
          <span className="split-word">
            <span
              className={`split-inner ${accentFrom >= 0 && i >= accentFrom ? 'gradient-text' : ''}`}
              style={{ '--i': i, '--d': `${delay}ms` }}
            >
              {w}
            </span>
          </span>
          {i < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </Tag>
  )
}
