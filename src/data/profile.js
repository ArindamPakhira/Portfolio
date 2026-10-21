import { headlineSkills } from './skills'

/* ===========================================================
   EDIT ME. Everything personal on the site comes from here.
   =========================================================== */

// Switch features on/off. Set to false to remove a feature completely.
export const config = {
  intro: true, // cinematic opening animation (plays once per page load)
  cursor: true, // custom cursor (auto-disabled on touch devices)
  grid: true, // fine grid background that lights up around the cursor
  defaultTheme: 'cyan', // key from `themes` below
}

// Intro animation: timings in milliseconds, plus its text.
// Sequence: enter -> hello (holdA) -> sheet fills (fill) -> tech (holdB) -> reveal (exit)
export const intro = {
  enter: 1800,
  holdA: 1800,
  fill: 1500,
  holdB: 1800,
  exit: 2500,
  hello: "Hi, I'm",
  wordA: 'Welcome',
  wordB: 'Software Developer',
}

// Accent colour themes (a = main accent, b = secondary glow).
// Visitors can switch them from the navbar dots.
export const themes = {
  neon: { label: 'Neon green', a: '#39ff88', b: '#8b5cf6' },
  cyan: { label: 'Cyan', a: '#2de2e6', b: '#6a5cff' },
  amber: { label: 'Amber', a: '#ffb020', b: '#ff4d6d' },
  violet: { label: 'Violet', a: '#b388ff', b: '#39ff88' },
}

export const profile = {
  name: 'Arindam Pakhira',
  firstName: 'Arindam',
  lastName: 'Pakhira',
  availability: 'Open to new opportunities',
  email: 'hello.arindam.software@gmail.com', 
  location: 'India',
  resumeUrl: '/resume.pdf', // file lives at public/resume.pdf
  socials: {
    github: 'https://github.com/ArindamPakhira', 
    linkedin: 'https://www.linkedin.com/in/arindam-pakhira-276a7a251', 
  },
  // Hero text
  hero: {
    greeting: "Hi, I'm",
    role: 'Software Developer',
    tech: ['React', 'React Native', 'Next.js', 'Android', 'iOS'],
    tagline:
      'Frontend-focused developer building responsive web apps and cross-platform mobile apps, and connecting them to APIs. I care about code that stays clean and easy to maintain.',
    ctaPrimary: 'Explore My Work',
    ctaSecondary: "Let's Connect",
  },
  about: [
    "I'm a Computer Science & Engineering (B.Tech) graduate from Kalyani Government Engineering College and a Full Stack Software Developer passionate about building scalable web and mobile applications.",
    'On the web, I develop responsive, user-friendly applications using React.js, Next.js, JavaScript, and Tailwind CSS. I also work with Vite and Microfrontend architecture using Module Federation to build modular and maintainable applications. For mobile development, I use React Native to build cross-platform Android and iOS applications with reusable components, navigation, state management, and responsive UI design.',
    'Beyond the frontend, I develop backend solutions using C# and ASP.NET Core, integrate REST APIs, and work with SQL databases and stored procedures to build complete, data-driven applications. I focus on writing clean, efficient, and maintainable code while continuously learning new technologies, solving challenging problems, and contributing to innovative projects across the full software development lifecycle.',
  ],
  education: {
    degree: 'B.Tech in Computer Science & Engineering',
    school: 'Kalyani Government Engineering College',
  },
  // Shown in the animated code card in the About section
  card: {
    name: 'Arindam Pakhira',
    degree: 'B.Tech CSE',
    stack: ['React', 'React Native', 'Next.js', 'API integration'],
    focus: 'clean, maintainable code',
    openToWork: true,
  },
  // Count-up stats (the technology count is calculated automatically)
  stats: [
    { value: 3, label: 'Platforms: web, mobile and backend' },
    { value: 3, label: 'SQL databases' },
    { value: 4, label: 'Programming languages' },
  ],
}

// ---------------------------------------------------------------
// SEO. Set NEXT_PUBLIC_SITE_URL (see .env.example) to your real domain before deploying.
// ---------------------------------------------------------------
export const seo = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  title: 'Arindam Pakhira | Software Developer: React, React Native & Next.js',
  description:
    'Portfolio of Arindam Pakhira, a Software Developer specializing in web and mobile application development with React.js, React Native and Next.js, including Android and iOS apps and API integration.',
  keywords: [
    'Arindam Pakhira',
    'Software Developer',
    'React Developer',
    'React Native Developer',
    'Next.js Developer',
    'Android App Development',
    'iOS App Development',
    'Mobile App Developer',
    'Web Developer',
    'API Integration',
    'Portfolio',
  ],
}

// ---------------------------------------------------------------
// Second animation (recreated from your reference video). A presenter walks up to a standing
// desk in a terracotta studio, points at the monitors, explains, then greets the visitor.
// It starts only after the opening animation has completely finished, can be skipped (button,
// Esc, or any scroll / swipe), then jumps to the About section and never replays in the session.
// ---------------------------------------------------------------
export const introScene = {
  enabled: true,
  duration: 10500, // minimum length in ms (it also waits for the voice / captions to finish)
  panelAt: 1200, // ms when the photo / profile panel slides in
  skipLabel: 'Skip Animation',
  // Put your photo at public/portrait.jpg (4:5 works best). Until then an illustrated portrait shows.
  portrait: '/portrait.jpg',
  // BEST QUALITY: a male version of the reference video (same scene, male character, his own voice).
  // Put it in /public and set the paths. It replaces the drawn studio and plays its own sound.
  video: { webm: '', mp4: '', poster: '' },
  voice: {
    enabled: true, // browser voice, used only when no video / audio file is set
    audioSrc: '', // optional recording of the lines below, e.g. '/intro-voice.mp3' (plays instead)
    startAt: 900, // ms into the scene when the audio file starts
    lang: 'en-IN',
    rate: 0.95,
    pitch: 0.85,
    volume: 1,
  },
  // What he says. `at` = second when the line starts when no voice is playing; with the
  // browser voice each line starts when the previous one has finished.
  lines: [
    { at: 1.0, text: "Hi, I'm Arindam Pakhira, a Software Developer." },
    { at: 3.4, text: 'I build fast, responsive web and mobile apps with React.js, React Native and Next.js.' },
    { at: 7.0, text: 'From Android and iOS to API integration, I turn ideas into polished interfaces.' },
    { at: 10.2, text: "Take a look around, and let's build something great together." },
  ],
  // Text on the left of the scene (same layout as the reference)
  copy: {
    eyebrow: '// Software Developer',
    firstName: 'Arindam',
    lastName: 'Pakhira',
    before: 'Building fast,',
    accent: 'responsive',
    after: 'web and mobile experiences.',
    text: 'Software Developer specializing in web and mobile application development: React.js, React Native, Next.js, Android, iOS and API integration.',
  },
  // Photo / profile panel on the right
  panel: {
    role: 'Software Developer',
    summary: 'Specializing in web and mobile application development, and connecting interfaces to APIs.',
    skills: headlineSkills,
  },
}
