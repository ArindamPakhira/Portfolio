// Studio scene, drawn on one canvas: terracotta room, standing desk with two code monitors,
// the presenter, floor reflection and a slow camera push-in (all as seen in the reference video).
// No React in here: IntroScene.jsx calls update() and draw() from a single rAF loop.
import { buildPresenter, choreoAt, clamp, ease, TAU } from './pose'

const CODE = ['#f1e3d0', '#74b4ff', '#86e3ac', '#ffa56f', '#c9a9ff']
const ROWS = [[0.55, 0], [0.82, 2], [0.4, 1], [0.7, 3], [0.62, 1], [0.3, 4], [0.76, 0], [0.5, 2], [0.66, 3]]

function rr(x, y, w, h, r) {
  const pts = []
  ;[[x + r, y + r, Math.PI], [x + w - r, y + r, 1.5 * Math.PI], [x + w - r, y + h - r, 0], [x + r, y + h - r, 0.5 * Math.PI]].forEach(([cx, cy, a0]) => {
    for (let k = 0; k <= 4; k++) {
      const a = a0 + (Math.PI / 2) * (k / 4)
      pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)])
    }
  })
  return pts
}

// Desk, monitors, keyboard. World units, ground at y = 0, desk spans x -290 to -8.
function deskShapes(t) {
  const S = []
  const black = '#161517'
  S.push({ t: 'ellipse', c: [-150, 3], rx: 150, ry: 7, rot: 0, fill: '#000', alpha: 0.28 })
  ;[[-262, -255], [-35, -28]].forEach(([a, b]) => S.push({ t: 'poly', fill: black, pts: [[a, -86], [b, -86], [b, 0], [a, 0]] }))
  ;[[-285, -232], [-60, -5]].forEach(([a, b]) => S.push({ t: 'poly', fill: black, pts: [[a, -4], [b, -4], [b, 0], [a, 0]] }))
  S.push({ t: 'poly', fill: black, alpha: 0.9, pts: [[-262, -42], [-28, -42], [-28, -37], [-262, -37]] })
  S.push({ t: 'poly', fill: '#d49a63', pts: [[-290, -93], [-8, -93], [14, -107], [-268, -107]] })
  S.push({ t: 'poly', fill: '#e2ae79', alpha: 0.5, pts: [[-290, -93], [-8, -93], [-3, -96], [-285, -96]] })
  S.push({ t: 'poly', fill: '#a56a3a', pts: [[-290, -93], [-8, -93], [-8, -86], [-290, -86]] })
  ;[-206, -118].forEach((cx, mi) => {
    S.push({ t: 'poly', fill: black, pts: [[cx - 3, -112], [cx + 3, -112], [cx + 3, -104], [cx - 3, -104]] })
    S.push({ t: 'ellipse', c: [cx, -104], rx: 15, ry: 2.6, rot: 0, fill: black })
    S.push({ t: 'poly', fill: '#0c0d0f', pts: rr(cx - 40, -166, 80, 56, 3) })
    S.push({ t: 'poly', fill: '#0f1a22', pts: rr(cx - 37, -163, 74, 50, 2) })
    ROWS.forEach(([w, c], i) => {
      const y = -158 + i * 5.2 + ((t * 5 + mi * 7) % 5.2) * 0 // rows keep their place, brightness pulses
      const pulse = 0.65 + 0.3 * Math.sin(t * 2.2 + i * 1.3 + mi)
      const indent = (i % 3) * 5
      S.push({ t: 'poly', fill: CODE[(c + mi) % CODE.length], alpha: pulse, pts: [[cx - 33 + indent, y], [cx - 33 + indent + w * 62, y], [cx - 33 + indent + w * 62, y + 2.4], [cx - 33 + indent, y + 2.4]] })
    })
    S.push({ t: 'poly', fill: '#8ecbff', alpha: 0.06, pts: [[cx - 37, -163], [cx - 8, -163], [cx - 30, -113], [cx - 37, -113]] })
  })
  S.push({ t: 'poly', fill: '#1d1c1f', pts: rr(-190, -100, 76, 4.6, 1.5) })
  S.push({ t: 'ellipse', c: [-96, -98.5], rx: 5, ry: 2.6, rot: 0, fill: '#1d1c1f' })
  return S
}

export function createStage(canvas, { showScene = true } = {}) {
  const ctx = canvas.getContext('2d')
  let W = 1
  let H = 1
  let rect = { x: 0, y: 0, w: 1, h: 1 }
  const sim = { step: 0, prevX: null, move: 0, fig: null, mouth: 0, blink: 0, nextBlink: 2.4, blinkT: -1, last: 0 }

  function shapePath(s) {
    ctx.globalAlpha = s.alpha ?? 1
    ctx.fillStyle = s.fill
    ctx.beginPath()
    if (s.t === 'poly') {
      s.pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])))
      ctx.closePath()
      ctx.fill()
    } else if (s.t === 'circle') {
      ctx.arc(s.c[0], s.c[1], s.r, 0, TAU)
      ctx.fill()
    } else if (s.t === 'ellipse') {
      ctx.ellipse(s.c[0], s.c[1], s.rx, s.ry, s.rot || 0, 0, TAU)
      ctx.fill()
    } else if (s.t === 'line') {
      ctx.moveTo(s.a[0], s.a[1])
      ctx.lineTo(s.b[0], s.b[1])
      ctx.strokeStyle = s.fill
      ctx.lineWidth = s.w
      ctx.lineCap = 'round'
      ctx.stroke()
    }
  }
  const drawShapes = (list) => {
    list.forEach(shapePath)
    ctx.globalAlpha = 1
  }

  return {
    // `stage` is the rectangle (relative to the canvas) the desk and presenter must fit inside
    resize(stage) {
      const r = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      W = Math.max(1, Math.round(r.width))
      H = Math.max(1, Math.round(r.height))
      canvas.width = Math.round(W * dpr)
      canvas.height = Math.round(H * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      rect = stage ? { x: stage.x - r.left, y: stage.y - r.top, w: stage.w, h: stage.h } : { x: 0, y: 0, w: W, h: H }
    },
    update(dt, t, talking) {
      const c = choreoAt(t)
      if (sim.prevX === null) sim.prevX = c.x
      const dx = c.x - sim.prevX
      sim.prevX = c.x
      const speed = dt > 0 ? Math.abs(dx) / dt : 0
      sim.move += (clamp(speed / 34, 0, 1) - sim.move) * Math.min(1, dt * 8)
      sim.step += Math.abs(dx) * 0.075
      // blink now and then, talk with a lively mouth
      if (t >= sim.nextBlink && sim.blinkT < 0) sim.blinkT = t
      if (sim.blinkT >= 0) {
        const k = (t - sim.blinkT) / 0.16
        sim.blink = k < 1 ? Math.sin(k * Math.PI) : 0
        if (k >= 1) {
          sim.blinkT = -1
          sim.nextBlink = t + 2.2 + Math.abs(Math.sin(t * 12.9)) * 2.4
        }
      }
      sim.mouth = talking ? clamp(0.2 + 0.6 * Math.abs(Math.sin(t * 9.4)) * (0.65 + 0.35 * Math.sin(t * 3.3)), 0, 1) : 0
      const sw = Math.sin(sim.step)
      sim.fig = {
        x: c.x,
        shapes: buildPresenter({
          ...c,
          step: sim.step,
          move: sim.move,
          sway: 1.5 * Math.sin(t * 1.1) * (1 - sim.move) + 2.2 * sw * sim.move,
          bob: -0.9 * Math.abs(sw) * sim.move + 0.5 * Math.sin(t * 1.8),
          mouth: sim.mouth,
          blink: sim.blink,
          brow: talking ? 0.35 * Math.abs(Math.sin(t * 1.7)) : 0,
        }),
      }
    },
    draw(t, D) {
      if (!sim.fig) this.update(0, 0, false)
      ctx.clearRect(0, 0, W, H)
      const u = Math.min((rect.h * 0.62) / 190, (rect.w * 0.95) / 415)
      const ox = rect.x + rect.w - 128 * u
      const gy = rect.y + rect.h * 0.95
      const horizon = gy - 66 * u

      // camera: slow push-in toward the presenter
      const zoom = 1 + 0.075 * ease(clamp(t / D, 0, 1))
      ctx.save()
      ctx.translate(ox - 40 * u, gy - 95 * u)
      ctx.scale(zoom, zoom)
      ctx.translate(-(ox - 40 * u), -(gy - 95 * u))

      // terracotta wall, light pool and floor
      const wall = ctx.createLinearGradient(0, 0, 0, horizon)
      wall.addColorStop(0, '#8e3c1f')
      wall.addColorStop(0.6, '#b9552d')
      wall.addColorStop(1, '#d2703f')
      ctx.fillStyle = wall
      ctx.fillRect(-W, -H, W * 3, horizon + H)
      const pool = ctx.createRadialGradient(ox - 40 * u, gy - 130 * u, 10, ox - 40 * u, gy - 130 * u, 380 * u)
      pool.addColorStop(0, 'rgba(255,196,140,0.34)')
      pool.addColorStop(1, 'rgba(255,196,140,0)')
      ctx.fillStyle = pool
      ctx.fillRect(-W, -H, W * 3, H * 2)
      const floor = ctx.createLinearGradient(0, horizon, 0, gy + 90 * u)
      floor.addColorStop(0, '#b45a30')
      floor.addColorStop(1, '#6e3016')
      ctx.fillStyle = floor
      ctx.fillRect(-W, horizon, W * 3, H)
      ctx.fillStyle = 'rgba(255,215,170,0.18)'
      ctx.fillRect(-W, horizon - 1, W * 3, 2)

      if (showScene) {
        const desk = deskShapes(t)
        const fig = sim.fig.shapes
        const cx = sim.fig.x
        // soft reflection on the floor
        ctx.save()
        ctx.translate(ox, gy)
        ctx.scale(u, -u)
        ctx.globalAlpha = 0.12
        drawShapes(desk)
        ctx.save()
        ctx.translate(cx, 0)
        drawShapes(fig)
        ctx.restore()
        ctx.restore()
        const fade = ctx.createLinearGradient(0, gy, 0, gy + 70 * u)
        fade.addColorStop(0, 'rgba(120,52,24,0)')
        fade.addColorStop(1, 'rgba(110,48,22,1)')
        ctx.fillStyle = fade
        ctx.fillRect(-W, gy, W * 3, 80 * u)

        ctx.save()
        ctx.translate(ox, gy)
        ctx.scale(u, u)
        drawShapes(desk)
        ctx.fillStyle = 'rgba(0,0,0,0.32)'
        ctx.beginPath()
        ctx.ellipse(cx, 2, 30, 4.5, 0, 0, TAU)
        ctx.fill()
        ctx.translate(cx, 0)
        drawShapes(fig)
        ctx.restore()
      }
      ctx.restore()
    },
  }
}
