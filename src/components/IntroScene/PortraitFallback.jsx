// Illustrated head-and-shoulders portrait, shown until you add your own photo at public/portrait.jpg
export default function PortraitFallback() {
  return (
    <svg viewBox="150 98 152 190" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Portrait placeholder" className="scene-portrait-art">
      <defs>
        <linearGradient id="pf-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#c8693c" />
          <stop offset="1" stopColor="#6e3016" />
        </linearGradient>
      </defs>
      <rect x="150" y="98" width="152" height="190" fill="url(#pf-bg)" />
      <path d="M150 288 L150 246 Q176 214 214 210 L238 210 Q276 214 302 246 L302 288 Z" fill="#eceff2" />
      <ellipse cx="226" cy="214" rx="14" ry="6" fill="#b27851" />
      <rect x="219" y="188" width="14" height="26" rx="5" fill="#b27851" />
      <ellipse cx="196" cy="166" rx="5" ry="9" fill="#b27851" />
      <ellipse cx="256" cy="166" rx="5" ry="9" fill="#b27851" />
      <ellipse cx="226" cy="160" rx="30" ry="36" fill="#c98f66" />
      <path d="M197 170 C199 196 212 200 226 200 C240 200 253 196 255 170 C249 187 240 191 226 191 C212 191 203 187 197 170 Z" fill="#17120f" opacity="0.7" />
      <path d="M212 180 Q226 173 240 180 Q226 184 212 180 Z" fill="#17120f" opacity="0.85" />
      <path d="M194 160 C188 112 222 104 232 104 C258 106 266 130 258 160 C256 142 250 130 236 126 C224 134 206 136 197 148 Z" fill="#17120f" />
      <path d="M207 149 Q216 146 224 149 M229 149 Q237 146 246 149" stroke="#17120f" strokeWidth="3.2" fill="none" strokeLinecap="round" />
      <ellipse cx="216" cy="159" rx="5" ry="4.6" fill="#fff" />
      <circle cx="217" cy="160" r="2.8" fill="#2a1b12" />
      <ellipse cx="237" cy="159" rx="5" ry="4.6" fill="#fff" />
      <circle cx="238" cy="160" r="2.8" fill="#2a1b12" />
      <path d="M226 162 Q222 174 226 176 Q229 177 230 174" stroke="#a56f4b" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <path d="M216 187 Q226 194 236 187" stroke="#e9c9b6" strokeWidth="2.4" fill="none" strokeLinecap="round" />
    </svg>
  )
}
