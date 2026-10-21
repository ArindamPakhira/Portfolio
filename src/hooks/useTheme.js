import { config, themes } from '../data/profile'

const toRgb = (hex) => {
  const n = parseInt(hex.slice(1), 16)
  return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`
}

export function applyTheme(key) {
  const t = themes[key] || themes[config.defaultTheme]
  const s = document.documentElement.style
  s.setProperty('--accent', t.a)
  s.setProperty('--accent-2', t.b)
  s.setProperty('--accent-rgb', toRgb(t.a))
  s.setProperty('--accent-2-rgb', toRgb(t.b))
  window.dispatchEvent(new Event('accentchange'))
  try {
    localStorage.setItem('theme', key)
  } catch {
    /* storage can be blocked; ignore */
  }
}

export function initTheme() {
  let saved
  try {
    saved = localStorage.getItem('theme')
  } catch {
    /* ignore */
  }
  applyTheme(themes[saved] ? saved : config.defaultTheme)
}
