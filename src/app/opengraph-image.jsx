import { ImageResponse } from 'next/og'
import { introScene } from '../data/profile'

export const alt = 'Arindam Pakhira | Software Developer'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// Generated at build time: the preview card shown when the link is shared on LinkedIn, X, WhatsApp...
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '0 90px',
          background: 'linear-gradient(135deg, #050607 55%, #1a1233 100%)',
          color: '#eef2ee',
        }}
      >
        <div style={{ display: 'flex', color: '#39ff88', fontSize: 34 }}>Hi, I'm</div>
        <div style={{ display: 'flex', fontSize: 136, fontWeight: 800, letterSpacing: -4, lineHeight: 1 }}>
          Arindam Pakhira
        </div>
        <div style={{ display: 'flex', fontSize: 52, marginTop: 24 }}>{introScene.panel.role}</div>
        <div style={{ display: 'flex', fontSize: 30, marginTop: 28, color: '#8f9a95' }}>
          React.js · React Native · Next.js · Android · iOS
        </div>
        <div style={{ display: 'flex', height: 6, width: 220, marginTop: 40, background: '#39ff88' }} />
      </div>
    ),
    { ...size },
  )
}
