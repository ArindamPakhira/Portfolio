import { config, profile, seo, themes } from '../data/profile'

export const metadata = {
  metadataBase: new URL(seo.siteUrl),
  title: { default: seo.title, template: `%s | ${profile.name}` },
  description: seo.description,
  keywords: seo.keywords,
  authors: [{ name: profile.name }],
  creator: profile.name,
  category: 'technology',
  formatDetection: { telephone: false, email: false, address: false },
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
    : undefined,
  applicationName: `${profile.name} Portfolio`,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: '/',
    siteName: `${profile.name} Portfolio`,
    title: seo.title,
    description: seo.description,
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: seo.title,
    description: seo.description,
    images: ['/opengraph-image'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#050607',
  colorScheme: 'dark',
}

// Applies the visitor's saved accent theme before first paint, so there is no colour flash.
const themeScript = `(function(){try{var T=${JSON.stringify(themes)};var k=localStorage.getItem('theme');if(!T[k])k=${JSON.stringify(config.defaultTheme)};var x=T[k],s=document.documentElement.style;function r(h){var n=parseInt(h.slice(1),16);return (n>>16&255)+', '+(n>>8&255)+', '+(n&255)}s.setProperty('--accent',x.a);s.setProperty('--accent-2',x.b);s.setProperty('--accent-rgb',r(x.a));s.setProperty('--accent-2-rgb',r(x.b))}catch(e){}})();`

// Without JavaScript there is no intro or scroll animation, so show everything plainly.
const noScriptCss = `.intro,.walk{display:none!important}main.portfolio.is-hidden{opacity:1!important;visibility:visible!important;transform:none!important}.hero-status,.hero-hi,.hero-role,.hero-tech,.hero-tag,.hero-cta,.reveal,.ch,.split-inner,.nav{opacity:1!important;transform:none!important;clip-path:none!important;filter:none!important}`

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,300..800&family=Sora:wght@500..800&family=DM+Sans:wght@400;500;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <noscript>
          <style>{noScriptCss}</style>
        </noscript>
      </head>
      <body>{children}</body>
    </html>
  )
}
