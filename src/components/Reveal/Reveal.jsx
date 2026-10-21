'use client'

import useInView from '../../hooks/useInView'
import './Reveal.css'

// Wrap anything to animate it in on scroll.
// variant: 'up' | 'left' | 'right' | 'zoom' | 'mask'
export default function Reveal({ children, as: Tag = 'div', variant = 'up', delay = 0, className = '', ...rest }) {
  const [ref, inView] = useInView()
  return (
    <Tag
      ref={ref}
      className={`reveal reveal-${variant} ${inView ? 'is-in' : ''} ${className}`}
      style={{ '--d': `${delay}ms` }}
      {...rest}
    >
      {children}
    </Tag>
  )
}
