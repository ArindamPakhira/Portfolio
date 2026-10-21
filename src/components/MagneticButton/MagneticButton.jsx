'use client'

import { useRef } from 'react'
import './MagneticButton.css'

// Pulls toward the cursor. Pass href for a link, onClick for a button.
// variant: 'primary' | 'ghost'    strength: 0 (off) to ~0.6 (strong)
export default function MagneticButton({
  children,
  href,
  onClick,
  variant = 'primary',
  strength = 0.35,
  className = '',
  ...rest
}) {
  const ref = useRef(null)
  const Tag = href ? 'a' : 'button'

  const move = (e) => {
    const el = ref.current
    const r = el.getBoundingClientRect()
    const x = (e.clientX - (r.left + r.width / 2)) * strength
    const y = (e.clientY - (r.top + r.height / 2)) * strength
    el.style.transform = `translate(${x}px, ${y}px)`
    el.firstChild.style.transform = `translate(${x * 0.35}px, ${y * 0.35}px)`
  }
  const leave = () => {
    ref.current.style.transform = ''
    ref.current.firstChild.style.transform = ''
  }

  return (
    <Tag
      ref={ref}
      href={href}
      onClick={onClick}
      type={href ? undefined : 'button'}
      className={`mbtn mbtn-${variant} ${className}`}
      onMouseMove={move}
      onMouseLeave={leave}
      {...rest}
    >
      <span className="mbtn-inner">{children}</span>
      <span className="mbtn-fill" aria-hidden="true" />
    </Tag>
  )
}
