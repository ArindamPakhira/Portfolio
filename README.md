# Arindam Pakhira | Portfolio (Next.js)

Your portfolio, converted from Vite to **Next.js 14 (App Router)** with SEO added and one new animation:
a second animation (recreated from your reference video) that plays after your opening animation.

The design, layout, styling, content and your existing opening animation are unchanged.

## Install and run

Needs Node.js 18.17 or newer.

```bash
npm install
npm run dev          # development, http://localhost:3000
npm run build        # production build
npm start            # serve the production build, http://localhost:3000
```

Before you deploy, copy `.env.example` to `.env.local` and set your real domain:

```
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

It is used for the canonical URL, Open Graph tags, `sitemap.xml` and `robots.txt`.

## What changed in the migration

| Before (Vite) | Now (Next.js) |
| --- | --- |
| `index.html`, `src/main.jsx` | `src/app/layout.jsx` (html, metadata, fonts) and `src/app/page.jsx` |
| Everything client-rendered | Pages are server-rendered, so crawlers and link previews see your content |
| `<img>` project images | `next/image` (automatic sizing, AVIF/WebP, lazy loading) |
| Theme set after load | Saved accent colour applied before first paint (no flash) |

All components, sections, hooks, data files and CSS keep the same names and folders. Components that use hooks or
browser APIs start with `'use client'`.

Two small SSR-safety edits were needed so nothing breaks on the server. Behaviour is the same:
- `IntroAnimation.jsx` reads `prefers-reduced-motion` after mount instead of during render. Timeline, stages, timings and CSS are untouched.
- `Navbar.jsx` reads the saved theme after mount (prevents a hydration mismatch).

## SEO included

- Title and description (Software Developer focus), keywords, canonical URL, robots directives, optional Google verification token (`src/app/layout.jsx`, text in `seo` in `src/data/profile.js`)
- Open Graph and Twitter cards with an auto-generated 1200x630 preview image (`src/app/opengraph-image.jsx`)
- `sitemap.xml` and `robots.txt` (`src/app/sitemap.js`, `src/app/robots.js`)
- JSON-LD `Person`, `WebSite` and `ProfilePage` structured data (`src/app/page.jsx`). GitHub/LinkedIn links are added automatically once you replace the `YOUR_USERNAME` placeholders.
- Semantic HTML (`header`, `nav`, `main`, `section`, one `h1`), alt text, and a no-JavaScript fallback that shows the full page
- Web app manifest (`src/app/manifest.js`), favicon (`src/app/icon.svg`), theme colour, viewport settings

## Startup sequence (all on the home page, no separate route)

1. Your original opening animation plays, unchanged.
2. Only after it has completely finished, the second animation plays. It is recreated from your reference video: a terracotta studio with a standing desk and two code monitors. A man in a white knit sweater, dark jeans and white sneakers steps up to the desk, points at the monitors, explains with open hands, comes forward and clasps his hands, then opens his arms in welcome, while the camera slowly pushes in. Your name and headline are on the left (as in the video), and a photo / profile panel is on the right.
3. When it ends, or is skipped, a glitch dissolve (like the video's transition) lands on the **About** section. The rest of the portfolio is right below it, and scrolling back up shows the normal Hero. It does not replay in the same page session.

### Skip and scroll-to-exit

A **Skip Animation** button is shown at the top right during the second animation only. It also ends immediately on mouse wheel or touchpad scroll, a swipe on touch screens, or the Esc / arrow / Page / Space / Home / End keys.
Every exit goes through one `leave()` function in `IntroScene.jsx`: it stops the render loop, speech, audio and video, removes all listeners, jumps to About, and plays the dissolve. It cannot run twice, and the scene is never mounted again until the page is reloaded. With reduced motion enabled the scene is skipped.

### Voice

Three options, in this order (set in `introScene.voice` / `introScene.video` in `src/data/profile.js`):
1. `voice.audioSrc`: your own recording (for example `/intro-voice.mp3` in `public/`). This gives the clearest, most natural voice.
2. The soundtrack of the video you supply (below).
3. Otherwise the browser's built-in speech, using a male English voice if the device has one.

Browsers only allow sound after a click or tap. The scene starts with captions and a pulsing **Hear it** button, and the voice starts when it is pressed. Mute is the same button.

### A closer match to the reference: supply a male version of the video

The character in the code is a flat illustration. Your reference is a rendered 3D character, which cannot be produced in code. For an exact match, create the same scene with a male character and voice in the tool that made the reference video, export it, put it in `public/` (WebM and/or MP4), and set `introScene.video`. It replaces the drawn studio and plays its own sound. The text, photo panel, Skip button, scroll exit, dissolve and About jump all keep working on top of it.

### Files

- `src/components/IntroScene/IntroScene.jsx`: timing, voice, controls, cleanup, dissolve
- `src/components/IntroScene/pose.js`: the character rig and the choreography taken from the video
- `src/components/IntroScene/stage.js`: canvas studio (room, desk, monitors, reflection, camera)
- `src/components/IntroScene/voice.js`: voice selection and speech
- `src/components/IntroScene/IntroScene.css`: layout for desktop, tablet, phone and landscape phone

Your photo goes at `public/portrait.jpg` (4:5 works best). Until then an illustrated portrait is shown.

## Edit your content

| File | What to change |
| --- | --- |
| `src/data/profile.js` | Name, hero text, email, GitHub/LinkedIn, about text, stats, intro text and timing, feature switches, themes, SEO text, presenter lines |
| `src/data/skills.js` | All skills (the Skills section reads from it) and `headlineSkills`, the labels in the intro's profile panel and in search metadata |
| `src/data/projects.js` | Projects: title, description, technologies, links, image, featured |
| `src/data/experience.js` | Work and education timeline |

Still to fill in with your real details (only you have them): `email`, `socials.github` and `socials.linkedin` in `profile.js`;
the project links and live-demo URLs in `projects.js`; and the company name and dates in `experience.js`.
Project screenshots: put them in `src/assets/`, import them in `projects.js`, and set `image`.

`public/resume.pdf` is a one-page résumé generated only from the text already in your portfolio (profile, education, skills).
Replace it with your full CV at any time, keeping the file name.

## Deploy

- **Vercel** (simplest): push to GitHub, import the repo, add `NEXT_PUBLIC_SITE_URL`, deploy.
- **Anywhere with Node**: `npm run build` then `npm start`.
