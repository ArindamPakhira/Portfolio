// Voice helpers for the intro. Order of preference (set in introScene.voice):
//   1. voice.audioSrc: your own recording (best quality)   2. the video's own soundtrack
//   3. the browser's built-in speech, using a male English voice when the device has one.

// Picks the most likely male voice installed on the visitor's device.
export function pickVoice(voices, lang) {
  const male = /\b(male|david|mark|daniel|james|george|guy|ryan|alex|fred|rishi|ravi|prabhat|hemant|aaron|arthur|oliver|thomas|richard)\b/i
  const female = /(female|zira|susan|heera|samantha|karen|moira|tessa|veena|kalpana|hazel|aria|jenny|emma|sonia|libby|natasha|neerja)/i
  const want = lang.toLowerCase()
  const base = want.split('-')[0]
  const ranked = voices
    .map((v) => {
      const l = v.lang.toLowerCase().replace('_', '-')
      if (!l.startsWith(base)) return null
      let s = l === want ? 4 : 2
      if (male.test(v.name)) s += 5
      if (female.test(v.name)) s -= 6
      if (v.localService) s += 0.5
      return { voice: v, score: s, isMale: male.test(v.name) && !female.test(v.name) }
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score)
  return ranked[0] || null
}

// Speaks one line. Resolves 'ok' when done, 'canceled' if stopped, 'blocked' if the browser refused sound.
export function speakLine(text, cfg) {
  return new Promise((resolve) => {
    const synth = window.speechSynthesis
    const u = new SpeechSynthesisUtterance(text)
    const pick = pickVoice(synth.getVoices(), cfg.lang)
    if (pick) {
      u.voice = pick.voice
      u.lang = pick.voice.lang
    } else {
      u.lang = cfg.lang
    }
    u.rate = cfg.rate
    u.pitch = pick && pick.isMale ? Math.min(1, cfg.pitch + 0.1) : cfg.pitch
    u.volume = cfg.volume
    let started = false
    u.onstart = () => {
      started = true
    }
    u.onend = () => resolve('ok')
    u.onerror = (e) => resolve(e.error === 'canceled' || e.error === 'interrupted' ? 'canceled' : 'blocked')
    synth.speak(u)
    setTimeout(() => {
      if (!started && !synth.speaking && !synth.pending) resolve('blocked')
    }, 1600)
  })
}

export const wait = (ms) => new Promise((r) => setTimeout(r, ms))
