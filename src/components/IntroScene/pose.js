// Front-facing presenter rig (pure geometry, no DOM) and the choreography taken from the reference
// video. buildPresenter(pose) returns shapes in world units: ground is y = 0, y grows downward,
// ~190 units tall, centred on x = 0.

const TAU = Math.PI * 2
const clamp = (x, a, b) => Math.min(b, Math.max(a, x))
const ease = (x) => x * x * (3 - 2 * x)
const lerp = (a, b, k) => a + (b - a) * k

export const COL = {
  sweater: '#eceff2', sweaterShade: '#c9ced6', cuff: '#d6dbe1',
  jeans: '#1f2b45', jeansShade: '#141c30', jeansHi: '#33436b',
  shoe: '#f5f6f8', sole: '#c4c9d0', shoeShade: '#d9dce1',
  skin: '#c98f66', skinShade: '#b27851', skinHi: '#d9a47c',
  hair: '#17120f', white: '#ffffff', iris: '#2a1b12', lip: '#9a5a4a', mouth: '#3a1511', tongue: '#b2554c',
}

const add = (a, b) => [a[0] + b[0], a[1] + b[1]]
const rotp = (p, a, o = [0, 0]) => {
  const c = Math.cos(a), s = Math.sin(a)
  const x = p[0] - o[0], y = p[1] - o[1]
  return [o[0] + x * c - y * s, o[1] + x * s + y * c]
}

// Catmull-Rom smoothing so outlines look organic, not faceted
export function smooth(pts, n = 6) {
  const out = []
  const L = pts.length
  for (let i = 0; i < L; i++) {
    const p0 = pts[(i - 1 + L) % L], p1 = pts[i], p2 = pts[(i + 1) % L], p3 = pts[(i + 2) % L]
    for (let k = 0; k < n; k++) {
      const t = k / n, t2 = t * t, t3 = t2 * t
      out.push([
        0.5 * (2 * p1[0] + (-p0[0] + p2[0]) * t + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3),
        0.5 * (2 * p1[1] + (-p0[1] + p2[1]) * t + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3),
      ])
    }
  }
  return out
}

export function taper(a, b, w1, w2, fill, alpha) {
  const dx = b[0] - a[0], dy = b[1] - a[1]
  const l = Math.hypot(dx, dy) || 1
  const n = [-dy / l, dx / l]
  return [
    { t: 'poly', fill, alpha, pts: [[a[0] + (n[0] * w1) / 2, a[1] + (n[1] * w1) / 2], [b[0] + (n[0] * w2) / 2, b[1] + (n[1] * w2) / 2], [b[0] - (n[0] * w2) / 2, b[1] - (n[1] * w2) / 2], [a[0] - (n[0] * w1) / 2, a[1] - (n[1] * w1) / 2]] },
    { t: 'circle', fill, alpha, c: a, r: w1 / 2 },
    { t: 'circle', fill, alpha, c: b, r: w2 / 2 },
  ]
}

const dirOut = (side, a) => (side < 0 ? [-Math.sin(a), Math.cos(a)] : [Math.sin(a), Math.cos(a)]) // + angle = outward/up

/* pose: x (stage offset, used by the stage), step, move, sway, bob, turn (-1 left .. 1 right),
   tilt (rad), aL fL aR fR (deg, + = outward), hL hR (0 closed .. 1 open), mouth, blink, brow */
export function buildPresenter(p) {
  const S = []
  const move = p.move || 0
  const sx = p.sway || 0 // upper body shift
  const by = p.bob || 0 // upper body bob
  const up = (pt) => [pt[0] + sx, pt[1] + by]

  // ----- legs and shoes
  const legs = [-1, 1].map((side, i) => {
    const phase = p.step + (i ? Math.PI : 0)
    const lift = Math.max(0, Math.sin(phase)) * move * 10
    const hip = [side * 10.5 + sx * 0.3, -92]
    const knee = [side * (11.5 + lift * 0.12), -50 - lift * 0.45]
    const ankle = [side * 12.5, -9 - lift]
    return { side, lift, hip, knee, ankle }
  })
  legs.forEach((l) => {
    S.push(...taper(l.hip, l.knee, 19, 15, COL.jeans), ...taper(l.knee, l.ankle, 15, 11.5, COL.jeans))
    S.push({ t: 'line', a: [l.hip[0] - l.side * 3.5, l.hip[1]], b: [l.knee[0] - l.side * 3, l.knee[1]], w: 3, fill: COL.jeansHi, alpha: 0.35 })
    S.push({ t: 'line', a: [l.knee[0] + l.side * 4, l.knee[1] + 2], b: [l.ankle[0] + l.side * 3.5, l.ankle[1]], w: 4, fill: COL.jeansShade, alpha: 0.45 })
    const sgn = l.side
    const shoe = [[-10, -3], [-12, 4], [-9, 9], [10, 9], [14.5, 5.5], [12, -1], [5, -5], [-3, -5]].map(([x, y]) => [l.ankle[0] + sgn * (x * 0.9 + 1) + sgn * 1.2, l.ankle[1] + y])
    S.push({ t: 'poly', fill: COL.shoe, pts: smooth(shoe, 3) })
    S.push({ t: 'poly', fill: COL.sole, pts: [[-11, 7], [14, 7], [14.5, 9], [-11, 9]].map(([x, y]) => [l.ankle[0] + sgn * (x * 0.9 + 1) + sgn * 1.2, l.ankle[1] + y]) })
    S.push({ t: 'ellipse', c: [l.ankle[0] + sgn * 6, l.ankle[1] + 1], rx: 4, ry: 2.2, rot: 0, fill: COL.shoeShade, alpha: 0.8 })
  })

  // ----- neck and torso
  S.push({ t: 'poly', fill: COL.skinShade, pts: [[-5.6, -170], [5.6, -170], [6.4, -154], [-6.4, -154]].map(up) })
  const torso = [[-31, -146], [-27, -155], [-13, -159], [13, -159], [27, -155], [31, -146], [30, -122], [26, -100], [25, -88], [-25, -88], [-26, -100], [-30, -122]]
  S.push({ t: 'poly', fill: COL.sweater, pts: smooth(torso.map(up), 4) })
  S.push({ t: 'poly', fill: COL.sweaterShade, alpha: 0.18, pts: smooth([[-31, -146], [-27, -155], [-20, -157], [-17, -120], [-19, -100], [-25, -88], [-26, -100], [-30, -122]].map(up), 3) })
  S.push({ t: 'poly', fill: COL.sweaterShade, pts: [[-25, -92], [25, -92], [25.5, -86], [-25.5, -86]].map(up) })
  for (let k = -3; k <= 3; k++) S.push({ t: 'line', a: up([k * 7, -150]), b: up([k * 6.5, -94]), w: 0.8, fill: COL.sweaterShade, alpha: 0.22 })
  S.push({ t: 'ellipse', c: up([0, -158]), rx: 11, ry: 4.2, rot: 0, fill: COL.skinShade })
  S.push({ t: 'ellipse', c: up([0, -157.6]), rx: 11.8, ry: 4.8, rot: 0, fill: COL.cuff, alpha: 0 })
  S.push({ t: 'poly', fill: COL.sweaterShade, pts: smooth([[-13, -160], [0, -157], [13, -160], [11, -156], [0, -152], [-11, -156]].map(up), 3) })
  S.push({ t: 'poly', fill: COL.skinShade, pts: smooth([[-9, -159], [0, -156.5], [9, -159], [7, -156.5], [0, -154], [-7, -156.5]].map(up), 3) })

  // ----- head (tilts about the base of the neck)
  const turn = p.turn || 0
  const H = (x, y) => {
    const q = rotp([x, y - 175], p.tilt || 0, [0, -160]) // head centre is 175 above the ground, pivot at the neck
    return up(q)
  }
  const F = (x, y) => H(x + turn * 2.4, y) // facial features slide when he looks left or right
  const jaw = [[-9.5, -9], [-10, -2], [-9, 5], [-6.5, 10], [-3, 12.5], [0, 13], [3, 12.5], [6.5, 10], [9, 5], [10, -2], [9.5, -9], [7, -13], [0, -14.5], [-7, -13]]
  S.push({ t: 'ellipse', c: H(-10.2, 0), rx: 1.9, ry: 3.3, rot: 0, fill: COL.skinShade })
  S.push({ t: 'ellipse', c: H(10.2, 0), rx: 1.9, ry: 3.3, rot: 0, fill: COL.skinShade })
  S.push({ t: 'poly', fill: COL.skin, pts: smooth(jaw.map(([x, y]) => H(x, y)), 4) })
  S.push({ t: 'poly', fill: COL.skinShade, alpha: 0.35, pts: smooth([[turn > 0 ? -9.5 : 4, -8], [turn > 0 ? -10 : 10, -1], [turn > 0 ? -6 : 9, 6], [turn > 0 ? -3 : 3, 11], [turn > 0 ? -5 : 6, 4], [turn > 0 ? -7 : 8, -2]].map(([x, y]) => H(x, y)), 3) })
  // beard stubble and moustache
  S.push({ t: 'poly', fill: COL.hair, alpha: 0.6, pts: smooth([[-9.5, 0], [-9, 6], [-6, 11], [0, 13], [6, 11], [9, 6], [9.5, 0], [8, 5.5], [5, 8.8], [0, 10], [-5, 8.8], [-8, 5.5]].map(([x, y]) => F(x, y)), 4) })
  S.push({ t: 'poly', fill: COL.hair, alpha: 0.75, pts: smooth([[-4.4, 5], [0, 3.8], [4.4, 5], [0, 6.2]].map(([x, y]) => F(x, y)), 3) })
  // hair
  S.push({ t: 'poly', fill: COL.hair, pts: smooth([[-10.8, -2], [-11.4, -10], [-8.5, -16.5], [-2, -19], [5, -18.5], [10, -15], [11.4, -9], [10.6, -2], [9.6, -8.5], [6, -11.5], [0, -12.5], [-6, -11], [-9.6, -6]].map(([x, y]) => H(x, y)), 4) })
  S.push({ t: 'poly', fill: '#2a211b', alpha: 0.8, pts: smooth([[-5, -17], [0, -18.4], [6, -17], [3, -14.5], [-2, -14.6]].map(([x, y]) => H(x, y)), 3) })
  // eyes, brows, nose, mouth
  const open = 1 - clamp(p.blink || 0, 0, 1)
  ;[-1, 1].forEach((s) => {
    const c = F(s * 4.1, -2.2)
    S.push({ t: 'ellipse', c, rx: 2.2, ry: 1.2 * open + 0.15, rot: 0, fill: COL.white })
    if (open > 0.25) {
      S.push({ t: 'circle', c: [c[0] + turn * 0.7, c[1]], r: 1.05, fill: COL.iris })
      S.push({ t: 'circle', c: [c[0] + turn * 0.7 + 0.4, c[1] - 0.4], r: 0.35, fill: COL.white })
    }
    const br = clamp(p.brow || 0, 0, 1) * 1.4
    S.push({ t: 'line', a: F(s * 6.8, -5.9 - br), b: F(s * 1.9, -5.5 - br * 0.6), w: 1.25, fill: COL.hair })
  })
  S.push({ t: 'line', a: F(0.6, -1.6), b: F(1.4, 3.2), w: 1.1, fill: COL.skinShade })
  S.push({ t: 'ellipse', c: F(0.3, 4), rx: 2, ry: 0.9, rot: 0, fill: COL.skinShade, alpha: 0.8 })
  const m = clamp(p.mouth || 0, 0, 1)
  if (m < 0.08) {
    S.push({ t: 'poly', fill: COL.lip, pts: smooth([[-3.6, 7.7], [0, 8.8], [3.6, 7.7], [0, 8.2]].map(([x, y]) => F(x, y)), 4) })
  } else {
    S.push({ t: 'ellipse', c: F(0, 8 + m * 0.5), rx: 3.4, ry: 0.8 + m * 2.4, rot: 0, fill: COL.mouth })
    S.push({ t: 'ellipse', c: F(0, 6.9 + m * 0.1), rx: 2.7, ry: 0.55, rot: 0, fill: COL.white, alpha: m > 0.3 ? 1 : 0.7 })
    if (m > 0.35) S.push({ t: 'ellipse', c: F(0, 9.4 + m * 0.7), rx: 1.9, ry: 0.9, rot: 0, fill: COL.tongue })
  }

  // ----- arms (drawn last, in front of the torso)
  ;[-1, 1].forEach((side) => {
    const a = (side < 0 ? p.aL : p.aR) * (Math.PI / 180)
    const f = (side < 0 ? p.fL : p.fR) * (Math.PI / 180)
    const openAmt = side < 0 ? p.hL : p.hR
    const sh = up([side * 28.5, -148])
    const d1 = dirOut(side, a)
    const el = [sh[0] + 29 * d1[0], sh[1] + 29 * d1[1]]
    const d2 = dirOut(side, a + f)
    const wr = [el[0] + 25 * d2[0], el[1] + 25 * d2[1]]
    S.push(...taper(sh, el, 13.5, 11.5, COL.sweater))
    S.push(...taper(el, wr, 11.5, 9.6, COL.sweater))
    S.push({ t: 'line', a: [sh[0] + d1[0] * 3 - side * 3, sh[1] + 2], b: [el[0] - side * 3, el[1]], w: 2.5, fill: COL.sweaterShade, alpha: 0.5 })
    S.push(...taper([wr[0] - 3.6 * d2[0], wr[1] - 3.6 * d2[1]], wr, 9.6, 9.6, COL.cuff))
    const hand = [wr[0] + 5.6 * d2[0], wr[1] + 5.6 * d2[1]]
    const ang = Math.atan2(d2[1], d2[0]) - Math.PI / 2
    S.push({ t: 'ellipse', c: hand, rx: 3.9 + (openAmt || 0) * 0.9, ry: 5.4 + (openAmt || 0) * 0.8, rot: -ang * 0 + (Math.atan2(d2[1], d2[0]) - Math.PI / 2) * -1 * -1, fill: COL.skin })
    if ((openAmt || 0) > 0.4) {
      for (let k = -1; k <= 1; k++) {
        const fa = Math.atan2(d2[1], d2[0]) + k * 0.28
        S.push({ t: 'line', a: hand, b: [hand[0] + 6.6 * Math.cos(fa), hand[1] + 6.6 * Math.sin(fa)], w: 1.6, fill: COL.skin })
      }
    }
  })
  return S
}

/* ---------- Choreography (from the reference video) ----------
   Right of the desk -> points at the monitors while stepping toward it -> explains with open hands
   -> steps forward and clasps his hands -> opens his arms in welcome. After the last key he idles. */
const K = (t, o) => ({ t, ...o })
const KEYS = [
  K(0.0, { x: 85, aL: 8, fL: 8, aR: 6, fR: 8, hL: 0.3, hR: 0.3, turn: -0.8, tilt: 0 }),
  K(0.9, { x: 85, aL: 38, fL: 52, aR: 8, fR: 10, hL: 0.9, hR: 0.3, turn: -0.9, tilt: -0.04 }),
  K(1.8, { x: 50, aL: 58, fL: 34, aR: 10, fR: 12, hL: 1, hR: 0.3, turn: -0.7, tilt: -0.03 }),
  K(3.1, { x: 6, aL: 74, fL: 14, aR: 12, fR: 14, hL: 1, hR: 0.3, turn: -0.9, tilt: -0.05 }),
  K(4.5, { x: 6, aL: 40, fL: 52, aR: 34, fR: 48, hL: 1, hR: 1, turn: -0.2, tilt: 0.02 }),
  K(5.8, { x: 6, aL: 56, fL: 24, aR: 26, fR: 40, hL: 1, hR: 1, turn: 0.1, tilt: 0.03 }),
  K(6.8, { x: 0, aL: 8, fL: -72, aR: 8, fR: -72, hL: 0.2, hR: 0.2, turn: 0, tilt: 0.04 }),
  K(8.0, { x: 0, aL: 8, fL: -72, aR: 8, fR: -72, hL: 0.2, hR: 0.2, turn: 0, tilt: 0.02 }),
  K(8.9, { x: 0, aL: 46, fL: 22, aR: 46, fR: 22, hL: 1, hR: 1, turn: 0, tilt: 0 }),
]
export const CHOREO_END = KEYS[KEYS.length - 1].t
const FIELDS = ['x', 'aL', 'fL', 'aR', 'fR', 'hL', 'hR', 'turn', 'tilt']

export function choreoAt(t) {
  const last = KEYS[KEYS.length - 1]
  const out = {}
  if (t >= last.t) FIELDS.forEach((f) => (out[f] = last[f]))
  else {
    let i = 0
    while (i < KEYS.length - 2 && t >= KEYS[i + 1].t) i++
    const a = KEYS[i], b = KEYS[i + 1]
    const k = ease(clamp((t - a.t) / (b.t - a.t), 0, 1))
    FIELDS.forEach((f) => (out[f] = lerp(a[f], b[f], k)))
  }
  if (t > last.t) {
    // gentle open-hand gestures while the last line finishes
    const s = Math.sin((t - last.t) * 1.4)
    out.aL += 6 * s
    out.aR += 6 * -s
    out.fL += 8 * s
    out.fR += 8 * -s
  }
  return out
}

export { TAU, clamp, ease, lerp }
